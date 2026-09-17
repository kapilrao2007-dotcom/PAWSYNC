const asyncHandler = require('express-async-handler');
const RescueCase = require('../models/RescueCase');
const Payment = require('../models/Payment');
const Donation = require('../models/Donation');
const AppError = require('../utils/appError');
const { generateDonationId } = require('../utils/generateIds');
const { createOrder, verifySignature, hasKeys } = require('../services/paymentService');
const { notify } = require('../services/notificationService');
const { logAction } = require('../services/auditService');

const MIN_DONATION_INR = 10;

// @desc    Create a Razorpay order for a donation to a case's campaign
// @route   POST /api/donations/create-order
// @access  Public (optional auth - donors may give anonymously)
const createDonationOrder = asyncHandler(async (req, res) => {
  const { caseId, amount, isAnonymous } = req.body;
  const amountInr = Number(amount);

  if (!caseId || !amountInr || amountInr < MIN_DONATION_INR) {
    throw new AppError(`A caseId and an amount of at least ₹${MIN_DONATION_INR} are required`, 400);
  }

  const rescueCase = await RescueCase.findOne({ caseId });
  if (!rescueCase) throw new AppError('Rescue case not found', 404);
  if (!rescueCase.campaign.isApproved) {
    throw new AppError('This case does not have an approved donation campaign yet', 409);
  }
  if (rescueCase.campaign.isClosed) {
    throw new AppError('This donation campaign is closed', 409);
  }

  const amountInPaise = Math.round(amountInr * 100);
  const receipt = `rcpt_${rescueCase.caseId}_${Date.now()}`;

  const order = await createOrder({
    amountInPaise,
    receipt,
    notes: { caseId: rescueCase.caseId, donor: req.user ? req.user._id.toString() : 'guest' },
  });

  const payment = await Payment.create({
    orderId: order.id,
    amount: amountInPaise,
    currency: 'INR',
    status: 'created',
    user: req.user ? req.user._id : undefined,
    rescueCase: rescueCase._id,
    rawResponse: order,
  });

  res.status(201).json({
    success: true,
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      isMock: Boolean(order.isMock),
    },
    keyId: hasKeys ? process.env.RAZORPAY_KEY_ID : 'rzp_mock_key',
    paymentRecordId: payment._id,
    isAnonymous: Boolean(isAnonymous),
  });
});

// @desc    Verify payment signature client-side callback and finalize the donation.
//          This is a convenience path; the webhook (below) is the authoritative
//          source of truth and will reconcile/deduplicate regardless.
// @route   POST /api/donations/verify
// @access  Public (optional auth)
const verifyDonation = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature, isAnonymous, message } = req.body;
  if (!orderId || !paymentId || !signature) {
    throw new AppError('orderId, paymentId and signature are required', 400);
  }

  const valid = verifySignature({ orderId, paymentId, signature });
  if (!valid) throw new AppError('Payment verification failed - signature mismatch', 400);

  const payment = await Payment.findOne({ orderId });
  if (!payment) throw new AppError('Payment order not found', 404);

  // Idempotency: if already captured + donation exists, just return it.
  const existingDonation = await Donation.findOne({ payment: payment._id });
  if (existingDonation) {
    return res.json({ success: true, message: 'Donation already recorded', donation: existingDonation });
  }

  payment.paymentId = paymentId;
  payment.signature = signature;
  payment.status = 'captured';
  await payment.save();

  const donation = await finalizeDonation({ payment, isAnonymous, message, donor: req.user });

  await logAction({ req, action: 'donation.verified', entityType: 'Donation', entityId: donation._id });

  res.json({ success: true, donation });
});

/**
 * Shared finalize step used by both the client-verify path and the webhook
 * path. Guarded by the unique Payment->Donation relationship so a retried
 * webhook or a client verify call can never double-count a donation.
 */
async function finalizeDonation({ payment, isAnonymous, message, donor }) {
  const rescueCase = await RescueCase.findById(payment.rescueCase);
  if (!rescueCase) throw new AppError('Associated rescue case no longer exists', 404);

  const amountInr = payment.amount / 100;

  const donation = await Donation.create({
    donationId: generateDonationId(),
    donor: donor ? donor._id : payment.user,
    donorName: isAnonymous ? 'Anonymous Supporter' : donor ? donor.name : 'Generous Supporter',
    isAnonymous: Boolean(isAnonymous),
    rescueCase: rescueCase._id,
    payment: payment._id,
    amount: amountInr,
    message,
    status: 'confirmed',
    confirmedAt: new Date(),
  });

  const previousRaised = rescueCase.campaign.raisedAmount;
  rescueCase.campaign.raisedAmount += amountInr;
  await rescueCase.save();

  await checkCampaignMilestones(rescueCase, previousRaised);

  return donation;
}

async function checkCampaignMilestones(rescueCase, previousRaised) {
  const { goalAmount, raisedAmount } = rescueCase.campaign;
  if (!goalAmount) return;

  const milestones = [50, 75, 100];
  const prevPct = (previousRaised / goalAmount) * 100;
  const newPct = (raisedAmount / goalAmount) * 100;

  for (const milestone of milestones) {
    if (prevPct < milestone && newPct >= milestone) {
      const RescueReport = require('../models/RescueReport');
      const report = await RescueReport.findById(rescueCase.report);
      if (report && report.reporter) {
        await notify({
          user: report.reporter,
          type: 'campaign_milestone',
          title: `${rescueCase.campaign.title} reached ${milestone}%`,
          message: `Thanks to the community, ${rescueCase.displayName}'s campaign has reached ${milestone}% of its goal.`,
          link: `/rescue/${rescueCase.caseId}`,
        });
      }
    }
  }
}

// @desc    Get a donation receipt
// @route   GET /api/donations/:donationId/receipt
// @access  Public (should be shared via link; contains no sensitive data)
const getReceipt = asyncHandler(async (req, res) => {
  const donation = await Donation.findOne({ donationId: req.params.donationId }).populate(
    'rescueCase',
    'caseId displayName campaign'
  );
  if (!donation) throw new AppError('Donation receipt not found', 404);

  res.json({
    success: true,
    receipt: {
      donationId: donation.donationId,
      caseId: donation.rescueCase.caseId,
      caseName: donation.rescueCase.displayName,
      amount: donation.amount,
      currency: donation.currency,
      status: donation.status,
      donorName: donation.isAnonymous ? 'Anonymous Supporter' : donation.donorName,
      timestamp: donation.confirmedAt || donation.createdAt,
    },
  });
});

// @desc    List donations for a case (transparency feed)
// @route   GET /api/donations/case/:caseId
// @access  Public
const listDonationsForCase = asyncHandler(async (req, res) => {
  const rescueCase = await RescueCase.findOne({ caseId: req.params.caseId });
  if (!rescueCase) throw new AppError('Rescue case not found', 404);

  const donations = await Donation.find({ rescueCase: rescueCase._id, status: 'confirmed' })
    .sort({ createdAt: -1 })
    .select('donationId donorName isAnonymous amount message createdAt');

  res.json({ success: true, count: donations.length, donations });
});

// @desc    Admin: list all donations across cases
// @route   GET /api/donations
// @access  Private (admin)
const listAllDonations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const donations = await Donation.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('rescueCase', 'caseId displayName')
    .populate('donor', 'name email');

  const total = await Donation.countDocuments(filter);
  res.json({ success: true, count: donations.length, total, page: Number(page), donations });
});

module.exports = {
  createDonationOrder,
  verifyDonation,
  finalizeDonation,
  getReceipt,
  listDonationsForCase,
  listAllDonations,
};

const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Donation = require('../models/Donation');
const AppError = require('../utils/appError');
const { verifyWebhookSignature } = require('../services/paymentService');
const { finalizeDonation } = require('./donationController');

// @desc    Razorpay webhook receiver. This is the authoritative source of
//          truth for payment status - never trust the frontend alone
//          (spec sections 10 and 24). Idempotent via Payment.webhookEventIds.
// @route   POST /api/payments/webhook
// @access  Public (verified via HMAC signature header, not auth)
const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  const valid = verifyWebhookSignature(rawBody, signature);
  if (!valid) throw new AppError('Invalid webhook signature', 400);

  const event = req.body;
  const eventId = event.id || `${event.event}_${Date.now()}`;
  const entity = event.payload?.payment?.entity || event.payload?.refund?.entity;

  if (!entity) return res.status(200).json({ success: true, message: 'No actionable entity in payload' });

  const payment = await Payment.findOne({ orderId: entity.order_id });
  if (!payment) return res.status(200).json({ success: true, message: 'Unknown order - ignored' });

  // Idempotency guard - a webhook can be retried by the gateway.
  if (payment.webhookEventIds.includes(eventId)) {
    return res.status(200).json({ success: true, message: 'Event already processed' });
  }
  payment.webhookEventIds.push(eventId);

  switch (event.event) {
    case 'payment.captured': {
      payment.paymentId = entity.id;
      payment.status = 'captured';
      await payment.save();

      const existingDonation = await Donation.findOne({ payment: payment._id });
      if (!existingDonation) {
        await finalizeDonation({ payment, isAnonymous: false, message: '', donor: null });
      }
      break;
    }
    case 'payment.failed': {
      payment.status = 'failed';
      await payment.save();
      break;
    }
    case 'refund.processed': {
      payment.status = 'refunded';
      payment.refund = {
        isRefunded: true,
        refundId: entity.id,
        refundedAt: new Date(),
        reason: entity.notes?.reason || 'Refund processed via gateway',
      };
      await payment.save();
      break;
    }
    default:
      await payment.save(); // persist the eventId even for events we don't act on
  }

  res.status(200).json({ success: true });
});

module.exports = { handleWebhook };

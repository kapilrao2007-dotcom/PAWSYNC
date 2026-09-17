const asyncHandler = require('express-async-handler');
const RescueReport = require('../models/RescueReport');
const RescueCase = require('../models/RescueCase');
const Animal = require('../models/Animal');
const AppError = require('../utils/appError');
const { generateCaseId } = require('../utils/generateIds');
const { uploadImages } = require('../services/uploadService');
const { toPublicLocation } = require('../utils/geo');
const { notify } = require('../services/notificationService');
const { awardPoints } = require('../services/pointsService');
const { logAction } = require('../services/auditService');

// @desc    Submit a new rescue report (citizen or guest). A Case ID is
//          generated immediately (spec section 8 - "After submission:
//          generate unique Case ID... Status: Submitted"), but the case
//          stays unlisted from public feeds until an admin/org verifies
//          it, and NO donation campaign is ever auto-created here.
// @route   POST /api/rescue-reports
// @access  Public (optional auth)
const createReport = asyncHandler(async (req, res) => {
  const { animalType, condition, description, landmark, lng, lat, address, urgencyIndicators, guestName, guestPhone } =
    req.body;

  if (!animalType || !condition || !description) {
    throw new AppError('animalType, condition and description are required', 400);
  }

  let photos = [];
  if (req.files && req.files.length) {
    photos = await uploadImages(req.files, 'pawsync/reports');
  }

  const location = {
    type: 'Point',
    coordinates: [Number(lng) || 0, Number(lat) || 0],
    address,
  };

  const report = await RescueReport.create({
    reporter: req.user ? req.user._id : undefined,
    guestContact: req.user ? undefined : { name: guestName, phone: guestPhone },
    animalType,
    condition,
    description,
    photos,
    landmark,
    location,
    urgencyIndicators: Array.isArray(urgencyIndicators)
      ? urgencyIndicators
      : urgencyIndicators
      ? [urgencyIndicators]
      : [],
  });

  // Immediately create the trackable RescueCase shell so the reporter gets
  // a Case ID + "Submitted" status right away, without exposing it publicly
  // or opening any funding until it passes verification.
  const rescueCase = await RescueCase.create({
    caseId: generateCaseId(),
    report: report._id,
    condition,
    animalType,
    photos,
    location,
    status: 'reported',
    timeline: [{ stage: 'reported', note: 'Reported by community member' }],
    isHidden: true,
    isDemo: false,
  });

  report.rescueCase = rescueCase._id;
  await report.save();

  await logAction({ req, action: 'rescue_report.create', entityType: 'RescueReport', entityId: report._id });

  res.status(201).json({
    success: true,
    message: 'Report submitted. Our verification team will review it shortly.',
    caseId: rescueCase.caseId,
    status: 'Submitted',
    report: { ...report.toObject(), location: toPublicLocation(report.location) },
  });
});

// @desc    List rescue reports (admin/org queue)
// @route   GET /api/rescue-reports
// @access  Private (admin, organization)
const listReports = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const reports = await RescueReport.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('reporter', 'name email');

  const total = await RescueReport.countDocuments(filter);

  res.json({ success: true, count: reports.length, total, page: Number(page), reports });
});

// @desc    Get single report
// @route   GET /api/rescue-reports/:id
// @access  Private (admin, organization, reporter)
const getReport = asyncHandler(async (req, res) => {
  const report = await RescueReport.findById(req.params.id).populate('reporter', 'name email');
  if (!report) throw new AppError('Report not found', 404);
  res.json({ success: true, report });
});

// @desc    Update report status - verify / reject / mark duplicate.
//          Verifying reveals the already-generated RescueCase in public
//          feeds and creates its Animal profile; rejecting/marking a
//          duplicate keeps the case hidden from the public (spec 8/9).
// @route   PATCH /api/rescue-reports/:id/status
// @access  Private (admin, organization)
const updateReportStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason, displayName } = req.body;
  const allowed = ['under_review', 'verified', 'rejected', 'duplicate'];
  if (!allowed.includes(status)) throw new AppError(`Invalid status. Must be one of: ${allowed.join(', ')}`, 400);

  const report = await RescueReport.findById(req.params.id);
  if (!report) throw new AppError('Report not found', 404);
  if (report.status === 'verified') throw new AppError('Report is already verified', 409);

  const rescueCase = await RescueCase.findById(report.rescueCase);
  if (!rescueCase) throw new AppError('Linked rescue case not found', 404);

  const before = report.toObject();
  report.status = status;
  report.rejectionReason = status === 'rejected' ? rejectionReason : undefined;
  report.reviewedBy = req.user._id;
  report.reviewedAt = new Date();

  if (status === 'verified') {
    const animal = await Animal.create({
      name: displayName || 'Unnamed',
      species: report.animalType,
      photos: report.photos,
      careStatus: 'in_treatment',
      location: report.location.address,
    });

    rescueCase.animal = animal._id;
    rescueCase.displayName = displayName || 'Unnamed';
    rescueCase.isHidden = false;
    rescueCase.pushTimeline('verified', 'Verified by PAWSYNC review team', req.user._id);
    await rescueCase.save();

    animal.rescueCase = rescueCase._id;
    await animal.save();

    if (report.reporter) {
      await awardPoints(report.reporter, 'valid_report', `Report ${report._id} verified`);
      await notify({
        user: report.reporter,
        type: 'report_verified',
        title: 'Your rescue report was verified',
        message: `Case ${rescueCase.caseId} is now live. Thank you for looking out for animals in your community.`,
        link: `/rescue/${rescueCase.caseId}`,
      });
    }
  } else {
    // rejected / duplicate / under_review - case stays hidden from public feeds
    rescueCase.isHidden = status !== 'under_review';
    await rescueCase.save();
  }

  await report.save();
  await logAction({
    req,
    action: `rescue_report.${status}`,
    entityType: 'RescueReport',
    entityId: report._id,
    before,
    after: report.toObject(),
  });

  res.json({ success: true, report, rescueCase });
});

module.exports = { createReport, listReports, getReport, updateReportStatus };

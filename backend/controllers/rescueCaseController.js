const asyncHandler = require('express-async-handler');
const RescueCase = require('../models/RescueCase');
const AppError = require('../utils/appError');
const { toPublicLocation } = require('../utils/geo');
const { TIMELINE_STAGES } = require('../models/RescueCase');
const { notify } = require('../services/notificationService');
const { awardPoints } = require('../services/pointsService');
const { logAction } = require('../services/auditService');

const PRIVILEGED_ROLES = ['admin', 'organization', 'volunteer', 'vet'];

function serializeCase(rescueCase, viewerRole) {
  const obj = rescueCase.toObject();
  if (!viewerRole || !PRIVILEGED_ROLES.includes(viewerRole)) {
    obj.location = toPublicLocation(obj.location);
  }
  return obj;
}

// @desc    Public feed of live rescue cases (for homepage + /rescue browse)
// @route   GET /api/rescue-cases
// @access  Public
const listCases = asyncHandler(async (req, res) => {
  const { status, animalType, page = 1, limit = 12, includeHidden } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (animalType) filter.animalType = animalType;

  // Unverified/rejected cases are unlisted from public feeds - only
  // admins/organizations reviewing the moderation queue can request them.
  const canSeeHidden = req.user && ['admin', 'organization'].includes(req.user.role) && includeHidden === 'true';
  if (!canSeeHidden) filter.isHidden = false;

  const cases = await RescueCase.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await RescueCase.countDocuments(filter);
  const viewerRole = req.user ? req.user.role : null;

  res.json({
    success: true,
    count: cases.length,
    total,
    page: Number(page),
    cases: cases.map((c) => serializeCase(c, viewerRole)),
  });
});

// @desc    Get a single case by its human-friendly Case ID (e.g. ARN-2026-004821)
// @route   GET /api/rescue-cases/:caseId
// @access  Public
const getCase = asyncHandler(async (req, res) => {
  const rescueCase = await RescueCase.findOne({ caseId: req.params.caseId })
    .populate('assignedVolunteer', 'name avatarUrl')
    .populate('assignedOrganization', 'name location');
  if (!rescueCase) throw new AppError('Rescue case not found', 404);

  const viewerRole = req.user ? req.user.role : null;
  res.json({ success: true, case: serializeCase(rescueCase, viewerRole) });
});

// @desc    Advance / update a case's status + timeline
// @route   PATCH /api/rescue-cases/:caseId/status
// @access  Private (admin, organization, assigned volunteer)
const updateCaseStatus = asyncHandler(async (req, res) => {
  const { stage, note } = req.body;
  if (!TIMELINE_STAGES.includes(stage)) {
    throw new AppError(`Invalid stage. Must be one of: ${TIMELINE_STAGES.join(', ')}`, 400);
  }

  const rescueCase = await RescueCase.findOne({ caseId: req.params.caseId });
  if (!rescueCase) throw new AppError('Rescue case not found', 404);

  const isAssignedVolunteer =
    rescueCase.assignedVolunteer && rescueCase.assignedVolunteer.toString() === req.user._id.toString();
  if (!['admin', 'organization'].includes(req.user.role) && !isAssignedVolunteer) {
    throw new AppError('You are not authorized to update this case', 403);
  }

  const before = rescueCase.status;
  rescueCase.pushTimeline(stage, note, req.user._id);
  await rescueCase.save();

  await logAction({
    req,
    action: 'rescue_case.status_update',
    entityType: 'RescueCase',
    entityId: rescueCase._id,
    before: { status: before },
    after: { status: stage },
  });

  if (rescueCase.report) {
    const RescueReport = require('../models/RescueReport');
    const report = await RescueReport.findById(rescueCase.report);
    if (report && report.reporter) {
      await notify({
        user: report.reporter,
        type: 'case_update',
        title: `${rescueCase.displayName}'s status was updated`,
        message: `Case ${rescueCase.caseId} is now: ${stage.replace(/_/g, ' ')}.`,
        link: `/rescue/${rescueCase.caseId}`,
      });
    }
  }

  if (stage === 'rescued' && rescueCase.assignedVolunteer) {
    await awardPoints(rescueCase.assignedVolunteer, 'verified_rescue_assistance', `Case ${rescueCase.caseId} rescued`);
  }

  res.json({ success: true, case: rescueCase });
});

// @desc    Assign a volunteer (or request professional assistance instead)
// @route   PATCH /api/rescue-cases/:caseId/assign
// @access  Private (admin, organization, volunteer self-assign via "I Can Help")
const assignVolunteer = asyncHandler(async (req, res) => {
  const { volunteerId, requestProfessionalAssistance } = req.body;
  const rescueCase = await RescueCase.findOne({ caseId: req.params.caseId });
  if (!rescueCase) throw new AppError('Rescue case not found', 404);

  if (requestProfessionalAssistance) {
    rescueCase.professionalAssistanceRequested = true;
    rescueCase.pushTimeline(rescueCase.status, 'Professional assistance requested instead of direct volunteer dispatch', req.user._id);
    await rescueCase.save();
    return res.json({ success: true, message: 'Professional assistance requested.', case: rescueCase });
  }

  const assignee = volunteerId || (req.user.role === 'volunteer' ? req.user._id : null);
  if (!assignee) throw new AppError('volunteerId is required', 400);

  rescueCase.assignedVolunteer = assignee;
  rescueCase.pushTimeline('volunteer_assigned', 'Volunteer assigned to this case', req.user._id);
  await rescueCase.save();

  await awardPoints(assignee, 'rescue_coordination', `Assigned to case ${rescueCase.caseId}`);
  await notify({
    user: assignee,
    type: 'volunteer_assigned',
    title: 'You have been assigned to a rescue',
    message: `You're now assigned to case ${rescueCase.caseId} (${rescueCase.displayName}). Please review the case details before heading out.`,
    link: `/rescue/${rescueCase.caseId}`,
  });

  res.json({ success: true, case: rescueCase });
});

// @desc    Approve a donation campaign for a case (gate before public fundraising)
// @route   PATCH /api/rescue-cases/:caseId/campaign/approve
// @access  Private (admin, organization)
const approveCampaign = asyncHandler(async (req, res) => {
  const { title, goalAmount, treatmentEstimate } = req.body;
  if (!goalAmount || Number(goalAmount) <= 0) throw new AppError('A valid goalAmount is required', 400);

  const rescueCase = await RescueCase.findOne({ caseId: req.params.caseId });
  if (!rescueCase) throw new AppError('Rescue case not found', 404);

  rescueCase.campaign.isApproved = true;
  rescueCase.campaign.approvedBy = req.user._id;
  rescueCase.campaign.approvedAt = new Date();
  rescueCase.campaign.title = title || `${rescueCase.displayName}'s Recovery`;
  rescueCase.campaign.goalAmount = Number(goalAmount);
  rescueCase.campaign.treatmentEstimate = treatmentEstimate;

  await rescueCase.save();
  await logAction({
    req,
    action: 'rescue_case.campaign_approve',
    entityType: 'RescueCase',
    entityId: rescueCase._id,
    after: rescueCase.campaign.toObject(),
  });

  res.json({ success: true, case: rescueCase });
});

// @desc    Add an approved expense line to a case's campaign (transparency ledger)
// @route   POST /api/rescue-cases/:caseId/expenses
// @access  Private (admin, organization)
const addApprovedExpense = asyncHandler(async (req, res) => {
  const { label, amount, receiptUrl } = req.body;
  if (!label || !amount) throw new AppError('label and amount are required', 400);

  const rescueCase = await RescueCase.findOne({ caseId: req.params.caseId });
  if (!rescueCase) throw new AppError('Rescue case not found', 404);

  rescueCase.campaign.approvedExpenses.push({
    label,
    amount: Number(amount),
    approvedBy: req.user._id,
    receiptUrl,
  });
  await rescueCase.save();

  res.status(201).json({ success: true, case: rescueCase });
});

module.exports = {
  listCases,
  getCase,
  updateCaseStatus,
  assignVolunteer,
  approveCampaign,
  addApprovedExpense,
};

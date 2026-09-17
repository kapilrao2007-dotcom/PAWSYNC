const asyncHandler = require('express-async-handler');
const Volunteer = require('../models/Volunteer');
const AppError = require('../utils/appError');

// @desc    Apply to become a volunteer (creates/updates own profile)
// @route   POST /api/volunteers
// @access  Private
const upsertVolunteerProfile = asyncHandler(async (req, res) => {
  const { area, skills, availability, preferredActivities, lng, lat } = req.body;

  const profile = await Volunteer.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      area,
      skills,
      availability,
      preferredActivities,
      ...(lng && lat ? { location: { type: 'Point', coordinates: [Number(lng), Number(lat)] } } : {}),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  req.user.role = req.user.role === 'citizen' ? 'volunteer' : req.user.role;
  await req.user.save();

  res.status(201).json({ success: true, profile });
});

// @desc    Public/lightweight preview list of verified volunteers (for homepage stats)
// @route   GET /api/volunteers
// @access  Public
const listVolunteers = asyncHandler(async (req, res) => {
  const { verified = 'true', limit = 12 } = req.query;
  const filter = verified === 'true' ? { verificationStatus: 'verified' } : {};

  const volunteers = await Volunteer.find(filter)
    .limit(Number(limit))
    .populate('user', 'name avatarUrl area level badges');

  res.json({ success: true, count: volunteers.length, volunteers });
});

// @desc    Get my volunteer dashboard profile
// @route   GET /api/volunteers/me
// @access  Private (volunteer)
const getMyVolunteerProfile = asyncHandler(async (req, res) => {
  const profile = await Volunteer.findOne({ user: req.user._id });
  if (!profile) throw new AppError('No volunteer profile found. Apply to become a volunteer first.', 404);
  res.json({ success: true, profile });
});

// @desc    Admin: verify a volunteer profile
// @route   PATCH /api/volunteers/:id/verify
// @access  Private (admin)
const verifyVolunteer = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'verified' | 'rejected'
  const profile = await Volunteer.findByIdAndUpdate(req.params.id, { verificationStatus: status }, { new: true });
  if (!profile) throw new AppError('Volunteer profile not found', 404);
  res.json({ success: true, profile });
});

module.exports = { upsertVolunteerProfile, listVolunteers, getMyVolunteerProfile, verifyVolunteer };

const asyncHandler = require('express-async-handler');
const Organization = require('../models/Organization');
const AppError = require('../utils/appError');

// @desc    Public partner/organization directory
// @route   GET /api/organizations
// @access  Public
const listOrganizations = asyncHandler(async (req, res) => {
  const { type, verified = 'true' } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (verified === 'true') filter.verificationStatus = 'verified';

  const organizations = await Organization.find(filter).select('-contactPhone');
  res.json({ success: true, count: organizations.length, organizations });
});

const getOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) throw new AppError('Organization not found', 404);
  res.json({ success: true, organization });
});

// @desc    Admin: register / verify an organization
// @route   POST /api/organizations
// @access  Private (admin)
const createOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.create(req.body);
  res.status(201).json({ success: true, organization });
});

const verifyOrganization = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const organization = await Organization.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: status },
    { new: true }
  );
  if (!organization) throw new AppError('Organization not found', 404);
  res.json({ success: true, organization });
});

module.exports = { listOrganizations, getOrganization, createOrganization, verifyOrganization };

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { signToken } = require('../utils/token');
const { logAction } = require('../services/auditService');

const sanitizeRole = (role) => (['citizen', 'volunteer', 'vet', 'shelter', 'organization'].includes(role) ? role : 'citizen');
// Note: 'admin' can never be self-assigned at registration - promoted only by an existing admin.

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, area } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError('An account with this email already exists', 409);

  const user = await User.create({
    name,
    email,
    password,
    phone,
    area,
    role: sanitizeRole(role),
  });

  await logAction({ req, action: 'user.register', entityType: 'User', entityId: user._id });

  const token = signToken(user._id);
  res.status(201).json({ success: true, token, user: user.toSafeJSON() });
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (user.isBlocked) throw new AppError('This account has been blocked. Contact support.', 403);

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  res.json({ success: true, token, user: user.toSafeJSON() });
});

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() });
});

// @desc    Update own profile (name, phone, area, avatar, privacy)
// @route   PATCH /api/auth/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'area', 'avatarUrl', 'privacy'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ success: true, user: req.user.toSafeJSON() });
});

module.exports = { register, login, getMe, updateMe };

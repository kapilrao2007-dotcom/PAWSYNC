const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { logAction } = require('../services/auditService');

// @desc    Admin: list users with filters
// @route   GET /api/users
// @access  Private (admin)
const listUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await User.countDocuments(filter);

  res.json({ success: true, count: users.length, total, page: Number(page), users });
});

// @desc    Admin: block / unblock a user
// @route   PATCH /api/users/:id/block
// @access  Private (admin)
const toggleBlockUser = asyncHandler(async (req, res) => {
  const { isBlocked } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'admin') throw new AppError('Cannot block an admin account', 403);

  user.isBlocked = Boolean(isBlocked);
  await user.save();

  await logAction({
    req,
    action: isBlocked ? 'user.block' : 'user.unblock',
    entityType: 'User',
    entityId: user._id,
  });

  res.json({ success: true, user: user.toSafeJSON() });
});

// @desc    Admin: change a user's role (e.g. promote to organization/admin)
// @route   PATCH /api/users/:id/role
// @access  Private (admin)
const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  const before = user.role;
  user.role = role;
  await user.save();

  await logAction({
    req,
    action: 'user.role_change',
    entityType: 'User',
    entityId: user._id,
    before: { role: before },
    after: { role },
  });

  res.json({ success: true, user: user.toSafeJSON() });
});

module.exports = { listUsers, toggleBlockUser, changeUserRole };

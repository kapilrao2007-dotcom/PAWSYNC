const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const User = require('../models/User');

/**
 * Verifies a JWT (from Authorization: Bearer <token>) and attaches
 * the authenticated user to req.user. Rejects blocked/inactive accounts.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized - no token provided', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) throw new AppError('Not authorized - user no longer exists', 401);
  if (user.isBlocked) throw new AppError('This account has been blocked', 403);
  if (!user.isActive) throw new AppError('This account has been deactivated', 403);

  req.user = user;
  next();
});

/**
 * Optional auth: attaches req.user if a valid token is present, but
 * does not reject the request otherwise. Used for guest-friendly routes
 * like public report submission.
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && !user.isBlocked && user.isActive) req.user = user;
    } catch (err) {
      // ignore invalid token for optional auth
    }
  }
  next();
});

/**
 * Role-based access control. Usage: authorize('admin', 'organization')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) throw new AppError('Not authorized', 401);
  if (!roles.includes(req.user.role)) {
    throw new AppError(`Role '${req.user.role}' is not permitted to perform this action`, 403);
  }
  next();
};

module.exports = { protect, optionalAuth, authorize };

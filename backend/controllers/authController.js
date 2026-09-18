const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { signToken } = require('../utils/token');
const { logAction } = require('../services/auditService');

// Node 18+ ships a global fetch - we deliberately avoid adding a Google/
// Facebook SDK dependency for this; both providers expose plain HTTPS
// endpoints that are enough to verify a token server-side.
const fetchJson = async (url) => {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
};

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

// @desc    Sign in / sign up with Google (Google Identity Services ID token)
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new AppError('Google sign-in is not configured on this server yet. An administrator needs to set GOOGLE_CLIENT_ID in backend/.env.', 501);
  }

  const { credential } = req.body;
  if (!credential) throw new AppError('Missing Google credential', 400);

  // Verify the ID token against Google's tokeninfo endpoint. This confirms
  // the token was really issued by Google and hasn't been tampered with.
  const { ok, data } = await fetchJson(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!ok || !data.sub) throw new AppError('Invalid or expired Google credential', 401);
  if (data.aud !== clientId) throw new AppError('This Google credential was not issued for this app', 401);
  if (!data.email) throw new AppError('Your Google account has no email to sign in with', 400);

  let user = await User.findOne({ $or: [{ googleId: data.sub }, { email: data.email.toLowerCase() }] });

  if (!user) {
    user = await User.create({
      name: data.name || data.email.split('@')[0],
      email: data.email,
      googleId: data.sub,
      avatarUrl: data.picture || '',
      isVerified: data.email_verified === 'true' || data.email_verified === true,
    });
    await logAction({ req, action: 'user.register', entityType: 'User', entityId: user._id });
  } else if (!user.googleId) {
    user.googleId = data.sub; // link the Google identity to an existing email/password account
    await user.save({ validateBeforeSave: false });
  }

  if (user.isBlocked) throw new AppError('This account has been blocked. Contact support.', 403);

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  res.json({ success: true, token, user: user.toSafeJSON() });
});

// @desc    Sign in / sign up with Facebook (Facebook Login access token)
// @route   POST /api/auth/facebook
// @access  Public
const facebookAuth = asyncHandler(async (req, res) => {
  const appId = process.env.FACEBOOK_APP_ID;
  if (!appId) {
    throw new AppError('Facebook sign-in is not configured on this server yet. An administrator needs to set FACEBOOK_APP_ID in backend/.env.', 501);
  }

  const { accessToken } = req.body;
  if (!accessToken) throw new AppError('Missing Facebook access token', 400);

  // Optional but recommended: verify the token was issued for THIS app,
  // when an app secret is available to build the required app access token.
  if (process.env.FACEBOOK_APP_SECRET) {
    const appToken = `${appId}|${process.env.FACEBOOK_APP_SECRET}`;
    const { ok: debugOk, data: debugData } = await fetchJson(
      `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appToken)}`
    );
    if (!debugOk || !debugData?.data?.is_valid || debugData.data.app_id !== appId) {
      throw new AppError('Invalid or expired Facebook access token', 401);
    }
  }

  const { ok, data } = await fetchJson(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${encodeURIComponent(accessToken)}`
  );
  if (!ok || !data.id) throw new AppError('Invalid or expired Facebook access token', 401);
  if (!data.email) {
    throw new AppError('Your Facebook account has no email PAWSYNC can use. Please use email sign-up instead, or allow email access when signing in with Facebook.', 400);
  }

  let user = await User.findOne({ $or: [{ facebookId: data.id }, { email: data.email.toLowerCase() }] });

  if (!user) {
    user = await User.create({
      name: data.name || data.email.split('@')[0],
      email: data.email,
      facebookId: data.id,
      avatarUrl: data.picture?.data?.url || '',
    });
    await logAction({ req, action: 'user.register', entityType: 'User', entityId: user._id });
  } else if (!user.facebookId) {
    user.facebookId = data.id; // link the Facebook identity to an existing email/password account
    await user.save({ validateBeforeSave: false });
  }

  if (user.isBlocked) throw new AppError('This account has been blocked. Contact support.', 403);

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  res.json({ success: true, token, user: user.toSafeJSON() });
});

module.exports = { register, login, getMe, updateMe, googleAuth, facebookAuth };

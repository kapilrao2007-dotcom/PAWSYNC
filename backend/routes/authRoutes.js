const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiters');
const { register, login, getMe, updateMe, googleAuth, facebookAuth } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/google', authLimiter, [body('credential').notEmpty().withMessage('Missing Google credential')], validate, googleAuth);
router.post('/facebook', authLimiter, [body('accessToken').notEmpty().withMessage('Missing Facebook access token')], validate, facebookAuth);

router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);

module.exports = router;

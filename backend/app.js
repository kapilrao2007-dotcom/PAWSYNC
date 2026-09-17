const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');

const { apiLimiter } = require('./middleware/rateLimiters');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const rescueReportRoutes = require('./routes/rescueReportRoutes');
const rescueCaseRoutes = require('./routes/rescueCaseRoutes');
const donationRoutes = require('./routes/donationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const animalRoutes = require('./routes/animalRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS - restrict to configured client origin(s)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// The Razorpay webhook needs the exact raw request body to verify its
// signature, so we capture it BEFORE the JSON body parser transforms it.
app.use(
  express.json({
    limit: '2mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// Sanitize against NoSQL injection & basic XSS payloads
app.use(mongoSanitize());
app.use(xss());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use('/api', apiLimiter);

// Local-dev image fallback storage (used only when Cloudinary is not configured)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, service: 'pawsync-backend', status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/rescue-reports', rescueReportRoutes);
app.use('/api/rescue-cases', rescueCaseRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

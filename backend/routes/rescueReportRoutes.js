const express = require('express');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const { writeLimiter } = require('../middleware/rateLimiters');
const upload = require('../middleware/upload');
const {
  createReport,
  listReports,
  getReport,
  updateReportStatus,
} = require('../controllers/rescueReportController');

const router = express.Router();

router.post('/', writeLimiter, optionalAuth, upload.array('photos', 6), createReport);
router.get('/', protect, authorize('admin', 'organization'), listReports);
router.get('/:id', protect, getReport);
router.patch('/:id/status', protect, authorize('admin', 'organization'), updateReportStatus);

module.exports = router;

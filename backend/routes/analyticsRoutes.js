const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getImpactStats, getAdminSummary } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/impact', getImpactStats);
router.get('/admin-summary', protect, authorize('admin'), getAdminSummary);

module.exports = router;

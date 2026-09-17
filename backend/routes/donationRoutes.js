const express = require('express');
const { optionalAuth, protect, authorize } = require('../middleware/auth');
const { writeLimiter } = require('../middleware/rateLimiters');
const {
  createDonationOrder,
  verifyDonation,
  getReceipt,
  listDonationsForCase,
  listAllDonations,
} = require('../controllers/donationController');

const router = express.Router();

router.get('/', protect, authorize('admin'), listAllDonations);
router.post('/create-order', writeLimiter, optionalAuth, createDonationOrder);
router.post('/verify', writeLimiter, optionalAuth, verifyDonation);
router.get('/:donationId/receipt', getReceipt);
router.get('/case/:caseId', listDonationsForCase);

module.exports = router;

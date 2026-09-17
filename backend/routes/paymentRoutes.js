const express = require('express');
const { handleWebhook } = require('../controllers/paymentWebhookController');

const router = express.Router();

// Note: this route is mounted with a raw-body parser in server.js so the
// webhook signature can be verified against the exact bytes received.
router.post('/webhook', handleWebhook);

module.exports = router;

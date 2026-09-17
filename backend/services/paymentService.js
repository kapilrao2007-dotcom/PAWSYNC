const crypto = require('crypto');
const Razorpay = require('razorpay');

const hasKeys = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

let razorpayInstance = null;
function getClient() {
  if (!hasKeys) return null;
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

/**
 * Creates a Razorpay order server-side. In local/demo environments without
 * real keys configured, returns a realistic mock order so the full donation
 * UI/flow can be exercised end-to-end without live credentials.
 */
async function createOrder({ amountInPaise, currency = 'INR', receipt, notes = {} }) {
  const client = getClient();

  if (!client) {
    return {
      id: `order_MOCK${crypto.randomBytes(6).toString('hex')}`,
      amount: amountInPaise,
      currency,
      receipt,
      status: 'created',
      notes,
      isMock: true,
    };
  }

  return client.orders.create({ amount: amountInPaise, currency, receipt, notes });
}

/**
 * Verifies the client-returned razorpay_signature against the order + payment
 * IDs using HMAC-SHA256 with the key secret. This is the server-side check
 * that must pass before a Donation is ever created (spec section 10/24).
 */
function verifySignature({ orderId, paymentId, signature }) {
  if (!hasKeys) {
    // Mock mode: accept a deterministic mock signature so the demo flow works.
    return signature === `mock_sig_${orderId}_${paymentId}`;
  }
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}

/**
 * Verifies an incoming webhook payload's signature against the configured
 * webhook secret. Webhooks are the source of truth for payment status,
 * independent of what the client tells us (spec section 10/24).
 */
function verifyWebhookSignature(rawBody, signatureHeader) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production'; // allow in dev/mock only
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signatureHeader;
}

module.exports = { hasKeys, getClient, createOrder, verifySignature, verifyWebhookSignature };

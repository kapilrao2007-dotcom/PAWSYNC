const mongoose = require('mongoose');

/**
 * Payment = the raw gateway-level transaction record (Razorpay order/payment).
 * Kept separate from Donation so failed/pending/refunded gateway attempts
 * are auditable even if a Donation record was never finalized.
 */
const paymentSchema = new mongoose.Schema(
  {
    gateway: { type: String, default: 'razorpay' },
    orderId: { type: String, required: true, unique: true, index: true }, // razorpay order_id
    paymentId: { type: String, index: true }, // razorpay payment_id (set after capture)
    signature: { type: String, select: false },

    amount: { type: Number, required: true, min: 1 }, // in smallest currency unit (paise)
    currency: { type: String, default: 'INR' },

    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'created',
    },

    // Idempotency: prevents duplicate donation creation from a retried webhook
    webhookEventIds: [{ type: String }],

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rescueCase: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCase' },

    refund: {
      isRefunded: { type: Boolean, default: false },
      refundId: { type: String },
      refundedAt: { type: Date },
      reason: { type: String },
    },

    rawResponse: { type: mongoose.Schema.Types.Mixed, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

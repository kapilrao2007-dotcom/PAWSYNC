const mongoose = require('mongoose');

/**
 * Donation = the finalized, verified contribution to a case's campaign.
 * A Donation is only ever created server-side, after Payment verification
 * or a webhook confirms the transaction (spec section 10 - never trust
 * frontend-only payment success).
 */
const donationSchema = new mongoose.Schema(
  {
    donationId: { type: String, required: true, unique: true, index: true }, // DON-2026-000123
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    donorName: { type: String, trim: true, default: 'Anonymous Supporter' },
    isAnonymous: { type: Boolean, default: false },

    rescueCase: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCase', required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },

    amount: { type: Number, required: true, min: 1 }, // in rupees (major unit) for display
    currency: { type: String, default: 'INR' },
    message: { type: String, trim: true, maxlength: 300 },

    status: { type: String, enum: ['pending', 'confirmed', 'refunded'], default: 'pending' },
    confirmedAt: { type: Date },
  },
  { timestamps: true }
);

donationSchema.index({ rescueCase: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);

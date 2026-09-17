const mongoose = require('mongoose');

/**
 * RescueReport = the raw citizen submission ("I see an animal in need").
 * It is intentionally lightweight and NEVER asks the reporter to diagnose
 * the animal - only to describe what they observed (spec section 8).
 * A report becomes a RescueCase only after admin/org verification.
 */
const rescueReportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional - allows guest reports
    guestContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
    },

    animalType: { type: String, enum: ['dog', 'cat', 'cow', 'bird', 'other'], required: true },
    condition: {
      type: String,
      enum: ['injured', 'sick', 'trapped', 'abandoned', 'lost', 'found', 'other'],
      required: true,
    },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    photos: [{ type: String }],

    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat] - exact, restricted
      address: { type: String, trim: true },
    },
    landmark: { type: String, trim: true },

    // Self-reported observation only - never a diagnosis
    urgencyIndicators: [
      {
        type: String,
        enum: ['bleeding', 'not_moving', 'traffic_risk', 'aggressive_area', 'weather_exposure', 'young_animal', 'none_observed'],
      },
    ],

    status: {
      type: String,
      enum: ['submitted', 'under_review', 'verified', 'rejected', 'duplicate'],
      default: 'submitted',
    },
    rejectionReason: { type: String, trim: true },

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },

    rescueCase: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCase' },

    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

rescueReportSchema.index({ location: '2dsphere' });
rescueReportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('RescueReport', rescueReportSchema);

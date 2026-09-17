const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'report_verified',
        'nearby_request',
        'campaign_milestone',
        'claim_approved',
        'case_update',
        'volunteer_assigned',
        'adoption_update',
        'system',
      ],
      default: 'system',
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    link: { type: String, trim: true }, // frontend deep link, e.g. /rescue/ARN-2026-004821
    isRead: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    area: { type: String, required: true, trim: true },
    skills: [{ type: String, trim: true }], // e.g. "First Aid", "Transport", "Handling", "Fostering"
    availability: {
      type: String,
      enum: ['weekdays', 'weekends', 'evenings', 'on_call', 'flexible'],
      default: 'flexible',
    },
    preferredActivities: [
      { type: String, enum: ['rescue', 'transport', 'foster', 'awareness', 'fundraising', 'medical_support'] },
    ],
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },

    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },

    stats: {
      communityHours: { type: Number, default: 0 },
      casesAssisted: { type: Number, default: 0 },
      activeCases: { type: Number, default: 0 },
      completedCases: { type: Number, default: 0 },
    },

    certificates: [
      {
        title: String,
        issuedAt: Date,
        fileUrl: String,
      },
    ],
  },
  { timestamps: true }
);

volunteerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Volunteer', volunteerSchema);

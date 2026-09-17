const mongoose = require('mongoose');

/**
 * Minimal Organization model - full Shelter/Vet/NGO directory modules
 * (spec sections 19-20) are expanded in Phase 2. Kept here because
 * RescueCase and Animal reference it for shelter assignment.
 */
const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['shelter', 'ngo', 'vet_clinic'], default: 'shelter' },
    location: { type: String, trim: true },
    servicesOffered: [{ type: String, trim: true }],
    capacity: { type: Number, default: 0 },
    animalsHosted: { type: Number, default: 0 },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true, select: false },
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);

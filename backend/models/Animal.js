const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: 'Unnamed' },
    species: { type: String, enum: ['dog', 'cat', 'cow', 'bird', 'other'], required: true },
    breed: { type: String, trim: true, default: 'Mixed / Unknown' },
    approxAge: { type: String, trim: true, default: 'Unknown' },
    gender: { type: String, enum: ['male', 'female', 'unknown'], default: 'unknown' },
    temperament: [{ type: String, trim: true }], // e.g. "Gentle", "Playful", "Shy"

    story: { type: String, trim: true, maxlength: 4000 },
    recoveryJourney: { type: String, trim: true, maxlength: 4000 },

    photos: [{ type: String }],

    careStatus: {
      type: String,
      enum: ['in_treatment', 'recovering', 'healthy', 'foster_care', 'shelter_care'],
      default: 'in_treatment',
    },

    adoptionStatus: {
      type: String,
      enum: ['not_listed', 'available', 'pending', 'adopted'],
      default: 'not_listed',
    },
    adoptionRequirements: [{ type: String, trim: true }],

    location: { type: String, trim: true }, // approximate area label, e.g. "Andheri West, Mumbai"

    rescueCase: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCase' },
    currentShelter: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    currentFoster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

animalSchema.index({ species: 1, adoptionStatus: 1 });

module.exports = mongoose.model('Animal', animalSchema);

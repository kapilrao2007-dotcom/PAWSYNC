const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['citizen', 'volunteer', 'vet', 'shelter', 'organization', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: { type: String, trim: true, select: false },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: 'citizen' },
    avatarUrl: { type: String, default: '' },
    area: { type: String, trim: true, default: '' },

    // Verification & security
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },

    // Contribution / gamification snapshot (denormalized for fast reads)
    contributionPoints: { type: Number, default: 0 },
    level: {
      type: String,
      enum: ['none', 'community_helper', 'rescue_supporter', 'animal_guardian', 'community_champion'],
      default: 'none',
    },
    badges: [{ type: String }],

    // Privacy controls
    privacy: {
      showExactLocationToVolunteers: { type: Boolean, default: false },
      showPhoneToVerifiedOrgs: { type: Boolean, default: true },
      profileDiscoverable: { type: Boolean, default: true },
    },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;

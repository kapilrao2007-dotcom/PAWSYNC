const mongoose = require('mongoose');

const TIMELINE_STAGES = [
  'reported',
  'verified',
  'volunteer_assigned',
  'rescue_in_progress',
  'rescued',
  'treatment',
  'foster_shelter',
  'recovered',
  'adoption',
  'closed',
];

const timelineEntrySchema = new mongoose.Schema(
  {
    stage: { type: String, enum: TIMELINE_STAGES, required: true },
    note: { type: String, trim: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const expenseLineSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true }, // e.g. "Veterinary treatment"
    amount: { type: Number, required: true, min: 0 },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiptUrl: { type: String },
    approvedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const campaignSchema = new mongoose.Schema(
  {
    isApproved: { type: Boolean, default: false }, // gate: never auto-created (spec section 8/10)
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    title: { type: String, trim: true }, // e.g. "Rocky's Recovery"
    goalAmount: { type: Number, default: 0, min: 0 },
    raisedAmount: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'INR' },
    treatmentEstimate: { type: String, trim: true },
    approvedExpenses: [expenseLineSchema],
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const rescueCaseSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true, unique: true, index: true }, // ARN-2026-004821
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueReport', required: true },
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },

    displayName: { type: String, trim: true, default: 'Unnamed' }, // "Rocky"
    condition: {
      type: String,
      enum: ['injured', 'sick', 'trapped', 'abandoned', 'lost', 'found', 'other'],
      required: true,
    },
    animalType: { type: String, enum: ['dog', 'cat', 'cow', 'bird', 'other'], required: true },
    photos: [{ type: String }],

    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
      address: { type: String, trim: true },
    },

    status: {
      type: String,
      enum: TIMELINE_STAGES,
      default: 'reported',
    },
    timeline: [timelineEntrySchema],

    assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedOrganization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    professionalAssistanceRequested: { type: Boolean, default: false },

    campaign: { type: campaignSchema, default: () => ({}) },

    // Set true if the underlying report was rejected/marked duplicate -
    // keeps the Case ID + tracking link valid for the reporter without
    // surfacing it in the public "Live Rescue Cases" feed.
    isHidden: { type: Boolean, default: false },

    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

rescueCaseSchema.index({ status: 1, createdAt: -1 });
rescueCaseSchema.index({ 'campaign.isApproved': 1 });

rescueCaseSchema.methods.pushTimeline = function pushTimeline(stage, note, actor) {
  this.timeline.push({ stage, note, actor });
  this.status = stage;
};

module.exports = mongoose.model('RescueCase', rescueCaseSchema);
module.exports.TIMELINE_STAGES = TIMELINE_STAGES;

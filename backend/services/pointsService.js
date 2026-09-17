const User = require('../models/User');

// spec section 13 - Contribution Reward System
const POINT_VALUES = {
  valid_report: 10,
  rescue_coordination: 15,
  verified_rescue_assistance: 30,
  approved_foster_support: 50,
  adoption_follow_up: 25,
  verified_awareness_activity: 10,
};

const LEVEL_THRESHOLDS = [
  { min: 1000, level: 'community_champion', label: 'Community Champion' },
  { min: 500, level: 'animal_guardian', label: 'Animal Guardian' },
  { min: 250, level: 'rescue_supporter', label: 'Rescue Supporter' },
  { min: 100, level: 'community_helper', label: 'Community Helper' },
  { min: 0, level: 'none', label: 'Newcomer' },
];

function resolveLevel(points) {
  return LEVEL_THRESHOLDS.find((t) => points >= t.min);
}

/**
 * Awards points ONLY after verification of the underlying action - never
 * automatically on upload (spec section 13). Updates the user's level and
 * badge list transactionally with their new point total.
 */
async function awardPoints(userId, reasonKey, note) {
  if (!userId) return null;
  const amount = POINT_VALUES[reasonKey];
  if (!amount) throw new Error(`Unknown point reason: ${reasonKey}`);

  const user = await User.findById(userId);
  if (!user) return null;

  user.contributionPoints += amount;
  const newLevel = resolveLevel(user.contributionPoints);
  const leveledUp = newLevel.level !== user.level;
  user.level = newLevel.level;

  if (leveledUp && newLevel.level !== 'none' && !user.badges.includes(newLevel.label)) {
    user.badges.push(newLevel.label);
  }

  await user.save();
  return { amount, total: user.contributionPoints, level: user.level, leveledUp, note };
}

module.exports = { POINT_VALUES, LEVEL_THRESHOLDS, resolveLevel, awardPoints };

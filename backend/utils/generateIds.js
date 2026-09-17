const { customAlphabet } = require('nanoid');

const numeric = customAlphabet('0123456789', 6);

/**
 * Generates a human-friendly, sortable Case ID.
 * Format: ARN-<year>-<6 digit sequence>
 * Example: ARN-2026-004821
 */
function generateCaseId() {
  const year = new Date().getFullYear();
  return `ARN-${year}-${numeric()}`;
}

/**
 * Generates a Donation ID.
 * Format: DON-<year>-<6 digit sequence>
 */
function generateDonationId() {
  const year = new Date().getFullYear();
  return `DON-${year}-${numeric()}`;
}

module.exports = { generateCaseId, generateDonationId };

const asyncHandler = require('express-async-handler');
const RescueReport = require('../models/RescueReport');
const RescueCase = require('../models/RescueCase');
const Donation = require('../models/Donation');
const Animal = require('../models/Animal');
const Volunteer = require('../models/Volunteer');
const Organization = require('../models/Organization');

// @desc    Community impact numbers used on the public homepage counters.
//          IMPORTANT: this always reflects real database counts. Seeded
//          demo data is clearly flagged via isDemo so it can be excluded
//          in a production deployment by filtering isDemo:false.
// @route   GET /api/analytics/impact
// @access  Public
const getImpactStats = asyncHandler(async (req, res) => {
  const [reports, animalsAssisted, treatmentCases, adoptions, activeVolunteers, orgs, donationAgg] =
    await Promise.all([
      RescueReport.countDocuments({}),
      RescueCase.countDocuments({ status: { $ne: 'reported' } }),
      RescueCase.countDocuments({ status: { $in: ['treatment', 'recovered', 'adoption', 'closed'] } }),
      Animal.countDocuments({ adoptionStatus: 'adopted' }),
      Volunteer.countDocuments({ verificationStatus: 'verified' }),
      Organization.countDocuments({ verificationStatus: 'verified' }),
      Donation.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
    ]);

  const communities = await RescueCase.distinct('location.address');

  res.json({
    success: true,
    isDemoEnvironment: true,
    stats: {
      reports,
      animalsAssisted,
      treatmentCases,
      adoptions,
      activeVolunteers,
      communitiesServed: Math.max(communities.filter(Boolean).length, 0),
      totalDonated: donationAgg[0]?.total || 0,
      totalDonations: donationAgg[0]?.count || 0,
      verifiedOrganizations: orgs,
    },
  });
});

// @desc    Admin dashboard summary cards
// @route   GET /api/analytics/admin-summary
// @access  Private (admin)
const getAdminSummary = asyncHandler(async (req, res) => {
  const [
    totalReports,
    pendingVerification,
    activeRescues,
    treatmentCases,
    donationAgg,
    verifiedVolunteers,
    adoptions,
  ] = await Promise.all([
    RescueReport.countDocuments({}),
    RescueReport.countDocuments({ status: 'submitted' }),
    RescueCase.countDocuments({ status: { $in: ['verified', 'volunteer_assigned', 'rescue_in_progress'] } }),
    RescueCase.countDocuments({ status: 'treatment' }),
    Donation.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Volunteer.countDocuments({ verificationStatus: 'verified' }),
    Animal.countDocuments({ adoptionStatus: 'adopted' }),
  ]);

  res.json({
    success: true,
    summary: {
      totalReports,
      pendingVerification,
      activeRescues,
      treatmentCases,
      totalDonations: donationAgg[0]?.total || 0,
      donationCount: donationAgg[0]?.count || 0,
      verifiedVolunteers,
      adoptions,
    },
  });
});

module.exports = { getImpactStats, getAdminSummary };

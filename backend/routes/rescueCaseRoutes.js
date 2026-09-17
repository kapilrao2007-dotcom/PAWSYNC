const express = require('express');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const {
  listCases,
  getCase,
  updateCaseStatus,
  assignVolunteer,
  approveCampaign,
  addApprovedExpense,
} = require('../controllers/rescueCaseController');

const router = express.Router();

router.get('/', optionalAuth, listCases);
router.get('/:caseId', optionalAuth, getCase);
router.patch('/:caseId/status', protect, authorize('admin', 'organization', 'volunteer'), updateCaseStatus);
router.patch('/:caseId/assign', protect, authorize('admin', 'organization', 'volunteer'), assignVolunteer);
router.patch('/:caseId/campaign/approve', protect, authorize('admin', 'organization'), approveCampaign);
router.post('/:caseId/expenses', protect, authorize('admin', 'organization'), addApprovedExpense);

module.exports = router;

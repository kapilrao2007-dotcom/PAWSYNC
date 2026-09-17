const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  upsertVolunteerProfile,
  listVolunteers,
  getMyVolunteerProfile,
  verifyVolunteer,
} = require('../controllers/volunteerController');

const router = express.Router();

router.get('/', listVolunteers);
router.post('/', protect, upsertVolunteerProfile);
router.get('/me', protect, getMyVolunteerProfile);
router.patch('/:id/verify', protect, authorize('admin'), verifyVolunteer);

module.exports = router;

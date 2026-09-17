const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  listOrganizations,
  getOrganization,
  createOrganization,
  verifyOrganization,
} = require('../controllers/organizationController');

const router = express.Router();

router.get('/', listOrganizations);
router.get('/:id', getOrganization);
router.post('/', protect, authorize('admin'), createOrganization);
router.patch('/:id/verify', protect, authorize('admin'), verifyOrganization);

module.exports = router;

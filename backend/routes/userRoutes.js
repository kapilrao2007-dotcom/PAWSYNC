const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { listUsers, toggleBlockUser, changeUserRole } = require('../controllers/userController');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/', listUsers);
router.patch('/:id/block', toggleBlockUser);
router.patch('/:id/role', changeUserRole);

module.exports = router;

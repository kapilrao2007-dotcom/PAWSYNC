const express = require('express');
const { protect } = require('../middleware/auth');
const { listMyNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', protect, listMyNotifications);
router.patch('/read-all', protect, markAllAsRead);
router.patch('/:id/read', protect, markAsRead);

module.exports = router;

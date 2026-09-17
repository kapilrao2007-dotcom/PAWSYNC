const multer = require('multer');
const path = require('path');
const AppError = require('../utils/appError');

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

// Files are held in memory briefly, then either streamed to Cloudinary
// (services/uploadService.js) or flushed to /uploads in local dev mode.
// Never written to disk with their original name/extension trusted blindly.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new AppError('Only JPG, PNG, WEBP or GIF images are allowed', 400), false);
  }
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
    return cb(new AppError('Unsupported file extension', 400), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 6 },
});

module.exports = upload;

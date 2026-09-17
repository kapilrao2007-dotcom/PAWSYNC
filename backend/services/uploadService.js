const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { cloudinary, isConfigured } = require('../config/cloudinary');

const LOCAL_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });

/**
 * Uploads an in-memory file buffer (from multer) to Cloudinary if configured,
 * otherwise falls back to local disk storage under /uploads for local dev.
 * Returns a public URL string.
 */
async function uploadImageBuffer(file, folder = 'pawsync') {
  if (isConfigured) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(file.buffer);
    });
  }

  // Local dev fallback: write with a random, extension-safe filename.
  const safeExt = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }[
    file.mimetype
  ] || '.jpg';
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
  const filepath = path.join(LOCAL_UPLOAD_DIR, filename);
  fs.writeFileSync(filepath, file.buffer);
  return `/uploads/${filename}`;
}

async function uploadImages(files = [], folder = 'pawsync') {
  return Promise.all(files.map((file) => uploadImageBuffer(file, folder)));
}

module.exports = { uploadImageBuffer, uploadImages };

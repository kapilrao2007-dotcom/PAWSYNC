const Notification = require('../models/Notification');

/**
 * Creates an in-app notification. Email delivery is stubbed for the
 * local/dev environment (logs to console) - wire up a provider such as
 * Nodemailer + SES/SendGrid in production (see README "Phase 2+").
 */
async function notify({ user, type = 'system', title, message, link, meta }) {
  const notification = await Notification.create({ user, type, title, message, link, meta });

  // Stubbed email send - replace with a real provider in production.
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[PAWSYNC EMAIL-STUB] To user ${user}: "${title}" - ${message}`);
  }

  return notification;
}

module.exports = { notify };

const AuditLog = require('../models/AuditLog');

async function logAction({ req, action, entityType, entityId, before, after }) {
  try {
    await AuditLog.create({
      actor: req.user ? req.user._id : undefined,
      actorRole: req.user ? req.user.role : 'guest',
      action,
      entityType,
      entityId,
      before,
      after,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  } catch (err) {
    // Audit logging must never break the primary request flow.
    console.error(`[PAWSYNC AUDIT] Failed to log action ${action}:`, err.message);
  }
}

module.exports = { logAction };

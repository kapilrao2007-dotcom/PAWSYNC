const mongoose = require('mongoose');
const AppError = require('../utils/appError');

/**
 * Fails fast with a clear, actionable message when MongoDB isn't currently
 * connected, instead of letting Mongoose silently buffer the query for
 * ~10s and then blow up with an opaque timeout error that looks like any
 * other unhandled 500 to the frontend.
 *
 * This is what turns a confusing "Request failed with status code 500" on
 * sign-up / the donate page into a message that actually says what's wrong.
 */
function requireDb(req, res, next) {
  // 1 = connected. 0 = disconnected, 2 = connecting, 3 = disconnecting.
  if (mongoose.connection.readyState !== 1) {
    return next(
      new AppError(
        'The PAWSYNC server is running, but it cannot reach the database right now. ' +
          'Check that MONGO_URI in backend/.env is correct and that MongoDB (local mongod, or your Atlas cluster) is reachable, then restart the backend.',
        503
      )
    );
  }
  next();
}

module.exports = requireDb;

const AppError = require('../utils/appError');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;

  if (err.name === 'CastError') {
    error = new AppError(`Resource not found with id ${err.value}`, 404);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new AppError(`Duplicate value for ${field}. Please use another value.`, 409);
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid authentication token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Authentication token expired', 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : error.message || 'Something went wrong';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[PAWSYNC ERROR] ${req.method} ${req.originalUrl} -> ${statusCode}: ${err.message}`);
    if (statusCode === 500) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { stack: err.stack } : {}),
  });
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };

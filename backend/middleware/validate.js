const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

/**
 * Runs after an array of express-validator checks and turns any
 * validation failures into a single, clean 400 AppError.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join('; ');
    return next(new AppError(message, 400));
  }
  next();
}

module.exports = validate;

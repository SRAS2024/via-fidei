// server/middleware/validateRequest.js
const { validationResult } = require("express-validator");

/**
 * Middleware to validate request using express-validator
 * If there are validation errors, returns 400 with error details
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  next();
}

module.exports = validateRequest;

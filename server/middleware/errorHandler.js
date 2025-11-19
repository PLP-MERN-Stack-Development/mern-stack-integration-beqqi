const { validationResult } = require('express-validator');

// Centralized error handler and express-validator result handler
module.exports = (err, req, res, next) => {
  // If there are validation errors from express-validator, handle them
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const status = err.statusCode || 500;
  const message = err.message || 'Server Error';
  console.error(err);
  res.status(status).json({ success: false, message });
};

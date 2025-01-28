const { validationResult } = require("express-validator");

const handleValidationError = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, errors: result.array() });
  }
  next();
};

module.exports = handleValidationError;

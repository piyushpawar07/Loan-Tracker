const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return sendError(res, 400, 'Validation failed', {
    errors: result.array({ onlyFirstError: true }).map((err) => ({
      field: err.path,
      message: err.msg,
    })),
  });
}

module.exports = validate;

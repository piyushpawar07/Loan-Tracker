const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

// Runs after the express-validator chains in a route file. Keeping this check
// in one shared place means controllers can assume their input is already
// valid and never have to contain validation logic themselves.
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

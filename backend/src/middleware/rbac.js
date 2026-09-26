const { ALL_ROLES } = require('../constants/roles');
const { sendError } = require('../utils/response');

function authorize(...allowedRoles) {
  if (allowedRoles.length === 0) {
    throw new Error('authorize() needs at least one role');
  }
  const unknownRoles = allowedRoles.filter((role) => !ALL_ROLES.includes(role));
  if (unknownRoles.length > 0) {
    throw new Error(`authorize() got unknown role(s): ${unknownRoles.join(', ')}`);
  }

  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, `Forbidden: requires one of [${allowedRoles.join(', ')}]`);
    }

    return next();
  };
}

module.exports = { authorize };

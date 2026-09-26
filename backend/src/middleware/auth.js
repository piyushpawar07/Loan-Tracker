const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../services/tokenBlacklist.service');
const { sendError } = require('../utils/response');

async function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return sendError(res, 401, 'Authentication token missing');
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    return sendError(res, 401, 'Authentication token missing');
  }

  let revoked;
  try {
    revoked = await isTokenBlacklisted(token);
  } catch (err) {
    console.error('Token blacklist check failed:', err.message);
    return sendError(res, 503, 'Authentication service unavailable, please retry');
  }
  if (revoked) {
    return sendError(res, 401, 'Token has been revoked');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = { userId: decoded.userId, role: decoded.role };
    req.token = token;
    req.tokenExpiresAt = decoded.exp;
    return next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return sendError(res, 401, 'Authentication token expired');
    }
    return sendError(res, 401, 'Authentication token invalid');
  }
}

module.exports = { authenticate };

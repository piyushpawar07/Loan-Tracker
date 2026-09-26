const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { blacklistToken } = require('../services/tokenBlacklist.service');
const { sendSuccess, sendError } = require('../utils/response');

const SALT_ROUNDS = 10;

const TOKEN_EXPIRY = '8h';

const DUMMY_HASH = bcrypt.hashSync('timing-equaliser-not-a-real-password', SALT_ROUNDS);

async function registerUser(req, res) {
  const { name, email, password, role } = req.body;

  if (await userModel.existsByEmail(email)) {
    return sendError(res, 409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await userModel.create({ name, email, passwordHash, role });
    return sendSuccess(res, 201, 'User registered successfully', { user });
  } catch (err) {
    if (err.code === 'P2002') {
      return sendError(res, 409, 'An account with this email already exists');
    }
    throw err;
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findByEmail(email);

  const passwordOk = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

  if (!user || !passwordOk) {
    return sendError(res, 401, 'Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: TOKEN_EXPIRY,
  });

  const { password_hash: _passwordHash, ...safeUser } = user;
  return sendSuccess(res, 200, 'Login successful', { token, user: safeUser });
}

async function getCurrentUser(req, res) {
  const user = await userModel.findPublicById(req.user.userId);
  if (!user) return sendError(res, 404, 'User not found');
  return sendSuccess(res, 200, 'Current user retrieved', { user });
}

async function logoutUser(req, res) {
  try {
    await blacklistToken(req.token, req.tokenExpiresAt);
  } catch (err) {
    console.error('Token blacklist write failed:', err.message);
    return sendError(res, 503, 'Logout could not be completed, please retry');
  }
  return sendSuccess(res, 200, 'Logged out successfully');
}

module.exports = { registerUser, loginUser, getCurrentUser, logoutUser };

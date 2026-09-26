const redis = require('../config/cache');

const BLACKLISTED = 'blacklisted';

async function blacklistToken(token, expiresAt) {
  const secondsLeft = expiresAt - Math.floor(Date.now() / 1000);
  if (secondsLeft <= 0) return;
  await redis.set(token, BLACKLISTED, 'EX', secondsLeft);
}

async function isTokenBlacklisted(token) {
  return (await redis.exists(token)) === 1;
}

module.exports = { blacklistToken, isTokenBlacklisted };

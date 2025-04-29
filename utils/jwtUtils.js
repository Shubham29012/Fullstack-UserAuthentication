const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate JWT token for a user
 * @param {Object} user - User object with id, username, email
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email
  };

  // Create token with 15 minutes expiration
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Get remaining time until token expiration
 * @param {string} token - JWT token
 * @returns {number} - Seconds until expiration, or 0 if expired/invalid
 */
const getTokenRemainingTime = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return 0;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    
    return Math.max(0, expirationTime - currentTime);
  } catch (error) {
    return 0;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenRemainingTime
};
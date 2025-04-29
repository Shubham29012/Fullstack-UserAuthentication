const fetch = require('node-fetch');

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - Whether password is valid (at least 8 characters)
 */
const isValidPassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} - Whether username is valid
 */
const isValidUsername = (username) => {
  // Alphanumeric with underscores, 3-50 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

/**
 * Verify Google reCAPTCHA token
 * @param {string} token - reCAPTCHA token from client
 * @returns {Promise<boolean>} - Whether reCAPTCHA is valid
 */
const verifyRecaptcha = async (token) => {
  if (!token) return false;
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  verifyRecaptcha
};
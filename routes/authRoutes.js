const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { createRateLimiter } = require('../middlewares/authMiddleware');

// 5 attempts per 15 minutes
const loginRateLimiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
);

// Registration routes
router.get('/register', AuthController.showRegisterPage);
router.post('/register', AuthController.register);

// Login routes
router.get('/login', AuthController.showLoginPage);
router.post('/login', loginRateLimiter, AuthController.login);

// Logout route
router.get('/logout', AuthController.logout);

module.exports = router;
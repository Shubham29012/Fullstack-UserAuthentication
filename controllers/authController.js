const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const { generateToken } = require('../utils/jwtUtils');
const { 
  isValidEmail, 
  isValidPassword, 
  isValidUsername,
  verifyRecaptcha 
} = require('../utils/validation');

const AuthController = {
  /**
   * Render registration page
   */
  showRegisterPage: (req, res) => {
    res.render('register', { error: req.query.error });
  },

  /**
   * Handle user registration
   */
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Validate input
      if (!username || !email || !password) {
        return res.render('register', { 
          error: 'All fields are required',
          username,
          email
        });
      }
      
      if (!isValidUsername(username)) {
        return res.render('register', {
          error: 'Username must be 3-50 characters and contain only letters, numbers, and underscores',
          username,
          email
        });
      }
      
      if (!isValidEmail(email)) {
        return res.render('register', {
          error: 'Please enter a valid email address',
          username,
          email
        });
      }
      
      if (!isValidPassword(password)) {
        return res.render('register', {
          error: 'Password must be at least 8 characters long',
          username,
          email
        });
      }
      
      // Check if username or email already exists
      const usernameExists = await UserModel.usernameExists(username);
      if (usernameExists) {
        return res.render('register', {
          error: 'Username already exists',
          email
        });
      }
      
      const emailExists = await UserModel.emailExists(email);
      if (emailExists) {
        return res.render('register', {
          error: 'Email already registered',
          username
        });
      }
      
      // Create user
      await UserModel.createUser({ username, email, password });
      
      // Redirect to login with success message
      res.redirect('/login?success=Registration successful! Please log in.');
    } catch (error) {
      console.error('Registration error:', error);
      res.render('register', {
        error: 'Registration failed. Please try again.',
        username: req.body.username,
        email: req.body.email
      });
    }
  },

  /**
   * Render login page
   */
  showLoginPage: (req, res) => {
    res.render('login', { 
      error: req.query.error,
      success: req.query.success,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
    });
  },

  /**
   * Handle user login
   */
  login: async (req, res) => {
    try {
      const { identifier, password, 'g-recaptcha-response': recaptchaToken } = req.body;
      
      // Validate input
      if (!identifier || !password) {
        return res.render('login', {
          error: 'Username/email and password are required',
          recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
      }
      
      // Verify reCAPTCHA
      const recaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        return res.render('login', {
          error: 'Invalid reCAPTCHA. Please try again.',
          recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
      }
      
      // Find user by username or email
      const user = await UserModel.findByUsernameOrEmail(identifier);
      if (!user) {
        return res.render('login', {
          error: 'Invalid credentials',
          recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.render('login', {
          error: 'Invalid credentials',
          recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Set token in cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: 'strict'
      });
      
      // Redirect to profile
      res.redirect('/profile');
    } catch (error) {
      console.error('Login error:', error);
      res.render('login', {
        error: 'Login failed. Please try again.',
        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
      });
    }
  },

  logout: (req, res) => {
    // Clear token cookie
    res.clearCookie('token');
    res.redirect('/login?success=You have been logged out');
  }
};

module.exports = AuthController;
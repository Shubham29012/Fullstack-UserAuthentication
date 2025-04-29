const { verifyToken, getTokenRemainingTime } = require('../utils/jwtUtils');
const UserModel = require('../models/userModel');


const authenticate = async (req, res, next) => {
  // Get token from cookies or authorization header
  const token = req.cookies.token || 
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
      ? req.headers.authorization.split(' ')[1] 
      : null);
  
  if (!token) {
    return res.redirect('/login?error=Please log in to access this page');
  }
  
  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    res.clearCookie('token');
    return res.redirect('/login?error=Session expired. Please log in again');
  }
  
  try {
    // Get user from database
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      res.clearCookie('token');
      return res.redirect('/login?error=User no longer exists');
    }
    
    // Check token expiration time for warning
    const remainingTime = getTokenRemainingTime(token);
    if (remainingTime < 120 && remainingTime > 0) {
      // Less than 2 minutes remaining - add warning flag
      res.locals.tokenExpiryWarning = true;
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.redirect('/login?error=Authentication failed');
  }
};

/**
 * Rate limiting middleware factory
 * Creates a simple in-memory rate limiter
 */
const createRateLimiter = (windowMs, maxRequests) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    // Clean old requests
    const userRequests = requests.get(ip).filter(time => now - time < windowMs);
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).render('login', { 
        error: 'Too many login attempts. Please try again later.',
        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY 
      });
    }
    
    // Add current request and update
    userRequests.push(now);
    requests.set(ip, userRequests);
    
    next();
  };
};

module.exports = {
  authenticate,
  createRateLimiter
};
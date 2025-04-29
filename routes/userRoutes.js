const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/profile', authenticate, UserController.showProfile);

module.exports = router;
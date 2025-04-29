const UserModel = require('../models/userModel');

const UserController = {
  
  showProfile: async (req, res) => {
    try {
      const user = req.user;
      const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Render the profile page with user data
      res.render('profile', {
        user: {
          ...user,
          formattedDate
        },
        tokenExpiryWarning: res.locals.tokenExpiryWarning
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.redirect('/login?error=Error loading profile');
    }
  }
};

module.exports = UserController;
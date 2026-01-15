const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { userQueries, hashPassword } = require('../models/database');

// View profile
router.get('/profile', requireAuth, (req, res) => {
  try {
    const user = req.session.user;
    const dbUser = userQueries.getUserWithRoles.get(user.id);

    res.render('users/profile', {
      title: 'My Profile',
      profile: dbUser
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load profile'
    });
  }
});

// Change password page
router.get('/change-password', requireAuth, (req, res) => {
  res.render('users/change-password', {
    title: 'Change Password',
    error: null,
    success: null
  });
});

// Change password POST
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    const user = req.session.user;

    // Validate passwords
    if (new_password !== confirm_password) {
      return res.render('users/change-password', {
        title: 'Change Password',
        error: 'New passwords do not match',
        success: null
      });
    }

    if (new_password.length < 6) {
      return res.render('users/change-password', {
        title: 'Change Password',
        error: 'Password must be at least 6 characters',
        success: null
      });
    }

    // Get user from database
    const dbUser = userQueries.findById.get(user.id);

    // Verify current password
    const { verifyPassword } = require('../models/database');
    const isValid = await verifyPassword(current_password, dbUser.password);

    if (!isValid) {
      return res.render('users/change-password', {
        title: 'Change Password',
        error: 'Current password is incorrect',
        success: null
      });
    }

    // Hash and update password
    const hashedPassword = await hashPassword(new_password);
    userQueries.updatePassword.run(hashedPassword, user.id);

    res.render('users/change-password', {
      title: 'Change Password',
      error: null,
      success: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.render('users/change-password', {
      title: 'Change Password',
      error: 'Failed to change password. Please try again.',
      success: null
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { userQueries, verifyPassword } = require('../models/database');
const { redirectIfAuth, getUserRoles } = require('../middleware/auth');

// Login page
router.get('/', redirectIfAuth, (req, res) => {
  res.redirect('/login');
});

router.get('/login', redirectIfAuth, (req, res) => {
  res.render('login', { 
    title: 'Login',
    error: req.query.error 
  });
});

// Login POST
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(`🔐 Login attempt for user: ${username}`);

  try {
    // Find user by username
    const user = userQueries.findByUsername.get(username);

    console.log(`🔐 User found: ${user ? 'yes' : 'no'}`);

    if (!user) {
      console.log(`🔐 No user found with username: ${username}`);
      return res.render('login', {
        title: 'Login',
        error: 'Invalid username or password'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      console.log(`🔐 User ${username} is not active: ${user.status}`);
      return res.render('login', {
        title: 'Login',
        error: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    // Verify password
    console.log(`🔐 Verifying password for user: ${username}`);
    const isValid = await verifyPassword(password, user.password);
    console.log(`🔐 Password valid: ${isValid}`);

    if (!isValid) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid username or password'
      });
    }

    // Get user roles
    const roles = getUserRoles(user.id);
    console.log(`🔐 User ${username} roles: ${roles.join(', ')}`);

    // Store user in session (without password)
    req.session.user = {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      department: user.department,
      location: user.location,
      roles: roles
    };

    console.log(`🔐 Login successful for user: ${username}`);
    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      title: 'Login',
      error: 'An error occurred. Please try again.'
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
});

module.exports = router;

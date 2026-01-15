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

  try {
    // Find user by username
    const user = userQueries.findByUsername.get(username);

    if (!user) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid username or password'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.render('login', {
        title: 'Login',
        error: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid username or password'
      });
    }

    // Get user roles
    const roles = getUserRoles(user.id);

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

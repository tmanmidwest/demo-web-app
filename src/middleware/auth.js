const { userRoleQueries } = require('../models/database');

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Middleware to check if user has specific role
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const userId = req.session.user.id;
    const userRoles = req.session.user.roles || [];

    // Check if user has any of the allowed roles
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to access this page.'
      });
    }

    next();
  };
}

// Middleware to redirect to dashboard if already logged in
function redirectIfAuth(req, res, next) {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
}

// Helper function to check if user has a specific role
function hasRole(user, roleName) {
  const roles = user.roles || [];
  return roles.includes(roleName);
}

// Helper function to get user roles from database
function getUserRoles(userId) {
  try {
    const roles = userRoleQueries.getUserRoles.all(userId);
    return roles.map(r => r.name);
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
}

module.exports = {
  requireAuth,
  requireRole,
  redirectIfAuth,
  hasRole,
  getUserRoles
};

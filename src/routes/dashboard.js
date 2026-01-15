const express = require('express');
const router = express.Router();
const { requireAuth, hasRole } = require('../middleware/auth');
const { taskQueries, userQueries } = require('../models/database');

// Dashboard home
router.get('/', requireAuth, (req, res) => {
  try {
    const user = req.session.user;
    const roles = user.roles || [];

    let tasks = [];
    let stats = { total: 0, open: 0, in_progress: 0, completed: 0 };

    // Get tasks based on role
    if (roles.includes('Administrator')) {
      // Admins see all tasks
      tasks = taskQueries.getAll.all();
    } else if (roles.includes('Sales Manager')) {
      // Managers see their team's tasks
      tasks = taskQueries.getByTeam.all(user.id, user.id);
    } else {
      // Regular users see only their tasks
      tasks = taskQueries.getByUser.all(user.id);
    }

    // Calculate stats from the tasks
    stats.total = tasks.length;
    stats.open = tasks.filter(t => t.status === 'open').length;
    stats.in_progress = tasks.filter(t => t.status === 'in_progress').length;
    stats.completed = tasks.filter(t => t.status === 'completed').length;

    res.render('dashboard', {
      title: 'Dashboard',
      tasks: tasks,
      stats: stats,
      userRoles: roles
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load dashboard'
    });
  }
});

module.exports = router;

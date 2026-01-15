const express = require('express');
const router = express.Router();
const { requireAuth, requireRole, hasRole } = require('../middleware/auth');
const { taskQueries, userQueries } = require('../models/database');

// Create task page
router.get('/create', requireAuth, (req, res) => {
  try {
    const user = req.session.user;
    const roles = user.roles || [];

    // Get users for assignment dropdown
    let users = [];
    if (roles.includes('Administrator') || roles.includes('Sales Manager')) {
      users = userQueries.getAll.all().filter(u => u.status === 'active');
    }

    res.render('tasks/create', {
      title: 'Create Task',
      users: users,
      userRoles: roles
    });
  } catch (error) {
    console.error('Create task page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load create task page'
    });
  }
});

// Create task POST
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { title, description, type, priority, assigned_to, due_date } = req.body;
    const user = req.session.user;
    const roles = user.roles || [];

    // Validate assigned_to
    let assignedUserId;
    if (roles.includes('Administrator') || roles.includes('Sales Manager')) {
      assignedUserId = parseInt(assigned_to) || user.id;
    } else {
      // Regular users can only assign to themselves
      assignedUserId = user.id;
    }

    // Create task
    const result = taskQueries.create.run(
      title,
      description,
      type,
      'open',
      priority || 'medium',
      assignedUserId,
      user.id,
      due_date || null
    );

    res.redirect('/dashboard?success=Task created successfully');
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to create task'
    });
  }
});

// View task
router.get('/:id', requireAuth, (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const user = req.session.user;
    const roles = user.roles || [];

    const task = taskQueries.findById.get(taskId);

    if (!task) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Task not found'
      });
    }

    // Check permissions
    const isAdmin = roles.includes('Administrator');
    const isManager = roles.includes('Sales Manager');
    const isOwner = task.assigned_to === user.id;

    if (!isAdmin && !isManager && !isOwner) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to view this task'
      });
    }

    res.render('tasks/view', {
      title: 'Task Details',
      task: task,
      userRoles: roles
    });
  } catch (error) {
    console.error('View task error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load task'
    });
  }
});

// Edit task page
router.get('/:id/edit', requireAuth, (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const user = req.session.user;
    const roles = user.roles || [];

    const task = taskQueries.findById.get(taskId);

    if (!task) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Task not found'
      });
    }

    // Check permissions
    const isAdmin = roles.includes('Administrator');
    const isManager = roles.includes('Sales Manager');
    const isOwner = task.assigned_to === user.id;

    if (!isAdmin && !isManager && !isOwner) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to edit this task'
      });
    }

    // Get users for assignment dropdown
    let users = [];
    if (isAdmin || isManager) {
      users = userQueries.getAll.all().filter(u => u.status === 'active');
    }

    res.render('tasks/edit', {
      title: 'Edit Task',
      task: task,
      users: users,
      userRoles: roles
    });
  } catch (error) {
    console.error('Edit task page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load edit page'
    });
  }
});

// Update task POST
router.post('/:id/edit', requireAuth, async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, description, type, status, priority, assigned_to, due_date } = req.body;
    const user = req.session.user;
    const roles = user.roles || [];

    const task = taskQueries.findById.get(taskId);

    if (!task) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Task not found'
      });
    }

    // Check permissions
    const isAdmin = roles.includes('Administrator');
    const isManager = roles.includes('Sales Manager');
    const isOwner = task.assigned_to === user.id;

    if (!isAdmin && !isManager && !isOwner) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to edit this task'
      });
    }

    // Update task
    taskQueries.update.run(
      title,
      description,
      type,
      status,
      priority,
      assigned_to || task.assigned_to,
      due_date || null,
      taskId
    );

    res.redirect('/dashboard?success=Task updated successfully');
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to update task'
    });
  }
});

// Delete task
router.post('/:id/delete', requireAuth, (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const user = req.session.user;
    const roles = user.roles || [];

    const task = taskQueries.findById.get(taskId);

    if (!task) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Task not found'
      });
    }

    // Only admins and managers can delete tasks
    const isAdmin = roles.includes('Administrator');
    const isManager = roles.includes('Sales Manager');

    if (!isAdmin && !isManager) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to delete tasks'
      });
    }

    taskQueries.delete.run(taskId);
    res.redirect('/dashboard?success=Task deleted successfully');
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to delete task'
    });
  }
});

module.exports = router;

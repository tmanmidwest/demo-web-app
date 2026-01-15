const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/auth');
const { userQueries, roleQueries, userRoleQueries, hashPassword } = require('../models/database');

// Admin dashboard
router.get('/', requireRole('Administrator'), (req, res) => {
  try {
    const users = userQueries.getAll.all();
    const roles = roleQueries.getAll.all();

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      totalRoles: roles.length
    };

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: stats
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load admin dashboard'
    });
  }
});

// User management
router.get('/users', requireRole('Administrator'), (req, res) => {
  try {
    const users = userQueries.getAll.all();
    
    res.render('admin/users', {
      title: 'User Management',
      users: users,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    console.error('User list error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load users'
    });
  }
});

// Create user page
router.get('/users/create', requireRole('Administrator'), (req, res) => {
  try {
    const roles = roleQueries.getAll.all();
    const managers = userQueries.getAll.all().filter(u => u.status === 'active');

    res.render('admin/user-create', {
      title: 'Create User',
      roles: roles,
      managers: managers,
      error: null
    });
  } catch (error) {
    console.error('Create user page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load create user page'
    });
  }
});

// Create user POST
router.post('/users/create', requireRole('Administrator'), async (req, res) => {
  try {
    const { username, password, first_name, last_name, email, manager_id, department, location, roles } = req.body;

    // Validate required fields
    if (!username || !password || !first_name || !last_name || !email) {
      const allRoles = roleQueries.getAll.all();
      const managers = userQueries.getAll.all().filter(u => u.status === 'active');
      
      return res.render('admin/user-create', {
        title: 'Create User',
        roles: allRoles,
        managers: managers,
        error: 'All required fields must be filled'
      });
    }

    // Check if username or email already exists
    const existingUser = userQueries.findByUsername.get(username);
    const existingEmail = userQueries.findByEmail.get(email);

    if (existingUser || existingEmail) {
      const allRoles = roleQueries.getAll.all();
      const managers = userQueries.getAll.all().filter(u => u.status === 'active');
      
      return res.render('admin/user-create', {
        title: 'Create User',
        roles: allRoles,
        managers: managers,
        error: 'Username or email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = userQueries.create.run(
      username,
      hashedPassword,
      first_name,
      last_name,
      email,
      manager_id || null,
      department || null,
      location || null,
      'active'
    );

    const userId = result.lastInsertRowid;

    // Assign roles
    if (roles) {
      const roleArray = Array.isArray(roles) ? roles : [roles];
      roleArray.forEach(roleId => {
        userRoleQueries.assign.run(userId, parseInt(roleId));
      });
    }

    res.redirect('/admin/users?success=User created successfully');
  } catch (error) {
    console.error('Create user error:', error);
    const allRoles = roleQueries.getAll.all();
    const managers = userQueries.getAll.all().filter(u => u.status === 'active');
    
    res.render('admin/user-create', {
      title: 'Create User',
      roles: allRoles,
      managers: managers,
      error: 'Failed to create user. Please try again.'
    });
  }
});

// Edit user page
router.get('/users/:id/edit', requireRole('Administrator'), (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = userQueries.getUserWithRoles.get(userId);

    if (!user) {
      return res.redirect('/admin/users?error=User not found');
    }

    const allRoles = roleQueries.getAll.all();
    const managers = userQueries.getAll.all().filter(u => u.status === 'active' && u.id !== userId);
    
    // Parse user role IDs
    const userRoleIds = user.role_ids ? user.role_ids.split(',').map(id => parseInt(id)) : [];

    res.render('admin/user-edit', {
      title: 'Edit User',
      user: user,
      userRoleIds: userRoleIds,
      roles: allRoles,
      managers: managers,
      error: null
    });
  } catch (error) {
    console.error('Edit user page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load edit user page'
    });
  }
});

// Update user POST
router.post('/users/:id/edit', requireRole('Administrator'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { first_name, last_name, email, manager_id, department, location, status, roles } = req.body;

    const user = userQueries.findById.get(userId);
    if (!user) {
      return res.redirect('/admin/users?error=User not found');
    }

    // Update user basic info
    userQueries.update.run(
      first_name,
      last_name,
      email,
      manager_id || null,
      department || null,
      location || null,
      status,
      userId
    );

    // Update roles
    userRoleQueries.revokeAll.run(userId);
    if (roles) {
      const roleArray = Array.isArray(roles) ? roles : [roles];
      roleArray.forEach(roleId => {
        userRoleQueries.assign.run(userId, parseInt(roleId));
      });
    }

    res.redirect('/admin/users?success=User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    res.redirect(`/admin/users/${req.params.id}/edit?error=Failed to update user`);
  }
});

// Reset password page
router.get('/users/:id/reset-password', requireRole('Administrator'), (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = userQueries.findById.get(userId);

    if (!user) {
      return res.redirect('/admin/users?error=User not found');
    }

    res.render('admin/user-reset-password', {
      title: 'Reset Password',
      user: user,
      error: null,
      success: null
    });
  } catch (error) {
    console.error('Reset password page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load reset password page'
    });
  }
});

// Reset password POST
router.post('/users/:id/reset-password', requireRole('Administrator'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { new_password, confirm_password } = req.body;

    const user = userQueries.findById.get(userId);
    if (!user) {
      return res.redirect('/admin/users?error=User not found');
    }

    if (new_password !== confirm_password) {
      return res.render('admin/user-reset-password', {
        title: 'Reset Password',
        user: user,
        error: 'Passwords do not match',
        success: null
      });
    }

    if (new_password.length < 6) {
      return res.render('admin/user-reset-password', {
        title: 'Reset Password',
        user: user,
        error: 'Password must be at least 6 characters',
        success: null
      });
    }

    const hashedPassword = await hashPassword(new_password);
    userQueries.updatePassword.run(hashedPassword, userId);

    res.render('admin/user-reset-password', {
      title: 'Reset Password',
      user: user,
      error: null,
      success: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    const user = userQueries.findById.get(parseInt(req.params.id));
    res.render('admin/user-reset-password', {
      title: 'Reset Password',
      user: user,
      error: 'Failed to reset password',
      success: null
    });
  }
});

// Delete user
router.post('/users/:id/delete', requireRole('Administrator'), (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return res.redirect('/admin/users?error=Cannot delete your own account');
    }

    userQueries.delete.run(userId);
    res.redirect('/admin/users?success=User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    res.redirect('/admin/users?error=Failed to delete user');
  }
});

// Role management
router.get('/roles', requireRole('Administrator'), (req, res) => {
  try {
    const roles = roleQueries.getAll.all();

    res.render('admin/roles', {
      title: 'Role Management',
      roles: roles,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    console.error('Role list error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load roles'
    });
  }
});

module.exports = router;

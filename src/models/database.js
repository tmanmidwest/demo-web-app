const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/database.sqlite');
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  const schema = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      manager_id INTEGER,
      department TEXT,
      location TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (manager_id) REFERENCES users(id)
    );

    -- Roles table
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- User_Roles junction table
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id INTEGER NOT NULL,
      role_id INTEGER NOT NULL,
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, role_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    );

    -- Tasks table
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
      priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
      assigned_to INTEGER NOT NULL,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      due_date DATETIME,
      FOREIGN KEY (assigned_to) REFERENCES users(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);
  `;

  db.exec(schema);
  console.log('✅ Database schema initialized');
}

// User queries
const userQueries = {
  create: db.prepare(`
    INSERT INTO users (username, password, first_name, last_name, email, manager_id, department, location, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  findByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
  findById: db.prepare('SELECT * FROM users WHERE id = ?'),
  findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  
  getAll: db.prepare(`
    SELECT u.*, 
           m.first_name || ' ' || m.last_name as manager_name,
           GROUP_CONCAT(r.name) as roles
    FROM users u
    LEFT JOIN users m ON u.manager_id = m.id
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `),
  
  update: db.prepare(`
    UPDATE users 
    SET first_name = ?, last_name = ?, email = ?, manager_id = ?, 
        department = ?, location = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  updatePassword: db.prepare(`
    UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  delete: db.prepare('DELETE FROM users WHERE id = ?'),
  
  getUserWithRoles: db.prepare(`
    SELECT u.*, GROUP_CONCAT(r.name) as roles, GROUP_CONCAT(r.id) as role_ids
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.id = ?
    GROUP BY u.id
  `)
};

// Role queries
const roleQueries = {
  create: db.prepare('INSERT INTO roles (name, description) VALUES (?, ?)'),
  findByName: db.prepare('SELECT * FROM roles WHERE name = ?'),
  findById: db.prepare('SELECT * FROM roles WHERE id = ?'),
  getAll: db.prepare('SELECT * FROM roles ORDER BY name'),
  delete: db.prepare('DELETE FROM roles WHERE id = ?')
};

// User-Role queries
const userRoleQueries = {
  assign: db.prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)'),
  revoke: db.prepare('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?'),
  revokeAll: db.prepare('DELETE FROM user_roles WHERE user_id = ?'),
  getUserRoles: db.prepare(`
    SELECT r.* FROM roles r
    INNER JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = ?
  `),
  hasRole: db.prepare(`
    SELECT COUNT(*) as count FROM user_roles ur
    INNER JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = ? AND r.name = ?
  `)
};

// Task queries
const taskQueries = {
  create: db.prepare(`
    INSERT INTO tasks (title, description, type, status, priority, assigned_to, created_by, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  findById: db.prepare(`
    SELECT t.*, 
           u1.first_name || ' ' || u1.last_name as assigned_to_name,
           u1.username as assigned_to_username,
           u2.first_name || ' ' || u2.last_name as created_by_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_to = u1.id
    LEFT JOIN users u2 ON t.created_by = u2.id
    WHERE t.id = ?
  `),
  
  getAll: db.prepare(`
    SELECT t.*, 
           u1.first_name || ' ' || u1.last_name as assigned_to_name,
           u1.username as assigned_to_username,
           u2.first_name || ' ' || u2.last_name as created_by_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_to = u1.id
    LEFT JOIN users u2 ON t.created_by = u2.id
    ORDER BY t.created_at DESC
  `),
  
  getByUser: db.prepare(`
    SELECT t.*, 
           u1.first_name || ' ' || u1.last_name as assigned_to_name,
           u2.first_name || ' ' || u2.last_name as created_by_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_to = u1.id
    LEFT JOIN users u2 ON t.created_by = u2.id
    WHERE t.assigned_to = ?
    ORDER BY t.created_at DESC
  `),
  
  getByTeam: db.prepare(`
    SELECT t.*, 
           u1.first_name || ' ' || u1.last_name as assigned_to_name,
           u1.username as assigned_to_username,
           u2.first_name || ' ' || u2.last_name as created_by_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_to = u1.id
    LEFT JOIN users u2 ON t.created_by = u2.id
    WHERE u1.manager_id = ? OR t.assigned_to = ?
    ORDER BY t.created_at DESC
  `),
  
  update: db.prepare(`
    UPDATE tasks 
    SET title = ?, description = ?, type = ?, status = ?, priority = ?, 
        assigned_to = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  delete: db.prepare('DELETE FROM tasks WHERE id = ?'),
  
  getStats: db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM tasks
  `)
};

// Helper functions
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  db,
  initializeDatabase,
  userQueries,
  roleQueries,
  userRoleQueries,
  taskQueries,
  hashPassword,
  verifyPassword
};

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');
const adminRoutes = require('./src/routes/admin');
const taskRoutes = require('./src/routes/tasks');
const userRoutes = require('./src/routes/users');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src/public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'saviynt-demo-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false  // Set to true only if using HTTPS
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Task Demo Web App running on http://localhost:${PORT}`);
  console.log(`📚 Default login: admin / admin123`);
});

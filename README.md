# Saviynt Demo App - Task Management System

A modern, feature-rich task management application designed to demonstrate Saviynt's Agentic Web App Onboarding capability. This application provides a complete web interface with user management, role-based access control, and task tracking functionality.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## 🎯 Purpose

This demo application showcases how Saviynt's agentic onboarding can:
- Navigate and interact with web applications without APIs
- Read page structures and extract user information
- Create, modify, and manage users through web interfaces
- Assign roles and manage permissions
- Demonstrate browser-based automation for IGA workflows

## ✨ Features

### User Management
- Create, read, update, and delete users
- User profiles with personal information
- Manager assignment and organizational hierarchy
- User status management (active/inactive)
- Password reset functionality

### Role-Based Access Control
- **Administrator**: Full system access, user and role management
- **Sales Manager**: View team tasks, manage tasks, limited admin access
- **Sales User**: Create and manage own tasks
- **Reporting User**: Read-only dashboard access

### Task Management
- Create and assign tasks
- Task types, priorities, and statuses
- Due date tracking
- Filtered task views based on user role
- Task lifecycle management

### Modern UI
- Clean, professional interface
- Responsive design for all devices
- Color-coded status indicators
- Intuitive navigation
- Real-time statistics dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git (for cloning)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-repo/saviynt-demo-app.git
cd saviynt-demo-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Initialize the database**
```bash
npm run init
```

4. **Seed demo data**
```bash
npm run seed
```

5. **Start the application**
```bash
npm start
```

6. **Access the application**
Open your browser to: `http://localhost:3000`

## 🔐 Demo Credentials

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Administrator | `admin` | `admin123` | Full system access |
| Sales Manager | `jsmith` | `admin123` | Team management |
| Sales User | `mwilliams` | `admin123` | Basic user |
| Reporting User | `rmartinez` | `admin123` | Read-only access |

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Using Docker
```bash
docker build -t saviynt-demo-app .
docker run -p 3000:3000 saviynt-demo-app
```

### Portainer Deployment
1. Navigate to **Stacks** in Portainer
2. Click **Add Stack**
3. Paste the contents of `docker-compose.yml`
4. Click **Deploy the stack**

## 📁 Project Structure

```
saviynt-demo-app/
├── src/
│   ├── models/           # Database models and queries
│   │   └── database.js   # SQLite setup and queries
│   ├── routes/           # Express route handlers
│   │   ├── auth.js       # Authentication routes
│   │   ├── dashboard.js  # Dashboard routes
│   │   ├── admin.js      # Admin panel routes
│   │   ├── tasks.js      # Task management routes
│   │   └── users.js      # User profile routes
│   ├── middleware/       # Express middleware
│   │   └── auth.js       # Auth & role checking
│   ├── views/            # EJS templates
│   │   ├── admin/        # Admin panel views
│   │   ├── tasks/        # Task views
│   │   ├── users/        # User profile views
│   │   └── partials/     # Reusable components
│   └── public/           # Static assets
│       └── css/          # Stylesheets
├── scripts/              # Utility scripts
│   ├── init-db.js        # Database initialization
│   ├── seed-data.js      # Demo data seeding
│   └── reset-demo.js     # Reset to demo state
├── data/                 # Database storage
│   └── database.sqlite   # SQLite database file
├── server.js             # Application entry point
├── package.json          # Dependencies and scripts
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose config
└── README.md             # This file
```

## 🔧 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the application |
| `npm run dev` | Start with auto-reload (requires nodemon) |
| `npm run init` | Initialize database schema |
| `npm run seed` | Populate with demo data |
| `npm run reset` | Reset database to demo state |

## 🌐 Deployment Options

### Local Development
```bash
npm install
npm run init
npm run seed
npm start
```

### DigitalOcean App Platform
1. Create new app from GitHub repository
2. Set build command: `npm install && npm run init && npm run seed`
3. Set run command: `npm start`
4. Configure environment variables

### AWS Elastic Beanstalk
1. Install EB CLI
2. Initialize: `eb init`
3. Create environment: `eb create`
4. Deploy: `eb deploy`

### Heroku
```bash
heroku create saviynt-demo-app
git push heroku main
```

## 🔄 Resetting Demo Data

To reset the application to its initial demo state:

```bash
npm run reset
```

This will:
- Delete the existing database
- Recreate the schema
- Repopulate with fresh demo data
- Reset all passwords to `admin123`

## 🛡️ Security Notes

⚠️ **Important**: This is a demo application. For production use:

1. Change the default `SESSION_SECRET` in `.env`
2. Update all default passwords
3. Enable HTTPS/TLS
4. Implement rate limiting
5. Add CSRF protection
6. Configure proper database backups
7. Review and harden security settings

## 📊 Database Schema

### Users Table
- User credentials and profile information
- Manager relationships
- Status tracking

### Roles Table
- Predefined system roles
- Role descriptions

### User_Roles Junction Table
- Many-to-many user-role assignments

### Tasks Table
- Task details and assignments
- Status and priority tracking
- Due date management

## 🤝 Contributing

This is a demo application, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review Saviynt's official documentation

## 🔗 Related Resources

- [Saviynt Documentation](https://docs.saviynt.com)
- [Agentic Onboarding Guide](https://docs.saviynt.com/agentic-onboarding)
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Documentation](https://expressjs.com)

## 📋 Changelog

### Version 1.0.0 (Initial Release)
- Complete user management system
- Role-based access control
- Task management functionality
- Modern responsive UI
- Docker support
- Demo data seeding
- Comprehensive documentation

---

**Built for Saviynt** | Demonstrating Agentic Web App Onboarding

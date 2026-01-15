# 📋 Saviynt Demo App - Project Overview

## What Is This?

The Saviynt Demo App is a fully functional task management web application specifically designed to demonstrate **Saviynt's Agentic Web App Onboarding** capability. It showcases how Saviynt can automatically discover, understand, and manage web applications that don't have traditional REST APIs.

## Purpose

This application serves as a **test target** for Saviynt's agentic capabilities by providing:
- A realistic web application with user management
- Role-based access control (RBAC)
- Standard web forms for user CRUD operations
- Multiple user roles with different permissions
- A modern, professional UI that's easy to navigate

## Key Features

### 👥 User Management
- **Create Users**: Add new users with profile information
- **Update Users**: Modify user details, status, and roles
- **Delete Users**: Remove users from the system
- **Activate/Deactivate**: Enable or disable user access
- **Password Management**: Reset user passwords
- **Organizational Hierarchy**: Assign managers to users

### 🔐 Role-Based Access Control
Four predefined roles demonstrating different access levels:

1. **Administrator**
   - Full system access
   - User and role management
   - View all tasks
   - System configuration

2. **Sales Manager**
   - View and manage team tasks
   - Create tasks for team members
   - Limited administrative access
   - Team performance dashboard

3. **Sales User**
   - Create and manage own tasks
   - View assigned tasks
   - Update task status
   - Basic dashboard access

4. **Reporting User**
   - Read-only access to dashboards
   - View reports and analytics
   - No modification permissions

### 📊 Task Management
- Create tasks with descriptions and metadata
- Assign tasks to users
- Set priorities (Low, Medium, High)
- Track status (Open, In Progress, Completed, Cancelled)
- Set due dates
- Filter and sort tasks
- Role-based task visibility

### 🎨 Modern User Interface
- Clean, professional design
- Responsive layout (mobile-friendly)
- Intuitive navigation
- Color-coded status indicators
- Real-time dashboard statistics
- Easy-to-read tables and forms

## Technical Architecture

### Technology Stack
- **Backend**: Node.js with Express
- **Database**: SQLite (file-based, portable)
- **Templates**: EJS (server-side rendering)
- **Authentication**: Session-based with bcrypt
- **Styling**: Custom CSS (Tailwind-inspired)

### Why These Technologies?

1. **SQLite**: 
   - No separate database server required
   - Perfect for demos and portability
   - Easy to backup and reset

2. **Server-Side Rendering**:
   - Pages are easily scrapeable by Saviynt's agent
   - No complex JavaScript frameworks
   - Standard HTML forms

3. **Express**:
   - Lightweight and fast
   - Well-documented
   - Large ecosystem

4. **Session-Based Auth**:
   - Traditional login flow
   - Cookie-based sessions
   - Demonstrates standard auth patterns

## File Structure

```
saviynt-demo-app/
├── src/
│   ├── models/
│   │   └── database.js          # SQLite setup, queries
│   ├── routes/
│   │   ├── auth.js              # Login/logout
│   │   ├── dashboard.js         # Main dashboard
│   │   ├── admin.js             # Admin panel
│   │   ├── tasks.js             # Task management
│   │   └── users.js             # User profiles
│   ├── middleware/
│   │   └── auth.js              # Authentication checks
│   ├── views/
│   │   ├── admin/               # Admin templates
│   │   ├── tasks/               # Task templates
│   │   ├── users/               # User templates
│   │   └── partials/            # Reusable components
│   └── public/
│       └── css/                 # Stylesheets
├── scripts/
│   ├── init-db.js               # Database initialization
│   ├── seed-data.js             # Demo data
│   └── reset-demo.js            # Reset to demo state
├── data/
│   └── database.sqlite          # Database file
├── server.js                    # Application entry
├── package.json                 # Dependencies
├── Dockerfile                   # Docker build
├── docker-compose.yml           # Docker orchestration
└── Documentation files
```

## How Saviynt Can Use This App

### Discovery Phase
1. Saviynt's agent navigates to the login page
2. Identifies form fields (username, password)
3. Detects authentication mechanism
4. Maps application structure

### User Management Phase
1. Logs in as administrator
2. Navigates to user management section
3. Identifies user list table
4. Maps create/edit/delete actions
5. Detects form fields and validation

### Role Assignment Phase
1. Discovers available roles
2. Maps role assignment interface
3. Tests role modification
4. Validates permission changes

### Integration Phase
1. Automates user provisioning
2. Manages role assignments
3. Monitors user status
4. Handles deprovisioning

## Demo Scenarios

### Scenario 1: New User Onboarding
1. Saviynt receives onboarding request
2. Logs into demo app as admin
3. Navigates to "Create User"
4. Fills in user details
5. Assigns appropriate role
6. Confirms user creation

### Scenario 2: Role Change
1. Access certification review triggers role change
2. Saviynt logs in
3. Finds user in user management
4. Updates role assignment
5. Verifies change applied

### Scenario 3: User Deactivation
1. Termination workflow initiated
2. Saviynt accesses app
3. Locates user account
4. Changes status to "Inactive"
5. Confirms deactivation

### Scenario 4: Access Review
1. Review campaign started
2. Saviynt logs in as reviewer
3. Navigates through user list
4. Extracts current roles
5. Provides review data

## Database Schema

### Users Table
```sql
- id (Primary Key)
- username (Unique)
- password (Hashed)
- first_name
- last_name
- email (Unique)
- manager_id (Foreign Key → Users)
- department
- location
- status (active/inactive)
- created_at
- updated_at
```

### Roles Table
```sql
- id (Primary Key)
- name (Unique)
- description
- created_at
```

### User_Roles Table
```sql
- user_id (Foreign Key → Users)
- role_id (Foreign Key → Roles)
- assigned_at
```

### Tasks Table
```sql
- id (Primary Key)
- title
- description
- type
- status
- priority
- assigned_to (Foreign Key → Users)
- created_by (Foreign Key → Users)
- due_date
- created_at
- updated_at
```

## Pre-loaded Demo Data

### Users (8 total)
- 1 Administrator
- 2 Sales Managers
- 4 Sales Users
- 1 Reporting User

### Tasks (15 total)
- Various types and statuses
- Distributed across users
- Realistic due dates

### Roles (4 total)
- Pre-configured with descriptions
- Ready for testing

## Getting Started

1. **Quick Test** (5 minutes):
   - See [QUICKSTART.md](QUICKSTART.md)
   - Run locally with npm

2. **Docker Deployment** (10 minutes):
   - See [DEPLOYMENT.md](DEPLOYMENT.md)
   - Deploy with Docker Compose

3. **Production Hosting** (30 minutes):
   - See [DEPLOYMENT.md](DEPLOYMENT.md)
   - Deploy to cloud provider

4. **Portainer Setup** (15 minutes):
   - See [PORTAINER.md](PORTAINER.md)
   - Deploy via Portainer stacks

## Use Cases

### For Saviynt Sales Engineers
- Live product demonstrations
- Customer proof-of-concepts
- Training sessions
- Internal testing

### For Saviynt Developers
- Testing agentic capabilities
- Developing new features
- Integration testing
- Regression testing

### For Customers
- Evaluating Saviynt capabilities
- Understanding agentic onboarding
- Planning implementations
- Training teams

## Customization Options

### Easy Customizations
- Change company name/logo
- Modify color scheme
- Add/remove fields
- Adjust task types
- Change role names

### Advanced Customizations
- Add new entities (projects, clients)
- Integrate with real systems
- Add API endpoints
- Implement SSO
- Multi-tenancy

## Limitations

This is a **demo application**. Not recommended for:
- Production use without hardening
- Storing sensitive real data
- High-traffic scenarios
- Mission-critical operations
- Compliance-sensitive environments

For production:
- Implement proper security measures
- Use PostgreSQL/MySQL instead of SQLite
- Add rate limiting
- Enable HTTPS
- Implement audit logging
- Add monitoring
- Set up backups

## Success Metrics

How to know it's working:

✅ Application starts without errors  
✅ Login page loads  
✅ Can log in with demo credentials  
✅ Dashboard displays data  
✅ Can create/edit users (as admin)  
✅ Can create/edit tasks  
✅ Role permissions work correctly  
✅ Data persists after restart  

## Troubleshooting

Common issues and solutions:

1. **Can't install dependencies**
   - Check Node.js version (18+)
   - Clear npm cache
   - Check internet connection

2. **Port 3000 already in use**
   - Use different port: `PORT=3001 npm start`
   - Kill process using port 3000

3. **Database errors**
   - Delete data/database.sqlite
   - Run npm run reset

4. **Permission denied**
   - Check file permissions
   - Run with appropriate user

## Documentation Index

- **[README.md](README.md)**: Main documentation
- **[QUICKSTART.md](QUICKSTART.md)**: 5-minute setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Comprehensive deployment
- **[PORTAINER.md](PORTAINER.md)**: Portainer-specific guide
- **[PROJECT-OVERVIEW.md](PROJECT-OVERVIEW.md)**: This file

## Contributing

This is a demo application, but improvements welcome:
- Bug fixes
- Documentation improvements
- New features
- UI enhancements
- Additional demo scenarios

## Support

For questions or issues:
1. Check documentation files
2. Review code comments
3. Check GitHub issues
4. Contact Saviynt support

## License

MIT License - Free to use, modify, and distribute

## Acknowledgments

Built to demonstrate Saviynt's innovative agentic web app onboarding technology.

---

**Ready to start?** See [QUICKSTART.md](QUICKSTART.md) for immediate setup!

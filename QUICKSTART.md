# 🚀 Saviynt Demo App - Quick Start Guide

Get the app running in under 5 minutes!

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

Check your versions:
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

## Installation Steps

### 1. Download or Clone the Project

**Option A: Download ZIP**
- Extract the ZIP file to your desired location
- Open terminal/command prompt in the extracted folder

**Option B: Clone from Git**
```bash
git clone <repository-url>
cd saviynt-demo-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages. It may take 1-2 minutes.

### 3. Initialize the Database

```bash
npm run init
```

This creates the SQLite database with the proper schema.

### 4. Load Demo Data

```bash
npm run seed
```

This populates the database with demo users and tasks.

### 5. Start the Application

```bash
npm start
```

You should see:
```
✅ Saviynt Demo App running on http://localhost:3000
📚 Default login: admin / admin123
```

### 6. Open Your Browser

Navigate to: **http://localhost:3000**

## 🔐 Login Credentials

Use any of these accounts to explore different roles:

| Role | Username | Password |
|------|----------|----------|
| **Administrator** | `admin` | `admin123` |
| **Sales Manager** | `jsmith` | `admin123` |
| **Sales User** | `mwilliams` | `admin123` |
| **Reporting User** | `rmartinez` | `admin123` |

## 🎯 What to Try

### As Administrator (`admin`)
1. Go to **Admin** → **User Management**
2. Create a new user
3. Assign roles to users
4. Reset user passwords
5. View all tasks across the organization

### As Sales Manager (`jsmith`)
1. View your team's tasks on the dashboard
2. Create tasks and assign to team members
3. Edit and update task statuses
4. Filter tasks by status, priority

### As Sales User (`mwilliams`)
1. Create your own tasks
2. Update task statuses
3. View your assigned tasks
4. Change your password

## 🐳 Docker Quick Start (Alternative)

If you prefer Docker:

```bash
# Using Docker Compose
docker-compose up -d

# Or using Docker directly
docker build -t saviynt-demo-app .
docker run -p 3000:3000 saviynt-demo-app
```

Then open: **http://localhost:3000**

## 🔄 Reset Demo Data

To reset everything back to the initial state:

```bash
npm run reset
```

This will:
- Delete all current data
- Recreate the database
- Reload demo users and tasks

## ❓ Troubleshooting

### Port 3000 Already in Use
```bash
# Use a different port
PORT=3001 npm start
```

### Database Locked Error
- Close the application completely
- Delete `data/database.sqlite`
- Run `npm run init` and `npm run seed` again

### Dependencies Won't Install
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
rm -rf node_modules package-lock.json
npm install
```

### Can't Access the App
- Check that the app is running (look for the success message)
- Try http://127.0.0.1:3000 instead of localhost
- Check your firewall settings

## 📝 Next Steps

1. **Explore the UI** - Click around and familiarize yourself with the interface
2. **Test User Management** - Create and modify users as administrator
3. **Try Task Workflows** - Create tasks and move them through statuses
4. **Check Role Permissions** - Login as different roles to see access differences
5. **Integrate with Saviynt** - Use this app to test Saviynt's agentic onboarding

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the [DEPLOYMENT.md](DEPLOYMENT.md) for hosting options
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues

## 🎉 You're Ready!

The app is now running and ready for Saviynt agentic onboarding demonstrations!

**Default URL**: http://localhost:3000  
**Default Login**: admin / admin123

---

**Quick Commands Reference**

```bash
npm start          # Start the application
npm run dev        # Start with auto-reload
npm run init       # Initialize database
npm run seed       # Load demo data
npm run reset      # Reset to demo state
```

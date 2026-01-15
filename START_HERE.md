# 🎉 Welcome to Saviynt Demo App!

Thank you for downloading the Saviynt Demo App. This ZIP contains everything you need to run a fully functional task management application designed to demonstrate Saviynt's Agentic Web App Onboarding capability.

## 📦 What's Inside

This package includes:
- ✅ Complete Node.js application source code
- ✅ Docker configuration for easy deployment
- ✅ Comprehensive documentation
- ✅ Database scripts with demo data
- ✅ Modern, professional UI
- ✅ Pre-configured user roles and permissions

## 🚀 Quick Start (Choose One)

### Option 1: Run Locally (5 minutes)
```bash
# Extract ZIP and navigate to folder
cd saviynt-demo-app

# Install dependencies
npm install

# Initialize database
npm run init

# Load demo data
npm run seed

# Start application
npm start

# Open browser to http://localhost:3000
# Login: admin / admin123
```

### Option 2: Run with Docker (3 minutes)
```bash
# Extract ZIP and navigate to folder
cd saviynt-demo-app

# Start with Docker Compose
docker-compose up -d

# Open browser to http://localhost:3000
# Login: admin / admin123
```

### Option 3: Deploy to Portainer (10 minutes)
See **PORTAINER.md** for detailed instructions on deploying via Portainer stacks.

## 📚 Documentation Files

Open these files for detailed guidance:

1. **START HERE**: `QUICKSTART.md` - Get running in 5 minutes
2. **README.md** - Full project documentation
3. **DEPLOYMENT.md** - Deploy to cloud services
4. **PORTAINER.md** - Portainer-specific deployment
5. **PROJECT-OVERVIEW.md** - Architecture and design

## 🔐 Demo Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Administrator | `admin` | `admin123` |
| Sales Manager | `jsmith` | `admin123` |
| Sales User | `mwilliams` | `admin123` |
| Reporting User | `rmartinez` | `admin123` |

## ✨ Key Features

### For Administrators
- Create, update, and delete users
- Assign roles and permissions
- Reset user passwords
- Manage organizational hierarchy
- View system-wide tasks

### For Managers
- View and manage team tasks
- Create tasks for team members
- Track team performance
- Limited administrative access

### For Users
- Create and update own tasks
- View assigned tasks
- Update task statuses
- Manage personal profile

## 🎯 What Makes This Special

This application demonstrates how Saviynt's agentic onboarding can:
- ✅ Navigate web applications without APIs
- ✅ Read and understand page structures
- ✅ Identify form fields and actions
- ✅ Create and manage users automatically
- ✅ Assign roles through web interfaces
- ✅ Extract user and access data

## 💡 Use Cases

### For Saviynt Sales Engineers
- Live product demonstrations
- Customer proof-of-concepts
- Training sessions
- Internal testing

### For Customers
- Evaluate Saviynt capabilities
- Understand agentic onboarding
- Plan implementation
- Train teams

### For Developers
- Test agentic features
- Develop integrations
- Regression testing
- Feature development

## 🛠️ Technology Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (file-based, portable)
- **Templates**: EJS (server-side rendering)
- **Authentication**: Session-based with bcrypt
- **UI**: Modern CSS with responsive design

## 📂 Project Structure

```
saviynt-demo-app/
├── src/
│   ├── models/       # Database and queries
│   ├── routes/       # Application routes
│   ├── middleware/   # Authentication
│   ├── views/        # EJS templates
│   └── public/       # CSS and assets
├── scripts/          # Setup scripts
├── data/             # Database storage
├── server.js         # Entry point
└── Documentation     # Guides
```

## 🔄 Resetting Demo Data

Need to reset everything to original state?

```bash
npm run reset
```

This will:
- Delete current database
- Recreate schema
- Reload all demo data
- Reset all passwords to `admin123`

## ⚠️ Important Notes

### Security
This is a **demo application**. For production:
- Change SESSION_SECRET
- Update default passwords
- Enable HTTPS
- Add rate limiting
- Implement audit logging

### Database
- SQLite is used for portability
- Data persists in `data/database.sqlite`
- Backup this file to save your data

### Ports
- Default port: 3000
- Change in `.env` file or: `PORT=3001 npm start`

## 🆘 Need Help?

### Can't Install Dependencies?
- Ensure Node.js 18+ is installed
- Run: `npm cache clean --force`
- Try: `rm -rf node_modules && npm install`

### Port Already in Use?
- Change port: `PORT=3001 npm start`
- Or kill existing process on port 3000

### Database Errors?
- Delete `data/database.sqlite`
- Run: `npm run init && npm run seed`

### More Help?
- Check documentation files
- Review code comments
- Search GitHub issues

## 🌟 Next Steps

1. **Extract the ZIP file**
2. **Choose your installation method** (Local/Docker/Portainer)
3. **Follow the Quick Start** above or see QUICKSTART.md
4. **Login and explore** the application
5. **Read PROJECT-OVERVIEW.md** to understand the architecture
6. **Test with Saviynt** agentic onboarding

## 📞 Support

For questions or issues:
- Check the documentation files included
- Review the code and comments
- Open GitHub issues (if repository is available)

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🎬 Ready to Start?

1. Extract this ZIP file
2. Open a terminal in the extracted folder
3. Run: `npm install && npm run init && npm run seed && npm start`
4. Open: http://localhost:3000
5. Login as: `admin` / `admin123`

**That's it!** You now have a fully functional demo application ready for Saviynt agentic onboarding testing.

---

**Built for Saviynt** | Demonstrating Agentic Web App Onboarding

For detailed instructions, open **QUICKSTART.md** first!

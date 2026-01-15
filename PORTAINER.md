# 📦 Portainer Deployment Guide

Complete guide for deploying Saviynt Demo App using Portainer.

## Prerequisites

- Portainer installed and running
- Access to Portainer web interface
- Git repository URL (GitHub, GitLab, etc.) OR the source files

---

## Deployment Method 1: From Git Repository (Recommended)

This is the easiest method - Portainer clones your repo and builds the container automatically.

### Step 1: Push Code to Git Repository

First, ensure your code is in a Git repository (GitHub, GitLab, Bitbucket, etc.):

```bash
# If not already a git repo
cd saviynt-demo-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/saviynt-demo-app.git
git push -u origin main
```

### Step 2: Create Stack in Portainer

1. **Login to Portainer** (usually `http://your-server:9000`)
2. **Select your environment** (local Docker or remote)
3. **Click "Stacks"** in the left sidebar
4. **Click "+ Add stack"**

### Step 3: Configure Repository Deployment

1. **Name**: `saviynt-demo-app`
2. **Build method**: Select **"Repository"**
3. **Repository URL**: `https://github.com/YOUR-USERNAME/saviynt-demo-app`
4. **Repository reference**: `refs/heads/main` (or your branch name)
5. **Compose path**: `docker-compose.yml`

### Step 4: Authentication (If Private Repo)

If your repository is private:
1. Toggle **"Authentication"** on
2. Enter your Git **username**
3. Enter your **personal access token** (not password)

### Step 5: Deploy

1. Click **"Deploy the stack"**
2. Wait for deployment (2-3 minutes on first run)
3. Check the container status shows "running"

### Step 6: Access Application

- **URL**: `http://YOUR-PORTAINER-HOST-IP:3000`
- **Login**: `admin` / `admin123`

---

## Deployment Method 2: Web Editor (No Git Required)

Use this if you don't want to use a Git repository.

### Step 1: Upload Files to Portainer Host

First, get the files onto your Portainer server:

```bash
# SSH into your Portainer host
ssh user@your-portainer-server

# Create directory
sudo mkdir -p /opt/saviynt-demo-app

# Option A: Clone from Git
cd /opt
sudo git clone https://github.com/YOUR-USERNAME/saviynt-demo-app.git

# Option B: Upload ZIP and extract
cd /opt/saviynt-demo-app
# Upload saviynt-demo-app.zip here
sudo unzip saviynt-demo-app.zip
sudo mv saviynt-demo-app/* .
```

### Step 2: Create Stack with Web Editor

1. In Portainer, go to **Stacks** → **+ Add stack**
2. **Name**: `saviynt-demo-app`
3. **Build method**: Select **"Web editor"**
4. **Paste this configuration**:

```yaml
version: '3.8'

services:
  app:
    image: node:18-alpine
    container_name: saviynt-demo-app
    working_dir: /app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - SESSION_SECRET=change-this-to-a-random-string
    volumes:
      - /opt/saviynt-demo-app:/app:ro
      - app-data:/app/data
      - node-modules:/app/node_modules
    command: >
      sh -c "cp -r /app/* /tmp/app 2>/dev/null || true &&
             cd /tmp/app &&
             npm install --production &&
             node scripts/init-db.js &&
             node scripts/seed-data.js &&
             node server.js"
    restart: unless-stopped

volumes:
  app-data:
  node-modules:
```

> **Important**: Change `/opt/saviynt-demo-app` to the actual path where you uploaded the files.

### Step 3: Deploy

1. Click **"Deploy the stack"**
2. Wait for deployment (2-3 minutes)
3. Verify container is running

---

## Verifying Deployment

### Check Container Status

1. Go to **Containers** in Portainer
2. Find `saviynt-demo-app`
3. Status should show **"running"** (green)

### View Logs

1. Click on the container name
2. Click **"Logs"** tab
3. You should see:
   ```
   ✅ Database schema initialized
   ✅ Demo data seeded successfully
   ✅ Saviynt Demo App running on http://localhost:3000
   ```

### Test Application

Open browser to: `http://YOUR-SERVER-IP:3000`

You should see the login page.

---

## Troubleshooting

### Error: "compose build operation failed"

**Cause**: Docker can't download Node.js packages during build.

**Solution**: The updated Dockerfile installs packages at runtime. Make sure you're using the latest version of the files.

### Error: Container exits immediately

**Check logs**:
1. **Containers** → `saviynt-demo-app` → **Logs**
2. Look for error messages

**Common fixes**:
- Port 3000 in use: Change port mapping to `"3001:3000"`
- Permission issues: Check volume mount paths exist

### Error: "Cannot find module"

**Cause**: Dependencies not installed properly.

**Solution**: 
1. Stop and remove the container
2. Remove the `node-modules` volume:
   - **Volumes** → find `saviynt-demo-app_node-modules` → **Remove**
3. Redeploy the stack

### Error: Database errors

**Solution**: Reset the database:
1. Stop the stack
2. Remove the `app-data` volume
3. Redeploy (will recreate database)

### Application very slow to start

**This is normal on first run.** The container needs to:
1. Download npm packages (~60 seconds)
2. Initialize database (~5 seconds)
3. Seed demo data (~10 seconds)

Subsequent restarts are faster because packages are cached.

---

## Managing the Application

### Stop Application
1. **Stacks** → `saviynt-demo-app`
2. Click **"Stop"**

### Restart Application
1. **Stacks** → `saviynt-demo-app`
2. Click **"Stop"** then **"Start"**

### Update Application (Git Repository Method)

1. Push changes to your Git repository
2. In Portainer: **Stacks** → `saviynt-demo-app`
3. Click **"Pull and redeploy"**

### Reset Demo Data

```bash
# Via Portainer Console
# Containers → saviynt-demo-app → Console → Connect

# In the container shell:
node scripts/reset-demo.js
```

Or simply:
1. Stop the stack
2. Delete the `app-data` volume
3. Start the stack (will reinitialize)

### View Container Shell

1. **Containers** → `saviynt-demo-app`
2. Click **"Console"**
3. Select **"/bin/sh"**
4. Click **"Connect"**

---

## Data Backup

### Backup Database

```bash
# On Portainer host
docker cp saviynt-demo-app:/app/data/database.sqlite ./backup-$(date +%Y%m%d).sqlite
```

### Restore Database

```bash
docker cp ./backup-YYYYMMDD.sqlite saviynt-demo-app:/app/data/database.sqlite
docker restart saviynt-demo-app
```

---

## Security Recommendations

Before using in any shared environment:

- [ ] Change `SESSION_SECRET` to a random string
- [ ] Change default passwords after first login
- [ ] Consider adding a reverse proxy with HTTPS
- [ ] Restrict network access to port 3000

---

## Quick Reference

| Action | Location |
|--------|----------|
| View logs | Containers → saviynt-demo-app → Logs |
| Restart | Stacks → saviynt-demo-app → Stop/Start |
| Update from Git | Stacks → saviynt-demo-app → Pull and redeploy |
| Access shell | Containers → saviynt-demo-app → Console |
| Check health | Containers → saviynt-demo-app → Status |

---

## Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Administrator | `admin` | `admin123` |
| Sales Manager | `jsmith` | `admin123` |
| Sales User | `mwilliams` | `admin123` |
| Reporting User | `rmartinez` | `admin123` |

---

## Next Steps

After successful deployment:
1. Access the app at `http://YOUR-SERVER:3000`
2. Login as admin
3. Explore the user management features
4. Test with Saviynt's agentic onboarding

For more help, see:
- [README.md](README.md) - Full documentation
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [QUICKSTART.md](QUICKSTART.md) - Local development

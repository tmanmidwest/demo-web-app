# 📦 Portainer Deployment Guide

Complete guide for deploying Saviynt Demo App using Portainer.

## Prerequisites

- Portainer installed and running
- Access to Portainer web interface
- This repository files available

## Deployment Methods

You have two options for deploying with Portainer:

### Method 1: Using Stacks (Recommended)
- Best for: Quick deployment from Git repository
- Time: 5 minutes
- Difficulty: Easy

### Method 2: Manual Container Creation
- Best for: Custom configuration
- Time: 10 minutes
- Difficulty: Moderate

---

## Method 1: Deploy Using Stacks

### Step 1: Access Portainer
1. Open Portainer in your browser (usually `http://your-server:9000`)
2. Log in with your credentials
3. Select your Docker environment

### Step 2: Create New Stack
1. Click **Stacks** in the left sidebar
2. Click **+ Add stack** button
3. Enter stack name: `saviynt-demo-app`

### Step 3: Configure Stack

Choose one of these options:

#### Option A: From Git Repository (Easiest)
1. Select **Repository** tab
2. Fill in:
   - **Repository URL**: `https://github.com/your-username/saviynt-demo-app`
   - **Repository reference**: `refs/heads/main`
   - **Compose path**: `docker-compose.yml`
3. Skip to Step 4

#### Option B: Web Editor (No Git Required)
1. Select **Web editor** tab
2. Paste this configuration:

```yaml
version: '3.8'

services:
  saviynt-demo:
    image: node:18-alpine
    container_name: saviynt-demo-app
    working_dir: /app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - SESSION_SECRET=change-this-secret-in-production
    volumes:
      - app-data:/app/data
      - ./:/app
    command: sh -c "npm install && npm run init && npm run seed && npm start"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  app-data:
    driver: local
```

### Step 4: Environment Variables (Optional)
Under **Environment variables** section, add:

| Name | Value |
|------|-------|
| `SESSION_SECRET` | Your custom secret key |
| `NODE_ENV` | `production` |

### Step 5: Deploy
1. Click **Deploy the stack**
2. Wait for deployment (2-3 minutes)
3. Check status in Stacks list

### Step 6: Verify Deployment
1. In Stacks, click on `saviynt-demo-app`
2. Check container status (should be "running")
3. Click **Logs** to see application output
4. Look for: `✅ Saviynt Demo App running on http://localhost:3000`

### Step 7: Access Application
- Find your Portainer host IP address
- Open browser to: `http://<portainer-host-ip>:3000`
- Login with: `admin` / `admin123`

---

## Method 2: Manual Container Creation

### Step 1: Prepare Application Files
1. Upload files to Portainer host
2. SSH into host:
```bash
ssh user@portainer-host
```

3. Create directory:
```bash
mkdir -p /opt/saviynt-demo-app
cd /opt/saviynt-demo-app
```

4. Upload or clone files here

### Step 2: Create Container in Portainer
1. Go to **Containers** in Portainer
2. Click **+ Add container**
3. Configure:

**Basic settings:**
- **Name**: `saviynt-demo-app`
- **Image**: `node:18-alpine`

**Network:**
- **Port mapping**: 
  - Host: `3000`
  - Container: `3000`

**Advanced:**
- **Command**: 
  ```
  sh -c "cd /app && npm install && npm run init && npm run seed && npm start"
  ```

**Volumes:**
- Click **+ map additional volume**
  - Container: `/app`
  - Host: `/opt/saviynt-demo-app`

**Environment variables:**
- `NODE_ENV`: `production`
- `SESSION_SECRET`: `your-secret-here`

**Restart policy:**
- Select: `Unless stopped`

4. Click **Deploy the container**

---

## Accessing the Application

### From Same Network
```
http://<portainer-host-ip>:3000
```

### From Internet (with Port Forwarding)
1. Configure router port forwarding:
   - External: 3000 → Internal: <portainer-host-ip>:3000
2. Access via: `http://<public-ip>:3000`

### Using Reverse Proxy (Recommended for Production)
See [Reverse Proxy Setup](#reverse-proxy-setup) below

---

## Managing the Application

### View Logs
1. Go to **Stacks** → `saviynt-demo-app`
2. Click **Logs** tab
3. Or for container: **Containers** → `saviynt-demo-app` → **Logs**

### Restart Application
**From Stack:**
1. **Stacks** → `saviynt-demo-app`
2. Click **Stop** then **Start**

**From Container:**
1. **Containers** → `saviynt-demo-app`
2. Click **Restart**

### Update Application
**If using Git repository:**
1. **Stacks** → `saviynt-demo-app`
2. Click **Update the stack**
3. Enable **Pull latest image**
4. Click **Update**

**If using manual deployment:**
1. Update files on host
2. Restart container

### Stop Application
1. **Stacks** → `saviynt-demo-app`
2. Click **Stop**

### Remove Application
1. **Stacks** → `saviynt-demo-app`
2. Click **Delete** (data will be preserved in volume)

---

## Data Management

### Backup Data
1. Go to **Volumes**
2. Find `saviynt-demo-app_app-data`
3. Use Portainer's backup feature or:

```bash
# Via SSH to host
docker run --rm -v saviynt-demo-app_app-data:/data \
  -v $(pwd):/backup alpine \
  tar czf /backup/saviynt-backup-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore Data
```bash
docker run --rm -v saviynt-demo-app_app-data:/data \
  -v $(pwd):/backup alpine \
  tar xzf /backup/saviynt-backup-YYYYMMDD.tar.gz -C /data
```

### Reset Demo Data
1. **Containers** → `saviynt-demo-app`
2. Click **Console** → **Connect**
3. Select: `/bin/sh`
4. Run:
```bash
npm run reset
```

### Clear All Data
1. Stop the stack
2. **Volumes** → `saviynt-demo-app_app-data`
3. Click **Remove**
4. Restart stack (will recreate with fresh data)

---

## Troubleshooting in Portainer

### Container Won't Start
1. Check logs: **Containers** → `saviynt-demo-app` → **Logs**
2. Common issues:
   - Port 3000 already in use
   - Insufficient permissions
   - Missing volume mount

### Can't Access Application
1. Verify container is running (green status)
2. Check port mapping: **Containers** → `saviynt-demo-app` → **Published ports**
3. Test from Portainer host:
```bash
curl http://localhost:3000
```

### Performance Issues
1. Check resource usage: **Containers** → `saviynt-demo-app` → **Stats**
2. Increase container resources if needed

### Database Errors
1. Stop container
2. Remove volume: **Volumes** → Delete `app-data`
3. Restart container (will reinitialize)

---

## Reverse Proxy Setup

### Using Nginx Proxy Manager (in Portainer)

1. **Deploy Nginx Proxy Manager** (if not installed):
```yaml
version: '3.8'
services:
  nginx-proxy-manager:
    image: 'jc21/nginx-proxy-manager:latest'
    ports:
      - '80:80'
      - '443:443'
      - '81:81'
    volumes:
      - npm-data:/data
      - npm-letsencrypt:/etc/letsencrypt
    restart: unless-stopped

volumes:
  npm-data:
  npm-letsencrypt:
```

2. **Configure Proxy Host**:
   - Access NPM: `http://<host-ip>:81`
   - Add Proxy Host:
     - Domain: `demo.yourdomain.com`
     - Forward to: `saviynt-demo-app:3000`
     - Enable SSL (optional)

3. **Access via domain**: `https://demo.yourdomain.com`

---

## Production Checklist

Before using in production:

- [ ] Change SESSION_SECRET environment variable
- [ ] Update all default passwords
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Configure restart policies
- [ ] Enable container health checks
- [ ] Set resource limits
- [ ] Configure logging
- [ ] Test disaster recovery

---

## Best Practices

### Security
- Use secrets for sensitive data
- Don't expose port 3000 directly to internet
- Use reverse proxy with SSL
- Regular security updates

### Monitoring
- Enable container health checks
- Set up alerts for container failures
- Monitor resource usage
- Regular log reviews

### Maintenance
- Regular backups (daily recommended)
- Test restores periodically
- Keep Docker images updated
- Document any customizations

---

## Quick Reference Commands

### View Application Status
```bash
docker ps | grep saviynt
```

### View Live Logs
```bash
docker logs -f saviynt-demo-app
```

### Execute Commands in Container
```bash
docker exec -it saviynt-demo-app sh
npm run reset
```

### Backup Database
```bash
docker exec saviynt-demo-app \
  tar czf /tmp/backup.tar.gz /app/data
docker cp saviynt-demo-app:/tmp/backup.tar.gz ./
```

---

## Support

### Common Issues
1. **Port conflict**: Change port mapping in stack
2. **Permission denied**: Check volume permissions
3. **Database locked**: Restart container

### Getting Help
- Check Portainer logs
- Review container logs
- Consult main [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Next Steps

After deployment:
1. Access application at `http://<host-ip>:3000`
2. Login as administrator
3. Explore features
4. Configure for your use case
5. Set up regular backups

**Default Login**: `admin` / `admin123`

---

**Pro Tip**: Use Portainer's template feature to save this configuration for quick redeployment!

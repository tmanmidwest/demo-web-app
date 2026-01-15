# 🔧 Troubleshooting Guide

Common issues and solutions for the Saviynt Demo App.

## Installation Issues

### "npm install" Fails

**Error**: Dependencies won't install
```
npm ERR! code ENOTFOUND
npm ERR! errno ENOTFOUND
```

**Solutions**:
1. Check internet connection
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and try again:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
4. Try with different registry:
   ```bash
   npm install --registry=https://registry.npmjs.org/
   ```

### "better-sqlite3" Build Fails

**Error**: Native module compilation error
```
gyp ERR! build error
```

**Solutions**:
1. Install build tools:
   - **Windows**: `npm install --global windows-build-tools`
   - **Mac**: `xcode-select --install`
   - **Linux**: `sudo apt-get install build-essential`
2. Use pre-built binaries:
   ```bash
   npm install better-sqlite3 --build-from-source=false
   ```

---

## Portainer Deployment Issues

### "compose build operation failed"

**Error**:
```
Failed to deploy a stack: compose build operation failed
exit code: 1
```

**Cause**: Using old docker-compose.yml that tries to build an image

**Solution**: Use the updated configuration that doesn't require building:

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
      - SESSION_SECRET=change-this-secret-in-production
    volumes:
      - ./:/app
      - app-data:/app/data
      - node-modules:/app/node_modules
    command: >
      sh -c "npm install --production &&
             node scripts/init-db.js &&
             node scripts/seed-data.js &&
             npm start"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s

volumes:
  app-data:
    driver: local
  node-modules:
    driver: local
```

**Steps**:
1. Delete the failed stack in Portainer
2. Create new stack with the configuration above
3. Deploy

### Container Starts but Immediately Stops

**Symptoms**: Container shows "Exited" status

**Solutions**:
1. Check logs in Portainer:
   - **Stacks** → Your stack → **Logs**
2. Common causes:
   - Port 3000 already in use → Change port mapping
   - Permission issues → Check volume permissions
   - Missing files → Verify repository clone

### "npm install" Takes Forever in Container

**Symptoms**: Container stuck during startup

**Solutions**:
1. Be patient - first startup can take 2-3 minutes
2. Check logs to see progress
3. If truly stuck (>5 minutes), restart container
4. Consider pre-installing dependencies:
   ```bash
   # On Portainer host
   cd /path/to/repo
   npm install --production
   ```

---

## Docker Issues

### Port Already in Use

**Error**:
```
Error starting userland proxy: listen tcp4 0.0.0.0:3000: bind: address already in use
```

**Solutions**:
1. Find what's using port 3000:
   ```bash
   lsof -i :3000
   # or
   netstat -tulpn | grep 3000
   ```
2. Kill the process or change port:
   ```yaml
   ports:
     - "3001:3000"  # Change host port
   ```

### Volume Permission Errors

**Error**: Can't write to database
```
Error: EACCES: permission denied
```

**Solutions**:
1. Fix volume permissions:
   ```bash
   docker exec -it saviynt-demo-app chmod 777 /app/data
   ```
2. Or recreate volume:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

---

## Database Issues

### "Database is Locked"

**Error**:
```
SQLITE_BUSY: database is locked
```

**Solutions**:
1. Stop all instances:
   ```bash
   docker-compose down
   # or
   npm stop
   ```
2. Delete lock file:
   ```bash
   rm data/database.sqlite-journal
   ```
3. Restart application

### "No Such Table" Error

**Error**:
```
SQLITE_ERROR: no such table: users
```

**Solutions**:
1. Initialize database:
   ```bash
   npm run init
   npm run seed
   ```
2. Or in Docker:
   ```bash
   docker exec -it saviynt-demo-app node scripts/init-db.js
   docker exec -it saviynt-demo-app node scripts/seed-data.js
   ```

### Database File Corrupted

**Symptoms**: Various SQL errors

**Solution**: Reset database:
```bash
# Stop application
docker-compose down  # or npm stop

# Delete database
rm data/database.sqlite

# Restart (will auto-initialize)
docker-compose up -d  # or npm run init && npm run seed && npm start
```

---

## Application Issues

### Can't Login - "Invalid Username or Password"

**Solutions**:
1. Verify you're using correct credentials:
   - Username: `admin`
   - Password: `admin123`
2. Check if database was seeded:
   ```bash
   npm run seed
   # or
   docker exec -it saviynt-demo-app node scripts/seed-data.js
   ```
3. Reset everything:
   ```bash
   npm run reset
   ```

### "Cannot GET /" or 404 Errors

**Solutions**:
1. Ensure application is running:
   ```bash
   docker ps  # Should show container running
   ```
2. Check server logs:
   ```bash
   docker logs saviynt-demo-app
   ```
3. Verify port and URL:
   - Should be: `http://localhost:3000`
   - Not: `https://localhost:3000`

### Session Expires Immediately

**Cause**: SESSION_SECRET not set properly

**Solution**: Set environment variable:
```bash
# In .env file
SESSION_SECRET=your-long-random-secret-here

# Or in docker-compose.yml
environment:
  - SESSION_SECRET=your-secret-here
```

---

## Network Issues

### Can't Access from Other Devices

**Solutions**:
1. Use host IP instead of localhost:
   - Find IP: `hostname -I` (Linux) or `ipconfig` (Windows)
   - Access: `http://192.168.x.x:3000`
2. Check firewall:
   ```bash
   sudo ufw allow 3000/tcp
   ```
3. Verify container networking:
   ```bash
   docker inspect saviynt-demo-app | grep IPAddress
   ```

### "Failed to Fetch" in Browser

**Solutions**:
1. Check if server is running: `curl http://localhost:3000`
2. Verify network mode in docker-compose
3. Try different browser
4. Clear browser cache

---

## Performance Issues

### Application Slow to Start

**Normal**: First startup takes 30-60 seconds
- npm install: 20-30 seconds
- Database init: 5-10 seconds  
- Seed data: 5-10 seconds

**If slower**:
1. Check available resources:
   ```bash
   docker stats saviynt-demo-app
   ```
2. Increase container memory if needed
3. Check disk space: `df -h`

### Slow Page Loads

**Solutions**:
1. Check database size: `ls -lh data/database.sqlite`
2. Restart application to clear memory
3. Check system resources
4. Reduce demo data if needed

---

## Data Issues

### Lost All Data After Restart

**Cause**: Database not persisted in volume

**Solution**: Ensure docker-compose.yml has:
```yaml
volumes:
  - app-data:/app/data

volumes:
  app-data:
    driver: local
```

### Can't Reset Demo Data

**Error**: Reset script fails

**Solutions**:
1. Manual reset:
   ```bash
   # Stop app
   docker-compose down
   
   # Delete database
   rm data/database.sqlite
   
   # Restart (auto-reinitializes)
   docker-compose up -d
   ```
2. Or via Docker:
   ```bash
   docker exec -it saviynt-demo-app sh
   npm run reset
   exit
   ```

---

## Common Questions

### How Do I Change the Port?

**Docker**:
```yaml
ports:
  - "8080:3000"  # Host:Container
```

**Local**:
```bash
PORT=8080 npm start
```

### How Do I Enable HTTPS?

Use a reverse proxy like Nginx or Caddy:
```nginx
server {
    listen 443 ssl;
    server_name demo.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

### How Do I Backup Data?

**Docker volume backup**:
```bash
docker run --rm -v saviynt-demo-app_app-data:/data \
  -v $(pwd):/backup alpine \
  tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C /data .
```

**Simple file backup**:
```bash
cp data/database.sqlite data/database.sqlite.backup
```

### How Do I Update the Application?

**Git repository**:
```bash
cd saviynt-demo-app
git pull
docker-compose up -d --force-recreate
```

**Manual update**:
1. Stop application
2. Replace files
3. Keep `data/` folder
4. Restart application

---

## Getting More Help

### Check Logs

**Docker**:
```bash
docker logs saviynt-demo-app
docker logs -f saviynt-demo-app  # Follow logs
```

**Local**:
```bash
npm start  # Logs appear in terminal
```

### Enable Debug Mode

Add to `.env`:
```
NODE_ENV=development
DEBUG=*
```

### Verify Installation

```bash
# Check Node version
node --version  # Should be 18+

# Check npm
npm --version

# Test database
ls -lh data/database.sqlite

# Test server
curl http://localhost:3000/health
```

### Report Issues

When reporting issues, include:
1. Error message (full text)
2. Log output
3. Environment (Docker/local, OS)
4. Steps to reproduce
5. What you've already tried

---

## Quick Fixes Checklist

- [ ] Checked application is running (`docker ps` or task manager)
- [ ] Verified correct URL (`http://localhost:3000`)
- [ ] Confirmed port is available (`lsof -i :3000`)
- [ ] Reviewed logs for errors
- [ ] Tried restarting application
- [ ] Checked disk space available
- [ ] Verified permissions on data folder
- [ ] Tested with curl or different browser
- [ ] Reviewed environment variables
- [ ] Consulted documentation

---

**Still stuck?** Open an issue on GitHub or consult the main [README.md](README.md).

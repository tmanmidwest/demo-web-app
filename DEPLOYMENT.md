# 📦 Deployment Guide

Comprehensive guide for deploying the Saviynt Demo App to various platforms.

## Table of Contents
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Portainer Deployment](#portainer-deployment)
- [DigitalOcean](#digitalocean)
- [AWS](#aws)
- [Heroku](#heroku)
- [General Cloud Hosting](#general-cloud-hosting)

---

## 🖥️ Local Development

Perfect for testing and demos on your own machine.

### Requirements
- Node.js 18+
- npm 8+

### Steps
```bash
# Install dependencies
npm install

# Initialize database
npm run init

# Load demo data
npm run seed

# Start server
npm start
```

Access at: `http://localhost:3000`

### Environment Variables
Create a `.env` file:
```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-secret-key-here
DATABASE_PATH=./data/database.sqlite
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

**Prerequisites**: Docker and Docker Compose installed

**Steps**:
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

**Access**: `http://localhost:3000`

### Using Docker Only

```bash
# Build image
docker build -t saviynt-demo-app .

# Run container
docker run -d \
  --name saviynt-app \
  -p 3000:3000 \
  -e SESSION_SECRET=your-secret-here \
  -v saviynt-data:/app/data \
  saviynt-demo-app

# View logs
docker logs -f saviynt-app

# Stop and remove
docker stop saviynt-app
docker rm saviynt-app
```

### Data Persistence
Data is stored in a Docker volume. To backup:
```bash
# Backup
docker run --rm -v saviynt-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/saviynt-data-backup.tar.gz -C /data .

# Restore
docker run --rm -v saviynt-data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/saviynt-data-backup.tar.gz -C /data
```

---

## 📦 Portainer Deployment

Perfect for managing Docker containers through a web UI.

### Prerequisites
- Portainer installed and running
- Access to Portainer dashboard

### Method 1: Using Stacks

1. **Login to Portainer**
2. **Navigate to Stacks** → Click **Add Stack**
3. **Name**: `saviynt-demo-app`
4. **Web Editor**: Paste this configuration:

```yaml
version: '3.8'

services:
  app:
    image: saviynt-demo-app:latest
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - SESSION_SECRET=${SESSION_SECRET:-change-this-in-production}
    volumes:
      - app-data:/app/data
    restart: unless-stopped

volumes:
  app-data:
```

5. **Deploy the Stack**

### Method 2: Using Repository

1. **Navigate to Stacks** → **Add Stack**
2. Select **Repository**
3. Enter your Git repository URL
4. Set compose path: `docker-compose.yml`
5. Deploy

### Access
- Find your Portainer host IP
- Access app at: `http://<portainer-host-ip>:3000`

### Environment Variables in Portainer
Add under Stack → Environment variables:
- `SESSION_SECRET`: Your secret key
- `NODE_ENV`: `production`

---

## ☁️ DigitalOcean

### Method 1: App Platform (Easiest)

1. **Create App**
   - Go to DigitalOcean Dashboard
   - Click **Create** → **Apps**
   - Connect your GitHub repository

2. **Configure Build**
   - **Build Command**: `npm install && npm run init && npm run seed`
   - **Run Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `SESSION_SECRET`: `<generate-strong-secret>`

3. **Select Plan**
   - Basic: $5/month (sufficient for demos)
   - Pro: $12/month (for heavier use)

4. **Deploy**
   - Click **Create Resources**
   - Wait for deployment (3-5 minutes)

### Method 2: Droplet + Docker

1. **Create Droplet**
   - Choose Docker marketplace image
   - Select plan ($6/month minimum)

2. **SSH into Droplet**
```bash
ssh root@your-droplet-ip
```

3. **Deploy**
```bash
# Clone repository
git clone <your-repo-url>
cd saviynt-demo-app

# Deploy with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
```

4. **Configure Firewall**
```bash
ufw allow 3000/tcp
ufw allow OpenSSH
ufw enable
```

**Access**: `http://your-droplet-ip:3000`

### Using Domain Name
1. Add A record in DigitalOcean DNS
2. Point to your droplet IP
3. Access via: `http://yourdomain.com:3000`

---

## 🌩️ AWS

### Method 1: Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize Application**
```bash
cd saviynt-demo-app
eb init
```
- Select region
- Create new application
- Choose Node.js platform

3. **Create Environment**
```bash
eb create saviynt-demo-env
```

4. **Deploy Updates**
```bash
eb deploy
```

5. **Open Application**
```bash
eb open
```

### Method 2: EC2 + Docker

1. **Launch EC2 Instance**
   - Amazon Linux 2
   - t2.micro (free tier) or t2.small
   - Security group: Allow ports 22, 80, 3000

2. **Connect and Setup**
```bash
# SSH to instance
ssh -i your-key.pem ec2-user@instance-ip

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and deploy
git clone <your-repo-url>
cd saviynt-demo-app
docker-compose up -d
```

**Access**: `http://ec2-instance-ip:3000`

### Using Load Balancer
- Create Application Load Balancer
- Configure target group for port 3000
- Register EC2 instance
- Access via Load Balancer DNS

---

## 🟣 Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Deployment Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
heroku create saviynt-demo-app
```

3. **Add Buildpack**
```bash
heroku buildpacks:set heroku/nodejs
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret-here
```

5. **Deploy**
```bash
git push heroku main
```

6. **Open Application**
```bash
heroku open
```

### Persistence Note
Heroku's filesystem is ephemeral. For persistent data:
- Use Heroku Postgres addon
- Or modify to use PostgreSQL instead of SQLite

---

## 🌐 General Cloud Hosting

### VPS Providers (Linode, Vultr, etc.)

1. **Create VPS**
   - Ubuntu 22.04 LTS
   - 1GB RAM minimum
   - Open ports: 22, 80, 3000

2. **Initial Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git
```

3. **Deploy Application**
```bash
# Clone repository
git clone <your-repo-url>
cd saviynt-demo-app

# Install and start
npm install
npm run init
npm run seed
npm start
```

4. **Run as Service** (Optional)
```bash
# Install PM2
sudo npm install -g pm2

# Start with PM2
pm2 start server.js --name saviynt-app

# Save configuration
pm2 save

# Set to start on boot
pm2 startup
```

---

## 🔒 Production Best Practices

### Security
- [ ] Change SESSION_SECRET
- [ ] Use HTTPS (Let's Encrypt/Certbot)
- [ ] Update default passwords
- [ ] Enable firewall
- [ ] Regular security updates
- [ ] Implement rate limiting

### Monitoring
- [ ] Set up application logging
- [ ] Monitor resource usage
- [ ] Configure alerts
- [ ] Regular backups

### Performance
- [ ] Use reverse proxy (Nginx)
- [ ] Enable compression
- [ ] Configure caching
- [ ] Database optimization

---

## 🔄 Continuous Deployment

### GitHub Actions Example
```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Droplet
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd saviynt-demo-app
            git pull
            docker-compose up -d --build
```

---

## 📊 Resource Requirements

### Minimum
- **CPU**: 1 core
- **RAM**: 512MB
- **Disk**: 1GB
- **Bandwidth**: 1GB/month

### Recommended
- **CPU**: 2 cores
- **RAM**: 2GB
- **Disk**: 5GB
- **Bandwidth**: 5GB/month

---

## 🆘 Troubleshooting Deployment

### Port Issues
```bash
# Check if port is in use
lsof -i :3000

# Use different port
PORT=3001 npm start
```

### Database Permissions
```bash
# Fix permissions
chmod 755 data/
chmod 644 data/*.sqlite
```

### Docker Issues
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild
docker-compose down
docker-compose up -d --build
```

---

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs` or `npm start`
2. Review this guide
3. Check cloud provider documentation
4. Open GitHub issue

---

**Next Steps**: After deployment, see [QUICKSTART.md](QUICKSTART.md) for usage instructions.

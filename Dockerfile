FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci for flexibility)
RUN npm install --production

# Copy application files
COPY . .

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Initialize database and start application
CMD sh -c "node scripts/init-db.js && node scripts/seed-data.js && npm start"

FROM node:18-alpine

WORKDIR /app

# Copy all application files
COPY . .

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Install dependencies and start application at runtime
# This avoids build-time network issues
CMD sh -c "npm install --production && node scripts/init-db.js && node scripts/seed-data.js && npm start"

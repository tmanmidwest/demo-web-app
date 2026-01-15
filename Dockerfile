FROM node:18-alpine

WORKDIR /app

# Copy all application files
COPY . .

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Health check - start checking after 2 minutes
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Install dependencies and run startup script with explicit output
CMD echo "=== Starting container ===" && \
    echo "=== Installing dependencies ===" && \
    npm install --omit=dev 2>&1 && \
    echo "=== Dependencies installed ===" && \
    echo "=== Running startup script ===" && \
    node scripts/startup.js

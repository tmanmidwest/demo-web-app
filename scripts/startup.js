#!/usr/bin/env node
/**
 * Startup script for Saviynt Demo App
 * This script handles database initialization, seeding, and starting the server
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DB_PATH = path.join(DATA_DIR, 'database.sqlite');

async function startup() {
  console.log('🚀 Starting Saviynt Demo App...');
  
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('📁 Created data directory');
  }

  // Check if this is a fresh database (no users)
  const { db, userQueries } = require('../src/models/database');
  
  let needsSeed = false;
  try {
    const users = userQueries.getAll.all();
    if (users.length === 0) {
      needsSeed = true;
      console.log('📊 Database is empty, will seed demo data');
    } else {
      console.log(`📊 Database has ${users.length} users, skipping seed`);
    }
  } catch (error) {
    console.log('📊 Database needs initialization');
    needsSeed = true;
  }

  // Seed if needed
  if (needsSeed) {
    console.log('🌱 Seeding demo data...');
    const seedData = require('./seed-data');
    await seedData();
  }

  // Start the server
  console.log('🌐 Starting web server...');
  require('../server');
}

startup().catch(error => {
  console.error('❌ Startup failed:', error);
  process.exit(1);
});

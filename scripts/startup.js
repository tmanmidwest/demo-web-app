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
  console.log(`📁 Database path: ${DB_PATH}`);
  
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('📁 Created data directory');
  }

  // Check if database file exists
  const dbExists = fs.existsSync(DB_PATH);
  console.log(`📊 Database file exists: ${dbExists}`);

  // Load database module (this initializes schema)
  const { db, userQueries } = require('../src/models/database');
  
  // Check if we need to seed
  let needsSeed = false;
  try {
    const users = userQueries.getAll.all();
    console.log(`📊 Found ${users.length} users in database`);
    if (users.length === 0) {
      needsSeed = true;
    }
  } catch (error) {
    console.log('📊 Error checking users:', error.message);
    needsSeed = true;
  }

  // Seed if needed
  if (needsSeed) {
    console.log('🌱 Seeding demo data...');
    const seedData = require('./seed-data');
    await seedData();
    
    // Verify seeding worked
    const users = userQueries.getAll.all();
    console.log(`✅ After seeding: ${users.length} users in database`);
    
    // Show first user for debugging
    if (users.length > 0) {
      console.log(`   First user: ${users[0].username} (id: ${users[0].id})`);
    }
  }

  // Final verification before starting server
  const finalCheck = userQueries.getAll.all();
  console.log(`🔍 Final check: ${finalCheck.length} users ready`);
  
  // Check database file size
  const stats = fs.statSync(DB_PATH);
  console.log(`📊 Database file size: ${stats.size} bytes`);

  // Start the server
  console.log('🌐 Starting web server...');
  require('../server');
}

startup().catch(error => {
  console.error('❌ Startup failed:', error);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');
const { initializeDatabase } = require('../src/models/database');
const seedData = require('./seed-data');

const DB_PATH = path.join(__dirname, '../data/database.sqlite');

async function resetDemo() {
  console.log('🔄 Resetting demo database...');

  try {
    // Delete existing database
    if (fs.existsSync(DB_PATH)) {
      fs.unlinkSync(DB_PATH);
      console.log('✅ Deleted existing database');
    }

    // Reinitialize database
    initializeDatabase();
    console.log('✅ Database reinitialized');

    // Seed with demo data
    await seedData();
    console.log('✅ Demo reset complete!');

  } catch (error) {
    console.error('❌ Error resetting demo:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  resetDemo()
    .then(() => {
      const { db } = require('../src/models/database');
      db.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = resetDemo;

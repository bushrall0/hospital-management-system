/**
 * Database Connection Test Script
 * Tests Oracle database connectivity for HealSmart HMS
 */

import { testConnection, initializePool, closePool } from './connection.js';

async function main() {
  console.log('🔍 Testing Oracle Database Connection...');
  console.log('======================================');
  console.log('Host: localhost/XEPDB1');
  console.log('User: project332');
  console.log('======================================\n');

  try {
    // Initialize pool
    await initializePool();

    // Test connection
    const isConnected = await testConnection();

    if (isConnected) {
      console.log('\n✅ SUCCESS: Database connection is working!');
      console.log('👍 You can now run the database initialization script.');
    } else {
      console.log('\n❌ FAILED: Could not connect to database');
      console.log('Please check:');
      console.log('  1. Oracle database is running');
      console.log('  2. Credentials are correct (project332/1234)');
      console.log('  3. Database XEPDB1 exists');
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    console.log('\nTroubleshooting:');
    console.log('  1. Ensure Oracle Database is installed and running');
    console.log('  2. Verify Oracle Instant Client is installed');
    console.log('  3. Check database credentials');
  } finally {
    await closePool();
    process.exit(0);
  }
}

main();

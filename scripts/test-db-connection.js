// Test Database Connection Script
const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function testConnection() {
  console.log('Attempting to connect to database...');
  console.log(`Connection string: ${connectionString.replace(/:[^:]*@/, ':***@')}`);
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Accept self-signed certificates
    },
    connectionTimeoutMillis: 10000, // 10 seconds
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to database!');
    
    // Test a simple query
    const res = await client.query('SELECT NOW() as current_time');
    console.log(`Current database time: ${res.rows[0].current_time}`);
    
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Additional connection diagnostics
    console.log('\nTrying to diagnose the issue:');
    const dbUrl = new URL(connectionString);
    console.log(`Host: ${dbUrl.hostname}`);
    console.log(`Port: ${dbUrl.port}`);
    console.log(`Database: ${dbUrl.pathname.substring(1)}`);
    console.log(`Username: ${dbUrl.username}`);
    console.log(`SSL Mode: ${dbUrl.searchParams.get('sslmode') || 'Not specified'}`);
    
    process.exit(1);
  }
}

testConnection(); 
// sample-metrics-insert.js
// Quick sample metrics insertion for testing
// Run: node sample-metrics-insert.js
// Requires: npm install mongodb
//
// For comprehensive data generation, use: node scripts/generate-realtime-metrics.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'trendai';
const collectionName = 'metrics';

// Helper to generate random metrics
function generateRandomMetrics(period = 'current') {
  const totalRevenue = Math.floor(Math.random() * 100000) + 100000;
  const totalOrders = Math.floor(Math.random() * 1000) + 800;
  const avgOrderValue = totalRevenue / totalOrders;
  const conversionRate = Math.random() * 2 + 2.5;
  const totalQuantity = Math.floor(totalOrders * (Math.random() * 1.5 + 1.5));
  
  return {
    period,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    totalQuantity,
    conversionRate: Math.round(conversionRate * 100) / 100,
    timestamp: new Date(),
    isLive: period === 'current'
  };
}

async function insertSampleMetrics() {
  const client = new MongoClient(uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✓ Connected successfully!');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Generate sample metrics for different periods
    const metrics = [
      generateRandomMetrics('current'),  // Current/live metrics
      generateRandomMetrics('24h'),      // Last 24 hours
      generateRandomMetrics('7d'),       // Last 7 days
      generateRandomMetrics('30d'),      // Last 30 days
      // Add a few more historical records
      generateRandomMetrics('1h'),
      generateRandomMetrics('1h'),
      generateRandomMetrics('1h'),
    ];
    
    console.log(`\nInserting ${metrics.length} sample metrics...`);
    const result = await collection.insertMany(metrics);
    console.log(`✓ Inserted ${result.insertedCount} documents successfully!`);
    
    // Display sample data
    console.log('\nSample current metrics:');
    const currentMetrics = metrics.find(m => m.period === 'current');
    console.log(JSON.stringify(currentMetrics, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('Quick sample data inserted!');
    console.log('For comprehensive data generation, use:');
    console.log('  node scripts/generate-realtime-metrics.js');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed.');
  }
}

// Run if executed directly
insertSampleMetrics()
  .then(() => {
    console.log('\n✓ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });

export { insertSampleMetrics, generateRandomMetrics };
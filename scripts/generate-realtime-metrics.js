// scripts/generate-realtime-metrics.js
// Generates realistic real-time metrics data for MongoDB
// Run: node scripts/generate-realtime-metrics.js

import { MongoClient } from 'mongodb';

// Configuration
const config = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: 'trendai',
  collections: {
    metrics: 'metrics',
    sales: 'sales',
    products: 'products'
  }
};

// Helper function to generate random number in range
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random float in range
function randomFloatInRange(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Generate realistic time-series metrics data
function generateMetricsTimeSeries(hoursBack = 168) { // Default 7 days
  const metrics = [];
  const now = new Date();
  
  // Base values with some variance
  let baseRevenue = 150000;
  let baseOrders = 1200;
  let baseConversionRate = 3.5;
  
  for (let i = hoursBack; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    // Add daily and hourly patterns
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    
    // Peak hours: 10am-2pm and 6pm-9pm
    const hourMultiplier = (hour >= 10 && hour <= 14) || (hour >= 18 && hour <= 21) 
      ? randomFloatInRange(1.2, 1.5) 
      : randomFloatInRange(0.7, 1.0);
    
    // Weekend boost
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) 
      ? randomFloatInRange(1.1, 1.3) 
      : 1.0;
    
    // Calculate metrics with variance
    const totalRevenue = Math.round(baseRevenue * hourMultiplier * weekendMultiplier * randomFloatInRange(0.9, 1.1));
    const totalOrders = Math.round(baseOrders * hourMultiplier * weekendMultiplier * randomFloatInRange(0.9, 1.1));
    const avgOrderValue = totalRevenue / totalOrders;
    const conversionRate = baseConversionRate * randomFloatInRange(0.95, 1.05);
    const totalQuantity = Math.round(totalOrders * randomFloatInRange(1.5, 3.0));
    
    metrics.push({
      period: '1h',
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      totalQuantity,
      conversionRate: Math.round(conversionRate * 100) / 100,
      timestamp,
      metadata: {
        hour,
        dayOfWeek,
        hourMultiplier: Math.round(hourMultiplier * 100) / 100,
        weekendMultiplier: Math.round(weekendMultiplier * 100) / 100
      }
    });
    
    // Slight trend over time
    baseRevenue *= randomFloatInRange(0.998, 1.002);
    baseOrders *= randomFloatInRange(0.998, 1.002);
    baseConversionRate *= randomFloatInRange(0.999, 1.001);
  }
  
  return metrics;
}

// Generate aggregated metrics (24h, 7d, 30d)
function generateAggregatedMetrics() {
  const periods = [
    { name: '24h', hours: 24 },
    { name: '7d', hours: 168 },
    { name: '30d', hours: 720 }
  ];
  
  const aggregatedMetrics = [];
  
  periods.forEach(({ name, hours }) => {
    const baseRevenue = hours === 24 ? 150000 : hours === 168 ? 1050000 : 4500000;
    const baseOrders = hours === 24 ? 1200 : hours === 168 ? 8400 : 36000;
    
    const totalRevenue = Math.round(baseRevenue * randomFloatInRange(0.95, 1.05));
    const totalOrders = Math.round(baseOrders * randomFloatInRange(0.95, 1.05));
    const avgOrderValue = totalRevenue / totalOrders;
    const totalQuantity = Math.round(totalOrders * randomFloatInRange(1.5, 3.0));
    const conversionRate = randomFloatInRange(3.0, 4.0);
    
    aggregatedMetrics.push({
      period: name,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      totalQuantity,
      conversionRate: Math.round(conversionRate * 100) / 100,
      timestamp: new Date()
    });
  });
  
  return aggregatedMetrics;
}

// Generate current/latest metrics (for real-time display)
function generateCurrentMetrics() {
  const totalRevenue = randomFloatInRange(140000, 160000);
  const totalOrders = randomInRange(1100, 1300);
  const avgOrderValue = totalRevenue / totalOrders;
  const conversionRate = randomFloatInRange(3.2, 3.8);
  const totalQuantity = Math.round(totalOrders * randomFloatInRange(1.5, 3.0));
  
  return {
    period: 'current',
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    totalQuantity,
    conversionRate: Math.round(conversionRate * 100) / 100,
    timestamp: new Date(),
    isLive: true
  };
}

// Generate sales data to support metrics
function generateSalesData(days = 30) {
  const sales = [];
  const now = new Date();
  
  const products = [
    'PROD001', 'PROD002', 'PROD003', 'PROD004', 'PROD005',
    'PROD006', 'PROD007', 'PROD008', 'PROD009', 'PROD010'
  ];
  
  const channels = ['online', 'retail', 'wholesale'];
  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Australia'];
  
  // Generate sales for each day
  for (let day = days; day >= 0; day--) {
    const salesPerDay = randomInRange(800, 1500);
    
    for (let i = 0; i < salesPerDay; i++) {
      const saleDate = new Date(now.getTime() - day * 24 * 60 * 60 * 1000 - randomInRange(0, 24 * 60 * 60 * 1000));
      const quantity = randomInRange(1, 5);
      const unitPrice = randomFloatInRange(50, 300);
      const revenue = quantity * unitPrice;
      
      sales.push({
        productId: products[randomInRange(0, products.length - 1)],
        quantity,
        revenue: Math.round(revenue * 100) / 100,
        channel: channels[randomInRange(0, channels.length - 1)],
        region: regions[randomInRange(0, regions.length - 1)],
        date: saleDate,
        userId: `USER${randomInRange(1000, 9999)}`,
        createdAt: saleDate,
        updatedAt: saleDate
      });
    }
  }
  
  return sales;
}

// Main function to insert data
async function insertRealtimeMetrics() {
  const client = new MongoClient(config.uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db(config.dbName);
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('\nClearing existing metrics data...');
    await db.collection(config.collections.metrics).deleteMany({});
    console.log('Existing metrics cleared.');
    
    // Generate and insert time-series metrics (7 days of hourly data)
    console.log('\nGenerating time-series metrics (7 days)...');
    const timeSeriesMetrics = generateMetricsTimeSeries(168);
    const timeSeriesResult = await db.collection(config.collections.metrics).insertMany(timeSeriesMetrics);
    console.log(`✓ Inserted ${timeSeriesResult.insertedCount} time-series metrics documents`);
    
    // Generate and insert aggregated metrics
    console.log('\nGenerating aggregated metrics (24h, 7d, 30d)...');
    const aggregatedMetrics = generateAggregatedMetrics();
    const aggregatedResult = await db.collection(config.collections.metrics).insertMany(aggregatedMetrics);
    console.log(`✓ Inserted ${aggregatedResult.insertedCount} aggregated metrics documents`);
    
    // Generate and insert current metrics
    console.log('\nGenerating current/live metrics...');
    const currentMetrics = generateCurrentMetrics();
    const currentResult = await db.collection(config.collections.metrics).insertOne(currentMetrics);
    console.log(`✓ Inserted current metrics document`);
    
    // Generate and insert sales data (optional - supports metrics calculations)
    console.log('\nGenerating sales data (30 days)...');
    const salesData = generateSalesData(30);
    
    // Insert in batches to avoid memory issues
    const batchSize = 1000;
    let totalInserted = 0;
    for (let i = 0; i < salesData.length; i += batchSize) {
      const batch = salesData.slice(i, i + batchSize);
      const salesResult = await db.collection(config.collections.sales).insertMany(batch);
      totalInserted += salesResult.insertedCount;
    }
    console.log(`✓ Inserted ${totalInserted} sales documents`);
    
    // Create indexes for better query performance
    console.log('\nCreating indexes...');
    await db.collection(config.collections.metrics).createIndex({ timestamp: -1 });
    await db.collection(config.collections.metrics).createIndex({ period: 1, timestamp: -1 });
    await db.collection(config.collections.sales).createIndex({ date: -1 });
    await db.collection(config.collections.sales).createIndex({ productId: 1, date: -1 });
    console.log('✓ Indexes created');
    
    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('DATA GENERATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Database: ${config.dbName}`);
    console.log(`Time-series metrics: ${timeSeriesResult.insertedCount} documents`);
    console.log(`Aggregated metrics: ${aggregatedResult.insertedCount} documents`);
    console.log(`Current metrics: 1 document`);
    console.log(`Sales data: ${totalInserted} documents`);
    console.log('='.repeat(60));
    
    // Sample query to verify data
    console.log('\nSample current metrics:');
    const sampleMetrics = await db.collection(config.collections.metrics)
      .findOne({ period: 'current' });
    console.log(JSON.stringify(sampleMetrics, null, 2));
    
    console.log('\n✓ All data inserted successfully!');
    console.log('\nYou can now use this data in your application.');
    console.log('The metrics will be available through the API endpoints.');
    
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed.');
  }
}

// Run the script
insertRealtimeMetrics()
  .then(() => {
    console.log('\n✓ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });

export {
  generateMetricsTimeSeries,
  generateAggregatedMetrics,
  generateCurrentMetrics,
  generateSalesData
};
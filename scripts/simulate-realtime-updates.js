// scripts/simulate-realtime-updates.js
// Simulates continuous real-time metrics updates in MongoDB
// Run: node scripts/simulate-realtime-updates.js
// Press Ctrl+C to stop

import { MongoClient } from 'mongodb';

// Configuration
const config = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: 'trendai',
  updateInterval: 5000, // Update every 5 seconds
  collection: 'metrics'
};

// Helper functions
function randomFloatInRange(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate realistic metrics with gradual changes
class MetricsSimulator {
  constructor() {
    // Base values that will change gradually
    this.baseRevenue = 150000;
    this.baseOrders = 1200;
    this.baseConversionRate = 3.5;
    this.trend = 1; // 1 for upward, -1 for downward
    this.trendCounter = 0;
  }
  
  generateMetrics() {
    // Change trend occasionally
    this.trendCounter++;
    if (this.trendCounter > 20) {
      this.trend *= -1;
      this.trendCounter = 0;
    }
    
    // Apply gradual trend
    const trendFactor = this.trend * randomFloatInRange(0.001, 0.003);
    this.baseRevenue *= (1 + trendFactor);
    this.baseOrders *= (1 + trendFactor);
    this.baseConversionRate *= (1 + randomFloatInRange(-0.002, 0.002));
    
    // Add time-of-day variance
    const hour = new Date().getHours();
    const hourMultiplier = (hour >= 10 && hour <= 14) || (hour >= 18 && hour <= 21) 
      ? randomFloatInRange(1.1, 1.3) 
      : randomFloatInRange(0.8, 1.0);
    
    // Calculate final metrics
    const totalRevenue = Math.round(this.baseRevenue * hourMultiplier * randomFloatInRange(0.98, 1.02));
    const totalOrders = Math.round(this.baseOrders * hourMultiplier * randomFloatInRange(0.98, 1.02));
    const avgOrderValue = totalRevenue / totalOrders;
    const conversionRate = this.baseConversionRate * randomFloatInRange(0.95, 1.05);
    const totalQuantity = Math.round(totalOrders * randomFloatInRange(1.5, 3.0));
    
    return {
      period: 'current',
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      totalQuantity,
      conversionRate: Math.round(conversionRate * 100) / 100,
      timestamp: new Date(),
      isLive: true,
      metadata: {
        trend: this.trend > 0 ? 'up' : 'down',
        hourMultiplier: Math.round(hourMultiplier * 100) / 100
      }
    };
  }
}

// Main simulation function
async function startRealtimeSimulation() {
  const client = new MongoClient(config.uri);
  const simulator = new MetricsSimulator();
  let updateCount = 0;
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✓ Connected successfully!');
    console.log(`Database: ${config.dbName}`);
    console.log(`Collection: ${config.collection}`);
    console.log(`Update interval: ${config.updateInterval}ms`);
    console.log('\nStarting real-time simulation...');
    console.log('Press Ctrl+C to stop\n');
    console.log('='.repeat(80));
    
    const db = client.db(config.dbName);
    const collection = db.collection(config.collection);
    
    // Update function
    const updateMetrics = async () => {
      try {
        const metrics = simulator.generateMetrics();
        
        // Update or insert current metrics
        await collection.updateOne(
          { period: 'current', isLive: true },
          { $set: metrics },
          { upsert: true }
        );
        
        // Also insert as historical record
        await collection.insertOne({
          ...metrics,
          period: '1h',
          isLive: false
        });
        
        updateCount++;
        
        // Display update
        const timestamp = new Date().toLocaleTimeString();
        const trend = metrics.metadata.trend === 'up' ? '↑' : '↓';
        console.log(`[${timestamp}] Update #${updateCount} ${trend}`);
        console.log(`  Revenue: $${metrics.totalRevenue.toLocaleString()}`);
        console.log(`  Orders: ${metrics.totalOrders.toLocaleString()}`);
        console.log(`  Avg Order: $${metrics.avgOrderValue.toFixed(2)}`);
        console.log(`  Conversion: ${metrics.conversionRate.toFixed(2)}%`);
        console.log('-'.repeat(80));
        
      } catch (error) {
        console.error('Error updating metrics:', error.message);
      }
    };
    
    // Initial update
    await updateMetrics();
    
    // Set up interval for continuous updates
    const intervalId = setInterval(updateMetrics, config.updateInterval);
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\nStopping simulation...');
      clearInterval(intervalId);
      await client.close();
      console.log(`✓ Simulation stopped after ${updateCount} updates`);
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error in simulation:', error);
    await client.close();
    process.exit(1);
  }
}

// Run the simulation
startRealtimeSimulation().catch((error) => {
  console.error('Failed to start simulation:', error);
  process.exit(1);
});

export { startRealtimeSimulation };
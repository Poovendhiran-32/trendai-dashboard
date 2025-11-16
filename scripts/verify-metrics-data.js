// scripts/verify-metrics-data.js
// Verifies metrics data in MongoDB
// Run: node scripts/verify-metrics-data.js

import { MongoClient } from 'mongodb';

const config = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: 'trendai'
};

async function verifyMetricsData() {
  const client = new MongoClient(config.uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✓ Connected successfully!\n');
    
    const db = client.db(config.dbName);
    
    // Check metrics collection
    console.log('='.repeat(80));
    console.log('METRICS COLLECTION VERIFICATION');
    console.log('='.repeat(80));
    
    const metricsCollection = db.collection('metrics');
    const totalMetrics = await metricsCollection.countDocuments();
    console.log(`\nTotal metrics documents: ${totalMetrics}`);
    
    if (totalMetrics === 0) {
      console.log('\n⚠️  No metrics data found!');
      console.log('Run one of these scripts to generate data:');
      console.log('  - node scripts/generate-realtime-metrics.js (comprehensive)');
      console.log('  - node sample-metrics-insert.js (quick sample)');
      return;
    }
    
    // Count by period
    console.log('\nMetrics by period:');
    const periods = await metricsCollection.aggregate([
      { $group: { _id: '$period', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    periods.forEach(p => {
      console.log(`  ${p._id}: ${p.count} documents`);
    });
    
    // Get current metrics
    console.log('\nCurrent/Live metrics:');
    const currentMetrics = await metricsCollection.findOne(
      { period: 'current', isLive: true },
      { sort: { timestamp: -1 } }
    );
    
    if (currentMetrics) {
      console.log(`  Revenue: $${currentMetrics.totalRevenue.toLocaleString()}`);
      console.log(`  Orders: ${currentMetrics.totalOrders.toLocaleString()}`);
      console.log(`  Avg Order Value: $${currentMetrics.avgOrderValue.toFixed(2)}`);
      console.log(`  Conversion Rate: ${currentMetrics.conversionRate.toFixed(2)}%`);
      console.log(`  Last Updated: ${new Date(currentMetrics.timestamp).toLocaleString()}`);
    } else {
      console.log('  ⚠️  No current metrics found');
    }
    
    // Get latest time-series metrics
    console.log('\nLatest time-series metrics (last 5):');
    const latestMetrics = await metricsCollection
      .find({ period: '1h' })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();
    
    if (latestMetrics.length > 0) {
      latestMetrics.forEach((m, i) => {
        const time = new Date(m.timestamp).toLocaleString();
        console.log(`  ${i + 1}. ${time} - $${m.totalRevenue.toLocaleString()} (${m.totalOrders} orders)`);
      });
    } else {
      console.log('  ⚠️  No time-series metrics found');
    }
    
    // Date range
    console.log('\nData date range:');
    const oldest = await metricsCollection.findOne({}, { sort: { timestamp: 1 } });
    const newest = await metricsCollection.findOne({}, { sort: { timestamp: -1 } });
    
    if (oldest && newest) {
      console.log(`  Oldest: ${new Date(oldest.timestamp).toLocaleString()}`);
      console.log(`  Newest: ${new Date(newest.timestamp).toLocaleString()}`);
      const daysDiff = Math.ceil((newest.timestamp - oldest.timestamp) / (1000 * 60 * 60 * 24));
      console.log(`  Span: ${daysDiff} days`);
    }
    
    // Check sales collection
    console.log('\n' + '='.repeat(80));
    console.log('SALES COLLECTION VERIFICATION');
    console.log('='.repeat(80));
    
    const salesCollection = db.collection('sales');
    const totalSales = await salesCollection.countDocuments();
    console.log(`\nTotal sales documents: ${totalSales}`);
    
    if (totalSales > 0) {
      // Sales by channel
      console.log('\nSales by channel:');
      const channels = await salesCollection.aggregate([
        { $group: { _id: '$channel', count: { $sum: 1 }, totalRevenue: { $sum: '$revenue' } } },
        { $sort: { totalRevenue: -1 } }
      ]).toArray();
      
      channels.forEach(c => {
        console.log(`  ${c._id}: ${c.count} sales, $${c.totalRevenue.toFixed(2)} revenue`);
      });
      
      // Sales by region
      console.log('\nSales by region:');
      const regions = await salesCollection.aggregate([
        { $group: { _id: '$region', count: { $sum: 1 }, totalRevenue: { $sum: '$revenue' } } },
        { $sort: { totalRevenue: -1 } }
      ]).toArray();
      
      regions.forEach(r => {
        console.log(`  ${r._id}: ${r.count} sales, $${r.totalRevenue.toFixed(2)} revenue`);
      });
      
      // Recent sales
      console.log('\nRecent sales (last 5):');
      const recentSales = await salesCollection
        .find({})
        .sort({ date: -1 })
        .limit(5)
        .toArray();
      
      recentSales.forEach((s, i) => {
        const date = new Date(s.date).toLocaleString();
        console.log(`  ${i + 1}. ${date} - ${s.productId} - $${s.revenue.toFixed(2)} (${s.channel})`);
      });
    } else {
      console.log('\n⚠️  No sales data found');
      console.log('Run: node scripts/generate-realtime-metrics.js');
    }
    
    // Check indexes
    console.log('\n' + '='.repeat(80));
    console.log('INDEXES');
    console.log('='.repeat(80));
    
    console.log('\nMetrics collection indexes:');
    const metricsIndexes = await metricsCollection.indexes();
    metricsIndexes.forEach(idx => {
      const keys = Object.keys(idx.key).join(', ');
      console.log(`  - ${idx.name}: ${keys}`);
    });
    
    if (totalSales > 0) {
      console.log('\nSales collection indexes:');
      const salesIndexes = await salesCollection.indexes();
      salesIndexes.forEach(idx => {
        const keys = Object.keys(idx.key).join(', ');
        console.log(`  - ${idx.name}: ${keys}`);
      });
    }
    
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`✓ Database: ${config.dbName}`);
    console.log(`✓ Metrics documents: ${totalMetrics}`);
    console.log(`✓ Sales documents: ${totalSales}`);
    console.log(`✓ Data is ${totalMetrics > 0 ? 'READY' : 'NOT READY'}`);
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    throw error;
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed.');
  }
}

// Run the verification
verifyMetricsData()
  .then(() => {
    console.log('\n✓ Verification complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Verification failed:', error);
    process.exit(1);
  });

export { verifyMetricsData };
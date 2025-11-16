import { MongoClient } from 'mongodb';
import DatabaseService from '../lib/database/database-service.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai';

async function testIntegration() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    // Test database service methods
    console.log('\n🧪 Testing Database Service Methods...');
    
    // Test products
    console.log('\n📦 Testing Products...');
    const products = await DatabaseService.getProducts({ limit: 5 });
    console.log(`Found ${products.products.length} products (total: ${products.total})`);
    
    // Test sales
    console.log('\n💰 Testing Sales...');
    const sales = await DatabaseService.getSales({ limit: 10 });
    console.log(`Found ${sales.sales.length} sales records (total: ${sales.total})`);
    
    // Test metrics
    console.log('\n📊 Testing Metrics...');
    const metrics = await DatabaseService.getMetrics(24);
    console.log('Metrics:', {
      total_revenue: metrics.total_revenue,
      total_orders: metrics.total_orders,
      avg_order_value: metrics.avg_order_value
    });
    
    // Test dashboard-specific methods
    console.log('\n🎯 Testing Dashboard Methods...');
    
    const metricsOverview = await DatabaseService.getMetricsOverview();
    console.log('Metrics Overview:', metricsOverview);
    
    const productPerformance = await DatabaseService.getProductPerformanceData(5);
    console.log(`Product Performance: ${productPerformance.length} products`);
    
    const categoryPerformance = await DatabaseService.getCategoryPerformance();
    console.log(`Category Performance: ${categoryPerformance.length} categories`);
    
    const seasonalTrends = await DatabaseService.getSeasonalTrendsData();
    console.log(`Seasonal Trends: ${seasonalTrends.length} months`);
    
    const externalSignals = await DatabaseService.getExternalSignalsData();
    console.log(`External Signals: ${externalSignals.length} signals`);
    
    const actionableInsights = await DatabaseService.getActionableInsights();
    console.log(`Actionable Insights: ${actionableInsights.length} insights`);
    
    console.log('\n✅ All tests passed! Integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  } finally {
    await client.close();
  }
}

// Run the test
testIntegration().catch(console.error);

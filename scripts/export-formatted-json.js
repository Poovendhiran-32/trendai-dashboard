import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai';
const OUTPUT_DIR = './json-exports';

async function exportFormattedJSON() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
    }
    
    // Export Products with better formatting
    console.log('\n🔄 Exporting Products...');
    const products = await db.collection('products').find({}).toArray();
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      currentStock: product.currentStock,
      reorderPoint: product.reorderPoint,
      supplier: product.supplier,
      seasonality: product.seasonality,
      trendScore: product.trendScore,
      salesVelocity: product.salesVelocity,
      predictedDemand: product.predictedDemand,
      forecastAccuracy: product.forecastAccuracy,
      riskLevel: product.riskLevel,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'products.json'), 
      JSON.stringify(formattedProducts, null, 2)
    );
    console.log(`   ✅ Exported ${formattedProducts.length} products`);
    
    // Export Sales with better formatting
    console.log('\n🔄 Exporting Sales...');
    const sales = await db.collection('sales').find({}).toArray();
    const formattedSales = sales.map(sale => ({
      productId: sale.productId,
      quantity: sale.quantity,
      revenue: sale.revenue,
      channel: sale.channel,
      region: sale.region,
      date: sale.date,
      userId: sale.userId,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt
    }));
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'sales.json'), 
      JSON.stringify(formattedSales, null, 2)
    );
    console.log(`   ✅ Exported ${formattedSales.length} sales records`);
    
    // Export Users (if any)
    console.log('\n🔄 Exporting Users...');
    const users = await db.collection('users').find({}).toArray();
    if (users.length > 0) {
      const formattedUsers = users.map(user => ({
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        industry: user.industry,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
      
      fs.writeFileSync(
        path.join(OUTPUT_DIR, 'users.json'), 
        JSON.stringify(formattedUsers, null, 2)
      );
      console.log(`   ✅ Exported ${formattedUsers.length} users`);
    } else {
      console.log(`   ℹ️  No users found`);
    }
    
    // Export Alerts (if any)
    console.log('\n🔄 Exporting Alerts...');
    const alerts = await db.collection('alerts').find({}).toArray();
    if (alerts.length > 0) {
      const formattedAlerts = alerts.map(alert => ({
        type: alert.type,
        priority: alert.priority,
        title: alert.title,
        message: alert.message,
        productId: alert.productId,
        isRead: alert.isRead,
        isResolved: alert.isResolved,
        createdAt: alert.createdAt,
        updatedAt: alert.updatedAt
      }));
      
      fs.writeFileSync(
        path.join(OUTPUT_DIR, 'alerts.json'), 
        JSON.stringify(formattedAlerts, null, 2)
      );
      console.log(`   ✅ Exported ${formattedAlerts.length} alerts`);
    } else {
      console.log(`   ℹ️  No alerts found`);
    }
    
    // Export Metrics (if any)
    console.log('\n🔄 Exporting Metrics...');
    const metrics = await db.collection('metrics').find({}).toArray();
    if (metrics.length > 0) {
      const formattedMetrics = metrics.map(metric => ({
        period: metric.period,
        totalRevenue: metric.totalRevenue,
        totalOrders: metric.totalOrders,
        avgOrderValue: metric.avgOrderValue,
        totalQuantity: metric.totalQuantity,
        conversionRate: metric.conversionRate,
        timestamp: metric.timestamp,
        createdAt: metric.createdAt,
        updatedAt: metric.updatedAt
      }));
      
      fs.writeFileSync(
        path.join(OUTPUT_DIR, 'metrics.json'), 
        JSON.stringify(formattedMetrics, null, 2)
      );
      console.log(`   ✅ Exported ${formattedMetrics.length} metrics`);
    } else {
      console.log(`   ℹ️  No metrics found`);
    }
    
    // Create a data summary
    const summary = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        database: db.databaseName,
        totalCollections: 5
      },
      dataSummary: {
        products: {
          count: formattedProducts.length,
          categories: [...new Set(formattedProducts.map(p => p.category))],
          priceRange: {
            min: Math.min(...formattedProducts.map(p => p.price)),
            max: Math.max(...formattedProducts.map(p => p.price)),
            average: formattedProducts.reduce((sum, p) => sum + p.price, 0) / formattedProducts.length
          }
        },
        sales: {
          count: formattedSales.length,
          totalRevenue: formattedSales.reduce((sum, s) => sum + s.revenue, 0),
          channels: [...new Set(formattedSales.map(s => s.channel))],
          regions: [...new Set(formattedSales.map(s => s.region))],
          dateRange: {
            earliest: new Date(Math.min(...formattedSales.map(s => new Date(s.date)))),
            latest: new Date(Math.max(...formattedSales.map(s => new Date(s.date))))
          }
        }
      }
    };
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'data-summary.json'), 
      JSON.stringify(summary, null, 2)
    );
    
    console.log('\n🎉 Formatted JSON export completed!');
    console.log(`📁 All files saved to: ${OUTPUT_DIR}`);
    console.log('\n📋 Files created:');
    console.log('   - products.json (formatted product data)');
    console.log('   - sales.json (formatted sales data)');
    console.log('   - users.json (if users exist)');
    console.log('   - alerts.json (if alerts exist)');
    console.log('   - metrics.json (if metrics exist)');
    console.log('   - data-summary.json (export summary)');
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  } finally {
    await client.close();
  }
}

exportFormattedJSON().catch(console.error);

// Simple data seeding script
import DatabaseService from '../lib/database/database-service.js';

async function seedData() {
  try {
    console.log('🌱 Starting simple data seeding...');
    
    // Create some sample products
    const sampleProducts = [
      {
        id: "ELEC001",
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 89.99,
        currentStock: 245,
        reorderPoint: 50,
        supplier: "TechCorp",
        seasonality: "high",
        trendScore: 8.5,
        salesVelocity: 85,
        predictedDemand: 2550,
        forecastAccuracy: 92,
        riskLevel: "low"
      },
      {
        id: "ELEC002", 
        name: "Smart Fitness Tracker",
        category: "Electronics",
        price: 129.99,
        currentStock: 180,
        reorderPoint: 40,
        supplier: "FitTech",
        seasonality: "medium",
        trendScore: 9.2,
        salesVelocity: 92,
        predictedDemand: 2760,
        forecastAccuracy: 88,
        riskLevel: "low"
      },
      {
        id: "ELEC003",
        name: "4K Webcam",
        category: "Electronics", 
        price: 199.99,
        currentStock: 95,
        reorderPoint: 25,
        supplier: "VisionTech",
        seasonality: "low",
        trendScore: 7.8,
        salesVelocity: 78,
        predictedDemand: 2340,
        forecastAccuracy: 85,
        riskLevel: "medium"
      }
    ];

    // Create some sample sales
    const sampleSales = [
      {
        productId: "ELEC001",
        quantity: 5,
        revenue: 449.95,
        channel: "online",
        region: "North America",
        date: new Date()
      },
      {
        productId: "ELEC002",
        quantity: 3,
        revenue: 389.97,
        channel: "retail", 
        region: "Europe",
        date: new Date()
      },
      {
        productId: "ELEC003",
        quantity: 2,
        revenue: 399.98,
        channel: "wholesale",
        region: "Asia Pacific",
        date: new Date()
      }
    ];

    // Seed products
    console.log('📦 Seeding products...');
    for (const product of sampleProducts) {
      try {
        await DatabaseService.createProduct(product);
        console.log(`✅ Created product: ${product.name}`);
      } catch (error) {
        console.log(`⚠️ Product ${product.name} might already exist`);
      }
    }

    // Seed sales
    console.log('💰 Seeding sales...');
    for (const sale of sampleSales) {
      try {
        await DatabaseService.createSale(sale);
        console.log(`✅ Created sale: ${sale.productId}`);
      } catch (error) {
        console.log(`⚠️ Sale for ${sale.productId} might already exist`);
      }
    }

    console.log('✅ Data seeding completed!');
    
    // Test the data
    const products = await DatabaseService.getProducts({ limit: 5 });
    const sales = await DatabaseService.getSales({ limit: 5 });
    const metrics = await DatabaseService.getMetrics(24);
    
    console.log('\n📊 Seeded data summary:');
    console.log(`- Products: ${products.total}`);
    console.log(`- Sales: ${sales.total}`);
    console.log(`- Revenue: $${metrics.total_revenue}`);
    console.log(`- Orders: ${metrics.total_orders}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedData();

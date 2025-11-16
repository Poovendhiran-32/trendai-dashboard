import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai';
const DB_NAME = 'trendai';

// Fetch real product data from Fake Store API
async function fetchRealProducts() {
  try {
    console.log('🌐 Fetching real product data from Fake Store API...');
    
    const response = await fetch('https://fakestoreapi.com/products?limit=100');
    const products = await response.json();
    
    console.log(`✅ Fetched ${products.length} real products`);
    
    return products.map((product, index) => ({
      id: `REAL${(index + 1).toString().padStart(3, '0')}`,
      name: product.title,
      category: product.category,
      price: product.price,
      currentStock: Math.floor(Math.random() * 500 + 50),
      reorderPoint: Math.floor(Math.random() * 50 + 10),
      supplier: 'Real Supplier',
      seasonality: Math.random() > 0.5 ? 'medium' : 'high',
      trendScore: parseFloat((Math.random() * 4 + 6).toFixed(1)),
      salesVelocity: parseFloat((Math.random() * 20 + 5).toFixed(2)),
      predictedDemand: Math.floor(Math.random() * 1000 + 100),
      forecastAccuracy: parseFloat((Math.random() * 20 + 75).toFixed(1)),
      riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      description: product.description,
      image: product.image,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
  } catch (error) {
    console.error('❌ Error fetching real products:', error);
    return [];
  }
}

// Generate sales data for real products
function generateSalesForProducts(productIds, count = 10000) {
  const channels = ['online', 'retail', 'wholesale'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];
  
  return Array.from({ length: count }, () => {
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    const quantity = Math.floor(Math.random() * 50 + 1);
    const basePrice = Math.random() * 200 + 10;
    const revenue = quantity * basePrice;
    
    return {
      productId,
      quantity,
      revenue: parseFloat(revenue.toFixed(2)),
      channel: channels[Math.floor(Math.random() * channels.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
}

async function importRealData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Fetch real products
    const realProducts = await fetchRealProducts();
    
    if (realProducts.length === 0) {
      console.log('❌ No real products fetched, skipping import');
      return;
    }
    
    // Insert real products
    const productResult = await db.collection('products').insertMany(realProducts);
    console.log(`✅ Inserted ${productResult.insertedCount} real products`);
    
    // Generate sales data for real products
    const productIds = realProducts.map(p => p.id);
    const salesData = generateSalesForProducts(productIds, 15000);
    
    // Insert sales data
    const salesResult = await db.collection('sales').insertMany(salesData);
    console.log(`✅ Inserted ${salesResult.insertedCount} sales records for real products`);
    
    // Show final stats
    const totalProducts = await db.collection('products').countDocuments();
    const totalSales = await db.collection('sales').countDocuments();
    
    console.log('\n🎉 Real data import completed!');
    console.log(`📦 Total Products: ${totalProducts}`);
    console.log(`💰 Total Sales: ${totalSales}`);
    
  } catch (error) {
    console.error('❌ Error importing real data:', error);
  } finally {
    await client.close();
  }
}

// Run the import
importRealData().catch(console.error);

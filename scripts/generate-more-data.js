import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai';
const DB_NAME = 'trendai';

// Generate more realistic product data
function generateProducts(count = 1000) {
  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Health & Beauty', 'Sports & Outdoors',
    'Books', 'Toys', 'Automotive', 'Pet Supplies', 'Office Supplies',
    'Food & Beverage', 'Jewelry', 'Art & Crafts', 'Musical Instruments', 'Baby & Kids'
  ];
  
  const brands = [
    'TechCorp', 'StyleCo', 'SmartHome', 'HealthFirst', 'OutdoorGear',
    'BookWorld', 'ToyLand', 'AutoParts', 'PetCare', 'OfficeMax',
    'FreshFood', 'LuxuryJewels', 'CreativeArts', 'MusicPro', 'BabyCare'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `PROD${(i + 501).toString().padStart(3, '0')}`,
    name: faker.commerce.productName(),
    category: faker.helpers.arrayElement(categories),
    price: parseFloat(faker.commerce.price({ min: 10, max: 2000, dec: 2 })),
    currentStock: faker.number.int({ min: 0, max: 1000 }),
    reorderPoint: faker.number.int({ min: 10, max: 100 }),
    supplier: faker.helpers.arrayElement(brands),
    seasonality: faker.helpers.arrayElement(['low', 'medium', 'high']),
    trendScore: parseFloat(faker.number.float({ min: 1, max: 10, fractionDigits: 1 })),
    salesVelocity: faker.number.float({ min: 0, max: 50, fractionDigits: 2 }),
    predictedDemand: faker.number.int({ min: 100, max: 5000 }),
    forecastAccuracy: faker.number.float({ min: 70, max: 95, fractionDigits: 1 }),
    riskLevel: faker.helpers.arrayElement(['low', 'medium', 'high']),
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: new Date()
  }));
}

// Generate more realistic sales data
function generateSales(count = 50000, productIds) {
  const channels = ['online', 'retail', 'wholesale', 'mobile', 'marketplace'];
  const regions = [
    'North America', 'Europe', 'Asia Pacific', 'Latin America', 
    'Middle East & Africa', 'Australia', 'Canada', 'Mexico'
  ];

  return Array.from({ length: count }, () => {
    const productId = faker.helpers.arrayElement(productIds);
    const quantity = faker.number.int({ min: 1, max: 100 });
    const basePrice = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
    const revenue = quantity * basePrice;

    return {
      productId,
      quantity,
      revenue: parseFloat(revenue.toFixed(2)),
      channel: faker.helpers.arrayElement(channels),
      region: faker.helpers.arrayElement(regions),
      date: faker.date.between({ 
        from: new Date('2023-01-01'), 
        to: new Date() 
      }),
      userId: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
}

async function generateMoreData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Get existing product IDs
    const existingProducts = await db.collection('products').find({}).toArray();
    const existingProductIds = existingProducts.map(p => p.id);
    
    console.log(`📦 Found ${existingProducts.length} existing products`);
    
    // Generate more products
    const newProducts = generateProducts(1000);
    console.log(`🆕 Generated ${newProducts.length} new products`);
    
    // Insert new products
    const productResult = await db.collection('products').insertMany(newProducts);
    console.log(`✅ Inserted ${productResult.insertedCount} new products`);
    
    // Get all product IDs (existing + new)
    const allProducts = await db.collection('products').find({}).toArray();
    const allProductIds = allProducts.map(p => p.id);
    
    // Generate more sales data
    const newSales = generateSales(50000, allProductIds);
    console.log(`🆕 Generated ${newSales.length} new sales records`);
    
    // Insert new sales
    const salesResult = await db.collection('sales').insertMany(newSales);
    console.log(`✅ Inserted ${salesResult.insertedCount} new sales records`);
    
    // Update indexes
    await db.collection('products').createIndex({ id: 1 }, { unique: true });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ trendScore: -1 });
    await db.collection('sales').createIndex({ productId: 1 });
    await db.collection('sales').createIndex({ date: -1 });
    await db.collection('sales').createIndex({ region: 1 });
    await db.collection('sales').createIndex({ channel: 1 });
    
    console.log('📊 Updated database indexes');
    
    // Show final stats
    const finalProductCount = await db.collection('products').countDocuments();
    const finalSalesCount = await db.collection('sales').countDocuments();
    
    console.log('\n🎉 Data generation completed!');
    console.log(`📦 Total Products: ${finalProductCount}`);
    console.log(`💰 Total Sales: ${finalSalesCount}`);
    
  } catch (error) {
    console.error('❌ Error generating data:', error);
  } finally {
    await client.close();
  }
}

// Run the data generation
generateMoreData().catch(console.error);

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai';

console.log('🔗 MongoDB Connection Information:');
console.log('================================');
console.log(`Connection String: ${MONGODB_URI}`);
console.log(`Database Name: ${MONGODB_URI.split('/').pop()}`);
console.log(`Host: ${MONGODB_URI.split('//')[1].split('/')[0]}`);
console.log('');

console.log('📋 MongoDB Compass Connection Steps:');
console.log('===================================');
console.log('1. Open MongoDB Compass');
console.log('2. Click "New Connection"');
console.log('3. Enter connection string: mongodb://localhost:27017');
console.log('4. Click "Connect"');
console.log('5. Select database: "trendai"');
console.log('6. Click on collections: "products" and "sales"');
console.log('');

console.log('🎯 Expected Data:');
console.log('================');
console.log('- products collection: 500 documents');
console.log('- sales collection: 10,100 documents');
console.log('- Database size: ~1.24 MB');
console.log('');

// Test connection and show sample data
async function showSampleData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connection successful!');
    
    const db = client.db();
    const dbName = db.databaseName;
    
    console.log(`\n📊 Database: ${dbName}`);
    
    // Show products count
    const productCount = await db.collection('products').countDocuments();
    console.log(`📦 Products: ${productCount} documents`);
    
    // Show sales count  
    const salesCount = await db.collection('sales').countDocuments();
    console.log(`💰 Sales: ${salesCount} documents`);
    
    // Show sample product
    const sampleProduct = await db.collection('products').findOne({});
    if (sampleProduct) {
      console.log(`\n🔍 Sample Product:`);
      console.log(`   ID: ${sampleProduct.id}`);
      console.log(`   Name: ${sampleProduct.name}`);
      console.log(`   Category: ${sampleProduct.category}`);
      console.log(`   Price: $${sampleProduct.price}`);
    }
    
    // Show sample sale
    const sampleSale = await db.collection('sales').findOne({});
    if (sampleSale) {
      console.log(`\n🔍 Sample Sale:`);
      console.log(`   Product ID: ${sampleSale.productId}`);
      console.log(`   Revenue: $${sampleSale.revenue}`);
      console.log(`   Date: ${sampleSale.date}`);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await client.close();
  }
}

showSampleData().catch(console.error);

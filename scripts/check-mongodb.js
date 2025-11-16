import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai';

async function checkMongoDB() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    
    console.log('\n📊 Available Databases:');
    databases.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Check the specific database we're using
    const dbName = MONGODB_URI.split('/').pop() || 'trendai';
    const db = client.db(dbName);
    
    console.log(`\n🎯 Checking database: ${dbName}`);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Collections in database:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check products collection
    if (collections.find(c => c.name === 'products')) {
      const productCount = await db.collection('products').countDocuments();
      console.log(`\n📦 Products collection: ${productCount} documents`);
      
      // Show first few products
      const sampleProducts = await db.collection('products').find({}).limit(3).toArray();
      console.log('\n🔍 Sample products:');
      sampleProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} (${product.category}) - $${product.price}`);
      });
    }
    
    // Check sales collection
    if (collections.find(c => c.name === 'sales')) {
      const salesCount = await db.collection('sales').countDocuments();
      console.log(`\n💰 Sales collection: ${salesCount} documents`);
      
      // Show first few sales
      const sampleSales = await db.collection('sales').find({}).limit(3).toArray();
      console.log('\n🔍 Sample sales:');
      sampleSales.forEach((sale, index) => {
        console.log(`  ${index + 1}. ${sale.productId} - $${sale.revenue} (${sale.date})`);
      });
    }
    
    // Check if there are other databases with similar names
    console.log('\n🔍 Checking for similar database names...');
    const similarDbs = databases.databases.filter(db => 
      db.name.includes('trend') || db.name.includes('ai') || db.name.includes('dashboard')
    );
    
    if (similarDbs.length > 0) {
      console.log('Found similar databases:');
      similarDbs.forEach(db => {
        console.log(`  - ${db.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking MongoDB:', error);
  } finally {
    await client.close();
  }
}

checkMongoDB().catch(console.error);

import { MongoClient } from 'mongodb';
import { products, salesData } from '../lib/data/dataset.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai';
const DB_NAME = 'trendai';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Clear existing data
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
    console.log('Cleared existing data');
    
    // Insert products
    const productDocuments = products.map(product => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    const productResult = await db.collection('products').insertMany(productDocuments);
    console.log(`Inserted ${productResult.insertedCount} products`);
    
    // Insert sales data
    const salesDocuments = salesData.map(sale => ({
      ...sale,
      date: new Date(sale.date),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    const salesResult = await db.collection('sales').insertMany(salesDocuments);
    console.log(`Inserted ${salesResult.insertedCount} sales records`);
    
    // Create indexes for better performance
    await db.collection('products').createIndex({ id: 1 }, { unique: true });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ trendScore: -1 });
    await db.collection('sales').createIndex({ productId: 1 });
    await db.collection('sales').createIndex({ date: -1 });
    await db.collection('sales').createIndex({ region: 1 });
    await db.collection('sales').createIndex({ channel: 1 });
    
    console.log('Created database indexes');
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seeding function
seedDatabase().catch(console.error);

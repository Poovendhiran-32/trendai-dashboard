// Database seeding script
import DatabaseService from '../lib/database/database-service.js';
import { products, salesData } from '../lib/data/dataset.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if we have a database connection
    const connection = await import('../lib/database/connection.js').then(m => m.default());
    
    if (!connection) {
      console.log('⚠️ No database connection available. Using mock data.');
      return;
    }
    
    // Seed products
    console.log('📦 Seeding products...');
    await DatabaseService.migrateProducts(products);
    
    // Seed sales data
    console.log('💰 Seeding sales data...');
    await DatabaseService.migrateSales(salesData);
    
    console.log('✅ Database seeding completed!');
    
    // Verify the data
    const productCount = await DatabaseService.getProducts({ limit: 1 });
    const salesCount = await DatabaseService.getSales({ limit: 1 });
    
    console.log(`📊 Seeded data:`);
    console.log(`- Products: ${productCount.total}`);
    console.log(`- Sales: ${salesCount.total}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;

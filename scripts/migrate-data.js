import DatabaseService from '../lib/database/database-service.js';
import { products, salesData } from '../lib/data/dataset.js';

async function migrateData() {
  try {
    console.log('🚀 Starting data migration...');
    
    // Migrate products
    console.log('📦 Migrating products...');
    await DatabaseService.migrateProducts(products);
    
    // Migrate sales data
    console.log('💰 Migrating sales data...');
    await DatabaseService.migrateSales(salesData);
    
    console.log('✅ Data migration completed successfully!');
    
    // Test the migration
    console.log('🧪 Testing migration...');
    const testProducts = await DatabaseService.getProducts({ limit: 5 });
    const testSales = await DatabaseService.getSales({ limit: 5 });
    const testMetrics = await DatabaseService.getMetrics(24);
    
    console.log('📊 Migration test results:');
    console.log(`- Products: ${testProducts.total} total`);
    console.log(`- Sales: ${testSales.total} total`);
    console.log(`- Metrics: $${testMetrics.total_revenue} revenue`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
}

export default migrateData;

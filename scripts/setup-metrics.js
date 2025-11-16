// scripts/setup-metrics.js
// Interactive setup wizard for metrics data
// Run: node scripts/setup-metrics.js

import { MongoClient } from 'mongodb';
import readline from 'readline';
import { spawn } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const config = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: 'trendai'
};

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function checkMongoDBConnection() {
  const client = new MongoClient(config.uri);
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    await client.close();
    return true;
  } catch (error) {
    return false;
  }
}

async function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const scriptFullPath = scriptPath.startsWith('../') 
      ? scriptPath 
      : `scripts/${scriptPath}`;
    
    const child = spawn('node', [scriptFullPath], {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script exited with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runSetup() {
  console.log('\n' + '='.repeat(80));
  console.log('TRENDAI METRICS DATA SETUP WIZARD');
  console.log('='.repeat(80));
  console.log('\nThis wizard will help you set up real-time metrics data for your application.\n');
  
  // Step 1: Check MongoDB connection
  console.log('Step 1: Checking MongoDB connection...');
  const isConnected = await checkMongoDBConnection();
  
  if (!isConnected) {
    console.log('✗ Cannot connect to MongoDB!');
    console.log('\nPlease ensure MongoDB is running:');
    console.log('  Windows: net start MongoDB');
    console.log('  Or check your MONGODB_URI in .env.local\n');
    console.log(`Current URI: ${config.uri}`);
    rl.close();
    process.exit(1);
  }
  
  console.log('✓ MongoDB connection successful!\n');
  
  // Step 2: Check existing data
  console.log('Step 2: Checking existing data...');
  const client = new MongoClient(config.uri);
  await client.connect();
  const db = client.db(config.dbName);
  const metricsCount = await db.collection('metrics').countDocuments();
  const salesCount = await db.collection('sales').countDocuments();
  await client.close();
  
  console.log(`  Metrics documents: ${metricsCount}`);
  console.log(`  Sales documents: ${salesCount}\n`);
  
  // Step 3: Ask user what to do
  console.log('Step 3: Choose setup option\n');
  console.log('What would you like to do?');
  console.log('  1. Generate comprehensive data (7 days metrics + 30 days sales) [Recommended]');
  console.log('  2. Generate quick sample data (just a few records for testing)');
  console.log('  3. Clear all existing data and regenerate');
  console.log('  4. Exit without changes\n');
  
  const choice = await question('Enter your choice (1-4): ');
  
  switch (choice.trim()) {
    case '1':
      console.log('\n✓ Generating comprehensive data...');
      console.log('This may take a minute...\n');
      await runScript('generate-realtime-metrics.js');
      break;
      
    case '2':
      console.log('\n✓ Generating quick sample data...\n');
      await runScript('../sample-metrics-insert.js');
      break;
      
    case '3':
      console.log('\n⚠️  WARNING: This will delete all existing metrics and sales data!');
      const confirm = await question('Are you sure? (yes/no): ');
      if (confirm.toLowerCase() === 'yes') {
        console.log('\n✓ Clearing data and regenerating...\n');
        await runScript('generate-realtime-metrics.js');
      } else {
        console.log('\n✓ Cancelled. No changes made.');
      }
      break;
      
    case '4':
      console.log('\n✓ Exiting without changes.');
      rl.close();
      process.exit(0);
      break;
      
    default:
      console.log('\n✗ Invalid choice. Exiting.');
      rl.close();
      process.exit(1);
  }
  
  // Step 4: Verify data
  console.log('\nStep 4: Verifying data...\n');
  await runScript('verify-metrics-data.js');
  
  // Step 5: Next steps
  console.log('\n' + '='.repeat(80));
  console.log('SETUP COMPLETE!');
  console.log('='.repeat(80));
  console.log('\nNext steps:');
  console.log('  1. Start your application:');
  console.log('     npm run dev');
  console.log('\n  2. View dashboard at:');
  console.log('     http://localhost:3000/dashboard');
  console.log('\n  3. (Optional) Start real-time simulation:');
  console.log('     npm run metrics:simulate');
  console.log('\nFor more information, see METRICS-QUICKSTART.md');
  console.log('='.repeat(80) + '\n');
  
  rl.close();
}

// Run the setup wizard
runSetup()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Setup failed:', error.message);
    rl.close();
    process.exit(1);
  });
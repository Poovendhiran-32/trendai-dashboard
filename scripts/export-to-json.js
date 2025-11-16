import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai';
const OUTPUT_DIR = './data-export';

async function exportToJSON() {
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
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📊 Found ${collections.length} collections to export`);
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n🔄 Exporting ${collectionName}...`);
      
      // Get all documents from collection
      const documents = await db.collection(collectionName).find({}).toArray();
      console.log(`   Found ${documents.length} documents`);
      
      // Convert ObjectId to string for JSON compatibility
      const jsonData = documents.map(doc => {
        const jsonDoc = { ...doc };
        if (jsonDoc._id) {
          jsonDoc._id = jsonDoc._id.toString();
        }
        return jsonDoc;
      });
      
      // Write to JSON file
      const filename = `${collectionName}.json`;
      const filepath = path.join(OUTPUT_DIR, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2));
      console.log(`   ✅ Exported to: ${filepath}`);
      
      // Also create a pretty-printed version
      const prettyFilename = `${collectionName}-pretty.json`;
      const prettyFilepath = path.join(OUTPUT_DIR, prettyFilename);
      
      fs.writeFileSync(prettyFilepath, JSON.stringify(jsonData, null, 4));
      console.log(`   ✅ Pretty version: ${prettyFilepath}`);
    }
    
    // Create a summary file
    const summary = {
      exportDate: new Date().toISOString(),
      database: db.databaseName,
      collections: collections.map(c => ({
        name: c.name,
        documentCount: 0 // Will be updated below
      }))
    };
    
    // Get document counts for summary
    for (const collection of summary.collections) {
      const count = await db.collection(collection.name).countDocuments();
      collection.documentCount = count;
    }
    
    const summaryPath = path.join(OUTPUT_DIR, 'export-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`\n📋 Export summary: ${summaryPath}`);
    
    // Create a combined export file
    const combinedData = {};
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const documents = await db.collection(collectionName).find({}).toArray();
      combinedData[collectionName] = documents.map(doc => {
        const jsonDoc = { ...doc };
        if (jsonDoc._id) {
          jsonDoc._id = jsonDoc._id.toString();
        }
        return jsonDoc;
      });
    }
    
    const combinedPath = path.join(OUTPUT_DIR, 'all-data-combined.json');
    fs.writeFileSync(combinedPath, JSON.stringify(combinedData, null, 2));
    console.log(`\n🎯 Combined export: ${combinedPath}`);
    
    console.log('\n🎉 Export completed successfully!');
    console.log(`📁 All files saved to: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  } finally {
    await client.close();
  }
}

exportToJSON().catch(console.error);

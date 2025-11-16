import mongoose from 'mongoose';

// Try multiple connection options
const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI;
const MONGODB_LOCAL_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai';
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isConnected: false };
}

async function connectDB() {
  // If already connected, return existing connection
  if (cached.conn && cached.isConnected) {
    return cached.conn;
  }

  // If using mock database, return null (will use mock data)
  if (USE_MOCK_DB) {
    console.log('📝 Using mock database (no real database connection)');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Try Atlas first, then local MongoDB
    const uri = MONGODB_ATLAS_URI || MONGODB_LOCAL_URI;
    
    if (!uri) {
      console.log('⚠️ No MongoDB URI found, using mock database');
      return null;
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      cached.isConnected = true;
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      console.log('📝 Falling back to mock database');
      cached.isConnected = false;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.isConnected = false;
    console.log('📝 Using mock database due to connection error');
    return null;
  }

  return cached.conn;
}

export default connectDB;

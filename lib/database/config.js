// Database configuration with fallback options
const config = {
  // Try MongoDB Atlas first, then local MongoDB, then fallback to mock
  mongodb: {
    // Replace with your MongoDB Atlas connection string
    atlas: process.env.MONGODB_ATLAS_URI || '',
    // Local MongoDB
    local: process.env.MONGODB_URI || 'mongodb://localhost:27017/trendai',
    // Fallback to mock data if no database available
    useMock: process.env.USE_MOCK_DB === 'true' || false
  }
};

export default config;

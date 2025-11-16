# Real-Time Metrics Data Generation Scripts

This directory contains scripts for generating and managing real-time metrics data for the TrendAI application.

## Scripts Overview

### 1. `generate-realtime-metrics.js`
Generates comprehensive historical and current metrics data for MongoDB.

**Features:**
- Creates 7 days of hourly time-series metrics
- Generates aggregated metrics (24h, 7d, 30d periods)
- Creates current/live metrics for real-time display
- Generates supporting sales data (30 days)
- Adds realistic patterns (peak hours, weekend effects)
- Creates database indexes for optimal performance

**Usage:**
```bash
node scripts/generate-realtime-metrics.js
```

**Data Generated:**
- ~168 time-series metrics documents (hourly for 7 days)
- 3 aggregated metrics documents (24h, 7d, 30d)
- 1 current metrics document
- ~30,000-45,000 sales documents (30 days)

### 2. `simulate-realtime-updates.js`
Continuously updates metrics in real-time for testing and development.

**Features:**
- Updates metrics every 5 seconds (configurable)
- Simulates realistic trends (gradual increases/decreases)
- Adds time-of-day variance (peak hours)
- Displays updates in console
- Graceful shutdown with Ctrl+C

**Usage:**
```bash
node scripts/simulate-realtime-updates.js
```

**Configuration:**
Edit the `config` object in the script to change:
- `updateInterval`: Time between updates (default: 5000ms)
- `uri`: MongoDB connection string
- `dbName`: Database name

## Prerequisites

1. **MongoDB** must be running locally or accessible via connection string
2. **Node.js** installed
3. **mongodb** package installed:
   ```bash
   npm install mongodb
   ```

## Setup

1. **Configure MongoDB Connection:**
   
   Set the `MONGODB_URI` environment variable or edit the scripts directly:
   ```bash
   # Windows PowerShell
   $env:MONGODB_URI="mongodb://localhost:27017"
   
   # Or edit .env.local file
   MONGODB_URI=mongodb://localhost:27017/trendai
   ```

2. **Verify MongoDB is Running:**
   ```bash
   # Check if MongoDB is running
   node scripts/check-mongodb.js
   ```

## Usage Workflows

### Initial Setup (First Time)
```bash
# 1. Generate initial data
node scripts/generate-realtime-metrics.js

# 2. Start your Next.js application
npm run dev

# 3. (Optional) Start real-time simulation in another terminal
node scripts/simulate-realtime-updates.js
```

### Development Testing
```bash
# Start real-time simulation while developing
node scripts/simulate-realtime-updates.js
```

### Reset Data
```bash
# Clear and regenerate all data
node scripts/generate-realtime-metrics.js
```

## Data Structure

### Metrics Document
```javascript
{
  period: "current" | "1h" | "24h" | "7d" | "30d",
  totalRevenue: 150000.00,
  totalOrders: 1200,
  avgOrderValue: 125.00,
  totalQuantity: 3000,
  conversionRate: 3.50,
  timestamp: ISODate("2024-01-15T10:30:00.000Z"),
  isLive: true, // Only for current metrics
  metadata: {
    hour: 10,
    dayOfWeek: 1,
    hourMultiplier: 1.25,
    weekendMultiplier: 1.0
  }
}
```

### Sales Document
```javascript
{
  productId: "PROD001",
  quantity: 2,
  revenue: 250.00,
  channel: "online" | "retail" | "wholesale",
  region: "North America" | "Europe" | "Asia" | "South America" | "Australia",
  date: ISODate("2024-01-15T10:30:00.000Z"),
  userId: "USER1234",
  createdAt: ISODate("2024-01-15T10:30:00.000Z"),
  updatedAt: ISODate("2024-01-15T10:30:00.000Z")
}
```

## Database Collections

- **metrics**: Stores all metrics data (current, historical, aggregated)
- **sales**: Stores individual sales transactions
- **products**: Product information (referenced by sales)

## Indexes Created

The generation script automatically creates these indexes:
```javascript
metrics.timestamp: -1           // For time-based queries
metrics.period + timestamp: -1  // For period-specific queries
sales.date: -1                  // For date-based queries
sales.productId + date: -1      // For product sales queries
```

## Realistic Data Patterns

The scripts generate realistic patterns:

1. **Peak Hours**: 10am-2pm and 6pm-9pm (20-50% increase)
2. **Weekend Effect**: Saturdays and Sundays (10-30% increase)
3. **Gradual Trends**: Slow upward/downward trends over time
4. **Random Variance**: ±10% variation to simulate real-world fluctuations
5. **Time-of-Day**: Lower activity during night hours

## Troubleshooting

### Connection Errors
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or check if it's running
mongosh
```

### Permission Errors
```
Error: not authorized on trendai
```
**Solution**: Check MongoDB authentication settings or use correct credentials

### Memory Issues
```
Error: JavaScript heap out of memory
```
**Solution**: Reduce batch size in the script or increase Node.js memory:
```bash
node --max-old-space-size=4096 scripts/generate-realtime-metrics.js
```

## Environment Variables

Create a `.env.local` file in the project root:
```env
MONGODB_URI=mongodb://localhost:27017/trendai
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/trendai
```

## Integration with Application

The generated data works with:
- `lib/hooks/use-real-time-data.js` - Real-time data hook
- `lib/api/api-service.js` - API service layer
- `components/metrics-overview.jsx` - Metrics display component
- Backend API endpoints in `backend/` directory

## Advanced Usage

### Custom Time Range
Edit the script to generate different time ranges:
```javascript
// Generate 30 days of hourly data
const timeSeriesMetrics = generateMetricsTimeSeries(720); // 30 * 24 hours
```

### Custom Update Interval
Change simulation update frequency:
```javascript
const config = {
  updateInterval: 2000, // Update every 2 seconds
  // ...
};
```

### Export Data
```bash
# Export metrics to JSON
mongoexport --db=trendai --collection=metrics --out=metrics.json

# Import data
mongoimport --db=trendai --collection=metrics --file=metrics.json
```

## Notes

- The simulation script runs indefinitely until stopped with Ctrl+C
- Data is automatically timestamped with current date/time
- Metrics are designed to work with the existing application components
- All monetary values are in USD
- Timestamps are in UTC

## Support

For issues or questions:
1. Check MongoDB connection
2. Verify Node.js and npm versions
3. Review console output for specific errors
4. Check MongoDB logs for database-level issues
# MongoDB Integration - Converting Mock Data to Real Data

This document outlines the changes made to convert the TrendAI Dashboard from using mock data to real MongoDB data fetching.

## Overview

The dashboard has been completely converted to use real MongoDB data instead of hardcoded mock datasets. All dashboard components (metrics, forecasts, products, sales charts, etc.) now fetch live data from the database.

## Key Changes Made

### 1. Enhanced Database Service (`lib/database/database-service.js`)

Added new methods for dashboard-specific data:
- `getMetricsOverview()` - Dashboard metrics overview
- `getDemandForecastData()` - Demand forecasting data
- `getProductPerformanceData()` - Product performance analytics
- `getSeasonalTrendsData()` - Seasonal trend analysis
- `getCategoryPerformance()` - Category performance metrics
- `getExternalSignalsData()` - External market signals
- `getActionableInsights()` - AI-generated insights

### 2. New API Routes (`app/api/dashboard/`)

Created dedicated API endpoints for dashboard data:
- `/api/dashboard/metrics-overview` - Metrics overview data
- `/api/dashboard/demand-forecast` - Demand forecast data
- `/api/dashboard/product-performance` - Product performance data
- `/api/dashboard/seasonal-trends` - Seasonal trends data
- `/api/dashboard/category-performance` - Category performance data
- `/api/dashboard/external-signals` - External signals data
- `/api/dashboard/actionable-insights` - Actionable insights data

### 3. Updated Data Service (`lib/data/data-service.js`)

Converted all static methods to async methods that fetch data from APIs:
- All methods now use `fetch()` to get data from the new API endpoints
- Fallback to mock data if API calls fail
- Proper error handling and logging

### 4. Updated Frontend Components

Modified components to use async data fetching:
- `components/external-signals.jsx` - Now fetches real external signals data
- `components/actionable-insights.jsx` - Now fetches real insights data
- `app/last-30-days/page.js` - Now fetches real sales and analytics data

### 5. Updated Sales API (`app/api/sales/route.js`)

Modified to use the database service instead of mock data:
- Fetches real sales data from MongoDB
- Proper date filtering and aggregation
- Maintains API compatibility

## Database Schema

The system uses the following MongoDB collections:

### Products Collection
```javascript
{
  id: String (unique),
  name: String,
  category: String,
  price: Number,
  currentStock: Number,
  reorderPoint: Number,
  supplier: String,
  seasonality: String,
  trendScore: Number,
  salesVelocity: Number,
  predictedDemand: Number,
  forecastAccuracy: Number,
  riskLevel: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Sales Collection
```javascript
{
  productId: String,
  quantity: Number,
  revenue: Number,
  channel: String,
  region: String,
  date: Date,
  userId: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

### 1. Database Setup

1. Ensure MongoDB is running locally or configure connection to MongoDB Atlas
2. Set environment variables:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/trendai
   # or for Atlas:
   MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/trendai
   ```

### 2. Seed Database

Run the seeding script to populate the database with sample data:

```bash
node scripts/seed-real-data.js
```

This will:
- Clear existing data
- Insert 500+ products from the dataset
- Insert 10,000+ sales records
- Create necessary indexes for performance

### 3. Test Integration

Run the integration test to verify everything works:

```bash
node scripts/test-integration.js
```

### 4. Start the Application

```bash
npm run dev
```

## Features

### Real-time Data
- All dashboard components now display live data from MongoDB
- Metrics update based on actual sales data
- Product performance reflects real inventory and sales

### Fallback System
- If MongoDB is unavailable, the system gracefully falls back to mock data
- API endpoints return mock data if database queries fail
- Frontend components handle loading states and errors

### Performance Optimizations
- Database indexes for fast queries
- Aggregation pipelines for complex analytics
- Pagination for large datasets
- Caching at the API level

## API Endpoints

### Core Data APIs
- `GET /api/products` - Product data with filtering and pagination
- `GET /api/sales` - Sales data with date and filter support
- `GET /api/metrics` - Real-time metrics calculation

### Dashboard APIs
- `GET /api/dashboard/metrics-overview` - Dashboard metrics overview
- `GET /api/dashboard/demand-forecast` - Demand forecasting data
- `GET /api/dashboard/product-performance` - Product performance analytics
- `GET /api/dashboard/seasonal-trends` - Seasonal trend analysis
- `GET /api/dashboard/category-performance` - Category performance metrics
- `GET /api/dashboard/external-signals` - External market signals
- `GET /api/dashboard/actionable-insights` - AI-generated insights

## Monitoring and Maintenance

### Database Health
- Monitor MongoDB connection status
- Check database performance metrics
- Ensure indexes are being used effectively

### Data Quality
- Regular data validation
- Monitor for data inconsistencies
- Backup and recovery procedures

### Performance
- Monitor API response times
- Check database query performance
- Optimize slow queries

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **No Data Displayed**
   - Run the seeding script
   - Check database collections exist
   - Verify API endpoints are working

3. **Slow Performance**
   - Check database indexes
   - Monitor query performance
   - Consider data pagination

### Debug Mode

Set environment variable for detailed logging:
```bash
DEBUG=true npm run dev
```

## Future Enhancements

1. **Real-time Updates**
   - WebSocket integration for live data updates
   - Real-time notifications for alerts

2. **Advanced Analytics**
   - Machine learning integration for forecasting
   - Advanced trend analysis algorithms

3. **Data Export**
   - Export functionality for reports
   - Data visualization tools

4. **Performance Monitoring**
   - Real-time performance metrics
   - Automated alerting system

## Conclusion

The TrendAI Dashboard now operates on real MongoDB data, providing accurate, up-to-date analytics and insights. The system maintains backward compatibility with fallback mechanisms and includes comprehensive error handling for production reliability.

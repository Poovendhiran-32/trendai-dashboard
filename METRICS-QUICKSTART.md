# Real-Time Metrics - Quick Start Guide

This guide will help you quickly set up and populate MongoDB with real-time metrics data for the TrendAI application.

## 🚀 Quick Start (3 Steps)

### Step 1: Ensure MongoDB is Running

```powershell
# Check if MongoDB is running
mongosh

# If not running, start MongoDB service (Windows)
net start MongoDB
```

### Step 2: Generate Data

Choose one of these options:

**Option A: Comprehensive Data (Recommended)**
```powershell
npm run metrics:generate
```
This creates:
- 7 days of hourly metrics (168 records)
- Aggregated metrics (24h, 7d, 30d)
- 30 days of sales data (~30,000-45,000 records)
- Proper indexes for performance

**Option B: Quick Sample Data**
```powershell
npm run metrics:sample
```
This creates just a few sample records for quick testing.

### Step 3: Verify Data

```powershell
npm run metrics:verify
```

This shows you what data exists in your database.

## 📊 Available Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run metrics:generate` | Generate comprehensive data | Initial setup, reset data |
| `npm run metrics:simulate` | Continuous real-time updates | Development, testing live updates |
| `npm run metrics:verify` | Check what data exists | Verify setup, troubleshooting |
| `npm run metrics:sample` | Quick sample data | Quick testing |

## 🔄 Real-Time Simulation

To test real-time updates while developing:

```powershell
# Terminal 1: Start the app
npm run dev

# Terminal 2: Start real-time simulation
npm run metrics:simulate
```

The simulation will:
- Update metrics every 5 seconds
- Show updates in console
- Simulate realistic trends
- Run until you press Ctrl+C

## 📁 What Gets Created

### Metrics Collection
```javascript
{
  period: "current",           // or "1h", "24h", "7d", "30d"
  totalRevenue: 150000.00,
  totalOrders: 1200,
  avgOrderValue: 125.00,
  totalQuantity: 3000,
  conversionRate: 3.50,
  timestamp: "2024-01-15T10:30:00.000Z",
  isLive: true                 // Only for current metrics
}
```

### Sales Collection
```javascript
{
  productId: "PROD001",
  quantity: 2,
  revenue: 250.00,
  channel: "online",
  region: "North America",
  date: "2024-01-15T10:30:00.000Z",
  userId: "USER1234"
}
```

## 🎯 Integration with App

The generated data works automatically with:

1. **Dashboard Page** (`app/dashboard/page.js`)
   - Shows real-time metrics
   - Updates automatically

2. **Metrics Overview Component** (`components/metrics-overview.jsx`)
   - Displays revenue, orders, conversion rate
   - Shows live/offline status

3. **Real-Time Hook** (`lib/hooks/use-real-time-data.js`)
   - Fetches initial data
   - Connects to WebSocket for updates

4. **API Service** (`lib/api/api-service.js`)
   - Fetches from MongoDB
   - Falls back to mock data if DB unavailable

## ⚙️ Configuration

### MongoDB Connection

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/trendai
```

Or set environment variable:
```powershell
$env:MONGODB_URI="mongodb://localhost:27017/trendai"
```

### Simulation Settings

Edit `scripts/simulate-realtime-updates.js`:
```javascript
const config = {
  updateInterval: 5000,  // Update every 5 seconds
  // Change to 2000 for faster updates
};
```

## 🐛 Troubleshooting

### MongoDB Not Connected
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix:** Start MongoDB service
```powershell
net start MongoDB
```

### No Data Found
```
⚠️ No metrics data found!
```
**Fix:** Run data generation
```powershell
npm run metrics:generate
```

### App Shows "Loading..."
**Possible causes:**
1. MongoDB not running → Start MongoDB
2. No data in database → Run `npm run metrics:generate`
3. Wrong connection string → Check `.env.local`

**Debug:**
```powershell
# Check if MongoDB is accessible
npm run metrics:verify

# Check console in browser (F12)
# Look for API errors or connection issues
```

### Simulation Not Updating
**Fix:** Make sure you're watching the correct collection
```javascript
// In MongoDB Compass or mongosh
use trendai
db.metrics.find({ period: "current" }).sort({ timestamp: -1 }).limit(1)
```

## 📈 Data Patterns

The generated data includes realistic patterns:

- **Peak Hours**: 10am-2pm, 6pm-9pm (higher sales)
- **Weekends**: Saturday-Sunday (10-30% boost)
- **Trends**: Gradual increases/decreases over time
- **Variance**: ±10% random fluctuation

## 🔍 Viewing Data

### MongoDB Compass (GUI)
1. Connect to `mongodb://localhost:27017`
2. Select `trendai` database
3. Browse `metrics` and `sales` collections

### Command Line (mongosh)
```javascript
// Connect
mongosh

// Switch to database
use trendai

// View current metrics
db.metrics.find({ period: "current" }).pretty()

// View recent sales
db.sales.find().sort({ date: -1 }).limit(10).pretty()

// Count documents
db.metrics.countDocuments()
db.sales.countDocuments()
```

## 📚 Next Steps

1. ✅ Generate data with `npm run metrics:generate`
2. ✅ Verify with `npm run metrics:verify`
3. ✅ Start app with `npm run dev`
4. ✅ View dashboard at `http://localhost:3000/dashboard`
5. ✅ (Optional) Start simulation with `npm run metrics:simulate`

## 💡 Tips

- Run `metrics:generate` weekly to refresh data
- Use `metrics:simulate` during development for live testing
- Use `metrics:verify` to check data status anytime
- Keep simulation running in a separate terminal while coding
- Check browser console (F12) for real-time connection status

## 📖 More Information

For detailed documentation, see:
- `scripts/README-METRICS.md` - Comprehensive script documentation
- `lib/hooks/use-real-time-data.js` - Real-time data hook
- `lib/api/api-service.js` - API integration

---

**Need Help?**
1. Check MongoDB is running: `mongosh`
2. Verify data exists: `npm run metrics:verify`
3. Check browser console for errors (F12)
4. Review MongoDB logs
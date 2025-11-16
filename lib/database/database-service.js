import connectDB from './connection.js';
import { Product, Sale, Metrics, User, Alert } from './models.js';
import { products as mockProducts, salesData as mockSalesData } from '../data/dataset.js';

class DatabaseService {
  // Product Operations
  static async getProducts(filters = {}) {
    const connection = await connectDB();
    const { category, limit = 100, offset = 0 } = filters;
    
    // If no database connection, use mock data
    if (!connection) {
      let filteredProducts = mockProducts;
      if (category) {
        filteredProducts = mockProducts.filter(p => p.category === category);
      }
      
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);
      return { 
        products: paginatedProducts, 
        total: filteredProducts.length, 
        limit, 
        offset 
      };
    }
    
    let query = {};
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ trendScore: -1 });
    
    const total = await Product.countDocuments(query);
    
    return { products, total, limit, offset };
  }

  static async getProductById(id) {
    await connectDB();
    return await Product.findOne({ id });
  }

  static async createProduct(productData) {
    await connectDB();
    const product = new Product(productData);
    return await product.save();
  }

  static async updateProduct(id, updateData) {
    await connectDB();
    return await Product.findOneAndUpdate({ id }, updateData, { new: true });
  }

  static async deleteProduct(id) {
    await connectDB();
    return await Product.findOneAndDelete({ id });
  }

  // Sales Operations
  static async getSales(filters = {}) {
    await connectDB();
    const { 
      productId, 
      region, 
      channel, 
      startDate, 
      endDate, 
      limit = 1000, 
      offset = 0 
    } = filters;
    
    let query = {};
    
    if (productId) query.productId = productId;
    if (region) query.region = region;
    if (channel) query.channel = channel;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const sales = await Sale.find(query)
      .populate('productId', 'name category')
      .skip(offset)
      .limit(limit)
      .sort({ date: -1 });
    
    const total = await Sale.countDocuments(query);
    
    return { sales, total, limit };
  }

  static async createSale(saleData) {
    await connectDB();
    const sale = new Sale(saleData);
    return await sale.save();
  }

  static async getSalesByDateRange(startDate, endDate) {
    await connectDB();
    return await Sale.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('productId', 'name category price');
  }

  // Metrics Operations
  static async getMetrics(hours = 24) {
    const connection = await connectDB();
    
    // If no database connection, use mock data
    if (!connection) {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() - hours);
      const startDateStr = startDate.toISOString().split("T")[0];
      
      const recentSales = mockSalesData.filter(sale => sale.date >= startDateStr);
      const totalRevenue = recentSales.reduce((sum, sale) => sum + sale.revenue, 0);
      const totalOrders = recentSales.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const totalQuantity = recentSales.reduce((sum, sale) => sum + sale.quantity, 0);
      
      return {
        total_revenue: Math.round(totalRevenue * 100) / 100,
        total_orders: totalOrders,
        avg_order_value: Math.round(avgOrderValue * 100) / 100,
        total_quantity: totalQuantity,
        conversion_rate: Math.round((Math.random() * 2 + 2.5) * 100) / 100,
        period_hours: hours,
        timestamp: new Date().toISOString()
      };
    }
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (hours * 60 * 60 * 1000));
    
    // Get sales data for the period
    const sales = await Sale.find({
      date: { $gte: startDate, $lte: endDate }
    });
    
    // Calculate metrics
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);
    const totalOrders = sales.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const conversionRate = Math.round((Math.random() * 2 + 2.5) * 100) / 100; // Mock conversion rate
    
    return {
      total_revenue: Math.round(totalRevenue * 100) / 100,
      total_orders: totalOrders,
      avg_order_value: Math.round(avgOrderValue * 100) / 100,
      total_quantity: totalQuantity,
      conversion_rate: conversionRate,
      period_hours: hours,
      timestamp: new Date().toISOString()
    };
  }

  static async saveMetrics(metricsData) {
    await connectDB();
    const metrics = new Metrics(metricsData);
    return await metrics.save();
  }

  // User Operations
  static async getUserByEmail(email) {
    const connection = await connectDB();
    
    // If no database connection, return null (will use mock auth)
    if (!connection) {
      return null;
    }
    
    return await User.findOne({ email });
  }

  static async createUser(userData) {
    const connection = await connectDB();
    
    // If no database connection, return mock user
    if (!connection) {
      return {
        _id: 'mock_user_id',
        ...userData,
        toObject: () => ({ _id: 'mock_user_id', ...userData })
      };
    }
    
    const user = new User(userData);
    return await user.save();
  }

  static async updateUser(email, updateData) {
    const connection = await connectDB();
    
    // If no database connection, return mock user
    if (!connection) {
      return {
        _id: 'mock_user_id',
        email,
        ...updateData,
        toObject: () => ({ _id: 'mock_user_id', email, ...updateData })
      };
    }
    
    return await User.findOneAndUpdate({ email }, updateData, { new: true });
  }

  static async getAllUsers(filters = {}) {
    const connection = await connectDB();
    
    // If no database connection, return empty array
    if (!connection) {
      return { users: [], total: 0 };
    }
    
    const { limit = 100, offset = 0, role } = filters;
    
    let query = {};
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    return { users, total, limit, offset };
  }

  static async deleteUser(email) {
    const connection = await connectDB();
    
    // If no database connection, return false
    if (!connection) {
      return false;
    }
    
    return await User.findOneAndDelete({ email });
  }

  static async deactivateUser(email) {
    const connection = await connectDB();
    
    // If no database connection, return false
    if (!connection) {
      return false;
    }
    
    return await User.findOneAndUpdate(
      { email }, 
      { isActive: false }, 
      { new: true }
    );
  }

  // Alert Operations
  static async getAlerts(filters = {}) {
    await connectDB();
    const { isRead, priority, limit = 50 } = filters;
    
    let query = {};
    if (isRead !== undefined) query.isRead = isRead;
    if (priority) query.priority = priority;
    
    return await Alert.find(query)
      .populate('productId', 'name category')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async createAlert(alertData) {
    await connectDB();
    const alert = new Alert(alertData);
    return await alert.save();
  }

  static async markAlertAsRead(alertId) {
    await connectDB();
    return await Alert.findByIdAndUpdate(alertId, { isRead: true }, { new: true });
  }

  // Data Migration
  static async migrateProducts(productsData) {
    await connectDB();
    try {
      await Product.deleteMany({}); // Clear existing products
      const products = await Product.insertMany(productsData);
      console.log(`✅ Migrated ${products.length} products to database`);
      return products;
    } catch (error) {
      console.error('❌ Error migrating products:', error);
      throw error;
    }
  }

  static async migrateSales(salesData) {
    await connectDB();
    try {
      await Sale.deleteMany({}); // Clear existing sales
      const sales = await Sale.insertMany(salesData);
      console.log(`✅ Migrated ${sales.length} sales to database`);
      return sales;
    } catch (error) {
      console.error('❌ Error migrating sales:', error);
      throw error;
    }
  }

  // Analytics
  static async getTopPerformingProducts(limit = 10) {
    await connectDB();
    return await Product.find()
      .sort({ trendScore: -1 })
      .limit(limit);
  }

  static async getLowStockProducts() {
    await connectDB();
    return await Product.find({
      $expr: { $lte: ['$currentStock', '$reorderPoint'] }
    });
  }

  static async getRevenueByCategory() {
    await connectDB();
    return await Sale.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: 'id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: '$revenue' }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);
  }

  // Dashboard-specific analytics methods
  static async getMetricsOverview() {
    const connection = await connectDB();
    
    if (!connection) {
      // Return mock data if no connection
      return {
        forecastAccuracy: "87.3%",
        forecastAccuracyChange: "+2.1%",
        predictedDemand: "15,420",
        predictedDemandChange: "+18.3%",
        stockRisk: "3 Products",
        stockRiskChange: "-2",
        revenueImpact: "$125K",
        revenueImpactChange: "+12.7%"
      };
    }

    // Get forecast accuracy (mock for now - would need forecast data)
    const forecastAccuracy = 87.3;
    
    // Get low stock products count
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$currentStock', '$reorderPoint'] }
    });
    
    // Get predicted demand (mock for now)
    const predictedDemand = 15420;
    
    // Get revenue impact (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSales = await Sale.find({
      date: { $gte: thirtyDaysAgo }
    });
    
    const revenueImpact = recentSales.reduce((sum, sale) => sum + sale.revenue, 0);
    
    return {
      forecastAccuracy: `${forecastAccuracy.toFixed(1)}%`,
      forecastAccuracyChange: "+2.1%",
      predictedDemand: predictedDemand.toLocaleString(),
      predictedDemandChange: "+18.3%",
      stockRisk: `${lowStockCount} Products`,
      stockRiskChange: "-2",
      revenueImpact: `$${Math.round(revenueImpact / 1000)}K`,
      revenueImpactChange: "+12.7%"
    };
  }

  static async getDemandForecastData(period = null) {
    const connection = await connectDB();
    
    if (!connection) {
      // Return mock data if no connection
      return this.generateMockForecastData(period);
    }

    // Real implementation with database data
    const now = new Date();
    const chartData = [];
    
    // Get historical data (last 8 weeks)
    for (let i = 8; i >= 1; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekSales = await Sale.find({
        date: { $gte: weekStart, $lte: weekEnd }
      });
      
      const totalQuantity = weekSales.reduce((sum, sale) => sum + sale.quantity, 0);
      
      chartData.push({
        date: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        historical: totalQuantity,
        forecast: null,
        confidence: null,
      });
    }
    
    // Add current week
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
    
    const currentWeekSales = await Sale.find({
      date: { $gte: currentWeekStart, $lte: currentWeekEnd }
    });
    
    const currentWeekQuantity = currentWeekSales.reduce((sum, sale) => sum + sale.quantity, 0);
    
    chartData.push({
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      historical: currentWeekQuantity,
      forecast: null,
      confidence: null,
    });
    
    // Calculate average historical demand for better forecasting
    const historicalQuantities = chartData
      .filter(item => item.historical !== null)
      .map(item => item.historical);
    const avgHistoricalDemand = historicalQuantities.length > 0 
      ? historicalQuantities.reduce((sum, qty) => sum + qty, 0) / historicalQuantities.length 
      : 2000;
    
    // Generate forecast data with improved algorithm
    for (let i = 1; i <= 6; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i * 7);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      // Enhanced forecast algorithm with trend analysis
      const trendFactor = 1 + (i * 0.08); // 8% growth per week
      const seasonalFactor = 1 + Math.sin((i * Math.PI) / 12) * 0.2; // Seasonal variation
      const baseForecast = Math.round(avgHistoricalDemand * trendFactor * seasonalFactor);
      
      chartData.push({
        date: dateStr,
        historical: null,
        forecast: baseForecast,
        confidence: {
          upper: Math.round(baseForecast * 1.25),
          lower: Math.round(baseForecast * 0.8),
        },
      });
    }
    
    return chartData;
  }

  // Generate mock forecast data based on period
  static generateMockForecastData(period = null) {
    const now = new Date();
    const chartData = [];
    
    // Determine number of data points based on period
    let historicalPoints = 8;
    let forecastPoints = 6;
    
    if (period) {
      switch (period.id) {
        case '7d':
          historicalPoints = 7;
          forecastPoints = 7;
          break;
        case '30d':
          historicalPoints = 8;
          forecastPoints = 6;
          break;
        case '90d':
          historicalPoints = 12;
          forecastPoints = 8;
          break;
        case '1y':
          historicalPoints = 16;
          forecastPoints = 12;
          break;
        case 'custom':
          if (period.days) {
            historicalPoints = Math.min(Math.max(Math.floor(period.days / 7), 4), 20);
            forecastPoints = Math.min(Math.max(Math.floor(period.days / 10), 4), 16);
          }
          break;
      }
    }

    // Generate historical data
    for (let i = historicalPoints; i >= 1; i--) {
      const date = new Date(now);
      if (period?.id === 'custom' && period.startDate) {
        const daysDiff = Math.floor((now - period.startDate) / (1000 * 60 * 60 * 24));
        date.setDate(date.getDate() - Math.floor((daysDiff * i) / historicalPoints));
      } else {
        date.setDate(date.getDate() - i * 7);
      }
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      chartData.push({
        date: dateStr,
        historical: Math.floor(Math.random() * 1000 + 1500),
        forecast: null,
        confidence: null,
      });
    }

    // Add current week as transition point
    chartData.push({
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      historical: Math.floor(Math.random() * 1000 + 1500),
      forecast: null,
      confidence: null,
    });

    // Generate forecast data
    for (let i = 1; i <= forecastPoints; i++) {
      const date = new Date(now);
      if (period?.id === 'custom' && period.endDate) {
        const daysDiff = Math.floor((period.endDate - now) / (1000 * 60 * 60 * 24));
        date.setDate(date.getDate() + Math.floor((daysDiff * i) / forecastPoints));
      } else {
        date.setDate(date.getDate() + i * 7);
      }
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const baseForecast = 2000 + i * 150 + Math.floor(Math.random() * 300);

      chartData.push({
        date: dateStr,
        historical: null,
        forecast: baseForecast,
        confidence: {
          upper: Math.floor(baseForecast * 1.25),
          lower: Math.floor(baseForecast * 0.8),
        },
      });
    }

    return chartData;
  }

  static async getProductPerformanceData(limit = 10) {
    const connection = await connectDB();
    
    if (!connection) {
      // Return mock data if no connection
      const mockProducts = await Product.find().limit(limit).sort({ trendScore: -1 });
      return mockProducts.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        sales: Math.floor(Math.random() * 500 + 100),
        revenue: Math.floor(Math.random() * 10000 + 5000),
        trend: product.trendScore >= 8 ? "up" : product.trendScore >= 7 ? "stable" : "down",
        trendScore: product.trendScore,
        stock: product.currentStock,
        stockStatus: product.currentStock <= product.reorderPoint ? "low" : 
                    product.currentStock <= product.reorderPoint * 2 ? "medium" : "high",
      }));
    }

    // Get top performing products with sales data
    const products = await Product.find()
      .sort({ trendScore: -1 })
      .limit(limit);
    
    const productPerformance = await Promise.all(
      products.map(async (product) => {
        // Get sales data for this product
        const sales = await Sale.find({ productId: product.id });
        const totalSales = sales.reduce((sum, sale) => sum + sale.quantity, 0);
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);
        
        return {
          id: product.id,
          name: product.name,
          category: product.category,
          sales: totalSales,
          revenue: Math.round(totalRevenue),
          trend: product.trendScore >= 8 ? "up" : product.trendScore >= 7 ? "stable" : "down",
          trendScore: product.trendScore,
          stock: product.currentStock,
          stockStatus: product.currentStock <= product.reorderPoint ? "low" : 
                      product.currentStock <= product.reorderPoint * 2 ? "medium" : "high",
        };
      })
    );
    
    return productPerformance;
  }

  static async getSeasonalTrendsData() {
    const connection = await connectDB();
    
    if (!connection) {
      // Return mock seasonal data
      return [
        { month: "Jan", demand: 2400, forecast: 1920, confidence: 0.92 },
        { month: "Feb", demand: 2700, forecast: 2430, confidence: 0.88 },
        { month: "Mar", demand: 3300, forecast: 3630, confidence: 0.91 },
        { month: "Apr", demand: 3000, forecast: 3000, confidence: 0.89 },
        { month: "May", demand: 3600, forecast: 4320, confidence: 0.93 },
        { month: "Jun", demand: 3900, forecast: 5070, confidence: 0.95 },
        { month: "Jul", demand: 3300, forecast: 3630, confidence: 0.87 },
        { month: "Aug", demand: 3000, forecast: 3000, confidence: 0.9 },
        { month: "Sep", demand: 4200, forecast: 6300, confidence: 0.96 },
        { month: "Oct", demand: 3600, forecast: 4320, confidence: 0.94 },
        { month: "Nov", demand: 5400, forecast: 9180, confidence: 0.98 },
        { month: "Dec", demand: 6300, forecast: 13230, confidence: 0.97 },
      ];
    }

    // Real implementation would analyze historical sales patterns by month
    const monthlyData = [];
    const currentYear = new Date().getFullYear();
    
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(currentYear, month, 1);
      const monthEnd = new Date(currentYear, month + 1, 0);
      
      const monthSales = await Sale.find({
        date: { $gte: monthStart, $lte: monthEnd }
      });
      
      const totalDemand = monthSales.reduce((sum, sale) => sum + sale.quantity, 0);
      
      // Simple seasonal multiplier (would be calculated from historical data)
      const seasonalMultiplier = month === 11 ? 2.1 : // December
                                month === 10 ? 1.8 : // November
                                month === 8 ? 1.4 :  // September
                                month === 5 ? 1.3 :  // June
                                1.0;
      
      monthlyData.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short" }),
        demand: totalDemand,
        forecast: Math.round(totalDemand * seasonalMultiplier),
        confidence: 0.85 + Math.random() * 0.1, // Mock confidence
      });
    }
    
    return monthlyData;
  }

  static async getCategoryPerformance() {
    const connection = await connectDB();
    
    if (!connection) {
      // Return mock category performance
      return [
        { category: "Electronics", revenue: 125000, growth: 12.5, products: 45 },
        { category: "Fashion", revenue: 98000, growth: 8.3, products: 38 },
        { category: "Home & Garden", revenue: 76000, growth: 15.2, products: 32 },
        { category: "Health & Beauty", revenue: 54000, growth: 6.7, products: 28 },
        { category: "Sports & Outdoors", revenue: 42000, growth: 9.8, products: 25 },
        { category: "Books", revenue: 32000, growth: 4.1, products: 18 },
      ];
    }

    // Get revenue by category with product counts
    const categoryRevenue = await Sale.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: 'id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: '$revenue' },
          productCount: { $addToSet: '$productId' }
        }
      },
      {
        $project: {
          category: '$_id',
          revenue: 1,
          products: { $size: '$productCount' },
          _id: 0
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 8
      }
    ]);

    // Add growth percentages (mock for now - would calculate from historical data)
    return categoryRevenue.map(cat => ({
      ...cat,
      growth: Math.round((Math.random() * 30 - 10) * 10) / 10
    }));
  }

  static async getExternalSignalsData() {
    // This would typically come from external APIs or data sources
    // For now, return mock data
    return [
      {
        date: "Jan 15",
        type: "weather",
        impact: "positive",
        strength: 8.5,
        description: "Unusually cold winter driving demand for winter clothing",
        source: "Weather API",
      },
      {
        date: "Jan 20",
        type: "social",
        impact: "positive",
        strength: 9.2,
        description: "Viral TikTok trend featuring fitness trackers",
        source: "Social Media Analytics",
      },
      {
        date: "Jan 25",
        type: "economic",
        impact: "negative",
        strength: 6.8,
        description: "Consumer spending down 3% due to inflation concerns",
        source: "Economic Indicators",
      },
      {
        date: "Feb 01",
        type: "competitor",
        impact: "negative",
        strength: 7.5,
        description: "Major competitor launched similar product at 20% lower price",
        source: "Competitive Intelligence",
      },
      {
        date: "Feb 05",
        type: "event",
        impact: "positive",
        strength: 8.9,
        description: "Valentine's Day approaching - jewelry and gift demand surge",
        source: "Calendar Events",
      },
    ];
  }

  static async getActionableInsights() {
    const connection = await connectDB();
    
    if (!connection) {
      // Return mock insights
      return [
        {
          type: "alert",
          priority: "high",
          title: "Stock Alert",
          description: "3 products are below reorder point",
          action: "Review inventory levels",
          impact: "Prevent stockouts",
        },
        {
          type: "opportunity",
          priority: "medium",
          title: "Trending Products",
          description: "Wireless Bluetooth Headphones showing strong upward trend",
          action: "Increase marketing spend",
          impact: "Boost revenue by 15-20%",
        },
      ];
    }

    const insights = [];
    
    // Check for low stock products
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$currentStock', '$reorderPoint'] }
    });
    
    if (lowStockProducts.length > 0) {
      insights.push({
        type: "alert",
        priority: "high",
        title: "Stock Alert",
        description: `${lowStockProducts.length} products are below reorder point`,
        action: "Review inventory levels",
        impact: "Prevent stockouts",
      });
    }
    
    // Check for trending products
    const topProducts = await Product.find()
      .sort({ trendScore: -1 })
      .limit(1);
    
    if (topProducts.length > 0 && topProducts[0].trendScore >= 8) {
      insights.push({
        type: "opportunity",
        priority: "medium",
        title: "Trending Products",
        description: `${topProducts[0].name} showing strong upward trend`,
        action: "Increase marketing spend",
        impact: "Boost revenue by 15-20%",
      });
    }
    
    return insights.slice(0, 6); // Return top 6 insights
  }
}

export default DatabaseService;

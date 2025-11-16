import { ApiService } from '../api/api-service';

export class DataService {
  // Metrics Overview Data
  static async getMetricsOverview() {
    try {
      const response = await fetch('/api/dashboard/metrics-overview');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics overview');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching metrics overview:', error);
      // Fallback to mock data
      return {
        forecastAccuracy: "87.3%",
        forecastAccuracyChange: "+2.1%",
        predictedDemand: "15,420",
        predictedDemandChange: "+18.3%",
        stockRisk: "3 Products",
        stockRiskChange: "-2",
        revenueImpact: "$125K",
        revenueImpactChange: "+12.7%",
      };
    }
  }

  // Demand Forecast Chart Data
  static async getDemandForecastData(period = null) {
    try {
      const params = new URLSearchParams()
      if (period) {
        params.append('period', period.id)
        if (period.days) {
          params.append('days', period.days)
        }
        if (period.startDate) {
          params.append('startDate', period.startDate.toISOString())
        }
        if (period.endDate) {
          params.append('endDate', period.endDate.toISOString())
        }
      }

      const response = await fetch(`/api/dashboard/demand-forecast?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch demand forecast data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching demand forecast data:', error);
      // Fallback to mock data with period-based generation
      return this.generateMockForecastData(period)
    }
  }

  // Generate mock forecast data based on period
  static generateMockForecastData(period = null) {
    const now = new Date()
    const chartData = []
    
    // Determine number of data points based on period
    let historicalPoints = 8
    let forecastPoints = 6
    
    if (period) {
      switch (period.id) {
        case '7d':
          historicalPoints = 7
          forecastPoints = 7
          break
        case '30d':
          historicalPoints = 8
          forecastPoints = 6
          break
        case '90d':
          historicalPoints = 12
          forecastPoints = 8
          break
        case '1y':
          historicalPoints = 16
          forecastPoints = 12
          break
        case 'custom':
          if (period.days) {
            historicalPoints = Math.min(Math.max(Math.floor(period.days / 7), 4), 20)
            forecastPoints = Math.min(Math.max(Math.floor(period.days / 10), 4), 16)
          }
          break
      }
    }

    // Generate historical data
    for (let i = historicalPoints; i >= 1; i--) {
      const date = new Date(now)
      if (period?.id === 'custom' && period.startDate) {
        const daysDiff = Math.floor((now - period.startDate) / (1000 * 60 * 60 * 24))
        date.setDate(date.getDate() - Math.floor((daysDiff * i) / historicalPoints))
      } else {
        date.setDate(date.getDate() - i * 7)
      }
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      chartData.push({
        date: dateStr,
        historical: Math.floor(Math.random() * 1000 + 1500),
        forecast: null,
        confidence: null,
      })
    }

    // Add current week as transition point
    chartData.push({
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      historical: Math.floor(Math.random() * 1000 + 1500),
      forecast: null,
      confidence: null,
    })

    // Generate forecast data
    for (let i = 1; i <= forecastPoints; i++) {
      const date = new Date(now)
      if (period?.id === 'custom' && period.endDate) {
        const daysDiff = Math.floor((period.endDate - now) / (1000 * 60 * 60 * 24))
        date.setDate(date.getDate() + Math.floor((daysDiff * i) / forecastPoints))
      } else {
        date.setDate(date.getDate() + i * 7)
      }
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      const baseForecast = 2000 + i * 150 + Math.floor(Math.random() * 300)

      chartData.push({
        date: dateStr,
        historical: null,
        forecast: baseForecast,
        confidence: {
          upper: Math.floor(baseForecast * 1.25),
          lower: Math.floor(baseForecast * 0.8),
        },
      })
    }

    return chartData
  }

  // Product Performance Data
  static async getProductPerformanceData(limit = 10) {
    try {
      const response = await fetch(`/api/dashboard/product-performance?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product performance data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product performance data:', error);
      // Fallback to mock data
      return [
        { id: "PROD1", name: "Wireless Headphones", category: "Electronics", sales: 245, revenue: 12500, trend: "up", trendScore: 8.5, stock: 45, stockStatus: "high" },
        { id: "PROD2", name: "Fitness Tracker", category: "Electronics", sales: 189, revenue: 9800, trend: "up", trendScore: 9.2, stock: 32, stockStatus: "medium" },
        { id: "PROD3", name: "Running Shoes", category: "Sports", sales: 156, revenue: 7800, trend: "stable", trendScore: 7.8, stock: 28, stockStatus: "high" },
        { id: "PROD4", name: "Coffee Maker", category: "Home & Garden", sales: 134, revenue: 6700, trend: "up", trendScore: 8.1, stock: 15, stockStatus: "low" },
        { id: "PROD5", name: "Yoga Mat", category: "Sports", sales: 98, revenue: 4900, trend: "down", trendScore: 6.5, stock: 42, stockStatus: "high" }
      ];
    }
  }

  // Seasonal Trends Data
  static async getSeasonalTrendsData() {
    try {
      const response = await fetch('/api/dashboard/seasonal-trends');
      if (!response.ok) {
        throw new Error('Failed to fetch seasonal trends data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching seasonal trends data:', error);
      // Fallback to mock data
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
  }

  // External Signals Data
  static async getExternalSignalsData() {
    try {
      const response = await fetch('/api/dashboard/external-signals');
      if (!response.ok) {
        throw new Error('Failed to fetch external signals data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching external signals data:', error);
      // Fallback to mock data
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
  }

  // Actionable Insights Data
  static async getActionableInsights() {
    try {
      const response = await fetch('/api/dashboard/actionable-insights');
      if (!response.ok) {
        throw new Error('Failed to fetch actionable insights data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching actionable insights data:', error);
      // Fallback to mock data
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
  }

  // Category Performance Data
  static async getCategoryPerformance() {
    try {
      const response = await fetch('/api/dashboard/category-performance');
      if (!response.ok) {
        throw new Error('Failed to fetch category performance data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching category performance data:', error);
      // Fallback to mock data
      return [
        { category: "Electronics", revenue: 125000, growth: 12.5, products: 45 },
        { category: "Fashion", revenue: 98000, growth: 8.3, products: 38 },
        { category: "Home & Garden", revenue: 76000, growth: 15.2, products: 32 },
        { category: "Health & Beauty", revenue: 54000, growth: 6.7, products: 28 },
        { category: "Sports & Outdoors", revenue: 42000, growth: 9.8, products: 25 },
        { category: "Books", revenue: 32000, growth: 4.1, products: 18 },
      ];
    }
  }

  // Search products
  static async searchProducts(query) {
    try {
      const response = await ApiService.getProducts({ search: query, limit: 50 });
      return response.products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Get product details
  static async getProductDetails(productId) {
    try {
      const response = await ApiService.getProducts({ productId, limit: 1 });
      return response.products?.[0] || null;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  }

  // Get sales history for a product
  static async getProductSalesHistory(productId) {
    try {
      const response = await ApiService.getSales({ product_id: productId, limit: 100 });
      return response.sales || [];
    } catch (error) {
      console.error('Error fetching product sales history:', error);
      return [];
    }
  }

  // Get top performing products
  static async getTopPerformingProducts(limit = 10) {
    try {
      const response = await ApiService.getProducts({ limit, sort: 'trend_score' });
      return response.products || [];
    } catch (error) {
      console.error('Error fetching top performing products:', error);
      return [];
    }
  }

  // Get low stock products
  static async getLowStockProducts() {
    try {
      const response = await ApiService.getProducts({ low_stock: true });
      return response.products || [];
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }
}

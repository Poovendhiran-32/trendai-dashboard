// Mock API service that uses local data instead of making HTTP requests
import { DataService } from '../data/data-service';

class MockApiService {
  // Mock getMetrics for initial metrics fetch
  static async getMetrics() {
    return MockApiService._generateRandomMetrics();
  }

  // Mock WebSocket connection for real-time metrics
  static createWebSocketConnection() {
    // Simple EventTarget-based mock WebSocket
    class MockWebSocket {
      constructor() {
        this.readyState = 1; // OPEN
        this.onopen = null;
        this.onmessage = null;
        this.onclose = null;
        this.onerror = null;
        setTimeout(() => this.onopen && this.onopen(), 100);
        this._interval = setInterval(() => {
          if (this.onmessage) {
            const metrics = MockApiService._generateRandomMetrics();
            this.onmessage({
              data: JSON.stringify({ type: 'metrics_update', data: metrics })
            });
          }
        }, 2000);
      }
      send() {}
      close() {
        clearInterval(this._interval);
        this.readyState = 3;
        if (this.onclose) this.onclose();
      }
    }
    return new MockWebSocket();
  }
  static _generateRandomMetrics() {
    // Simulate realistic random metrics
    const total_revenue = Math.floor(Math.random() * 100000) + 100000;
    const total_orders = Math.floor(Math.random() * 1000) + 500;
    const avg_order_value = total_revenue / total_orders;
    const conversion_rate = Math.random() * 5 + 1; // 1% - 6%
    return {
      total_revenue,
      total_orders,
      avg_order_value,
      conversion_rate,
    };
  }

  // Health check
  static async healthCheck() {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      connections: 1
    };
  }

  // Products API
  static async getProducts(params = {}) {
    const { category, limit = 100, offset = 0 } = params;
    
    let filteredProducts = DataService.getProductPerformanceData();
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    
    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      limit,
      offset
    };
  }

  // Sales API
  static async getSales(params = {}) {
    const { product_id, region, channel, days = 30, limit = 1000 } = params;
    
    // Get sales data from the dataset
    const salesData = DataService.getSalesDataByDateRange(
      new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      new Date().toISOString().split("T")[0]
    );
    
    let filteredSales = salesData;
    
    if (product_id) {
      filteredSales = filteredSales.filter(s => s.productId === product_id);
    }
    if (region) {
      filteredSales = filteredSales.filter(s => s.region === region);
    }
    if (channel) {
      filteredSales = filteredSales.filter(s => s.channel === channel);
    }
    
    return {
      sales: filteredSales.slice(0, limit),
      total: filteredSales.length,
      limit
    };
  }

  // Metrics API
  static async getMetrics(hours = 24) {
    const salesData = DataService.getSalesDataByDateRange(
      new Date(Date.now() - hours * 60 * 60 * 1000).toISOString().split("T")[0],
      new Date().toISOString().split("T")[0]
    );
    
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.revenue, 0);
    const totalOrders = salesData.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalQuantity = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
    
    return {
      total_revenue: Math.round(totalRevenue * 100) / 100,
      total_orders: totalOrders,
      avg_order_value: Math.round(avgOrderValue * 100) / 100,
      total_quantity: totalQuantity,
      conversion_rate: Math.round((2.5 + Math.random() * 2) * 100) / 100,
      period_hours: hours,
      timestamp: new Date().toISOString()
    };
  }

  // WebSocket connection helper (mock)
  static createWebSocketConnection() {
    // Return a mock WebSocket that immediately connects
    const mockWs = {
      readyState: 1, // OPEN
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      send: (data) => {
        // Mock sending data
        console.log('Mock WebSocket send:', data);
      },
      close: () => {
        // Mock closing
        console.log('Mock WebSocket closed');
      }
    };
    
    // Simulate immediate connection
    setTimeout(() => {
      if (mockWs.onopen) {
        mockWs.onopen();
      }
      
      // Simulate periodic metrics updates
      const sendMockMetrics = () => {
        if (mockWs.onmessage) {
          const mockMetrics = {
            type: 'metrics_update',
            data: {
              total_revenue: Math.floor(Math.random() * 50000 + 10000),
              total_orders: Math.floor(Math.random() * 500 + 100),
              avg_order_value: Math.floor(Math.random() * 200 + 50),
              conversion_rate: Math.round((Math.random() * 2 + 2.5) * 100) / 100
            }
          };
          mockWs.onmessage({ data: JSON.stringify(mockMetrics) });
        }
      };
      
      // Send initial metrics after connection
      setTimeout(sendMockMetrics, 200);
      
      // Send periodic updates every 5 seconds
      setInterval(sendMockMetrics, 5000);
    }, 100);
    
    return mockWs;
  }
}

export default MockApiService;



import axios from 'axios';
import MockApiService from './mock-api-service';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 5000, // Reduced timeout for faster fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API Service class with fallback to mock data
export class ApiService {
  // Metrics API
  static async getMetrics(hours = 24) {
    try {
      const response = await apiClient.get('/api/metrics', { params: { hours } });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock metrics:', error.message);
      return await MockApiService.getMetrics(hours);
    }
  }

  // WebSocket connection for real-time metrics
  static createWebSocketConnection() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || '';
    if (wsUrl) {
      return new WebSocket(wsUrl);
    }
    // Fallback to mock WebSocket if no URL is set
    return MockApiService.createWebSocketConnection();
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await apiClient.get('/api/health');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data:', error.message);
      return await MockApiService.healthCheck();
    }
  }

  // Products API
  static async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/api/products', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data:', error.message);
      return await MockApiService.getProducts(params);
    }
  }

  // Sales API
  static async getSales(params = {}) {
    try {
      const response = await apiClient.get('/api/sales', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data:', error.message);
      return await MockApiService.getSales(params);
    }
  }

  // Metrics API
  static async getMetrics(hours = 24) {
    try {
      const response = await apiClient.get('/api/metrics', {
        params: { hours }
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data:', error.message);
      return await MockApiService.getMetrics(hours);
    }
  }

  // WebSocket connection helper
  static createWebSocketConnection() {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
      return new WebSocket(wsUrl);
    } catch (error) {
      console.warn('WebSocket not available, using mock connection:', error.message);
      return MockApiService.createWebSocketConnection();
    }
  }

  // Auth APIs
  static async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Data Management APIs
  static async uploadDataset(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await apiClient.post('/data/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getDatasets(params = {}) {
    try {
      const response = await apiClient.get('/data/datasets', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getDataset(datasetId, includeData = false) {
    try {
      const response = await apiClient.get(`/data/datasets/${datasetId}`, {
        params: { include_data: includeData }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteDataset(datasetId) {
    try {
      const response = await apiClient.delete(`/data/datasets/${datasetId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Prediction APIs
  static async analyzeDataset(datasetId, dateColumn, valueColumn, forecastPeriods = 30) {
    try {
      const response = await apiClient.post('/predict/analyze', {
        datasetId,
        dateColumn,
        valueColumn,
        forecastPeriods,
        modelType: 'arima'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getTrends(datasetId, dateColumn, valueColumn) {
    try {
      const response = await apiClient.get(`/predict/trends/${datasetId}`, {
        params: { date_column: dateColumn, value_column: valueColumn }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getSeasonality(datasetId, dateColumn, valueColumn) {
    try {
      const response = await apiClient.get(`/predict/seasonality/${datasetId}`, {
        params: { date_column: dateColumn, value_column: valueColumn }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getPredictions(datasetId = null) {
    try {
      const params = datasetId ? { dataset_id: datasetId } : {};
      const response = await apiClient.get('/data/predictions', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin APIs
  static async getAllUsers(params = {}) {
    try {
      const response = await apiClient.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getUser(userId) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserStatus(userId, isActive) {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/status`, null, {
        params: { is_active: isActive }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getSystemStats() {
    try {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ApiService;


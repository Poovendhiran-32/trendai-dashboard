import mongoose from 'mongoose';

// Product Schema
const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  reorderPoint: {
    type: Number,
    required: true,
    default: 10
  },
  supplier: {
    type: String,
    required: true
  },
  seasonality: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  trendScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  salesVelocity: {
    type: Number,
    default: 0
  },
  predictedDemand: {
    type: Number,
    default: 0
  },
  forecastAccuracy: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  }
}, {
  timestamps: true
});

// Sales Schema
const salesSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  revenue: {
    type: Number,
    required: true,
    min: 0
  },
  channel: {
    type: String,
    enum: ['online', 'retail', 'wholesale'],
    required: true
  },
  region: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  userId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Metrics Schema (for storing calculated metrics)
const metricsSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true // e.g., '24h', '7d', '30d'
  },
  totalRevenue: {
    type: Number,
    required: true
  },
  totalOrders: {
    type: Number,
    required: true
  },
  avgOrderValue: {
    type: Number,
    required: true
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  conversionRate: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'viewer', 'Business Analyst', 'Data Analyst', 'Operations Manager', 'Supply Chain Manager', 'Marketing Manager', 'Sales Manager', 'CEO/Founder', 'Other'],
    default: 'user'
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Alert Schema
const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['stock', 'trend', 'forecast', 'system'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    ref: 'Product'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create models
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Sale = mongoose.models.Sale || mongoose.model('Sale', salesSchema);
export const Metrics = mongoose.models.Metrics || mongoose.model('Metrics', metricsSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema);

export default {
  Product,
  Sale,
  Metrics,
  User,
  Alert
};

// Large product dataset (500+ products)
export const products = [
  // Electronics
  {
    id: "ELEC001",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 89.99,
    currentStock: 245,
    reorderPoint: 50,
    supplier: "TechCorp",
    seasonality: "high",
    trendScore: 8.5,
  },
  {
    id: "ELEC002",
    name: "Smart Fitness Tracker",
    category: "Electronics",
    price: 129.99,
    currentStock: 180,
    reorderPoint: 40,
    supplier: "FitTech",
    seasonality: "medium",
    trendScore: 9.2,
  },
  {
    id: "ELEC003",
    name: "4K Webcam",
    category: "Electronics",
    price: 199.99,
    currentStock: 95,
    reorderPoint: 25,
    supplier: "VisionTech",
    seasonality: "low",
    trendScore: 7.8,
  },
  {
    id: "ELEC004",
    name: "Portable Power Bank 20000mAh",
    category: "Electronics",
    price: 45.99,
    currentStock: 320,
    reorderPoint: 75,
    supplier: "PowerPlus",
    seasonality: "medium",
    trendScore: 8.1,
  },
  {
    id: "ELEC005",
    name: "Gaming Mechanical Keyboard",
    category: "Electronics",
    price: 159.99,
    currentStock: 140,
    reorderPoint: 30,
    supplier: "GameGear",
    seasonality: "high",
    trendScore: 8.9,
  },

  // Fashion
  {
    id: "FASH001",
    name: "Premium Cotton T-Shirt",
    category: "Fashion",
    price: 24.99,
    currentStock: 450,
    reorderPoint: 100,
    supplier: "StyleCo",
    seasonality: "high",
    trendScore: 7.5,
  },
  {
    id: "FASH002",
    name: "Denim Skinny Jeans",
    category: "Fashion",
    price: 79.99,
    currentStock: 280,
    reorderPoint: 60,
    supplier: "DenimWorks",
    seasonality: "medium",
    trendScore: 8.3,
  },
  {
    id: "FASH003",
    name: "Winter Wool Coat",
    category: "Fashion",
    price: 199.99,
    currentStock: 85,
    reorderPoint: 20,
    supplier: "WarmWear",
    seasonality: "high",
    trendScore: 9.1,
  },
  {
    id: "FASH004",
    name: "Athletic Running Shoes",
    category: "Fashion",
    price: 119.99,
    currentStock: 195,
    reorderPoint: 45,
    supplier: "SportStep",
    seasonality: "medium",
    trendScore: 8.7,
  },
  {
    id: "FASH005",
    name: "Leather Crossbody Bag",
    category: "Fashion",
    price: 89.99,
    currentStock: 165,
    reorderPoint: 35,
    supplier: "LeatherCraft",
    seasonality: "low",
    trendScore: 7.9,
  },

  // Home & Garden
  {
    id: "HOME001",
    name: "Smart LED Light Bulbs (4-pack)",
    category: "Home & Garden",
    price: 39.99,
    currentStock: 380,
    reorderPoint: 80,
    supplier: "SmartHome",
    seasonality: "low",
    trendScore: 8.4,
  },
  {
    id: "HOME002",
    name: "Ceramic Plant Pots Set",
    category: "Home & Garden",
    price: 29.99,
    currentStock: 220,
    reorderPoint: 50,
    supplier: "GardenPlus",
    seasonality: "high",
    trendScore: 7.6,
  },
  {
    id: "HOME003",
    name: "Memory Foam Pillow",
    category: "Home & Garden",
    price: 49.99,
    currentStock: 155,
    reorderPoint: 35,
    supplier: "ComfortSleep",
    seasonality: "medium",
    trendScore: 8.2,
  },
  {
    id: "HOME004",
    name: "Stainless Steel Kitchen Knife Set",
    category: "Home & Garden",
    price: 129.99,
    currentStock: 95,
    reorderPoint: 25,
    supplier: "ChefTools",
    seasonality: "low",
    trendScore: 8.8,
  },
  {
    id: "HOME005",
    name: "Bamboo Cutting Board",
    category: "Home & Garden",
    price: 34.99,
    currentStock: 275,
    reorderPoint: 60,
    supplier: "EcoKitchen",
    seasonality: "medium",
    trendScore: 7.7,
  },

  // Health & Beauty
  {
    id: "HEAL001",
    name: "Vitamin D3 Supplements",
    category: "Health & Beauty",
    price: 19.99,
    currentStock: 420,
    reorderPoint: 90,
    supplier: "HealthFirst",
    seasonality: "high",
    trendScore: 8.6,
  },
  {
    id: "HEAL002",
    name: "Organic Face Moisturizer",
    category: "Health & Beauty",
    price: 34.99,
    currentStock: 185,
    reorderPoint: 40,
    supplier: "NaturalGlow",
    seasonality: "medium",
    trendScore: 8.0,
  },
  {
    id: "HEAL003",
    name: "Electric Toothbrush",
    category: "Health & Beauty",
    price: 79.99,
    currentStock: 125,
    reorderPoint: 30,
    supplier: "DentalCare",
    seasonality: "low",
    trendScore: 8.5,
  },
  {
    id: "HEAL004",
    name: "Protein Powder Vanilla",
    category: "Health & Beauty",
    price: 49.99,
    currentStock: 240,
    reorderPoint: 55,
    supplier: "FitNutrition",
    seasonality: "medium",
    trendScore: 9.0,
  },
  {
    id: "HEAL005",
    name: "Essential Oil Diffuser",
    category: "Health & Beauty",
    price: 59.99,
    currentStock: 160,
    reorderPoint: 35,
    supplier: "AromaLife",
    seasonality: "high",
    trendScore: 7.8,
  },

  // Sports & Outdoors
  {
    id: "SPOR001",
    name: "Yoga Mat Premium",
    category: "Sports & Outdoors",
    price: 39.99,
    currentStock: 290,
    reorderPoint: 65,
    supplier: "YogaZen",
    seasonality: "medium",
    trendScore: 8.3,
  },
  {
    id: "SPOR002",
    name: "Camping Tent 4-Person",
    category: "Sports & Outdoors",
    price: 199.99,
    currentStock: 75,
    reorderPoint: 20,
    supplier: "OutdoorGear",
    seasonality: "high",
    trendScore: 8.9,
  },
  {
    id: "SPOR003",
    name: "Resistance Bands Set",
    category: "Sports & Outdoors",
    price: 24.99,
    currentStock: 350,
    reorderPoint: 75,
    supplier: "FitEquip",
    seasonality: "low",
    trendScore: 8.1,
  },
  {
    id: "SPOR004",
    name: "Water Bottle Insulated",
    category: "Sports & Outdoors",
    price: 29.99,
    currentStock: 410,
    reorderPoint: 85,
    supplier: "HydroTech",
    seasonality: "medium",
    trendScore: 7.9,
  },
  {
    id: "SPOR005",
    name: "Hiking Backpack 40L",
    category: "Sports & Outdoors",
    price: 149.99,
    currentStock: 110,
    reorderPoint: 25,
    supplier: "TrailMaster",
    seasonality: "high",
    trendScore: 8.7,
  },
]

// Generate additional products to reach 500+
const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Health & Beauty",
  "Sports & Outdoors",
  "Books",
  "Toys",
  "Automotive",
  "Pet Supplies",
  "Office Supplies",
]
const suppliers = [
  "TechCorp",
  "StyleCo",
  "SmartHome",
  "HealthFirst",
  "OutdoorGear",
  "BookWorld",
  "ToyLand",
  "AutoParts",
  "PetCare",
  "OfficeMax",
]

for (let i = 26; i <= 500; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)]
  const supplier = suppliers[Math.floor(Math.random() * suppliers.length)]
  const seasonality = ["high", "medium", "low"][Math.floor(Math.random() * 3)]

  products.push({
    id: `PROD${i.toString().padStart(3, "0")}`,
    name: `Product ${i} - ${category}`,
    category,
    price: Math.round((Math.random() * 200 + 10) * 100) / 100,
    currentStock: Math.floor(Math.random() * 500 + 50),
    reorderPoint: Math.floor(Math.random() * 100 + 20),
    supplier,
    seasonality,
    trendScore: Math.round((Math.random() * 4 + 6) * 10) / 10,
  })
}

// Generate historical sales data (10,000+ records)
export const salesData = []
const channels = ["online", "retail", "wholesale"]
const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"]

// Generate historical data (past year)
for (let i = 0; i < 8000; i++) {
  const product = products[Math.floor(Math.random() * products.length)]
  const quantity = Math.floor(Math.random() * 50 + 1)
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 365))

  salesData.push({
    date: date.toISOString().split("T")[0],
    productId: product.id,
    quantity,
    revenue: Math.round(quantity * product.price * 100) / 100,
    channel: channels[Math.floor(Math.random() * channels.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
  })
}

// Generate recent data (last 7 days) for real-time metrics
for (let i = 0; i < 2000; i++) {
  const product = products[Math.floor(Math.random() * products.length)]
  const quantity = Math.floor(Math.random() * 50 + 1)
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 7)) // Last 7 days

  salesData.push({
    date: date.toISOString().split("T")[0],
    productId: product.id,
    quantity,
    revenue: Math.round(quantity * product.price * 100) / 100,
    channel: channels[Math.floor(Math.random() * channels.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
  })
}

// Generate today's data to ensure real-time metrics work
const today = new Date().toISOString().split("T")[0]
for (let i = 0; i < 100; i++) {
  const product = products[Math.floor(Math.random() * products.length)]
  const quantity = Math.floor(Math.random() * 20 + 1)
  
  salesData.push({
    date: today,
    productId: product.id,
    quantity,
    revenue: Math.round(quantity * product.price * 100) / 100,
    channel: channels[Math.floor(Math.random() * channels.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
  })
}

// Generate forecast data for next 12 weeks
export const forecastData = []
const topProducts = products.slice(0, 50) // Focus on top 50 products for forecasting

topProducts.forEach((product) => {
  for (let week = 0; week < 12; week++) {
    const date = new Date()
    date.setDate(date.getDate() + week * 7)

    const baseValue = Math.floor(Math.random() * 1000 + 500)
    const seasonalMultiplier = product.seasonality === "high" ? 1.3 : product.seasonality === "medium" ? 1.1 : 1.0
    const forecast = Math.floor(baseValue * seasonalMultiplier)

    forecastData.push({
      date: date.toISOString().split("T")[0],
      productId: product.id,
      historical: week < 4 ? Math.floor(forecast * (0.8 + Math.random() * 0.4)) : null,
      forecast: week >= 4 ? forecast : null,
      confidence:
        week >= 4
          ? {
              upper: Math.floor(forecast * 1.2),
              lower: Math.floor(forecast * 0.8),
            }
          : null,
      accuracy: 0.85 + Math.random() * 0.1,
    })
  }
})

// Generate external signals data
export const externalSignals = [
  {
    date: "2024-01-15",
    type: "weather",
    impact: "positive",
    strength: 8.5,
    description: "Unusually cold winter driving demand for winter clothing",
    source: "Weather API",
  },
  {
    date: "2024-01-20",
    type: "social",
    impact: "positive",
    strength: 9.2,
    description: "Viral TikTok trend featuring fitness trackers",
    source: "Social Media Analytics",
  },
  {
    date: "2024-01-25",
    type: "economic",
    impact: "negative",
    strength: 6.8,
    description: "Consumer spending down 3% due to inflation concerns",
    source: "Economic Indicators",
  },
  {
    date: "2024-02-01",
    type: "competitor",
    impact: "negative",
    strength: 7.5,
    description: "Major competitor launched similar product at 20% lower price",
    source: "Competitive Intelligence",
  },
  {
    date: "2024-02-05",
    type: "event",
    impact: "positive",
    strength: 8.9,
    description: "Valentine's Day approaching - jewelry and gift demand surge",
    source: "Calendar Events",
  },
]

// Generate seasonal patterns
export const seasonalPatterns = [
  { month: "January", category: "Electronics", multiplier: 0.8, confidence: 0.92, historicalAverage: 2400 },
  { month: "February", category: "Electronics", multiplier: 0.9, confidence: 0.88, historicalAverage: 2700 },
  { month: "March", category: "Electronics", multiplier: 1.1, confidence: 0.91, historicalAverage: 3300 },
  { month: "April", category: "Electronics", multiplier: 1.0, confidence: 0.89, historicalAverage: 3000 },
  { month: "May", category: "Electronics", multiplier: 1.2, confidence: 0.93, historicalAverage: 3600 },
  { month: "June", category: "Electronics", multiplier: 1.3, confidence: 0.95, historicalAverage: 3900 },
  { month: "July", category: "Electronics", multiplier: 1.1, confidence: 0.87, historicalAverage: 3300 },
  { month: "August", category: "Electronics", multiplier: 1.0, confidence: 0.9, historicalAverage: 3000 },
  { month: "September", category: "Electronics", multiplier: 1.4, confidence: 0.96, historicalAverage: 4200 },
  { month: "October", category: "Electronics", multiplier: 1.2, confidence: 0.94, historicalAverage: 3600 },
  { month: "November", category: "Electronics", multiplier: 1.8, confidence: 0.98, historicalAverage: 5400 },
  { month: "December", category: "Electronics", multiplier: 2.1, confidence: 0.97, historicalAverage: 6300 },

  { month: "January", category: "Fashion", multiplier: 0.7, confidence: 0.89, historicalAverage: 1400 },
  { month: "February", category: "Fashion", multiplier: 1.2, confidence: 0.92, historicalAverage: 2400 },
  { month: "March", category: "Fashion", multiplier: 1.4, confidence: 0.94, historicalAverage: 2800 },
  { month: "April", category: "Fashion", multiplier: 1.3, confidence: 0.91, historicalAverage: 2600 },
  { month: "May", category: "Fashion", multiplier: 1.1, confidence: 0.88, historicalAverage: 2200 },
  { month: "June", category: "Fashion", multiplier: 1.0, confidence: 0.87, historicalAverage: 2000 },
  { month: "July", category: "Fashion", multiplier: 0.9, confidence: 0.85, historicalAverage: 1800 },
  { month: "August", category: "Fashion", multiplier: 1.2, confidence: 0.9, historicalAverage: 2400 },
  { month: "September", category: "Fashion", multiplier: 1.5, confidence: 0.95, historicalAverage: 3000 },
  { month: "October", category: "Fashion", multiplier: 1.3, confidence: 0.93, historicalAverage: 2600 },
  { month: "November", category: "Fashion", multiplier: 1.7, confidence: 0.96, historicalAverage: 3400 },
  { month: "December", category: "Fashion", multiplier: 1.4, confidence: 0.94, historicalAverage: 2800 },
]

// Data aggregation functions
export function getProductsByCategory(category) {
  return products.filter((p) => p.category === category)
}

export function getTopPerformingProducts(limit = 10) {
  return products.sort((a, b) => b.trendScore - a.trendScore).slice(0, limit)
}

export function getLowStockProducts() {
  return products.filter((p) => p.currentStock <= p.reorderPoint)
}

export function getSalesDataByDateRange(startDate, endDate) {
  return salesData.filter((s) => s.date >= startDate && s.date <= endDate)
}

export function getRevenueByCategory() {
  const categoryRevenue = new Map()

  salesData.forEach((sale) => {
    const product = products.find((p) => p.id === sale.productId)
    if (product) {
      const current = categoryRevenue.get(product.category) || 0
      categoryRevenue.set(product.category, current + sale.revenue)
    }
  })

  return Array.from(categoryRevenue.entries()).map(([category, revenue]) => ({
    category,
    revenue: Math.round(revenue * 100) / 100,
  }))
}

export function getForecastAccuracy() {
  const accuracies = forecastData.filter((f) => f.accuracy).map((f) => f.accuracy)

  return accuracies.length > 0
    ? Math.round((accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length) * 100) / 100
    : 0
}

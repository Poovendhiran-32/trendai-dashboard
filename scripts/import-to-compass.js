// Data import script for MongoDB Compass
// Copy this data and import it into your MongoDB Compass

const products = [
  {
    "id": "ELEC001",
    "name": "Wireless Bluetooth Headphones",
    "category": "Electronics",
    "price": 89.99,
    "currentStock": 245,
    "reorderPoint": 50,
    "supplier": "TechCorp",
    "seasonality": "high",
    "trendScore": 8.5,
    "salesVelocity": 85,
    "predictedDemand": 2550,
    "forecastAccuracy": 92,
    "riskLevel": "low"
  },
  {
    "id": "ELEC002",
    "name": "Smart Fitness Tracker",
    "category": "Electronics",
    "price": 129.99,
    "currentStock": 180,
    "reorderPoint": 40,
    "supplier": "FitTech",
    "seasonality": "medium",
    "trendScore": 9.2,
    "salesVelocity": 92,
    "predictedDemand": 2760,
    "forecastAccuracy": 88,
    "riskLevel": "low"
  },
  {
    "id": "ELEC003",
    "name": "4K Webcam",
    "category": "Electronics",
    "price": 199.99,
    "currentStock": 95,
    "reorderPoint": 25,
    "supplier": "VisionTech",
    "seasonality": "low",
    "trendScore": 7.8,
    "salesVelocity": 78,
    "predictedDemand": 2340,
    "forecastAccuracy": 85,
    "riskLevel": "medium"
  }
];

const sales = [
  {
    "productId": "ELEC001",
    "quantity": 5,
    "revenue": 449.95,
    "channel": "online",
    "region": "North America",
    "date": "2024-09-21T00:00:00.000Z"
  },
  {
    "productId": "ELEC002",
    "quantity": 3,
    "revenue": 389.97,
    "channel": "retail",
    "region": "Europe",
    "date": "2024-09-21T00:00:00.000Z"
  },
  {
    "productId": "ELEC003",
    "quantity": 2,
    "revenue": 399.98,
    "channel": "wholesale",
    "region": "Asia Pacific",
    "date": "2024-09-21T00:00:00.000Z"
  }
];

console.log("Products to import:", JSON.stringify(products, null, 2));
console.log("\nSales to import:", JSON.stringify(sales, null, 2));

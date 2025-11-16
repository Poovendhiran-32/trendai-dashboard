# Mock dataset for the backend
import random
from datetime import datetime, timedelta

# Generate products data
products = []
categories = ["Electronics", "Fashion", "Home & Garden", "Health & Beauty", "Sports & Outdoors"]
suppliers = ["TechCorp", "StyleCo", "SmartHome", "HealthFirst", "OutdoorGear"]

for i in range(100):
    products.append({
        "id": f"PROD{i:03d}",
        "name": f"Product {i}",
        "category": random.choice(categories),
        "price": round(random.uniform(10, 500), 2),
        "currentStock": random.randint(50, 500),
        "reorderPoint": random.randint(20, 100),
        "supplier": random.choice(suppliers),
        "seasonality": random.choice(["high", "medium", "low"]),
        "trendScore": round(random.uniform(6, 10), 1),
    })

# Generate sales data
salesData = []
channels = ["online", "retail", "wholesale"]
regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"]

for i in range(1000):
    product = random.choice(products)
    quantity = random.randint(1, 50)
    date = datetime.now() - timedelta(days=random.randint(0, 365))
    
    salesData.append({
        "date": date.strftime("%Y-%m-%d"),
        "productId": product["id"],
        "quantity": quantity,
        "revenue": round(quantity * product["price"], 2),
        "channel": random.choice(channels),
        "region": random.choice(regions),
    })

# Generate forecast data
forecastData = []
for i in range(50):
    for week in range(12):
        date = datetime.now() + timedelta(weeks=week)
        forecastData.append({
            "date": date.strftime("%Y-%m-%d"),
            "productId": products[i]["id"],
            "historical": None if week >= 4 else random.randint(100, 1000),
            "forecast": None if week < 4 else random.randint(100, 1000),
            "confidence": {
                "upper": random.randint(120, 1200),
                "lower": random.randint(80, 800)
            } if week >= 4 else None,
            "accuracy": round(random.uniform(0.8, 0.95), 2)
        })

# Generate external signals
externalSignals = [
    {
        "date": "2024-01-15",
        "type": "weather",
        "impact": "positive",
        "strength": 8.5,
        "description": "Unusually cold winter driving demand for winter clothing",
        "source": "Weather API",
    },
    {
        "date": "2024-01-20",
        "type": "social",
        "impact": "positive",
        "strength": 9.2,
        "description": "Viral TikTok trend featuring fitness trackers",
        "source": "Social Media Analytics",
    },
    {
        "date": "2024-01-25",
        "type": "economic",
        "impact": "negative",
        "strength": 6.8,
        "description": "Consumer spending down 3% due to inflation concerns",
        "source": "Economic Indicators",
    },
]

# Generate seasonal patterns
seasonalPatterns = []
for month in ["January", "February", "March", "April", "May", "June", 
              "July", "August", "September", "October", "November", "December"]:
    for category in categories:
        seasonalPatterns.append({
            "month": month,
            "category": category,
            "multiplier": round(random.uniform(0.7, 2.1), 1),
            "confidence": round(random.uniform(0.85, 0.98), 2),
            "historicalAverage": random.randint(1000, 5000)
        })



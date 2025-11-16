import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import random
import json

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "trendai_dashboard"

async def setup_database():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    print("Setting up TrendAI Dashboard database...")
    
    # Clear existing data
    await db.products.delete_many({})
    await db.sales.delete_many({})
    
    # Sample product categories
    categories = [
        "Electronics", "Clothing", "Home & Garden", "Sports", "Books",
        "Beauty", "Automotive", "Toys", "Food", "Health"
    ]
    
    # Generate sample products
    products = []
    for i in range(500):
        product = {
            "id": f"prod_{i+1}",
            "name": f"Product {i+1}",
            "category": random.choice(categories),
            "price": round(random.uniform(10, 1000), 2),
            "stock": random.randint(0, 1000),
            "sales_velocity": round(random.uniform(0.1, 10.0), 2),
            "trend_score": round(random.uniform(1, 100), 1),
            "last_updated": datetime.now()
        }
        products.append(product)
    
    await db.products.insert_many(products)
    print(f"Inserted {len(products)} products")
    
    # Generate sample sales data
    sales = []
    regions = ["North", "South", "East", "West", "Central"]
    channels = ["online", "retail", "mobile", "wholesale"]
    
    # Generate sales for the last 90 days
    base_date = datetime.now() - timedelta(days=90)
    
    for i in range(10000):  # 10,000 sales records
        sale_date = base_date + timedelta(
            days=random.randint(0, 90),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        product_id = f"prod_{random.randint(1, 500)}"
        quantity = random.randint(1, 10)
        unit_price = round(random.uniform(10, 1000), 2)
        
        sale = {
            "id": f"sale_{i+1}",
            "product_id": product_id,
            "quantity": quantity,
            "revenue": round(quantity * unit_price, 2),
            "date": sale_date,
            "region": random.choice(regions),
            "channel": random.choice(channels)
        }
        sales.append(sale)
    
    await db.sales.insert_many(sales)
    print(f"Inserted {len(sales)} sales records")
    
    # Create indexes for better performance
    await db.products.create_index("id")
    await db.products.create_index("category")
    await db.sales.create_index("product_id")
    await db.sales.create_index("date")
    await db.sales.create_index("region")
    
    print("Database setup completed!")
    client.close()

if __name__ == "__main__":
    asyncio.run(setup_database())

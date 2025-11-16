from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import IndexModel, ASCENDING, DESCENDING
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None

# Database instance
db_instance = Database()

async def connect_to_mongo():
    """Create database connection"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "trendai_dashboard")
    
    logger.info(f"Connecting to MongoDB at {mongodb_url}")
    
    db_instance.client = AsyncIOMotorClient(mongodb_url)
    db_instance.database = db_instance.client[database_name]
    
    # Test connection
    try:
        await db_instance.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if db_instance.client:
        db_instance.client.close()
        logger.info("Disconnected from MongoDB")

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db_instance.database

async def create_indexes():
    """Create database indexes for optimal performance"""
    db = await get_database()
    
    # Products collection indexes
    products_indexes = [
        IndexModel([("id", ASCENDING)], unique=True),
        IndexModel([("category", ASCENDING)]),
        IndexModel([("price", ASCENDING)]),
        IndexModel([("stock", ASCENDING)]),
        IndexModel([("trend_score", DESCENDING)]),
        IndexModel([("sales_velocity", DESCENDING)]),
        IndexModel([("last_updated", DESCENDING)]),
        IndexModel([("category", ASCENDING), ("trend_score", DESCENDING)]),
    ]
    
    # Sales collection indexes
    sales_indexes = [
        IndexModel([("id", ASCENDING)], unique=True),
        IndexModel([("product_id", ASCENDING)]),
        IndexModel([("date", DESCENDING)]),
        IndexModel([("region", ASCENDING)]),
        IndexModel([("channel", ASCENDING)]),
        IndexModel([("revenue", DESCENDING)]),
        IndexModel([("product_id", ASCENDING), ("date", DESCENDING)]),
        IndexModel([("date", DESCENDING), ("region", ASCENDING)]),
        IndexModel([("date", DESCENDING), ("channel", ASCENDING)]),
    ]
    
    # Customers collection indexes
    customers_indexes = [
        IndexModel([("id", ASCENDING)], unique=True),
        IndexModel([("email", ASCENDING)], unique=True, sparse=True),
        IndexModel([("region", ASCENDING)]),
        IndexModel([("lifetime_value", DESCENDING)]),
        IndexModel([("acquisition_date", DESCENDING)]),
        IndexModel([("last_order_date", DESCENDING)]),
    ]
    
    # Trends collection indexes
    trends_indexes = [
        IndexModel([("product_id", ASCENDING)]),
        IndexModel([("trend_direction", ASCENDING)]),
        IndexModel([("trend_strength", DESCENDING)]),
        IndexModel([("period_end", DESCENDING)]),
        IndexModel([("confidence_score", DESCENDING)]),
    ]
    
    # External signals collection indexes
    signals_indexes = [
        IndexModel([("id", ASCENDING)], unique=True),
        IndexModel([("source", ASCENDING)]),
        IndexModel([("signal_type", ASCENDING)]),
        IndexModel([("timestamp", DESCENDING)]),
        IndexModel([("impact_score", DESCENDING)]),
        IndexModel([("related_products", ASCENDING)]),
    ]
    
    # Forecasts collection indexes
    forecasts_indexes = [
        IndexModel([("product_id", ASCENDING)]),
        IndexModel([("date", ASCENDING)]),
        IndexModel([("model_used", ASCENDING)]),
        IndexModel([("product_id", ASCENDING), ("date", ASCENDING)]),
    ]
    
    # Inventory alerts collection indexes
    alerts_indexes = [
        IndexModel([("id", ASCENDING)], unique=True),
        IndexModel([("product_id", ASCENDING)]),
        IndexModel([("alert_type", ASCENDING)]),
        IndexModel([("severity", ASCENDING)]),
        IndexModel([("resolved", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)]),
    ]
    
    try:
        # Create indexes for all collections
        await db.products.create_indexes(products_indexes)
        await db.sales.create_indexes(sales_indexes)
        await db.customers.create_indexes(customers_indexes)
        await db.trends.create_indexes(trends_indexes)
        await db.external_signals.create_indexes(signals_indexes)
        await db.forecasts.create_indexes(forecasts_indexes)
        await db.inventory_alerts.create_indexes(alerts_indexes)
        
        logger.info("Successfully created all database indexes")
        
    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")
        raise

# Collection helpers
async def get_products_collection():
    db = await get_database()
    return db.products

async def get_sales_collection():
    db = await get_database()
    return db.sales

async def get_customers_collection():
    db = await get_database()
    return db.customers

async def get_trends_collection():
    db = await get_database()
    return db.trends

async def get_signals_collection():
    db = await get_database()
    return db.external_signals

async def get_forecasts_collection():
    db = await get_database()
    return db.forecasts

async def get_alerts_collection():
    db = await get_database()
    return db.inventory_alerts

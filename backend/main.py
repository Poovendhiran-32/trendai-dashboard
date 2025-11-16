from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import json
from datetime import datetime, timedelta
import random
from typing import List, Optional
import os
import uvicorn
import logging

# Import our modules
from database import connect_to_mongo, close_mongo_connection, create_indexes
from database import get_products_collection, get_sales_collection, get_customers_collection
try:
    from websocket_manager import manager
    from real_time_data import data_generator
    HAS_WEBSOCKET = True
except ImportError:
    HAS_WEBSOCKET = False
from models import *

# Import routes
from routes import auth, data, predict, admin

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await create_indexes()
    if HAS_WEBSOCKET:
        await data_generator.start()
    logger.info("Application startup complete")
    
    yield
    
    # Shutdown
    if HAS_WEBSOCKET:
        await data_generator.stop()
    await close_mongo_connection()
    logger.info("Application shutdown complete")

app = FastAPI(
    title="TrendAI Dashboard API",
    version="1.0.0",
    description="Real-time analytics API for TrendAI Dashboard",
    lifespan=lifespan
)

# CORS middleware - configured for production
# Get allowed origins from environment variable, fallback to localhost for development
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
origins_list = [origin.strip() for origin in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"CORS configured with origins: {origins_list}")

# Include routers
app.include_router(auth.router)
app.include_router(data.router)
app.include_router(predict.router)
app.include_router(admin.router)

# WebSocket endpoint (if available)
if HAS_WEBSOCKET:
    @app.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket):
        client_id = await manager.connect(websocket)
        
        try:
            while True:
                # Listen for client messages
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                if message.get("type") == "subscribe":
                    subscriptions = message.get("subscriptions", [])
                    await manager.subscribe_client(client_id, subscriptions)
                    
                elif message.get("type") == "unsubscribe":
                    subscriptions = message.get("subscriptions", [])
                    await manager.unsubscribe_client(client_id, subscriptions)
                    
                elif message.get("type") == "ping":
                    await manager.send_personal_message(json.dumps({
                        "type": "pong",
                        "timestamp": datetime.now().isoformat()
                    }), client_id)
                    
        except WebSocketDisconnect:
            manager.disconnect(client_id)
        except Exception as e:
            logger.error(f"WebSocket error for client {client_id}: {e}")
            manager.disconnect(client_id)

# API Routes
@app.get("/")
async def root():
    return {"message": "TrendAI Dashboard API is running", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    connections = manager.get_connection_stats() if HAS_WEBSOCKET else {"active": 0}
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "connections": connections
    }

@app.get("/api/products")
async def get_products(
    category: Optional[str] = None,
    limit: int = Query(100, le=1000),
    offset: int = Query(0, ge=0)
):
    products_collection = await get_products_collection()
    
    query = {}
    if category:
        query["category"] = category
    
    products = await products_collection.find(query).skip(offset).limit(limit).to_list(limit)
    
    # Convert ObjectId to string
    for product in products:
        if "_id" in product:
            product["_id"] = str(product["_id"])
        if "last_updated" in product:
            product["last_updated"] = product["last_updated"].isoformat()
        if "created_at" in product:
            product["created_at"] = product["created_at"].isoformat()
    
    return {
        "products": products,
        "total": await products_collection.count_documents(query),
        "limit": limit,
        "offset": offset
    }

@app.get("/api/sales")
async def get_sales(
    product_id: Optional[str] = None,
    region: Optional[str] = None,
    channel: Optional[str] = None,
    days: int = Query(30, le=365),
    limit: int = Query(1000, le=5000)
):
    sales_collection = await get_sales_collection()
    
    # Build query
    query = {}
    if product_id:
        query["product_id"] = product_id
    if region:
        query["region"] = region
    if channel:
        query["channel"] = channel
    
    # Date filter
    start_date = datetime.now() - timedelta(days=days)
    query["date"] = {"$gte": start_date}
    
    sales = await sales_collection.find(query).sort("date", -1).limit(limit).to_list(limit)
    
    # Convert dates to ISO format
    for sale in sales:
        if "_id" in sale:
            sale["_id"] = str(sale["_id"])
        if "date" in sale:
            sale["date"] = sale["date"].isoformat()
        if "created_at" in sale:
            sale["created_at"] = sale["created_at"].isoformat()
    
    return {
        "sales": sales,
        "total": await sales_collection.count_documents(query),
        "limit": limit
    }

@app.get("/api/metrics")
async def get_metrics(hours: int = Query(24, le=168)):  # Max 1 week
    sales_collection = await get_sales_collection()
    
    # Calculate metrics for the specified time period
    start_time = datetime.now() - timedelta(hours=hours)
    
    pipeline = [
        {"$match": {"date": {"$gte": start_time}}},
        {"$group": {
            "_id": None,
            "total_revenue": {"$sum": "$revenue"},
            "total_orders": {"$sum": 1},
            "avg_order_value": {"$avg": "$revenue"},
            "total_quantity": {"$sum": "$quantity"}
        }}
    ]
    
    result = await sales_collection.aggregate(pipeline).to_list(1)
    
    if result:
        metrics = result[0]
        return {
            "total_revenue": round(metrics.get("total_revenue", 0), 2),
            "total_orders": metrics.get("total_orders", 0),
            "avg_order_value": round(metrics.get("avg_order_value", 0), 2),
            "total_quantity": metrics.get("total_quantity", 0),
            "conversion_rate": round(random.uniform(2.5, 4.5), 2),  # Mock for now
            "period_hours": hours,
            "timestamp": datetime.now().isoformat()
        }
    else:
        return {
            "total_revenue": 0,
            "total_orders": 0,
            "avg_order_value": 0,
            "total_quantity": 0,
            "conversion_rate": 0,
            "period_hours": hours,
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

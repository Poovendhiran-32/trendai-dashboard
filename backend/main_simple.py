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

# Import mock data
from dataset import products, salesData, forecastData, externalSignals, seasonalPatterns

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TrendAI Dashboard API",
    version="1.0.0",
    description="Real-time analytics API for TrendAI Dashboard"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove disconnected clients
                self.active_connections.remove(connection)

manager = ConnectionManager()

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    
    try:
        while True:
            # Listen for client messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "subscribe":
                subscriptions = message.get("subscriptions", [])
                # Send initial data
                if "metrics" in subscriptions:
                    metrics = await get_metrics_data()
                    await manager.send_personal_message(json.dumps({
                        "type": "metrics_update",
                        "data": metrics
                    }), websocket)
                
            elif message.get("type") == "ping":
                await manager.send_personal_message(json.dumps({
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                }), websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

# API Routes
@app.get("/")
async def root():
    return {"message": "TrendAI Dashboard API is running", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "connections": len(manager.active_connections)
    }

@app.get("/api/products")
async def get_products(
    category: Optional[str] = None,
    limit: int = Query(100, le=1000),
    offset: int = Query(0, ge=0)
):
    filtered_products = products
    
    if category:
        filtered_products = [p for p in products if p["category"] == category]
    
    # Apply pagination
    paginated_products = filtered_products[offset:offset + limit]
    
    return {
        "products": paginated_products,
        "total": len(filtered_products),
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
    filtered_sales = salesData
    
    # Apply filters
    if product_id:
        filtered_sales = [s for s in filtered_sales if s["productId"] == product_id]
    if region:
        filtered_sales = [s for s in filtered_sales if s["region"] == region]
    if channel:
        filtered_sales = [s for s in filtered_sales if s["channel"] == channel]
    
    # Date filter
    cutoff_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
    filtered_sales = [s for s in filtered_sales if s["date"] >= cutoff_date]
    
    # Apply limit
    limited_sales = filtered_sales[:limit]
    
    return {
        "sales": limited_sales,
        "total": len(filtered_sales),
        "limit": limit
    }

async def get_metrics_data():
    """Generate mock metrics data"""
    total_revenue = sum(sale["revenue"] for sale in salesData[-100:])  # Last 100 sales
    total_orders = len(salesData[-100:])
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
    
    return {
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "avg_order_value": round(avg_order_value, 2),
        "total_quantity": sum(sale["quantity"] for sale in salesData[-100:]),
        "conversion_rate": round(random.uniform(2.5, 4.5), 2),
        "period_hours": 24,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/metrics")
async def get_metrics(hours: int = Query(24, le=168)):  # Max 1 week
    return await get_metrics_data()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)



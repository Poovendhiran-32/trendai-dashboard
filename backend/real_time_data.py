import asyncio
import json
import random
from datetime import datetime, timedelta
from typing import Dict, Any, List
import logging
from database import get_sales_collection, get_products_collection, get_alerts_collection
from websocket_manager import manager
from models import SalesRecord, InventoryAlert, ExternalSignal

logger = logging.getLogger(__name__)

class RealTimeDataGenerator:
    def __init__(self):
        self.is_running = False
        self.generation_tasks = []
        
    async def start(self):
        """Start all real-time data generation tasks"""
        if self.is_running:
            return
            
        self.is_running = True
        logger.info("Starting real-time data generation...")
        
        # Start different data generation tasks
        self.generation_tasks = [
            asyncio.create_task(self.generate_sales_data()),
            asyncio.create_task(self.generate_inventory_alerts()),
            asyncio.create_task(self.generate_external_signals()),
            asyncio.create_task(self.update_metrics()),
            asyncio.create_task(self.simulate_trend_changes())
        ]
        
    async def stop(self):
        """Stop all real-time data generation tasks"""
        self.is_running = False
        
        for task in self.generation_tasks:
            task.cancel()
            
        await asyncio.gather(*self.generation_tasks, return_exceptions=True)
        logger.info("Stopped real-time data generation")

    async def generate_sales_data(self):
        """Generate new sales records periodically"""
        while self.is_running:
            try:
                await asyncio.sleep(random.uniform(5, 15))  # Random interval 5-15 seconds
                
                # Generate new sale
                sales_collection = await get_sales_collection()
                
                new_sale = {
                    "id": f"sale_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{random.randint(1000, 9999)}",
                    "product_id": f"prod_{random.randint(1, 500)}",
                    "quantity": random.randint(1, 5),
                    "unit_price": round(random.uniform(10, 500), 2),
                    "revenue": 0,  # Will be calculated
                    "date": datetime.now(),
                    "region": random.choice(["North", "South", "East", "West", "Central"]),
                    "channel": random.choice(["online", "retail", "mobile", "wholesale"]),
                    "customer_id": f"cust_{random.randint(1, 1000)}",
                    "discount": round(random.uniform(0, 50), 2) if random.random() < 0.3 else 0,
                    "created_at": datetime.now()
                }
                
                # Calculate revenue
                new_sale["revenue"] = round(
                    new_sale["quantity"] * new_sale["unit_price"] - new_sale["discount"], 2
                )
                
                # Insert into database
                await sales_collection.insert_one(new_sale)
                
                # Broadcast to connected clients
                await manager.broadcast(json.dumps({
                    "type": "new_sale",
                    "data": {
                        **new_sale,
                        "date": new_sale["date"].isoformat(),
                        "created_at": new_sale["created_at"].isoformat()
                    },
                    "timestamp": datetime.now().isoformat()
                }), "sales_updates")
                
                logger.debug(f"Generated new sale: {new_sale['id']}")
                
            except Exception as e:
                logger.error(f"Error generating sales data: {e}")
                await asyncio.sleep(5)

    async def generate_inventory_alerts(self):
        """Generate inventory alerts for low stock products"""
        while self.is_running:
            try:
                await asyncio.sleep(30)  # Check every 30 seconds
                
                products_collection = await get_products_collection()
                alerts_collection = await get_alerts_collection()
                
                # Find products with low stock
                low_stock_products = await products_collection.find({
                    "stock": {"$lt": 50}
                }).to_list(10)
                
                for product in low_stock_products:
                    # Check if alert already exists
                    existing_alert = await alerts_collection.find_one({
                        "product_id": product["id"],
                        "resolved": False
                    })
                    
                    if not existing_alert:
                        alert = {
                            "id": f"alert_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{product['id']}",
                            "product_id": product["id"],
                            "alert_type": "low_stock" if product["stock"] > 0 else "out_of_stock",
                            "current_stock": product["stock"],
                            "threshold": 50,
                            "severity": "high" if product["stock"] == 0 else "medium",
                            "created_at": datetime.now(),
                            "resolved": False
                        }
                        
                        await alerts_collection.insert_one(alert)
                        
                        # Broadcast alert
                        await manager.broadcast(json.dumps({
                            "type": "inventory_alert",
                            "data": {
                                **alert,
                                "product_name": product["name"],
                                "created_at": alert["created_at"].isoformat()
                            },
                            "timestamp": datetime.now().isoformat()
                        }), "inventory_alerts")
                        
                        logger.info(f"Generated inventory alert for product {product['id']}")
                
            except Exception as e:
                logger.error(f"Error generating inventory alerts: {e}")
                await asyncio.sleep(30)

    async def generate_external_signals(self):
        """Generate external market signals"""
        while self.is_running:
            try:
                await asyncio.sleep(60)  # Generate every minute
                
                signals = [
                    {
                        "source": "google_trends",
                        "signal_type": "search_volume",
                        "value": random.uniform(0.5, 2.0),
                        "impact_score": random.uniform(10, 90)
                    },
                    {
                        "source": "weather",
                        "signal_type": "temperature",
                        "value": random.uniform(-10, 40),
                        "impact_score": random.uniform(5, 60)
                    },
                    {
                        "source": "social_media",
                        "signal_type": "sentiment",
                        "value": random.uniform(-1, 1),
                        "impact_score": random.uniform(20, 80)
                    },
                    {
                        "source": "competitor",
                        "signal_type": "price_change",
                        "value": random.uniform(-0.2, 0.2),
                        "impact_score": random.uniform(30, 95)
                    }
                ]
                
                selected_signal = random.choice(signals)
                
                signal_data = {
                    "id": f"signal_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{random.randint(1000, 9999)}",
                    "source": selected_signal["source"],
                    "signal_type": selected_signal["signal_type"],
                    "value": selected_signal["value"],
                    "impact_score": selected_signal["impact_score"],
                    "related_products": [f"prod_{random.randint(1, 500)}" for _ in range(random.randint(1, 5))],
                    "timestamp": datetime.now(),
                    "metadata": {
                        "confidence": random.uniform(0.6, 0.95),
                        "data_quality": random.choice(["high", "medium", "low"])
                    }
                }
                
                # Broadcast signal
                await manager.broadcast(json.dumps({
                    "type": "external_signal",
                    "data": {
                        **signal_data,
                        "timestamp": signal_data["timestamp"].isoformat()
                    },
                    "timestamp": datetime.now().isoformat()
                }), "external_signals")
                
                logger.debug(f"Generated external signal: {signal_data['source']}")
                
            except Exception as e:
                logger.error(f"Error generating external signals: {e}")
                await asyncio.sleep(60)

    async def update_metrics(self):
        """Update and broadcast real-time metrics"""
        while self.is_running:
            try:
                await asyncio.sleep(10)  # Update every 10 seconds
                
                sales_collection = await get_sales_collection()
                
                # Calculate metrics from last hour
                one_hour_ago = datetime.now() - timedelta(hours=1)
                
                pipeline = [
                    {"$match": {"date": {"$gte": one_hour_ago}}},
                    {"$group": {
                        "_id": None,
                        "total_revenue": {"$sum": "$revenue"},
                        "total_orders": {"$sum": 1},
                        "avg_order_value": {"$avg": "$revenue"}
                    }}
                ]
                
                result = await sales_collection.aggregate(pipeline).to_list(1)
                
                if result:
                    metrics = result[0]
                    metrics_data = {
                        "total_revenue": round(metrics.get("total_revenue", 0), 2),
                        "total_orders": metrics.get("total_orders", 0),
                        "avg_order_value": round(metrics.get("avg_order_value", 0), 2),
                        "conversion_rate": round(random.uniform(2.5, 4.5), 2),  # Mock for now
                        "timestamp": datetime.now().isoformat()
                    }
                    
                    # Broadcast metrics update
                    await manager.broadcast(json.dumps({
                        "type": "metrics_update",
                        "data": metrics_data,
                        "timestamp": datetime.now().isoformat()
                    }), "metrics_updates")
                
            except Exception as e:
                logger.error(f"Error updating metrics: {e}")
                await asyncio.sleep(10)

    async def simulate_trend_changes(self):
        """Simulate product trend changes"""
        while self.is_running:
            try:
                await asyncio.sleep(45)  # Update every 45 seconds
                
                products_collection = await get_products_collection()
                
                # Randomly select products to update trends
                products = await products_collection.find().limit(10).to_list(10)
                
                for product in products:
                    # Simulate trend change
                    trend_change = random.uniform(-5, 5)
                    new_trend_score = max(0, min(100, product["trend_score"] + trend_change))
                    
                    # Update product trend score
                    await products_collection.update_one(
                        {"id": product["id"]},
                        {
                            "$set": {
                                "trend_score": round(new_trend_score, 1),
                                "last_updated": datetime.now()
                            }
                        }
                    )
                    
                    # Broadcast trend update if significant change
                    if abs(trend_change) > 2:
                        await manager.broadcast(json.dumps({
                            "type": "trend_update",
                            "data": {
                                "product_id": product["id"],
                                "product_name": product["name"],
                                "old_trend_score": product["trend_score"],
                                "new_trend_score": round(new_trend_score, 1),
                                "change": round(trend_change, 1)
                            },
                            "timestamp": datetime.now().isoformat()
                        }), "trend_updates")
                
            except Exception as e:
                logger.error(f"Error simulating trend changes: {e}")
                await asyncio.sleep(45)

# Global data generator instance
data_generator = RealTimeDataGenerator()

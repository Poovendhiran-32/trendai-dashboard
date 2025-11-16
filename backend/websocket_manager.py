from fastapi import WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json
import asyncio
import logging
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.client_subscriptions: Dict[str, List[str]] = {}
        
    async def connect(self, websocket: WebSocket, client_id: str = None):
        """Accept WebSocket connection and assign client ID"""
        await websocket.accept()
        
        if not client_id:
            client_id = str(uuid.uuid4())
            
        self.active_connections[client_id] = websocket
        self.client_subscriptions[client_id] = []
        
        logger.info(f"Client {client_id} connected. Total connections: {len(self.active_connections)}")
        
        # Send welcome message with client ID
        await self.send_personal_message(json.dumps({
            "type": "connection_established",
            "client_id": client_id,
            "timestamp": datetime.now().isoformat()
        }), client_id)
        
        return client_id

    def disconnect(self, client_id: str):
        """Remove client connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            
        if client_id in self.client_subscriptions:
            del self.client_subscriptions[client_id]
            
        logger.info(f"Client {client_id} disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, client_id: str):
        """Send message to specific client"""
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(message)
            except Exception as e:
                logger.error(f"Error sending message to client {client_id}: {e}")
                self.disconnect(client_id)

    async def broadcast(self, message: str, message_type: str = None):
        """Broadcast message to all connected clients"""
        if not self.active_connections:
            return
            
        disconnected_clients = []
        
        for client_id, websocket in self.active_connections.items():
            try:
                # Check if client is subscribed to this message type
                if message_type and message_type not in self.client_subscriptions.get(client_id, []):
                    continue
                    
                await websocket.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting to client {client_id}: {e}")
                disconnected_clients.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)

    async def subscribe_client(self, client_id: str, subscription_types: List[str]):
        """Subscribe client to specific message types"""
        if client_id in self.client_subscriptions:
            self.client_subscriptions[client_id].extend(subscription_types)
            self.client_subscriptions[client_id] = list(set(self.client_subscriptions[client_id]))
            
            await self.send_personal_message(json.dumps({
                "type": "subscription_updated",
                "subscriptions": self.client_subscriptions[client_id],
                "timestamp": datetime.now().isoformat()
            }), client_id)

    async def unsubscribe_client(self, client_id: str, subscription_types: List[str]):
        """Unsubscribe client from specific message types"""
        if client_id in self.client_subscriptions:
            for sub_type in subscription_types:
                if sub_type in self.client_subscriptions[client_id]:
                    self.client_subscriptions[client_id].remove(sub_type)
                    
            await self.send_personal_message(json.dumps({
                "type": "subscription_updated",
                "subscriptions": self.client_subscriptions[client_id],
                "timestamp": datetime.now().isoformat()
            }), client_id)

    def get_connection_stats(self):
        """Get connection statistics"""
        return {
            "total_connections": len(self.active_connections),
            "clients": list(self.active_connections.keys()),
            "subscriptions": self.client_subscriptions
        }

# Global connection manager instance
manager = ConnectionManager()

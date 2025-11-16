from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ProductCategory(str, Enum):
    ELECTRONICS = "Electronics"
    CLOTHING = "Clothing"
    HOME_GARDEN = "Home & Garden"
    SPORTS = "Sports"
    BOOKS = "Books"
    BEAUTY = "Beauty"
    AUTOMOTIVE = "Automotive"
    TOYS = "Toys"
    FOOD = "Food"
    HEALTH = "Health"

class SalesChannel(str, Enum):
    ONLINE = "online"
    RETAIL = "retail"
    MOBILE = "mobile"
    WHOLESALE = "wholesale"

class Region(str, Enum):
    NORTH = "North"
    SOUTH = "South"
    EAST = "East"
    WEST = "West"
    CENTRAL = "Central"

class TrendDirection(str, Enum):
    UP = "up"
    DOWN = "down"
    STABLE = "stable"

# Product Models
class Product(BaseModel):
    id: str = Field(..., description="Unique product identifier")
    name: str = Field(..., description="Product name")
    category: ProductCategory = Field(..., description="Product category")
    price: float = Field(..., gt=0, description="Product price")
    stock: int = Field(..., ge=0, description="Current stock level")
    sales_velocity: float = Field(..., ge=0, description="Sales velocity (units per day)")
    trend_score: float = Field(..., ge=0, le=100, description="Trend score (0-100)")
    description: Optional[str] = Field(None, description="Product description")
    brand: Optional[str] = Field(None, description="Product brand")
    sku: Optional[str] = Field(None, description="Stock keeping unit")
    cost: Optional[float] = Field(None, gt=0, description="Product cost")
    margin: Optional[float] = Field(None, description="Profit margin percentage")
    supplier: Optional[str] = Field(None, description="Supplier name")
    last_updated: datetime = Field(default_factory=datetime.now)
    created_at: datetime = Field(default_factory=datetime.now)

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    brand: Optional[str] = None

# Sales Models
class SalesRecord(BaseModel):
    id: str = Field(..., description="Unique sales record identifier")
    product_id: str = Field(..., description="Product identifier")
    quantity: int = Field(..., gt=0, description="Quantity sold")
    unit_price: float = Field(..., gt=0, description="Unit price at time of sale")
    revenue: float = Field(..., gt=0, description="Total revenue (quantity * unit_price)")
    cost: Optional[float] = Field(None, description="Total cost of goods sold")
    profit: Optional[float] = Field(None, description="Total profit")
    date: datetime = Field(..., description="Sale date and time")
    region: Region = Field(..., description="Sales region")
    channel: SalesChannel = Field(..., description="Sales channel")
    customer_id: Optional[str] = Field(None, description="Customer identifier")
    discount: Optional[float] = Field(None, ge=0, description="Discount applied")
    tax: Optional[float] = Field(None, ge=0, description="Tax amount")
    created_at: datetime = Field(default_factory=datetime.now)

# Analytics Models
class MetricData(BaseModel):
    total_revenue: float = Field(..., description="Total revenue")
    total_orders: int = Field(..., description="Total number of orders")
    avg_order_value: float = Field(..., description="Average order value")
    conversion_rate: float = Field(..., description="Conversion rate percentage")
    total_customers: Optional[int] = Field(None, description="Total unique customers")
    repeat_customer_rate: Optional[float] = Field(None, description="Repeat customer rate")
    timestamp: datetime = Field(default_factory=datetime.now)

class TrendData(BaseModel):
    product_id: str = Field(..., description="Product identifier")
    trend_direction: TrendDirection = Field(..., description="Trend direction")
    trend_strength: float = Field(..., ge=0, le=100, description="Trend strength (0-100)")
    velocity_change: float = Field(..., description="Change in sales velocity")
    period_start: datetime = Field(..., description="Analysis period start")
    period_end: datetime = Field(..., description="Analysis period end")
    confidence_score: float = Field(..., ge=0, le=100, description="Confidence in trend analysis")

class SeasonalPattern(BaseModel):
    product_id: str = Field(..., description="Product identifier")
    season: str = Field(..., description="Season name")
    multiplier: float = Field(..., description="Seasonal multiplier")
    historical_data: List[Dict[str, Any]] = Field(default_factory=list)
    confidence: float = Field(..., ge=0, le=100)

# Forecast Models
class ForecastData(BaseModel):
    product_id: Optional[str] = Field(None, description="Product ID (None for aggregate)")
    date: datetime = Field(..., description="Forecast date")
    predicted_revenue: float = Field(..., description="Predicted revenue")
    predicted_quantity: Optional[int] = Field(None, description="Predicted quantity")
    confidence_interval_lower: float = Field(..., description="Lower confidence bound")
    confidence_interval_upper: float = Field(..., description="Upper confidence bound")
    model_used: str = Field(..., description="Forecasting model used")
    accuracy_score: Optional[float] = Field(None, description="Model accuracy score")

# External Signals Models
class ExternalSignal(BaseModel):
    id: str = Field(..., description="Signal identifier")
    source: str = Field(..., description="Signal source (e.g., 'google_trends', 'weather')")
    signal_type: str = Field(..., description="Type of signal")
    value: float = Field(..., description="Signal value")
    impact_score: float = Field(..., ge=0, le=100, description="Predicted impact score")
    related_products: List[str] = Field(default_factory=list, description="Related product IDs")
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional signal metadata")

# Customer Models
class Customer(BaseModel):
    id: str = Field(..., description="Customer identifier")
    email: Optional[str] = Field(None, description="Customer email")
    first_name: Optional[str] = Field(None, description="Customer first name")
    last_name: Optional[str] = Field(None, description="Customer last name")
    region: Optional[Region] = Field(None, description="Customer region")
    acquisition_date: datetime = Field(default_factory=datetime.now)
    lifetime_value: float = Field(default=0, description="Customer lifetime value")
    total_orders: int = Field(default=0, description="Total number of orders")
    last_order_date: Optional[datetime] = Field(None, description="Last order date")

# Inventory Models
class InventoryAlert(BaseModel):
    id: str = Field(..., description="Alert identifier")
    product_id: str = Field(..., description="Product identifier")
    alert_type: str = Field(..., description="Alert type (low_stock, out_of_stock, etc.)")
    current_stock: int = Field(..., description="Current stock level")
    threshold: int = Field(..., description="Alert threshold")
    severity: str = Field(..., description="Alert severity (low, medium, high)")
    created_at: datetime = Field(default_factory=datetime.now)
    resolved: bool = Field(default=False, description="Whether alert is resolved")

# API Response Models
class APIResponse(BaseModel):
    success: bool = Field(..., description="Request success status")
    message: str = Field(..., description="Response message")
    data: Optional[Any] = Field(None, description="Response data")
    timestamp: datetime = Field(default_factory=datetime.now)

class PaginatedResponse(BaseModel):
    items: List[Any] = Field(..., description="List of items")
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    per_page: int = Field(..., description="Items per page")
    pages: int = Field(..., description="Total number of pages")

# WebSocket Message Models
class WebSocketMessage(BaseModel):
    type: str = Field(..., description="Message type")
    data: Dict[str, Any] = Field(..., description="Message data")
    timestamp: datetime = Field(default_factory=datetime.now)
    client_id: Optional[str] = Field(None, description="Client identifier")

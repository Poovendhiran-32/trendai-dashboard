# TrendAI API Documentation

Complete API reference for the TrendAI backend.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-backend-url.com`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securepassword123",
  "company": "Acme Corp",
  "role": "Business Analyst",
  "industry": "Retail & E-commerce"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "company": "Acme Corp",
    "role": "user",
    "isActive": true
  },
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "company": "Acme Corp",
    "role": "user"
  }
}
```

#### Change Password
```http
POST /api/auth/change-password
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Data Management

#### Upload Dataset
```http
POST /api/data/upload
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: CSV or Excel file
- `metadata`: JSON string (optional)

**Response:**
```json
{
  "success": true,
  "dataset": {
    "id": "dataset-uuid",
    "filename": "sales_data.csv",
    "rowCount": 1000,
    "columnCount": 5,
    "columns": ["date", "product", "quantity", "revenue", "region"],
    "dateColumn": "date",
    "valueColumns": ["quantity", "revenue"],
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Datasets
```http
GET /api/data/datasets?limit=100&offset=0
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "datasets": [
    {
      "id": "dataset-uuid",
      "filename": "sales_data.csv",
      "rowCount": 1000,
      "columnCount": 5,
      "uploadedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 5,
  "limit": 100,
  "offset": 0
}
```

#### Get Dataset by ID
```http
GET /api/data/datasets/{dataset_id}?include_data=false
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "dataset": {
    "id": "dataset-uuid",
    "filename": "sales_data.csv",
    "rowCount": 1000,
    "columnCount": 5,
    "columns": ["date", "product", "quantity", "revenue"],
    "dataPreview": [
      {"date": "2024-01-01", "product": "A", "quantity": 10, "revenue": 100},
      {"date": "2024-01-02", "product": "B", "quantity": 15, "revenue": 150}
    ],
    "statistics": {
      "mean": {"quantity": 12.5, "revenue": 125},
      "median": {"quantity": 12, "revenue": 120}
    }
  }
}
```

#### Delete Dataset
```http
DELETE /api/data/datasets/{dataset_id}
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dataset deleted successfully"
}
```

### Predictions & Analysis

#### Analyze Dataset
```http
POST /api/predict/analyze
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "datasetId": "dataset-uuid",
  "dateColumn": "date",
  "valueColumn": "revenue",
  "forecastPeriods": 30,
  "modelType": "arima"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "trend": {
      "direction": "up",
      "strength": 75.5,
      "confidence": 85.2,
      "message": "Trend is up with 85.2% confidence"
    },
    "seasonality": {
      "hasSeasonality": true,
      "strength": 45.3,
      "period": 12
    },
    "forecast": {
      "success": true,
      "modelType": "ARIMA",
      "forecast": [
        {
          "date": "2024-02-01",
          "predicted": 1250.5,
          "lower": 1100.2,
          "upper": 1400.8
        }
      ],
      "metrics": {
        "aic": 1234.5,
        "bic": 1245.6,
        "forecastMean": 1250.0,
        "percentChange": 15.5
      }
    },
    "insights": [
      "📈 Strong upward trend detected with 85.2% confidence",
      "🔄 Seasonal pattern identified with 45.3% strength",
      "⚡ Forecast shows 15.5% increase"
    ]
  },
  "predictionId": "prediction-uuid"
}
```

#### Get Trend Analysis
```http
GET /api/predict/trends/{dataset_id}?date_column=date&value_column=revenue
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "trend": {
    "direction": "up",
    "strength": 75.5,
    "confidence": 85.2,
    "slope": 0.05,
    "message": "Trend is up with 85.2% confidence"
  }
}
```

#### Get Seasonal Decomposition
```http
GET /api/predict/seasonality/{dataset_id}?date_column=date&value_column=revenue
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "seasonality": {
    "hasSeasonality": true,
    "strength": 45.3,
    "period": 12,
    "trend": [100, 105, 110, ...],
    "seasonal": [5, -3, 8, ...],
    "residual": [2, -1, 3, ...],
    "dates": ["2024-01-01", "2024-01-02", ...]
  }
}
```

#### Get Predictions
```http
GET /api/data/predictions?dataset_id={dataset_id}
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "id": "prediction-uuid",
      "datasetId": "dataset-uuid",
      "modelType": "arima",
      "createdAt": "2024-01-15T10:30:00Z",
      "metrics": {
        "aic": 1234.5,
        "forecastMean": 1250.0
      },
      "insights": ["📈 Strong upward trend detected"]
    }
  ],
  "total": 10
}
```

### Admin Endpoints

#### Get All Users
```http
GET /api/admin/users?limit=100&offset=0
```

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "company": "Acme Corp",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "limit": 100,
  "offset": 0
}
```

#### Get User by ID
```http
GET /api/admin/users/{user_id}
```

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "company": "Acme Corp",
    "role": "user",
    "isActive": true
  }
}
```

#### Update User Status
```http
PATCH /api/admin/users/{user_id}/status?is_active=false
```

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

#### Get System Statistics
```http
GET /api/admin/stats
```

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "activeUsers": 120,
    "totalDatasets": 450,
    "totalPredictions": 890
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "detail": "Admin access required"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## WebSocket

### Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws')

ws.onopen = () => {
  // Subscribe to real-time updates
  ws.send(JSON.stringify({
    type: 'subscribe',
    subscriptions: ['metrics', 'alerts']
  }))
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Received:', data)
}
```

### Message Types

**Subscribe:**
```json
{
  "type": "subscribe",
  "subscriptions": ["metrics", "alerts", "predictions"]
}
```

**Unsubscribe:**
```json
{
  "type": "unsubscribe",
  "subscriptions": ["metrics"]
}
```

**Ping:**
```json
{
  "type": "ping"
}
```

**Pong Response:**
```json
{
  "type": "pong",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Code Examples

### Python
```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login', json={
    'email': 'user@example.com',
    'password': 'password123'
})
data = response.json()
token = data['access_token']

# Upload dataset
with open('data.csv', 'rb') as f:
    files = {'file': f}
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(
        'http://localhost:8000/api/data/upload',
        files=files,
        headers=headers
    )
    print(response.json())
```

### JavaScript
```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123'
    })
  })
  const data = await response.json()
  return data.access_token
}

// Upload dataset
const uploadDataset = async (file, token) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('http://localhost:8000/api/data/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  })
  return await response.json()
}
```

### cURL
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Upload dataset
curl -X POST http://localhost:8000/api/data/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@data.csv"

# Analyze dataset
curl -X POST http://localhost:8000/api/predict/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "datasetId": "dataset-uuid",
    "dateColumn": "date",
    "valueColumn": "revenue",
    "forecastPeriods": 30
  }'
```

## Support

For API support:
- Email: support@trendai.com
- Documentation: https://docs.trendai.com
- GitHub Issues: https://github.com/yourusername/trendai/issues
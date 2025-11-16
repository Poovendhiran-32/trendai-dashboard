# TrendAI - AI-Powered Demand Forecasting Platform

TrendAI is a comprehensive web application for analyzing trends, seasonal components, and forecasting demand using machine learning. Built with Next.js, FastAPI, and MongoDB.

## 🌟 Features

### Frontend (Next.js 14)
- **Authentication**: Secure JWT-based authentication with login/signup
- **Dashboard**: Real-time metrics and analytics visualization
- **Data Upload**: CSV/Excel file upload with automatic preprocessing
- **Trend Analysis**: Interactive charts showing trends and patterns
- **Forecasting**: AI-powered demand forecasting using ARIMA
- **Admin Panel**: User and dataset management for administrators
- **Responsive UI**: Built with Tailwind CSS and shadcn/ui components

### Backend (FastAPI)
- **RESTful API**: Complete API for authentication, data management, and predictions
- **ML Pipeline**: Time-series forecasting with ARIMA and seasonal decomposition
- **Database**: MongoDB integration with Motor (async)
- **WebSocket**: Real-time data updates
- **JWT Auth**: Secure token-based authentication
- **File Processing**: CSV/Excel parsing with pandas

## 📁 Project Structure

```
trendai/
├── app/                    # Next.js app directory (pages)
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Main dashboard
│   ├── data/              # Data explorer
│   ├── analytics/         # Analytics page
│   ├── admin/             # Admin panel
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn UI components
│   ├── auth/             # Auth-related components
│   └── ...
├── lib/                   # Utilities and services
│   ├── api/              # API service layer
│   ├── contexts/         # React contexts
│   ├── database/         # Database models and connection
│   └── ...
├── backend/               # FastAPI backend
│   ├── routes/           # API routes
│   │   ├── auth.py      # Authentication endpoints
│   │   ├── data.py      # Data management endpoints
│   │   ├── predict.py   # Prediction endpoints
│   │   └── admin.py     # Admin endpoints
│   ├── services/         # Business logic
│   │   ├── auth_service.py
│   │   └── data_service.py
│   ├── ml/               # Machine learning models
│   │   └── predictor.py # Time-series forecasting
│   ├── utils/            # Utilities
│   │   ├── jwt_handler.py
│   │   └── hashing.py
│   ├── models.py         # Pydantic models
│   ├── database.py       # Database connection
│   └── main.py           # FastAPI app
├── public/                # Static assets
└── scripts/               # Utility scripts

```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or Atlas)

### Frontend Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/trendai
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

3. **Run development server**:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Create virtual environment**:
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=trendai_dashboard
JWT_SECRET_KEY=your-secret-key-here
```

5. **Run backend server**:
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `GET /api/auth/me` - Get current user info

#### Data Management
- `POST /api/data/upload` - Upload dataset (CSV/Excel)
- `GET /api/data/datasets` - Get user's datasets
- `GET /api/data/datasets/{id}` - Get specific dataset
- `DELETE /api/data/datasets/{id}` - Delete dataset

#### Predictions
- `POST /api/predict/analyze` - Analyze dataset and generate forecast
- `GET /api/predict/trends/{id}` - Get trend analysis
- `GET /api/predict/seasonality/{id}` - Get seasonal decomposition

#### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics
- `PATCH /api/admin/users/{id}/status` - Update user status

## 🤖 Machine Learning

### Forecasting Models

The application uses **ARIMA** (AutoRegressive Integrated Moving Average) for time-series forecasting:

- **Trend Detection**: Identifies upward, downward, or stable trends
- **Seasonal Decomposition**: Separates trend, seasonal, and residual components
- **Forecasting**: Predicts future values with confidence intervals
- **Insights Generation**: AI-generated actionable insights

### Data Requirements

For accurate forecasting:
- Minimum 20-30 historical data points
- One date/time column
- At least one numeric value column
- Consistent date format
- No missing values in key columns

## 🎨 UI Components

Built with shadcn/ui components:
- Cards, Buttons, Inputs
- Tables, Charts (Recharts)
- Dialogs, Alerts
- Forms with validation
- Dark/Light mode support

## 🔐 Security

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Access and refresh tokens
- **Protected Routes**: Client and server-side route protection
- **CORS**: Configured for allowed origins
- **Input Validation**: Pydantic models for API validation

## 🚢 Deployment

### Frontend (Vercel)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables:
     - `MONGODB_ATLAS_URI`
     - `NEXT_PUBLIC_API_URL` (your backend URL)
     - `NEXT_PUBLIC_WS_URL` (your WebSocket URL)
   - Deploy

### Backend (Render/Railway)

#### Option 1: Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: trendai-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: MONGODB_URL
        sync: false
      - key: DATABASE_NAME
        value: trendai_dashboard
      - key: JWT_SECRET_KEY
        generateValue: true
```

2. Deploy on Render:
   - Go to [render.com](https://render.com)
   - Connect repository
   - Add environment variables
   - Deploy

#### Option 2: Railway

```bash
railway login
railway init
railway up
```

### Database (MongoDB Atlas)

1. **Create cluster**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Create database user
   - Whitelist IP (0.0.0.0/0 for development)

2. **Get connection string**:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Add to environment variables

## 🧪 Testing

### Frontend
```bash
npm run lint
```

### Backend
```bash
# Install pytest
pip install pytest pytest-asyncio

# Run tests
pytest
```

## 📝 Environment Variables

### Frontend (.env.local)
```env
MONGODB_URI=mongodb://localhost:27017/trendai
MONGODB_ATLAS_URI=mongodb+srv://...
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
USE_MOCK_DB=false
```

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=trendai_dashboard
JWT_SECRET_KEY=your-secret-key
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI for the high-performance backend
- shadcn for beautiful UI components
- Statsmodels for time-series analysis tools

---

**Note**: This is a production-ready application. Make sure to:
- Change all default secrets and passwords
- Configure proper CORS origins
- Set up SSL/TLS for production
- Implement rate limiting
- Add comprehensive error logging
- Set up monitoring and analytics
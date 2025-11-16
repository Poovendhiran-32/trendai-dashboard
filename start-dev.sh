#!/bin/bash

echo "🚀 Starting TrendAI Development Environment"
echo "=========================================="

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Run: mongod --dbpath /path/to/data"
    exit 1
fi
echo "✅ MongoDB is running"

# Start backend in background
echo ""
echo "🔧 Starting Backend (FastAPI)..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "✅ Backend dependencies installed"
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend
echo ""
echo "🎨 Starting Frontend (Next.js)..."
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "✅ TrendAI is running!"
echo "=========================================="
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop all services"

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for processes
wait
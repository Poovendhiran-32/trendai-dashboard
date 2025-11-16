@echo off
echo ========================================
echo 🚀 Starting TrendAI Development Environment
echo ========================================
echo.

REM Check if MongoDB is running
echo 📊 Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo ⚠️  MongoDB is not running. Please start MongoDB first.
    echo    Run: mongod --dbpath C:\data\db
    pause
    exit /b 1
)
echo ✅ MongoDB is running
echo.

REM Start backend
echo 🔧 Starting Backend (FastAPI)...
cd backend

if not exist venv (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
pip install -q -r requirements.txt
echo ✅ Backend dependencies installed

start "TrendAI Backend" cmd /k python main.py
timeout /t 5 /nobreak > nul

cd ..

REM Start frontend
echo.
echo 🎨 Starting Frontend (Next.js)...
call npm install
start "TrendAI Frontend" cmd /k npm run dev

echo.
echo ========================================
echo ✅ TrendAI is running!
echo ========================================
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to exit...
pause > nul
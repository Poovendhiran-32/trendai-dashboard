@echo off
echo ========================================
echo TrendAI - Git Repository Initialization
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/windows
    echo.
    pause
    exit /b 1
)

echo Git is installed!
echo.

REM Check if already initialized
if exist .git (
    echo Git repository already initialized!
    echo.
    git status
    echo.
    pause
    exit /b 0
)

echo Initializing Git repository...
git init
echo.

echo Adding all files...
git add .
echo.

echo Creating initial commit...
git commit -m "Initial commit - TrendAI production ready"
echo.

echo Renaming branch to main...
git branch -M main
echo.

echo ========================================
echo SUCCESS! Git repository initialized
echo ========================================
echo.
echo Next steps:
echo 1. Create GitHub repository at: https://github.com/new
echo 2. Run: git remote add origin YOUR_GITHUB_URL
echo 3. Run: git push -u origin main
echo.
echo Or run: git-push.bat (after creating GitHub repo)
echo.
pause
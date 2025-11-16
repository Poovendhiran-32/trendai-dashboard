@echo off
echo ========================================
echo TrendAI - Push to GitHub
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed
    echo Please run git-init.bat first
    pause
    exit /b 1
)

REM Check if repository is initialized
if not exist .git (
    echo ERROR: Git repository not initialized
    echo Please run git-init.bat first
    pause
    exit /b 1
)

echo Current repository status:
git status
echo.

REM Check if remote exists
git remote -v | findstr origin >nul 2>&1
if errorlevel 1 (
    echo No remote repository configured.
    echo.
    set /p GITHUB_URL="Enter your GitHub repository URL: "
    echo.
    echo Adding remote repository...
    git remote add origin %GITHUB_URL%
    echo.
)

echo Pushing to GitHub...
echo.
echo NOTE: You will need to enter your GitHub credentials:
echo - Username: Your GitHub username
echo - Password: Personal Access Token (NOT your GitHub password)
echo.
echo To create a token: https://github.com/settings/tokens
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo PUSH FAILED
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Wrong credentials - Use Personal Access Token as password
    echo 2. Remote already exists - Run: git remote remove origin
    echo 3. Branch mismatch - Run: git pull origin main --rebase
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Next steps:
echo 1. Verify code on GitHub
echo 2. Set up MongoDB Atlas
echo 3. Deploy to Render and Vercel
echo.
echo See STEP_BY_STEP_DEPLOYMENT.md for details
echo.
pause
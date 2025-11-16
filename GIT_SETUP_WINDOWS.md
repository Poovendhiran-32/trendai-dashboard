# Git Setup for Windows - Quick Fix

**Issue:** Git works in CMD but not in PowerShell/VS Code terminal

---

## ✅ Solution 1: Use CMD Instead (Easiest)

Since Git already works in CMD, just use CMD for Git commands:

### Steps:

1. **Open Command Prompt (CMD):**
   - Press `Windows + R`
   - Type: `cmd`
   - Press Enter

2. **Navigate to your project:**
   ```cmd
   cd D:\TrendAI\TrendAiDesignProject
   ```

3. **Verify Git works:**
   ```cmd
   git --version
   ```
   Should show: `git version 2.x.x`

4. **Configure Git (first time only):**
   ```cmd
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

5. **Initialize repository:**
   ```cmd
   git init
   git add .
   git commit -m "Initial commit - TrendAI production ready"
   git branch -M main
   ```

---

## ✅ Solution 2: Fix PowerShell PATH (Optional)

If you want Git to work in PowerShell/VS Code terminal:

### Steps:

1. **Find Git installation path:**
   - Usually: `C:\Program Files\Git\cmd`

2. **Add to System PATH:**
   - Press `Windows + X`
   - Select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\Program Files\Git\cmd`
   - Click "OK" on all dialogs

3. **Restart VS Code/PowerShell:**
   - Close and reopen terminal
   - Test: `git --version`

---

## 🚀 Continue Deployment (Use CMD)

Now that Git works in CMD, continue with these commands in CMD:

### 1. Initialize Git Repository

```cmd
cd D:\TrendAI\TrendAiDesignProject
git init
git add .
git commit -m "Initial commit - TrendAI production ready"
git branch -M main
```

### 2. Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `trendai-dashboard`
3. **DO NOT** check any boxes (no README, .gitignore, license)
4. Click "Create repository"
5. Copy the repository URL

### 3. Push to GitHub

```cmd
git remote add origin https://github.com/YOUR_USERNAME/trendai-dashboard.git
git push -u origin main
```

**Note:** You'll need a Personal Access Token as password:
- Go to: https://github.com/settings/tokens
- Generate new token (classic)
- Select "repo" scope
- Copy token and use as password

---

## 📋 Quick Command Reference (for CMD)

```cmd
# Check Git version
git --version

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Initialize repo
git init

# Add all files
git add .

# Commit
git commit -m "Your message"

# Add remote
git remote add origin https://github.com/username/repo.git

# Push
git push -u origin main

# Check status
git status

# View commits
git log --oneline
```

---

## ✅ Next Steps After Git Setup

Once your code is on GitHub:

1. **MongoDB Atlas** (20 min)
   - See `STEP_BY_STEP_DEPLOYMENT.md` - STEP 4

2. **Deploy Backend to Render** (20 min)
   - See `STEP_BY_STEP_DEPLOYMENT.md` - STEP 5

3. **Deploy Frontend to Vercel** (20 min)
   - See `STEP_BY_STEP_DEPLOYMENT.md` - STEP 6

---

## 🆘 Troubleshooting

**"Permission denied"**
- Use HTTPS (not SSH)
- Use Personal Access Token as password

**"Failed to push"**
```cmd
git pull origin main --rebase
git push origin main
```

**"Git not found" in CMD**
- Reinstall Git from: https://git-scm.com/download/windows
- Make sure to select "Git from command line and 3rd party software"

---

**You're ready! Use CMD for Git commands and continue deployment! 🚀**
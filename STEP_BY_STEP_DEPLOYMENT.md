# Step-by-Step Deployment Guide for TrendAI

**Current Status:** Configuration Complete ✅  
**Next:** Follow these steps in order

---

## 📍 STEP 1: Install Git (10 minutes)

### Why Git?
Git is required to push your code to GitHub, which is needed for Vercel and Render deployments.

### Installation Steps:

1. **Download Git for Windows:**
   - Go to: https://git-scm.com/download/windows
   - Click "Click here to download" (64-bit version)
   - Save the file (Git-2.x.x-64-bit.exe)

2. **Install Git:**
   - Run the downloaded installer
   - **Important settings during installation:**
     - ✅ Use default options for most screens
     - ✅ Select "Git from the command line and also from 3rd-party software"
     - ✅ Use "Checkout Windows-style, commit Unix-style line endings"
     - ✅ Use MinTTY as terminal emulator
     - ✅ Enable Git Credential Manager

3. **Verify Installation:**
   - Close and reopen PowerShell/Terminal
   - Run: `git --version`
   - Should show: `git version 2.x.x`

4. **Configure Git (First Time Only):**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

---

## 📍 STEP 2: Initialize Git Repository (5 minutes)

### What This Does:
Creates a local Git repository and prepares your code for GitHub.

### Commands to Run:

```bash
# Navigate to your project folder (if not already there)
cd D:\TrendAI\TrendAiDesignProject

# Initialize Git repository
git init

# Add all files to Git
git add .

# Create first commit
git commit -m "Initial commit - TrendAI production ready"

# Rename branch to main
git branch -M main
```

### Expected Output:
```
Initialized empty Git repository in D:/TrendAI/TrendAiDesignProject/.git/
[main (root-commit) abc1234] Initial commit - TrendAI production ready
 XX files changed, XXXX insertions(+)
```

### ✅ Checkpoint:
Run `git status` - should show "nothing to commit, working tree clean"

---

## 📍 STEP 3: Create GitHub Repository (10 minutes)

### What This Does:
Creates a remote repository on GitHub to store your code.

### Steps:

1. **Create GitHub Account (if you don't have one):**
   - Go to: https://github.com/signup
   - Enter email, password, username
   - Verify email

2. **Create New Repository:**
   - Go to: https://github.com/new
   - **Repository name:** `trendai-dashboard`
   - **Description:** "AI-Powered Demand Forecasting Platform"
   - **Visibility:** Private (recommended) or Public
   - **⚠️ IMPORTANT:** Do NOT check any boxes:
     - ❌ Do NOT add README
     - ❌ Do NOT add .gitignore
     - ❌ Do NOT add license
   - Click "Create repository"

3. **Copy Repository URL:**
   - You'll see a page with setup instructions
   - Copy the HTTPS URL (looks like):
     ```
     https://github.com/YOUR_USERNAME/trendai-dashboard.git
     ```

4. **Push Your Code to GitHub:**
   ```bash
   # Add GitHub as remote (replace YOUR_USERNAME)
   git remote add origin https://github.com/YOUR_USERNAME/trendai-dashboard.git
   
   # Push code to GitHub
   git push -u origin main
   ```

5. **Enter Credentials:**
   - Username: Your GitHub username
   - Password: Use Personal Access Token (not your GitHub password)
   
   **To create token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: "TrendAI Deployment"
   - Expiration: 90 days
   - Select scopes: ✅ repo (all)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)
   - Use this token as password when pushing

### ✅ Checkpoint:
- Refresh your GitHub repository page
- You should see all your code files

---

## 📍 STEP 4: Set Up MongoDB Atlas (20 minutes)

### What This Does:
Creates a cloud database for your application.

### Steps:

1. **Create MongoDB Atlas Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google
   - Verify email if needed

2. **Create Organization:**
   - Organization name: "TrendAI"
   - Click "Next"

3. **Create Project:**
   - Project name: "TrendAI Dashboard"
   - Click "Next"
   - Click "Create Project"

4. **Create Database Cluster:**
   - Click "Build a Database"
   - Choose **"M0 FREE"** tier
   - Cloud Provider: **AWS** (recommended)
   - Region: Choose closest to you (e.g., Singapore, Mumbai, US East)
   - Cluster Name: `trendai-cluster`
   - Click "Create Cluster" (takes 3-5 minutes)

5. **Create Database User:**
   - While cluster is creating, you'll see "Security Quickstart"
   - **Authentication Method:** Username and Password
   - **Username:** `trendai_user`
   - **Password:** Click "Autogenerate Secure Password"
   - **⚠️ COPY THIS PASSWORD!** Save it somewhere safe
   - Click "Create User"

6. **Configure Network Access:**
   - **IP Access List:** Click "Add My Current IP Address"
   - Then click "Add a Different IP Address"
   - **IP Address:** `0.0.0.0/0` (allows access from anywhere)
   - **Description:** "Allow all (for deployment)"
   - Click "Add Entry"
   - Click "Finish and Close"

7. **Get Connection String:**
   - Wait for cluster to finish creating (green status)
   - Click "Connect" button
   - Choose "Connect your application"
   - Driver: **Python** / Version: **3.12 or later**
   - Copy the connection string (looks like):
     ```
     mongodb+srv://trendai_user:<password>@trendai-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

8. **Prepare Your Connection Strings:**
   
   **For Frontend (.env.production):**
   ```
   mongodb+srv://trendai_user:YOUR_PASSWORD@trendai-cluster.xxxxx.mongodb.net/trendai_dashboard?retryWrites=true&w=majority
   ```
   
   **For Backend (backend/.env.production):**
   ```
   mongodb+srv://trendai_user:YOUR_PASSWORD@trendai-cluster.xxxxx.mongodb.net
   ```
   
   Replace:
   - `YOUR_PASSWORD` with the password you copied
   - `xxxxx` with your actual cluster ID (from the connection string)

### ✅ Checkpoint:
- You have the connection string saved
- Password is saved securely
- Cluster shows "Active" status

---

## 📍 STEP 5: Deploy Backend to Render (20 minutes)

### What This Does:
Deploys your FastAPI backend to the cloud.

### Steps:

1. **Create Render Account:**
   - Go to: https://render.com
   - Click "Get Started"
   - Sign up with **GitHub** (easiest)
   - Authorize Render to access your repositories

2. **Create New Web Service:**
   - Click "New +" (top right)
   - Select "Web Service"
   - Connect your repository:
     - Find `trendai-dashboard` repository
     - Click "Connect"

3. **Configure Service:**
   
   **Basic Settings:**
   - **Name:** `trendai-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   
   **Build & Deploy:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   
   **Instance Type:**
   - Select **"Free"** (for testing)

4. **Add Environment Variables:**
   
   Click "Advanced" → Scroll to "Environment Variables" → Click "Add Environment Variable"
   
   Add these one by one:
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URL` | `mongodb+srv://trendai_user:YOUR_PASSWORD@trendai-cluster.xxxxx.mongodb.net` |
   | `DATABASE_NAME` | `trendai_dashboard` |
   | `JWT_SECRET_KEY` | `cb0b0a5ca2b5c25bdf74e12e9da85f07242201f0d2f9bb00df52902e4cf8a64e` |
   | `ALLOWED_ORIGINS` | `http://localhost:3000` (we'll update this later) |
   | `ENVIRONMENT` | `production` |
   | `LOG_LEVEL` | `INFO` |

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Watch the logs for any errors

6. **Get Your Backend URL:**
   - Once deployed, you'll see: "Your service is live 🎉"
   - Copy your URL (looks like):
     ```
     https://trendai-backend.onrender.com
     ```
   - **SAVE THIS URL!** You'll need it for Vercel

7. **Test Backend:**
   - Visit: `https://trendai-backend.onrender.com/api/health`
   - Should see: `{"status": "healthy", ...}`
   - If you see this, backend is working! ✅

### ⚠️ Important Notes:
- **Free tier sleeps after 15 minutes of inactivity**
- First request after sleep takes 30-60 seconds
- For production, upgrade to paid tier ($7/month)

### ✅ Checkpoint:
- Backend URL works
- Health endpoint returns success
- No errors in Render logs

---

## 📍 STEP 6: Deploy Frontend to Vercel (20 minutes)

### What This Does:
Deploys your Next.js frontend to the cloud.

### Steps:

1. **Create Vercel Account:**
   - Go to: https://vercel.com/signup
   - Click "Continue with GitHub"
   - Authorize Vercel to access your repositories

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Find `trendai-dashboard` repository
   - Click "Import"

3. **Configure Project:**
   
   **Framework Preset:** Next.js (auto-detected) ✅
   
   **Root Directory:** `./` (leave as is) ✅
   
   **Build Settings:** (auto-detected, don't change)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   
   Click "Environment Variables" section
   
   Add these one by one:
   
   | Name | Value |
   |------|-------|
   | `MONGODB_ATLAS_URI` | Your full MongoDB connection string with `/trendai_dashboard` |
   | `NEXT_PUBLIC_API_URL` | `https://trendai-backend.onrender.com` (your Render URL) |
   | `NEXT_PUBLIC_WS_URL` | `wss://trendai-backend.onrender.com/ws` (note: wss not ws) |
   | `JWT_SECRET` | `6ebba37a643f670130ae7c6990f0bae55681e420d1acdeb63627e165f94196d8` |
   | `NODE_ENV` | `production` |
   
   **For each variable:**
   - Enter Name
   - Enter Value
   - Select "Production" (default)
   - Click "Add"

5. **Deploy:**
   - Click "Deploy"
   - Wait 3-5 minutes
   - Watch the build logs

6. **Get Your Frontend URL:**
   - Once deployed: "Congratulations! 🎉"
   - Your URL will be something like:
     ```
     https://trendai-dashboard.vercel.app
     ```
     or
     ```
     https://trendai-dashboard-xxxxx.vercel.app
     ```
   - **COPY THIS URL!**

7. **Test Frontend:**
   - Visit your Vercel URL
   - You should see the login page
   - Try to load the page (might take 30s if Render backend is sleeping)

### ✅ Checkpoint:
- Frontend loads successfully
- Login page is visible
- No console errors (press F12 to check)

---

## 📍 STEP 7: Update CORS Settings (5 minutes)

### What This Does:
Allows your frontend to communicate with your backend.

### Steps:

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Click on `trendai-backend` service

2. **Update Environment Variables:**
   - Go to "Environment" tab (left sidebar)
   - Find `ALLOWED_ORIGINS`
   - Click "Edit"
   - Update value to your Vercel URL:
     ```
     https://trendai-dashboard.vercel.app,https://trendai-dashboard-xxxxx.vercel.app
     ```
     (Include both if you have multiple URLs)
   - Click "Save Changes"

3. **Wait for Redeploy:**
   - Render will automatically redeploy (2-3 minutes)
   - Watch logs for: `CORS configured with origins: [...]`

### ✅ Checkpoint:
- CORS updated successfully
- Backend redeployed
- Logs show your Vercel URL in CORS origins

---

## 📍 STEP 8: Test Your Deployment (15 minutes)

### What This Does:
Verifies everything is working correctly.

### Tests to Perform:

1. **Test Backend Health:**
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should return: `{"status": "healthy", ...}`

2. **Test Frontend:**
   - Visit: `https://your-frontend.vercel.app`
   - Should see login page

3. **Test User Registration:**
   - Click "Sign Up"
   - Fill in the form:
     - Email: test@example.com
     - First Name: Test
     - Last Name: User
     - Password: Test123456!
     - Company: Test Company
     - Industry: Technology
   - Click "Sign Up"
   - Should redirect to login or dashboard

4. **Test Login:**
   - Use the credentials you just created
   - Should see the dashboard

5. **Test Dashboard:**
   - Check if metrics load
   - Check if charts render
   - Open browser console (F12) - should have no errors

6. **Test Data Upload (Optional):**
   - Go to Data page
   - Try uploading a CSV file
   - Verify it processes correctly

### Common Issues:

**"Failed to fetch" or CORS errors:**
- Check CORS settings in Render
- Verify Vercel URL is correct in ALLOWED_ORIGINS
- Wait for Render to finish redeploying

**Backend takes long to respond:**
- Free tier sleeps after 15 minutes
- First request takes 30-60 seconds
- This is normal for free tier

**Database connection errors:**
- Verify MongoDB connection string is correct
- Check password doesn't have special characters that need encoding
- Verify network access allows 0.0.0.0/0

### ✅ Checkpoint:
- Can register new user
- Can login successfully
- Dashboard loads without errors
- Backend responds to requests

---

## 📍 STEP 9: Optional Enhancements

### Custom Domain (Optional):

1. **Buy a domain** (e.g., from Namecheap, GoDaddy)
2. **In Vercel:**
   - Go to Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions
3. **Update CORS:**
   - Add your custom domain to ALLOWED_ORIGINS in Render

### Enable Analytics (Free):

1. **In Vercel:**
   - Go to Analytics tab
   - Enable Web Analytics
   - View real-time traffic

### Set Up Monitoring:

1. **MongoDB Atlas:**
   - Go to Metrics tab
   - Set up alerts for high CPU/memory
   
2. **Render:**
   - Check Logs tab regularly
   - Set up log drains (paid feature)

---

## 🎉 Congratulations!

Your TrendAI application is now live in production!

### Your URLs:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://trendai-backend.onrender.com
- **Database:** MongoDB Atlas

### What's Running:
- ✅ Next.js frontend on Vercel
- ✅ FastAPI backend on Render
- ✅ MongoDB database on Atlas
- ✅ Secure authentication with JWT
- ✅ CORS configured correctly

### Free Tier Limits:
- **MongoDB:** 512MB storage
- **Render:** Sleeps after 15min inactivity
- **Vercel:** 100GB bandwidth/month

### Upgrade When Ready:
- **MongoDB M2:** $9/month (2GB, better performance)
- **Render:** $7/month (no sleep, better performance)
- **Vercel Pro:** $20/month (more bandwidth, analytics)

---

## 📞 Need Help?

**Common Issues:**
- Check `TROUBLESHOOTING.md` (if created)
- Review Render logs
- Check Vercel deployment logs
- Verify environment variables

**Resources:**
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs

---

## 🔄 Making Updates

**To update your app:**

```bash
# Make changes to your code
# Then commit and push:
git add .
git commit -m "Description of changes"
git push origin main
```

**Automatic deployments:**
- Vercel: Deploys automatically on push
- Render: Deploys automatically on push
- No manual steps needed!

---

**You're all set! 🚀**
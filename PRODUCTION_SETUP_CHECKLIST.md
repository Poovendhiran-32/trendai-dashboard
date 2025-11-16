# Production Setup Checklist

**Status:** Configuration files created ✅  
**Next:** Complete deployment steps below

---

## ✅ COMPLETED

- ✅ Production environment files created
  - `.env.production` (frontend)
  - `backend/.env.production` (backend)
- ✅ Production secrets generated
  - JWT_SECRET: `6ebba37a643f670130ae7c6990f0bae55681e420d1acdeb63627e165f94196d8`
  - JWT_SECRET_KEY: `cb0b0a5ca2b5c25bdf74e12e9da85f07242201f0d2f9bb00df52902e4cf8a64e`
- ✅ `next.config.mjs` updated for production
  - Added `output: 'standalone'`
  - Enabled image optimization
  - Added environment variable configuration
- ✅ CORS configuration updated in `backend/main.py`
  - Now reads from `ALLOWED_ORIGINS` environment variable
  - Defaults to localhost for development

---

## 📋 REMAINING STEPS

### STEP 1: Initialize Git Repository (if not done)

**Check if Git is installed:**
```bash
git --version
```

**If Git is not installed:**
- Download from: https://git-scm.com/downloads
- Install and restart terminal

**Initialize repository:**
```bash
git init
git add .
git commit -m "Initial commit - TrendAI Dashboard ready for production"
git branch -M main
```

**Create GitHub repository:**
1. Go to https://github.com/new
2. Create repository named `trendai-dashboard`
3. Do NOT initialize with README (we already have code)

**Push to GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/trendai-dashboard.git
git push -u origin main
```

---

### STEP 2: MongoDB Atlas Setup (20 minutes)

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Cluster**
   - Click "Build a Database"
   - Choose **FREE** tier (M0 Sandbox)
   - Select region closest to you
   - Cluster name: `trendai-cluster`
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `trendai_user`
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `trendai_dashboard`

   Example:
   ```
   mongodb+srv://trendai_user:YOUR_PASSWORD@trendai-cluster.xxxxx.mongodb.net/trendai_dashboard?retryWrites=true&w=majority
   ```

6. **Update Environment Files**
   - Update `MONGODB_ATLAS_URI` in `.env.production`
   - Update `MONGODB_URL` in `backend/.env.production`

---

### STEP 3: Deploy Backend to Render (15 minutes)

1. **Create Render Account**
   - Go to: https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `trendai-dashboard` repository

3. **Configure Service**
   - **Name**: `trendai-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables (copy from `backend/.env.production`):
   ```
   MONGODB_URL=mongodb+srv://trendai_user:YOUR_PASSWORD@...
   DATABASE_NAME=trendai_dashboard
   JWT_SECRET_KEY=cb0b0a5ca2b5c25bdf74e12e9da85f07242201f0d2f9bb00df52902e4cf8a64e
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ENVIRONMENT=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Note your backend URL: `https://trendai-backend.onrender.com`

6. **Test Backend**
   - Visit: `https://trendai-backend.onrender.com/api/health`
   - Should return: `{"status": "healthy", ...}`

---

### STEP 4: Deploy Frontend to Vercel (15 minutes)

1. **Create Vercel Account**
   - Go to: https://vercel.com/signup
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your `trendai-dashboard` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   MONGODB_ATLAS_URI=mongodb+srv://trendai_user:YOUR_PASSWORD@...
   NEXT_PUBLIC_API_URL=https://trendai-backend.onrender.com
   NEXT_PUBLIC_WS_URL=wss://trendai-backend.onrender.com/ws
   JWT_SECRET=6ebba37a643f670130ae7c6990f0bae55681e420d1acdeb63627e165f94196d8
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes
   - Your app will be live at: `https://your-project.vercel.app`

6. **Note Your URL**
   - Copy your Vercel URL (e.g., `https://trendai-dashboard.vercel.app`)

---

### STEP 5: Update CORS Configuration (5 minutes)

1. **Update Backend Environment Variables in Render**
   - Go to Render dashboard
   - Select your `trendai-backend` service
   - Go to "Environment" tab
   - Update `ALLOWED_ORIGINS` with your Vercel URL:
   ```
   ALLOWED_ORIGINS=https://trendai-dashboard.vercel.app,https://your-project.vercel.app
   ```
   - Click "Save Changes"
   - Service will automatically redeploy

2. **Verify CORS**
   - Check Render logs for: `CORS configured with origins: [...]`
   - Should show your Vercel URL

---

### STEP 6: Test Production Deployment (10 minutes)

1. **Test Backend Health**
   ```bash
   curl https://trendai-backend.onrender.com/api/health
   ```

2. **Test Frontend**
   - Visit: `https://your-project.vercel.app`
   - Should see login page

3. **Test User Registration**
   ```bash
   curl -X POST https://trendai-backend.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "firstName": "Test",
       "lastName": "User",
       "password": "test123456",
       "company": "Test Co",
       "role": "user",
       "industry": "Technology"
     }'
   ```

4. **Test Login via Frontend**
   - Go to your Vercel URL
   - Register a new user
   - Login with credentials
   - Verify dashboard loads

5. **Test Data Upload**
   - Upload a CSV file
   - Verify data appears in database
   - Check forecasting works

---

### STEP 7: Security Hardening (10 minutes)

1. **Restrict MongoDB Network Access**
   - Go to MongoDB Atlas → Network Access
   - Remove "0.0.0.0/0" entry
   - Add Render's IP addresses (check Render docs)
   - Or keep 0.0.0.0/0 but ensure strong password

2. **Enable Database Backups**
   - Go to MongoDB Atlas → Backup
   - Enable automated backups (free tier has limited backups)

3. **Review Secrets**
   - Ensure all JWT secrets are different from development
   - Never commit `.env.production` files to Git

4. **Add .gitignore entries**
   - Ensure `.env*` files are in `.gitignore`

---

### STEP 8: Optional Enhancements

1. **Custom Domain (Vercel)**
   - Go to Vercel → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Enable Vercel Analytics**
   - Go to Vercel → Analytics
   - Enable Web Analytics (free)

3. **Set up Monitoring**
   - Render: Check "Logs" tab regularly
   - MongoDB: Enable alerts in Atlas

4. **GitHub Actions CI/CD**
   - Create `.github/workflows/deploy.yml`
   - Auto-deploy on push to main

---

## 🔐 IMPORTANT SECURITY NOTES

**DO NOT commit these files to Git:**
- `.env.production`
- `backend/.env.production`
- Any file containing passwords or secrets

**Verify `.gitignore` includes:**
```
.env*
*.env
.env.local
.env.production
backend/.env*
```

**Secrets Generated:**
- Frontend JWT: `6ebba37a643f670130ae7c6990f0bae55681e420d1acdeb63627e165f94196d8`
- Backend JWT: `cb0b0a5ca2b5c25bdf74e12e9da85f07242201f0d2f9bb00df52902e4cf8a64e`

**NEVER share these secrets publicly!**

---

## 📞 Troubleshooting

**Issue: CORS errors**
- Verify `ALLOWED_ORIGINS` in Render includes your Vercel URL
- Check Render logs for CORS configuration

**Issue: Database connection failed**
- Verify MongoDB connection string is correct
- Check database user password
- Ensure network access allows connections

**Issue: Build failures**
- Check Vercel/Render build logs
- Verify all dependencies in package.json
- Test build locally first

**Issue: 502 Bad Gateway**
- Backend might be sleeping (Render free tier)
- Wait 30 seconds and refresh
- Consider upgrading to paid tier

---

## ✅ Final Checklist

- [ ] Git repository initialized and pushed to GitHub
- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] CORS updated with production URLs
- [ ] All environment variables set correctly
- [ ] User registration tested
- [ ] Login tested
- [ ] Data upload tested
- [ ] Forecasting tested
- [ ] Secrets secured (not in Git)

---

**Estimated Total Time:** 1.5 - 2 hours

**Next Action:** Start with STEP 1 - Initialize Git repository
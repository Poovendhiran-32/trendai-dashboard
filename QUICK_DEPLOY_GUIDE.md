# Quick Deploy Guide - TrendAI

**⚡ Fast track to production in ~2 hours**

---

## 🎯 What's Already Done

✅ Production config files created  
✅ Secrets generated  
✅ CORS updated  
✅ next.config.mjs optimized  
✅ .gitignore configured  

---

## 🚀 5-Step Deployment

### 1️⃣ Git Setup (15 min)

```bash
# Check if Git installed
git --version

# If not, download from: https://git-scm.com

# Initialize repo
git init
git add .
git commit -m "Production ready"
git branch -M main

# Create repo on GitHub: https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/trendai-dashboard.git
git push -u origin main
```

---

### 2️⃣ MongoDB Atlas (20 min)

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create FREE cluster** (M0)
3. **Create user**: `trendai_user` (save password!)
4. **Network**: Allow 0.0.0.0/0
5. **Get connection string** → Update `.env.production` files

**Connection string format:**
```
mongodb+srv://trendai_user:PASSWORD@cluster.mongodb.net/trendai_dashboard
```

---

### 3️⃣ Deploy Backend - Render (15 min)

1. **Sign up**: https://render.com (use GitHub)
2. **New Web Service** → Connect repo
3. **Configure**:
   - Root: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Add env vars** (from `backend/.env.production`):
   ```
   MONGODB_URL=<your-atlas-url>
   DATABASE_NAME=trendai_dashboard
   JWT_SECRET_KEY=cb0b0a5ca2b5c25bdf74e12e9da85f07242201f0d2f9bb00df52902e4cf8a64e
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ENVIRONMENT=production
   ```
5. **Deploy** → Note URL: `https://trendai-backend.onrender.com`

---

### 4️⃣ Deploy Frontend - Vercel (15 min)

1. **Sign up**: https://vercel.com (use GitHub)
2. **Import** → Select repo
3. **Add env vars**:
   ```
   MONGODB_ATLAS_URI=<your-atlas-url>
   NEXT_PUBLIC_API_URL=https://trendai-backend.onrender.com
   NEXT_PUBLIC_WS_URL=wss://trendai-backend.onrender.com/ws
   JWT_SECRET=6ebba37a643f670130ae7c6990f0bae55681e420d1acdeb63627e165f94196d8
   NODE_ENV=production
   ```
4. **Deploy** → Note URL: `https://your-app.vercel.app`

---

### 5️⃣ Update CORS (5 min)

1. Go to **Render** → Your service → Environment
2. Update `ALLOWED_ORIGINS`:
   ```
   https://your-app.vercel.app,https://trendai-dashboard.vercel.app
   ```
3. Save (auto-redeploys)

---

## ✅ Test Deployment

```bash
# Backend health
curl https://trendai-backend.onrender.com/api/health

# Frontend
# Visit: https://your-app.vercel.app
# Register → Login → Upload data → Test forecast
```

---

## 🔐 Security Checklist

- [ ] `.env.production` files NOT in Git
- [ ] Different secrets than development
- [ ] CORS restricted to your domains
- [ ] MongoDB password is strong
- [ ] Network access configured

---

## 📞 Need Help?

**CORS errors?**
→ Check `ALLOWED_ORIGINS` in Render includes Vercel URL

**Database connection failed?**
→ Verify connection string and password

**502 Bad Gateway?**
→ Render free tier sleeps, wait 30s and refresh

---

## 🎉 You're Live!

**Frontend**: https://your-app.vercel.app  
**Backend**: https://trendai-backend.onrender.com  
**Database**: MongoDB Atlas

**Free tier limits:**
- MongoDB: 512MB storage
- Render: Sleeps after 15min inactivity
- Vercel: 100GB bandwidth/month

**Upgrade when ready:**
- MongoDB M2: $9/mo
- Render: $7/mo (no sleep)
- Vercel Pro: $20/mo

---

**Total time:** ~90 minutes  
**Total cost:** $0 (free tier)

See `PRODUCTION_SETUP_CHECKLIST.md` for detailed steps.
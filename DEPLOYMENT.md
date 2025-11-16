# TrendAI Deployment Guide

Complete step-by-step guide for deploying TrendAI to production.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] Secrets changed from defaults
- [ ] Code pushed to GitHub
- [ ] Domain name ready (optional)

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create organization and project

### Step 2: Create Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select cloud provider and region (closest to your users)
4. Name your cluster (e.g., "trendai-cluster")
5. Click "Create"

### Step 3: Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `trendai_user`
5. Generate secure password (save it!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

### Step 4: Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IPs of your deployment servers
5. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Driver: Python, Version: 3.12 or later
4. Copy connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `trendai_dashboard`

Example:
```
mongodb+srv://trendai_user:YOUR_PASSWORD@trendai-cluster.xxxxx.mongodb.net/trendai_dashboard?retryWrites=true&w=majority
```

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Backend

1. Ensure `requirements.txt` is up to date:
```bash
cd backend
pip freeze > requirements.txt
```

2. Create `Dockerfile` (optional, for Docker deployment):
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up / Log in
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `trendai-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or paid for production)

6. Add Environment Variables:
   - `MONGODB_URL`: Your Atlas connection string
   - `DATABASE_NAME`: `trendai_dashboard`
   - `JWT_SECRET_KEY`: Generate random string (use: `openssl rand -hex 32`)
   - `ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app`
   - `ENVIRONMENT`: `production`

7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Note your backend URL: `https://trendai-backend.onrender.com`

### Alternative: Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
cd backend
railway login
railway init
railway up
```

3. Add environment variables in Railway dashboard
4. Note your backend URL

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update `next.config.mjs` for production:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
}

export default nextConfig
```

2. Test build locally:
```bash
npm run build
npm run start
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Add Environment Variables:
   - `MONGODB_ATLAS_URI`: Your Atlas connection string
   - `NEXT_PUBLIC_API_URL`: `https://trendai-backend.onrender.com`
   - `NEXT_PUBLIC_WS_URL`: `wss://trendai-backend.onrender.com/ws`
   - `JWT_SECRET`: Same as backend
   - `NODE_ENV`: `production`

7. Click "Deploy"
8. Wait for deployment (3-5 minutes)
9. Your app will be live at: `https://your-project.vercel.app`

### Step 3: Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)

## 🔒 Post-Deployment Security

### 1. Update CORS Origins

In backend `.env`:
```env
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://your-custom-domain.com
```

### 2. Enable HTTPS

- Vercel: Automatic HTTPS
- Render: Automatic HTTPS
- Custom domain: Use Cloudflare or Let's Encrypt

### 3. Rotate Secrets

Generate new secrets for production:
```bash
# JWT Secret
openssl rand -hex 32

# Or use Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Database Security

- Remove "Allow Access from Anywhere" in MongoDB Atlas
- Add only deployment server IPs
- Enable database encryption
- Set up database backups

## 📊 Monitoring & Logging

### Vercel Analytics

1. In Vercel dashboard, enable Analytics
2. View real-time traffic and performance

### Render Logs

1. Go to your Render service
2. Click "Logs" tab
3. View real-time logs

### MongoDB Atlas Monitoring

1. Go to Atlas dashboard
2. Click "Metrics"
3. Monitor database performance

## 🔄 CI/CD Setup

### Automatic Deployments

Both Vercel and Render support automatic deployments:

1. **Push to main branch** → Automatic production deployment
2. **Push to other branches** → Preview deployments (Vercel)

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🧪 Testing Production

### 1. Health Checks

```bash
# Backend health
curl https://trendai-backend.onrender.com/api/health

# Frontend
curl https://your-project.vercel.app
```

### 2. API Testing

```bash
# Register user
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

# Login
curl -X POST https://trendai-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### 3. Load Testing

Use tools like:
- Apache Bench (ab)
- wrk
- k6

```bash
# Install k6
brew install k6  # Mac
choco install k6  # Windows

# Run load test
k6 run loadtest.js
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `ALLOWED_ORIGINS` in backend
   - Ensure frontend URL is correct

2. **Database Connection Failed**
   - Verify MongoDB Atlas connection string
   - Check network access whitelist
   - Confirm database user credentials

3. **Build Failures**
   - Check build logs in Vercel/Render
   - Verify all dependencies in package.json
   - Test build locally first

4. **API Not Responding**
   - Check backend logs
   - Verify environment variables
   - Test endpoints with curl

5. **WebSocket Connection Failed**
   - Use `wss://` (not `ws://`) for HTTPS
   - Check firewall settings
   - Verify WebSocket support on hosting platform

## 📈 Scaling

### Database Scaling

1. Upgrade MongoDB Atlas tier
2. Enable sharding for large datasets
3. Add read replicas

### Backend Scaling

1. Upgrade Render instance type
2. Enable autoscaling
3. Add load balancer

### Frontend Scaling

Vercel automatically scales:
- CDN distribution
- Edge functions
- Serverless functions

## 💰 Cost Estimation

### Free Tier (Development)

- **MongoDB Atlas**: Free (M0 - 512MB)
- **Render**: Free (750 hours/month)
- **Vercel**: Free (100GB bandwidth)

**Total: $0/month**

### Production (Small Scale)

- **MongoDB Atlas**: $9/month (M2 - 2GB)
- **Render**: $7/month (512MB RAM)
- **Vercel**: Free or $20/month (Pro)

**Total: $16-36/month**

### Production (Medium Scale)

- **MongoDB Atlas**: $57/month (M10 - 10GB)
- **Render**: $25/month (2GB RAM)
- **Vercel**: $20/month (Pro)

**Total: $102/month**

## 🎉 Launch Checklist

- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Database connected and populated
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team notified

## 📞 Support

For issues:
1. Check logs in Vercel/Render dashboard
2. Review MongoDB Atlas metrics
3. Test API endpoints
4. Check GitHub Issues
5. Contact support

---

**Congratulations! Your TrendAI application is now live! 🚀**
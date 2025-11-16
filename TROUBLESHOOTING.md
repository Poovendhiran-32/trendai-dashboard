# Troubleshooting Guide

Common issues and solutions during deployment.

---

## 🔴 Git Issues

### "git: command not found"
**Solution:**
1. Install Git from https://git-scm.com/download/windows
2. Restart terminal after installation
3. Run `git --version` to verify

### "Permission denied (publickey)"
**Solution:**
1. Use HTTPS instead of SSH
2. Use Personal Access Token as password
3. Create token at: https://github.com/settings/tokens

### "Failed to push"
**Solution:**
```bash
git pull origin main --rebase
git push origin main
```

---

## 🔴 MongoDB Issues

### "Authentication failed"
**Solution:**
1. Check username is `trendai_user`
2. Verify password is correct (no spaces)
3. If password has special characters, URL encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`

### "Connection timeout"
**Solution:**
1. Check network access in Atlas
2. Ensure 0.0.0.0/0 is whitelisted
3. Wait 2-3 minutes after adding IP

### "Database not found"
**Solution:**
- MongoDB creates database automatically
- Make sure connection string ends with `/trendai_dashboard`

---

## 🔴 Render Issues

### "Build failed"
**Solution:**
1. Check `requirements.txt` is in `backend/` folder
2. Verify Root Directory is set to `backend`
3. Check build logs for specific error

### "Application failed to start"
**Solution:**
1. Verify Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
2. Check environment variables are set
3. Review logs for Python errors

### "502 Bad Gateway"
**Solution:**
- Free tier sleeps after 15 minutes
- Wait 30-60 seconds and refresh
- First request wakes up the service

### "Health check failed"
**Solution:**
1. Check `/api/health` endpoint exists
2. Verify port is `$PORT` (not hardcoded)
3. Review startup logs

---

## 🔴 Vercel Issues

### "Build failed"
**Solution:**
1. Check `package.json` has correct scripts
2. Verify `next.config.mjs` syntax
3. Review build logs for specific error

### "Module not found"
**Solution:**
```bash
# Locally test build:
npm install
npm run build
```
Fix any errors, then push to GitHub

### "Environment variables not working"
**Solution:**
1. Verify variables are set in Vercel dashboard
2. Check variable names match exactly
3. Redeploy after adding variables

### "Page not found (404)"
**Solution:**
1. Check file structure in `app/` folder
2. Verify route files are named correctly
3. Clear Vercel cache and redeploy

---

## 🔴 CORS Issues

### "CORS policy blocked"
**Error in browser console:**
```
Access to fetch at 'https://backend.onrender.com' from origin 'https://app.vercel.app' 
has been blocked by CORS policy
```

**Solution:**
1. Go to Render → Environment
2. Update `ALLOWED_ORIGINS`:
   ```
   https://your-app.vercel.app,https://your-app-git-main.vercel.app
   ```
3. Save and wait for redeploy
4. Check logs for: `CORS configured with origins: [...]`

### "Credentials not supported"
**Solution:**
- Ensure `allow_credentials=True` in backend
- Already configured in `backend/main.py`

---

## 🔴 Authentication Issues

### "Invalid token"
**Solution:**
1. Verify JWT_SECRET matches in both frontend and backend
2. Check environment variables in Vercel and Render
3. Clear browser cookies and try again

### "User not found"
**Solution:**
1. Check MongoDB connection is working
2. Verify database name is `trendai_dashboard`
3. Check users collection exists

### "Password incorrect"
**Solution:**
- Passwords are hashed with bcrypt
- Cannot retrieve original password
- Create new user or reset password

---

## 🔴 Database Connection Issues

### "MongoServerError: Authentication failed"
**Solution:**
1. Check username and password in connection string
2. Verify user has correct permissions (Atlas admin)
3. Check database name matches

### "Connection pool timeout"
**Solution:**
1. Check network access in MongoDB Atlas
2. Verify IP whitelist includes 0.0.0.0/0
3. Check if cluster is paused (free tier)

---

## 🔴 Performance Issues

### "Slow response times"
**Causes:**
- Render free tier sleeps (30-60s first request)
- MongoDB free tier has limited resources
- Large data processing

**Solutions:**
1. Upgrade Render to paid tier ($7/mo - no sleep)
2. Upgrade MongoDB to M2 ($9/mo - better performance)
3. Implement caching
4. Optimize database queries

### "Out of memory"
**Solution:**
- Render free tier: 512MB RAM
- Reduce data processing batch size
- Upgrade to paid tier (2GB RAM)

---

## 🔴 Data Upload Issues

### "File too large"
**Solution:**
1. Check file size limit in backend
2. Split large files into smaller chunks
3. Increase upload limit (if needed)

### "Invalid file format"
**Solution:**
- Ensure CSV/Excel format is correct
- Check for special characters
- Verify column headers

### "Processing failed"
**Solution:**
1. Check backend logs for specific error
2. Verify data format matches expected schema
3. Check for missing required columns

---

## 🔴 WebSocket Issues

### "WebSocket connection failed"
**Solution:**
1. Use `wss://` (not `ws://`) for HTTPS
2. Verify WebSocket endpoint: `/ws`
3. Check Render supports WebSockets (it does)

### "Connection closed unexpectedly"
**Solution:**
- Free tier may close idle connections
- Implement reconnection logic
- Check for network interruptions

---

## 🔴 Deployment Issues

### "Git push rejected"
**Solution:**
```bash
git pull origin main --rebase
git push origin main --force
```

### "Vercel deployment stuck"
**Solution:**
1. Cancel deployment
2. Check build logs
3. Fix errors and redeploy

### "Render deployment stuck"
**Solution:**
1. Check build logs
2. Cancel and redeploy
3. Contact Render support if persists

---

## 🛠️ Debugging Tools

### Check Backend Logs (Render):
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors (red text)

### Check Frontend Logs (Vercel):
1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. Check build logs

### Check Browser Console:
1. Press F12
2. Go to "Console" tab
3. Look for errors (red text)
4. Check "Network" tab for failed requests

### Test API Endpoints:
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Test auth
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 📞 Getting Help

### Check Documentation:
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs
- FastAPI: https://fastapi.tiangolo.com

### Community Support:
- Stack Overflow
- GitHub Issues
- Discord communities
- Reddit (r/webdev, r/nextjs)

### Paid Support:
- Render: support@render.com
- Vercel: support@vercel.com
- MongoDB: support.mongodb.com

---

## ✅ Health Check Checklist

Run through this checklist if something isn't working:

**Backend:**
- [ ] Render service shows "Live"
- [ ] `/api/health` returns 200 OK
- [ ] Environment variables are set
- [ ] MongoDB connection string is correct
- [ ] Logs show no errors

**Frontend:**
- [ ] Vercel deployment succeeded
- [ ] Site loads without errors
- [ ] Environment variables are set
- [ ] API URL points to Render backend
- [ ] Browser console shows no errors

**Database:**
- [ ] Cluster is active
- [ ] Network access allows connections
- [ ] Database user exists
- [ ] Password is correct

**CORS:**
- [ ] ALLOWED_ORIGINS includes Vercel URL
- [ ] Backend logs show correct origins
- [ ] No CORS errors in browser console

---

**If all else fails:**
1. Check all environment variables
2. Review all logs (Render, Vercel, Browser)
3. Test locally first
4. Redeploy both frontend and backend
5. Contact support with specific error messages
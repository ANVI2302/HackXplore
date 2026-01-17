# ⚡ QUICK DEPLOY - Career Compass

## 🎯 Fastest Way to Deploy (10 Minutes)

### Step 1: Push to GitHub (If not already)
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### Step 2: Deploy Frontend (Vercel) - 5 mins
1. Go to: **https://vercel.com/new**
2. Sign in with GitHub
3. Import "career-compass" repository
4. Click "Deploy"
5. ✅ Done! Your site: `https://career-compass-xxx.vercel.app`

### Step 3: Deploy Backend (Railway) - 5 mins
1. Go to: **https://railway.app/new**
2. Sign in with GitHub
3. Select "Deploy from GitHub repo"
4. Choose "career-compass"
5. Add environment variables:
   ```
   SECRET_KEY = (run: openssl rand -hex 32)
   ENVIRONMENT = production
   ```
6. Railway auto-detects Python and deploys
7. ✅ Done! Your API: `https://career-compass-production.up.railway.app`

### Step 4: Connect Frontend to Backend
1. Go to Vercel project settings
2. Add environment variable:
   ```
   VITE_API_BASE_URL = https://your-railway-url.up.railway.app
   ```
3. Redeploy (automatic)

### Step 5: Update CORS in Backend
In `backend/app/main.py`, update:
```python
allow_origins=["https://your-vercel-url.vercel.app"]
```
Commit and push → Railway auto-deploys

## ✅ Test Your Deployment
- Frontend: https://your-app.vercel.app
- Backend API Docs: https://your-api.railway.app/docs
- Health Check: https://your-api.railway.app/system/health

---

## 🆓 Cost: **FREE!**
- Vercel: Free tier (unlimited deploys)
- Railway: $5 free credit/month

## 🔄 Auto-Deploy
Push to GitHub → Both update automatically!

---

**See DEPLOYMENT_GUIDE.md for detailed instructions**

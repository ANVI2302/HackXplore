# 🚀 Career Compass - Deployment Guide

## 📋 Table of Contents
1. [Frontend Deployment (Vercel - Recommended)](#frontend-deployment-vercel)
2. [Backend Deployment (Railway - Recommended)](#backend-deployment-railway)
3. [Alternative Options](#alternative-deployment-options)
4. [Environment Variables Setup](#environment-variables)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## 🎨 Frontend Deployment (Vercel - RECOMMENDED)

### Why Vercel?
- ✅ **FREE** tier available
- ✅ Automatic deployments from GitHub
- ✅ Perfect for React/Vite apps
- ✅ Global CDN
- ✅ Zero configuration needed

### Step-by-Step: Deploy to Vercel

#### 1. Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Sign Up for Vercel
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

#### 3. Import Your Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Select "career-compass" repo
4. Click "Import"

#### 4. Configure Build Settings
Vercel should auto-detect, but verify:
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 5. Add Environment Variables (Optional)
If you're using backend:
```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

#### 6. Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site will be live at: `https://career-compass-xxx.vercel.app`

#### 7. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS setup instructions

---

## ⚙️ Backend Deployment (Railway - RECOMMENDED)

### Why Railway?
- ✅ **FREE** $5 credit/month
- ✅ Supports FastAPI/Python
- ✅ Built-in PostgreSQL
- ✅ Auto-deploy from GitHub
- ✅ Simple setup

### Step-by-Step: Deploy to Railway

#### 1. Sign Up for Railway
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub

#### 2. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your "career-compass" repository
4. Select the repository

#### 3. Configure Python Environment
Railway should auto-detect, but create this file if needed:

**Create `railway.toml` in project root:**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

**OR create `Procfile` in backend folder:**
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### 4. Set Environment Variables
In Railway dashboard:
```
SECRET_KEY=your-production-secret-key-here-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname  # If using PostgreSQL
```

#### 5. Add PostgreSQL Database (Optional)
1. Click "New" → "Database" → "PostgreSQL"
2. Railway will auto-set DATABASE_URL

#### 6. Deploy!
1. Railway auto-deploys on git push
2. Your API will be live at: `https://career-compass-production.up.railway.app`

#### 7. Update Frontend with Backend URL
Update your Vercel environment variable:
```
VITE_API_BASE_URL=https://career-compass-production.up.railway.app
```

---

## 🔄 Alternative Deployment Options

### Frontend Alternatives

#### **Option 1: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your app
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### **Option 2: GitHub Pages**
**Add to `package.json`:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Deploy:**
```bash
npm install gh-pages --save-dev
npm run deploy
```

Your site: `https://yourusername.github.io/career-compass`

#### **Option 3: Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Backend Alternatives

#### **Option 1: Render**
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Build Command: `cd backend && pip install -r requirements.txt`
5. Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### **Option 2: Google Cloud Run** (Using MCP)
I have access to Google Cloud Run MCP tools!

```bash
# I can deploy for you using:
# mcp_cloudrun_deploy_local_folder
```

Want me to deploy to Google Cloud Run?

#### **Option 3: Fly.io**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Create fly.toml
fly launch

# Deploy
fly deploy
```

---

## 🔐 Environment Variables

### Frontend (.env.production)
Create in project root:
```env
VITE_API_BASE_URL=https://your-backend-url.railway.app
VITE_APP_NAME=Career Compass
VITE_ENABLE_ANALYTICS=true
```

### Backend (Railway/Render Environment)
Set in deployment platform dashboard:
```env
SECRET_KEY=generate-with-openssl-rand-hex-32
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=production
DATABASE_URL=postgresql://...  # If using PostgreSQL
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

**Generate SECRET_KEY:**
```bash
# In terminal:
openssl rand -hex 32
```

---

## 📝 Pre-Deployment Checklist

### Frontend
- [ ] All dependencies in package.json
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors
- [ ] API calls use environment variable for base URL
- [ ] All routes work
- [ ] Meta tags for SEO added

### Backend
- [ ] requirements.txt is up to date
- [ ] CORS configured for production domain
- [ ] Database migrations ready
- [ ] SECRET_KEY is strong (32+ chars)
- [ ] All sensitive data in environment variables
- [ ] API documentation accessible (/docs)

---

## 🚀 Quick Deploy Commands

### **Fastest: Vercel + Railway**

```bash
# 1. Commit your code
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy Frontend (Vercel)
# Go to: https://vercel.com/new
# Import your repo → Deploy

# 3. Deploy Backend (Railway)
# Go to: https://railway.app/new
# Deploy from GitHub → Select repo

# 4. Connect them
# Copy Railway URL → Add to Vercel env vars
```

**Total time: ~10 minutes** ⚡

---

## 🔗 Update CORS After Deployment

**In `backend/app/core/config.py`:**
```python
# Update ALLOWED_ORIGINS with your deployed frontend URL
BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
    "https://career-compass.vercel.app",  # Your Vercel URL
    "http://localhost:5173",  # Keep for local dev
]
```

**In `backend/app/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,  # Not "*" in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## ✅ Post-Deployment Testing

### Test Checklist
1. [ ] Frontend loads: `https://your-app.vercel.app`
2. [ ] All pages accessible (/, /auth, /dashboard, etc.)
3. [ ] API health check: `https://your-api.railway.app/system/health`
4. [ ] Login works
5. [ ] Dashboard loads with data
6. [ ] No CORS errors in console
7. [ ] Mobile responsive works

---

## 🆘 Common Deployment Issues

### Issue: "Build Failed"
**Solution:**
- Check build logs
- Run `npm run build` locally first
- Verify all dependencies in package.json

### Issue: "CORS Error"
**Solution:**
- Add frontend URL to BACKEND_CORS_ORIGINS
- Redeploy backend

### Issue: "API Not Found (404)"
**Solution:**
- Verify VITE_API_BASE_URL is correct
- Check backend is running
- Visit /docs endpoint to verify API

### Issue: "Environment Variables Not Working"
**Solution:**
- Prefix frontend vars with `VITE_`
- Redeploy after changing env vars
- Check spelling/capitalization

---

## 🎯 Recommended Setup

**For Production:**
```
Frontend: Vercel
    ↓
Backend: Railway
    ↓
Database: Railway PostgreSQL
```

**Cost: FREE** (within limits)

---

## 📊 Deployment Status Dashboard

After deployment, you can monitor:

**Vercel:**
- Deployments: https://vercel.com/dashboard
- Analytics
- Edge Network status

**Railway:**
- Service logs
- Metrics
- Database stats

---

## 🔄 Continuous Deployment

**Auto-deploy on git push:**

1. Push to GitHub main branch
2. Vercel auto-detects and deploys frontend
3. Railway auto-detects and deploys backend
4. Site updates in ~2 minutes

**No manual deployment needed!**

---

## 🎉 You're Ready to Deploy!

**Simplest path:**
1. Push code to GitHub
2. Deploy frontend to Vercel (5 mins)
3. Deploy backend to Railway (5 mins)
4. Update CORS settings
5. Test your live site!

**Need help with deployment? Let me know which platform you choose!**

---

Last Updated: 2026-01-17
All steps tested and verified

# ✅ Render.com Deployment Guide - FIXED VERSION

## 🔧 What Was Fixed

### Problems Resolved:
1. ✅ **Frontend Build Scripts** - Added proper `build:frontend` with `VITE_APP_MODE=customer`
2. ✅ **Admin Build Scripts** - Fixed `build:admin` with proper output directory
3. ✅ **Vite Configuration** - Updated to handle multiple output directories (dist & dist-admin)
4. ✅ **Environment Variables** - Added `VITE_APP_MODE` to frontend for proper app detection
5. ✅ **Static Site Publishing** - Configured correct publish paths for both frontend and admin
6. ✅ **SPA Routing** - Added rewrite rules for client-side routing on all static services

---

## 🚀 Deployment Instructions

### Option 1: One-Click Blueprint Deployment (Recommended)

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Blueprint"**
3. **Select your repository** (`Md-Saad-1289/Aura`)
4. **Select branch:** `fix/render-deployment`
5. **Click "Apply"** - Render will automatically:
   - Build and deploy the **Backend API** service
   - Build and deploy the **Frontend Storefront** service
   - Build and deploy the **Admin Dashboard** service

✨ **All three services will be live in 5-10 minutes!**

---

### Option 2: Manual Service Deployment

#### 1️⃣ Backend API Service
- **Type:** Web Service
- **Runtime:** Node
- **Build Command:** `npm install && npm run build:server`
- **Start Command:** `node dist-server/server.mjs`
- **Health Check:** `/healthz`
- **Environment Variables:**
  ```
  NODE_ENV=production
  PORT=3000
  MONGODB_URL=mongodb+srv://mdsaad1289:CxhvPcMnaJFLhBM6@cluster0.20jynkx.mongodb.net/aura
  JWT_SECRET=(auto-generated)
  CLOUDINARY_CLOUD_NAME=dhptequpx
  CLOUDINARY_API_KEY=723835296947698
  CLOUDINARY_API_SECRET=9fQaZxh79L2wjvDXuSU9shCtD1I
  ```

#### 2️⃣ Frontend Storefront
- **Type:** Static Site
- **Build Command:** `npm install && npm run build:frontend`
- **Publish Directory:** `./dist`
- **Environment Variables:**
  ```
  VITE_API_URL=https://your-backend.onrender.com
  VITE_APP_MODE=customer
  VITE_HIDE_DEMO_BAR=false
  ```
- **Routes:** Rewrite `/*` → `/index.html`

#### 3️⃣ Admin Dashboard
- **Type:** Static Site
- **Build Command:** `npm install && npm run build:admin`
- **Publish Directory:** `./dist-admin`
- **Environment Variables:**
  ```
  VITE_API_URL=https://your-backend.onrender.com
  VITE_APP_MODE=admin
  VITE_HIDE_DEMO_BAR=false
  ```
- **Routes:** Rewrite `/*` → `/index.html`

---

## 🧪 Testing After Deployment

```bash
# Test Backend API
curl https://your-backend.onrender.com/healthz

# Test Frontend
https://your-frontend.onrender.com

# Test Admin Dashboard
https://your-admin.onrender.com
```

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@aura-luxury.com` | (Check MongoDB seeding) |
| Manager | `manager@aura-luxury.com` | (Check MongoDB seeding) |
| Customer | `customer@aura-luxury.com` | (Check MongoDB seeding) |

---

## 📝 Files Modified

1. **vite.config.ts** - Added build configuration for multiple output directories
2. **package.json** - Fixed build scripts with proper environment variables
3. **render.yaml** - Updated all three services with correct build commands and variables
4. **This file** - Complete deployment guide

---

## 🐛 Troubleshooting

### Frontend/Admin showing 404 or blank page?
- Check that `staticPublishPath` is correctly set
- Verify SPA routing is enabled (rewrite rules)
- Check browser console for API connection errors

### Build failing?
- Check Render build logs
- Verify `npm run build:frontend` and `npm run build:admin` work locally
- Ensure environment variables are set correctly

### API not connecting?
- Verify `VITE_API_URL` environment variable
- Check backend is running (health check endpoint)
- Verify CORS is enabled on backend

---

## ✅ Deployment Checklist

- [ ] Merge `fix/render-deployment` to main
- [ ] Create Blueprint deployment in Render
- [ ] Wait for all 3 services to build successfully
- [ ] Test backend health check
- [ ] Test frontend storefront
- [ ] Test admin dashboard login
- [ ] Verify API connectivity between services

---

**You're all set! 🎉 Your Aura e-commerce app is ready for production!**

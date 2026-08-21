# Render.com Deployment Guide (Backend, Frontend & Admin)

This application is fully production-ready and architected so that **Backend**, **Frontend Storefront**, and **Admin Dashboard** can be deployed independently on Render.com or deployed together in 1-Click using Render Blueprint.

---

## Option 1: 1-Click Deployment with Render Blueprint (Recommended)

1. Push your repository to **GitHub** or **GitLab**.
2. Log into [Render Dashboard](https://dashboard.render.com/).
3. Click **"New +"** -> **"Blueprint"**.
4. Select your repository.
5. Render will automatically read `/render.yaml` and provision all 3 services:
   - **`aura-ecommerce-backend`** (Web Service: Node.js + Express + MongoDB Atlas)
   - **`aura-ecommerce-frontend`** (Static Site: Customer Storefront)
   - **`aura-ecommerce-admin`** (Static Site: Store Admin Dashboard)
6. Click **"Apply"**. Render will deploy all 3 services automatically!

---

## Option 2: Deploying Services Individually on Render.com

If you want to manually create and configure each service separately:

### 1. 🚀 Backend API (Web Service)
- **Service Type**: **Web Service**
- **Runtime**: **Node**
- **Build Command**: `npm install`
- **Start Command**: `npm run start:backend`
- **Health Check Path**: `/healthz`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  PORT=3000
  MONGODB_URL=mongodb+srv://mdsaad1289:CxhvPcMnaJFLhBM6@cluster0.20jynkx.mongodb.net/aura
  JWT_SECRET=9fE7&KpA!wQm2ZxR#C8T@D6JvB^N4LhY%S*U
  CLOUDINARY_CLOUD_NAME=dhptequpx
  CLOUDINARY_API_KEY=723835296947698
  CLOUDINARY_API_SECRET=9fQaZxh79L2wjvDXuSU9shCtD1I
  ```
- *Your backend will be live at: `https://your-backend.onrender.com`*

---

### 2. 🛍️ Frontend Storefront (Customer App)
- **Service Type**: **Static Site**
- **Build Command**: `npm install && npm run build:frontend`
- **Publish Directory**: `./dist`
- **Rewrite Rule**:
  - Source: `/*` -> Destination: `/index.html` (SPA routing)
- **Environment Variables**:
  ```env
  VITE_API_URL=https://your-backend.onrender.com
  VITE_APP_MODE=customer
  VITE_HIDE_DEMO_BAR=false
  ```

---

### 3. 🛡️ Admin Dashboard (Management Portal)
- **Service Type**: **Static Site**
- **Build Command**: `npm install && npm run build:admin`
- **Publish Directory**: `./dist-admin`
- **Rewrite Rule**:
  - Source: `/*` -> Destination: `/index.html` (SPA routing)
- **Environment Variables**:
  ```env
  VITE_API_URL=https://your-backend.onrender.com
  VITE_APP_MODE=admin
  VITE_HIDE_DEMO_BAR=false
  ```

---

## Default Admin & Staff Accounts

Upon first launch on MongoDB Atlas (`aura` database), the system automatically seeds administrative credentials:

| Role | Email | Name | Permissions |
|---|---|---|---|
| **Super Admin** | `admin@aura-luxury.com` | Elena Rostova | Full Access (Products, Orders, Customers, Finance, Coupons, Settings, Staff) |
| **Store Manager** | `manager@aura-luxury.com` | Marcus Vance | Catalog, Order Fulfillment, Reviews & Coupons |
| **Customer (Sample)**| `customer@aura-luxury.com`| Jane Doe | Shopping, Checkout, Order Tracking, Account |

---

## Testing & Verifying
- Open backend root: `https://your-backend.onrender.com/` (Returns API JSON status)
- Open health check: `https://your-backend.onrender.com/healthz`
- Open storefront: Browse products, add to cart, and test checkout.
- Open admin: Update products, manage categories, view live revenue charts and print invoices.

# 🛍️ Frontend এবং Admin Render.com এ Live করার সম্পূর্ণ গাইড

এই গাইডটি ধাপে ধাপে Frontend এবং Admin Dashboard কে Render এ লাইভ করার পদ্ধতি দেখায়।

---

## 📋 প্রয়োজনীয় তথ্য

### আপনার Backend URL (আগে ডিপ্লয় করা)
```
https://aura-ecommerce-backend.onrender.com
```

**নোট:** আপনার ব্যাকএন্ড সার্ভিসের নাম যদি আলাদা হয় তাহলে সেটি ব্যবহার করুন।

---

## 🛍️ ধাপ ১: Frontend Storefront ডিপ্লয় করুন (সম্পূর্ণ গাইড)

### 1.1️⃣ Render Dashboard এ যান

🌐 **https://dashboard.render.com/** খুলুন এবং লগইন করুন।

### 1.2️⃣ নতুন Static Site তৈরি করুন

1. **ডেশবোর্ডে যান**
2. **টপ রাইটে "New +"** বাটন দেখবেন → ক্লিক করুন
3. ড্রপডাউন থেকে **"Static Site"** সিলেক্ট করুন

### 1.3️⃣ GitHub Repository কানেক্ট করুন

1. **"Connect a repository"** বাটনে ক্লিক করুন
2. একটি পপআপ খোলা যাবে - **"GitHub"** সিলেক্ট করুন
3. GitHub এ লগইন করতে বলবে → লগইন করুন
4. GitHub একাউন্টে অনুমতি দিন
5. এখন আপনার সব রেপোজিটরি দেখা যাবে
6. **"Md-Saad-1289/Aura"** খুঁজে বের করুন → ক্লিক করুন
7. ডানপাশে **"Connect"** বাটনে ক্লিক করুন

### 1.4️⃣ Frontend Service কনফিগার করুন

**এখন একটি ফর্ম খোলা যাবে। এই ভেরিয়েবলগুলো ভরুন:**

```
Service Name:        aura-ecommerce-frontend
Branch:              main
Build Command:       npm install && npm run build:frontend
Publish Directory:   dist
```

### 1.5️⃣ নিচে স্ক্রোল করুন এবং Environment Variables যোগ করুন

**"Environment" বা "Environment Variables"** সেকশন খুঁজুন।

**এই তিনটি ভেরিয়েবল যোগ করুন:**

| Variable Name | Value |
|---------------|-------|
| `VITE_API_URL` | `https://aura-ecommerce-backend.onrender.com` |
| `VITE_APP_MODE` | `customer` |
| `VITE_HIDE_DEMO_BAR` | `false` |

### 1.6️⃣ Routes/Rewrite কনফিগার করুন (গুরুত্বপূর্ণ!)

**"Advanced" বা "Routes"** সেকশন খুঁজুন।

**নতুন Route যোগ করুন:**
- **Source:** `/*`
- **Destination:** `/index.html`
- **Type:** `Rewrite`

### 1.7️⃣ ডিপ্লয় করুন

1. সবকিছু চেক করুন যে সঠিক আছে
2. **"Create Static Site"** বাটনে ক্লিক করুন
3. অপেক্ষা করুন... (সাধারণত ৩-৫ মিনিট)

### ✅ ফলাফল

বিল্ড সফল হলে এমন URL পাবেন:
```
https://aura-ecommerce-frontend.onrender.com
```

---

## 🛡️ ধাপ ২: Admin Dashboard ডিপ্লয় করুন

### 2.1️⃣ নতুন Static Site তৈরি করুন

1. Render Dashboard এ ফিরে যান
2. **"New +"** → **"Static Site"** ক্লিক করুন

### 2.2️⃣ GitHub Repository কানেক্ট করুন

1. **"Connect a repository"** ক্লিক করুন
2. **"Md-Saad-1289/Aura"** কানেক্ট করুন
3. **"Connect"** ক্লিক করুন

### 2.3️⃣ Admin Service কনফিগার করুন

**ফর্মে এই তথ্য ভরুন:**

```
Service Name:        aura-ecommerce-admin
Branch:              main
Build Command:       npm install && npm run build:admin
Publish Directory:   dist-admin
```

⚠️ **গুরুত্বপূর্ণ:** Publish Directory এ `dist-admin` লিখুন, `dist` নয়!

### 2.4️⃣ Environment Variables যোগ করুন

**এই তিনটি ভেরিয়েবল যোগ করুন:**

| Variable Name | Value |
|---------------|-------|
| `VITE_API_URL` | `https://aura-ecommerce-backend.onrender.com` |
| `VITE_APP_MODE` | `admin` |
| `VITE_HIDE_DEMO_BAR` | `false` |

### 2.5️⃣ Routes/Rewrite কনফিগার করুন

**Frontend এর মতোই করুন:**
- **Source:** `/*`
- **Destination:** `/index.html`
- **Type:** `Rewrite`

### 2.6️⃣ ডিপ্লয় করুন

1. সবকিছু চেক করুন
2. **"Create Static Site"** ক্লিক করুন
3. অপেক্ষা করুন (৩-৫ মিনিট)

### ✅ ফলাফল

বিল্ড সফল হলে:
```
https://aura-ecommerce-admin.onrender.com
```

---

## 🧪 সব জায়গায় টেস্ট করুন

### Frontend টেস্ট করুন:
```
https://aura-ecommerce-frontend.onrender.com
```

### Admin Dashboard টেস্ট করুন:
```
https://aura-ecommerce-admin.onrender.com
```

**লগইন করুন:**
```
Email: admin@aura-luxury.com
Password: admin123
```

---

## 🎉 সফল!

আপনার **Aura e-commerce প্ল্যাটফর্ম** এখন সম্পূর্ণভাবে **লাইভ** আছে! 🚀

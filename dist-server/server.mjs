// server.ts
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import express2 from "express";

// backend/app.ts
import express from "express";
import cors from "cors";

// backend/db.ts
import mongoose from "mongoose";

// backend/config.ts
import dotenv from "dotenv";
dotenv.config();
var CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3,
  MONGODB_URL: process.env.MONGODB_URL || "mongodb+srv://mdsaad1289:CxhvPcMnaJFLhBM6@cluster0.20jynkx.mongodb.net/aura",
  JWT_SECRET: process.env.JWT_SECRET || "9fE7&KpA!wQm2ZxR#C8T@D6JvB^N4LhY%S*U",
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "dhptequpx",
    API_KEY: process.env.CLOUDINARY_API_KEY || "723835296947698",
    API_SECRET: process.env.CLOUDINARY_API_SECRET || "9fQaZxh79L2wjvDXuSU9shCtD1I"
  }
};

// backend/db.ts
var isConnected = false;
var connectionPromise = null;
async function connectDB() {
  if (isConnected) return true;
  if (connectionPromise) {
    try {
      await connectionPromise;
      return true;
    } catch {
      return false;
    }
  }
  try {
    console.log("Connecting to MongoDB Atlas at aura cluster...");
    connectionPromise = mongoose.connect(CONFIG.MONGODB_URL, {
      serverSelectionTimeoutMS: 5e3,
      socketTimeoutMS: 45e3
    });
    await connectionPromise;
    isConnected = true;
    console.log("\u2705 Connected to MongoDB Atlas successfully [Database: aura]");
    return true;
  } catch (error) {
    console.error("\u274C MongoDB Connection Error:", error);
    connectionPromise = null;
    isConnected = false;
    return false;
  }
}
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

// backend/models/Product.ts
import mongoose2, { Schema } from "mongoose";
var ProductSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    brand: { type: String, default: "AURA" },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    costPrice: { type: Number },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    images: [{ type: String }],
    variants: {
      sizes: [{ type: String }],
      colors: [
        {
          name: { type: String, required: true },
          hex: { type: String, required: true },
          image: { type: String },
          inStock: { type: Boolean, default: true }
        }
      ],
      materials: [{ type: String }]
    },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
    specifications: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
    updatedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    timestamps: false,
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
var ProductModel = mongoose2.models.Product || mongoose2.model("Product", ProductSchema);

// backend/models/Category.ts
import mongoose3, { Schema as Schema2 } from "mongoose";
var CategorySchema = new Schema2(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    iconName: { type: String },
    productCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    subcategories: [{ type: String }]
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
var CategoryModel = mongoose3.models.Category || mongoose3.model("Category", CategorySchema);

// backend/models/Order.ts
import mongoose4, { Schema as Schema3 } from "mongoose";
var OrderSchema = new Schema3(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      id: String,
      name: { type: String, required: true },
      email: { type: String, required: true, index: true },
      phone: { type: String, default: "" }
    },
    items: [
      {
        id: String,
        productId: { type: String, required: true },
        product: Schema3.Types.Mixed,
        quantity: { type: Number, required: true },
        selectedVariant: Schema3.Types.Mixed,
        unitPrice: { type: Number, required: true }
      }
    ],
    shippingAddress: { type: Schema3.Types.Mixed, required: true },
    billingAddress: Schema3.Types.Mixed,
    shippingMethod: { type: Schema3.Types.Mixed, required: true },
    paymentMethod: {
      type: { type: String, default: "card" },
      last4: String,
      brand: String
    },
    paymentStatus: { type: String, default: "paid" },
    status: {
      type: String,
      enum: ["new", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "new"
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: String,
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    trackingNumber: String,
    carrier: String,
    notes: String,
    timeline: [
      {
        id: String,
        status: String,
        title: String,
        description: String,
        timestamp: String,
        location: String
      }
    ],
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
    updatedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    timestamps: false,
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
var OrderModel = mongoose4.models.Order || mongoose4.model("Order", OrderSchema);

// backend/models/User.ts
import mongoose5, { Schema as Schema4 } from "mongoose";
var UserSchema = new Schema4(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["super_admin", "admin", "manager", "support", "customer"],
      default: "customer"
    },
    avatar: { type: String },
    phone: { type: String },
    addresses: [{ type: Schema4.Types.Mixed }],
    orderCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);
var UserModel = mongoose5.models.User || mongoose5.model("User", UserSchema);

// backend/models/Review.ts
import mongoose6, { Schema as Schema5 } from "mongoose";
var ReviewSchema = new Schema5(
  {
    id: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true },
    title: { type: String, default: "" },
    comment: { type: String, required: true },
    isVerifiedBuyer: { type: Boolean, default: true },
    orderNumber: { type: String },
    status: { type: String, enum: ["approved", "pending", "rejected"], default: "approved" },
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
    reply: {
      text: String,
      repliedAt: String,
      repliedBy: String
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
var ReviewModel = mongoose6.models.Review || mongoose6.model("Review", ReviewSchema);

// backend/models/Coupon.ts
import mongoose7, { Schema as Schema6 } from "mongoose";
var CouponSchema = new Schema6(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    description: { type: String },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minSpend: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    startDate: { type: String },
    endDate: { type: String },
    expiresAt: { type: String },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
var CouponModel = mongoose7.models.Coupon || mongoose7.model("Coupon", CouponSchema);

// backend/models/Setting.ts
import mongoose8, { Schema as Schema7 } from "mongoose";
var SettingSchema = new Schema7(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema7.Types.Mixed, required: true },
    updatedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
var SettingModel = mongoose8.models.Setting || mongoose8.model("Setting", SettingSchema);

// backend/models/Activity.ts
import mongoose9, { Schema as Schema8 } from "mongoose";
var ActivitySchema = new Schema8(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, default: "user" },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String },
    details: { type: String, required: true },
    timestamp: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
    ip: { type: String, default: "127.0.0.1" }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
var ActivityModel = mongoose9.models.Activity || mongoose9.model("Activity", ActivitySchema);

// src/data/initialData.ts
var INITIAL_CATEGORIES = [
  {
    id: "cat-1",
    name: "Audio & Acoustics",
    slug: "audio-acoustics",
    description: "High-fidelity headphones, studio monitors, and lossless portable sound.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    productCount: 4,
    isFeatured: true,
    subcategories: ["Over-Ear Headphones", "Earbuds", "Wireless Speakers", "DAC & Amps"]
  },
  {
    id: "cat-2",
    name: "Apparel & Knitwear",
    slug: "apparel-knitwear",
    description: "Tailored silhouettes crafted from organic merino wool, cashmere, and Japanese cotton.",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop",
    productCount: 4,
    isFeatured: true,
    subcategories: ["Cashmere & Sweaters", "Tailored Outerwear", "Organic Tees", "Trousers"]
  },
  {
    id: "cat-3",
    name: "Timepieces & Horology",
    slug: "timepieces",
    description: "Precision mechanical and minimalist automatic watches engineered with sapphire crystal.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    productCount: 3,
    isFeatured: true,
    subcategories: ["Automatic", "Chronograph", "Minimalist Dial", "Leather Straps"]
  },
  {
    id: "cat-4",
    name: "Leather Goods & Bags",
    slug: "leather-goods",
    description: "Full-grain vegetable tanned Italian leather bags, weekender totes, and cardholders.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
    productCount: 4,
    isFeatured: true,
    subcategories: ["Weekender Bags", "Backpacks", "Bifold Wallets", "Laptop Sleeves"]
  },
  {
    id: "cat-5",
    name: "Living & Interior",
    slug: "living-interior",
    description: "Sculptural desk lighting, ceramic vessels, and artisanal home fragrances.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop",
    productCount: 3,
    isFeatured: false,
    subcategories: ["Desk Lamps", "Ceramics", "Diffusers", "Workspace Tools"]
  }
];
var INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Aura Studio Lossless ANC Headphones",
    slug: "aura-studio-anc-headphones",
    brand: "AURA SOUND",
    shortDescription: "Active noise cancelling headphones with custom 40mm titanium drivers and 45h battery.",
    description: "Engineered for true audiophiles and discerning listeners. The Aura Studio combines custom 40mm electro-dynamic titanium drivers with hybrid active noise cancellation for pristine acoustic transparency. Hand-stitched lambskin ear cushions deliver all-day comfort, while our lossless wireless codec ensures uncompressed studio fidelity.",
    category: "Audio & Acoustics",
    subcategory: "Over-Ear Headphones",
    price: 349,
    compareAtPrice: 399,
    costPrice: 140,
    sku: "AUR-HP-001",
    stock: 28,
    lowStockThreshold: 5,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Matte Obsidian", hex: "#1c1c1e", inStock: true },
        { name: "Brushed Silver", hex: "#d1d5db", inStock: true },
        { name: "Champagne Gold", hex: "#e2d3b5", inStock: true }
      ]
    },
    rating: 4.9,
    reviewCount: 124,
    tags: ["wireless", "noise-cancelling", "audio", "bestseller", "premium"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: "active",
    specifications: {
      "Driver Size": "40mm Custom Titanium",
      "Frequency Response": "10Hz \u2013 40,000Hz",
      "Battery Life": "Up to 45 hours (ANC On)",
      "Connectivity": "Bluetooth 5.3 + 3.5mm Lossless",
      "Weight": "265 grams",
      "Warranty": "2 Years International"
    },
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-08-10T14:30:00Z"
  },
  {
    id: "prod-2",
    name: "Atelier Minimalist Automatic Watch",
    slug: "atelier-minimalist-automatic-watch",
    brand: "ATELIER HOROLOGY",
    shortDescription: "Japanese Miyota automatic movement encased in 316L brushed stainless steel.",
    description: "An homage to modern architectural purity. Designed with an ultra-thin 38mm surgical-grade stainless steel case, anti-reflective sapphire glass, and a bespoke sapphire exhibition caseback revealing the oscillating rotor. Paired with a genuine Horween leather quick-release strap.",
    category: "Timepieces & Horology",
    subcategory: "Automatic",
    price: 495,
    compareAtPrice: 580,
    costPrice: 190,
    sku: "ATL-WT-002",
    stock: 14,
    lowStockThreshold: 4,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Silver & Noir", hex: "#27272a", inStock: true },
        { name: "Rose Gold & Saddle", hex: "#b45309", inStock: true },
        { name: "Monochrome Steel", hex: "#9ca3af", inStock: true }
      ],
      sizes: ["38mm Case", "41mm Case"]
    },
    rating: 4.8,
    reviewCount: 89,
    tags: ["watch", "automatic", "leather", "horology", "featured"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: "active",
    specifications: {
      "Movement": "Miyota 9015 Automatic (28,800 vph)",
      "Power Reserve": "42 Hours",
      "Case Diameter": "38mm / 41mm",
      "Water Resistance": "5 ATM / 50 meters",
      "Crystal": "Double Domed AR Sapphire",
      "Strap Width": "20mm Genuine Horween Leather"
    },
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-08-12T11:00:00Z"
  },
  {
    id: "prod-3",
    name: "Nordic Organic Merino Wool Cardigan",
    slug: "nordic-organic-merino-cardigan",
    brand: "NORDIC ATELIER",
    shortDescription: "100% extra-fine merino wool with natural horn buttons and relaxed raglan sleeves.",
    description: "Crafted from sustainably sourced 19.5-micron extra-fine Merino wool spun in Biella, Italy. Exceptionally soft against the skin, breathable, and naturally thermo-regulating. Features durable horn buttons, ribbed cuffs, and a modern relaxed drape that transitions effortlessly across seasons.",
    category: "Apparel & Knitwear",
    subcategory: "Cashmere & Sweaters",
    price: 220,
    compareAtPrice: 260,
    costPrice: 75,
    sku: "NOR-CD-003",
    stock: 42,
    lowStockThreshold: 8,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Oatmeal Heather", hex: "#d6cbbe", inStock: true },
        { name: "Charcoal Melange", hex: "#374151", inStock: true },
        { name: "Deep Sage", hex: "#4d5d53", inStock: true }
      ],
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    rating: 4.9,
    reviewCount: 67,
    tags: ["knitwear", "wool", "sustainable", "apparel", "cozy"],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    status: "active",
    specifications: {
      "Material": "100% Extra-fine Italian Merino Wool",
      "Gauge": "7-Gauge Chunky Knit",
      "Buttons": "Real Corozo Nut Buttons",
      "Care": "Hand wash cold or dry clean",
      "Origin": "Ethically spun in Italy"
    },
    createdAt: "2026-03-10T12:00:00Z",
    updatedAt: "2026-08-15T09:00:00Z"
  },
  {
    id: "prod-4",
    name: "Vanguard Italian Leather Weekender Bag",
    slug: "vanguard-italian-leather-weekender",
    brand: "VANGUARD LEATHER",
    shortDescription: "Full-grain vegetable tanned vachetta leather with solid brass hardware.",
    description: "The definitive travel companion. Built to endure a lifetime of journeys, the Vanguard Weekender is handcrafted from 2.2mm full-grain Tuscan leather that matures with a rich, unique patina over time. Features a padded 16-inch laptop compartment, dedicated shoe pocket, and a detachable padded shoulder strap.",
    category: "Leather Goods & Bags",
    subcategory: "Weekender Bags",
    price: 480,
    compareAtPrice: 550,
    costPrice: 180,
    sku: "VAN-BG-004",
    stock: 19,
    lowStockThreshold: 3,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Cognac Saddle", hex: "#9a3412", inStock: true },
        { name: "Espresso Brown", hex: "#3e2723", inStock: true },
        { name: "Midnight Black", hex: "#18181b", inStock: true }
      ]
    },
    rating: 5,
    reviewCount: 94,
    tags: ["leather", "travel", "duffel", "bestseller", "luxury"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: false,
    status: "active",
    specifications: {
      "Dimensions": "52cm x 30cm x 26cm (42L Capacity)",
      "Leather": "Full-grain Tuscan Vachetta Leather",
      "Hardware": "Solid Antiqued Brass YKK Excella Zippers",
      "Lining": "Water-resistant 10oz Cotton Twill",
      "Weight": "1.8 kg"
    },
    createdAt: "2026-01-20T14:00:00Z",
    updatedAt: "2026-08-16T16:00:00Z"
  },
  {
    id: "prod-5",
    name: "Kanso Solid Brass & Ceramic Desk Lamp",
    slug: "kanso-brass-ceramic-desk-lamp",
    brand: "KANSO OBJECTS",
    shortDescription: "Hand-thrown stoneware base with brushed brass stem and dimmable 2700K warm LED.",
    description: "Harmonizing warm materials with contemporary precision. The Kanso Lamp features a heavy ceramic base textured with natural volcanic slip, a counterbalanced solid brass arm, and a step-less optical touch dimmer for sublime ambient workspace illumination.",
    category: "Living & Interior",
    subcategory: "Desk Lamps",
    price: 195,
    compareAtPrice: 230,
    costPrice: 65,
    sku: "KAN-LP-005",
    stock: 22,
    lowStockThreshold: 5,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Warm Terracotta", hex: "#c2410c", inStock: true },
        { name: "Sandstone Beige", hex: "#e7e5e4", inStock: true },
        { name: "Matte Charcoal", hex: "#262626", inStock: true }
      ]
    },
    rating: 4.7,
    reviewCount: 41,
    tags: ["lighting", "interior", "ceramic", "decor", "minimalist"],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    status: "active",
    specifications: {
      "Light Source": "Integrated 9W Warm LED (2700K, 90+ CRI)",
      "Brightness": "800 Lumens (Smooth Rotary Dimming)",
      "Height": "44cm",
      "Base Diameter": "16cm",
      "Cord": "2.0m Braided Fabric Cord"
    },
    createdAt: "2026-04-05T09:00:00Z",
    updatedAt: "2026-08-11T13:20:00Z"
  },
  {
    id: "prod-6",
    name: "Horizon Lossless Hi-Fi Wireless Speaker",
    slug: "horizon-lossless-hifi-speaker",
    brand: "AURA SOUND",
    shortDescription: "Room-filling 120W acoustic architecture with walnut cabinet and AirPlay 2.",
    description: "Crafted with an acoustically tuned real American Walnut cabinet, two neodymium silk-dome tweeters, and a dedicated 4.5-inch long-throw subwoofer. Delivers pristine spatial clarity with Wi-Fi streaming, AirPlay 2, Spotify Connect, and optical digital inputs.",
    category: "Audio & Acoustics",
    subcategory: "Wireless Speakers",
    price: 520,
    compareAtPrice: 599,
    costPrice: 210,
    sku: "AUR-SP-006",
    stock: 12,
    lowStockThreshold: 4,
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Natural Walnut", hex: "#78350f", inStock: true },
        { name: "Nordic Ash", hex: "#d6d3d1", inStock: true },
        { name: "Black Ash", hex: "#1c1917", inStock: true }
      ]
    },
    rating: 4.9,
    reviewCount: 53,
    tags: ["speaker", "audio", "hifi", "walnut", "smart-home"],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    isOnSale: false,
    status: "active",
    specifications: {
      "Amplifier": "120W Class-D Tri-Amped System",
      "Frequency Range": "38Hz \u2013 22,000Hz",
      "Wireless": "Wi-Fi 6, AirPlay 2, Bluetooth 5.3 aptX HD",
      "Inputs": "Optical TOSLINK, RCA Line-in, USB-C",
      "Dimensions": "36cm x 19cm x 15cm"
    },
    createdAt: "2026-02-18T15:00:00Z",
    updatedAt: "2026-08-14T10:45:00Z"
  },
  {
    id: "prod-7",
    name: "Kyoto Structured Trench Coat",
    slug: "kyoto-structured-trench-coat",
    brand: "NORDIC ATELIER",
    shortDescription: "Waterproof Japanese gabardine cotton with storm flap and horn buckles.",
    description: "A contemporary rethinking of the classic double-breasted trench. Tailored from high-density, water-repellent Japanese cotton gabardine with clean architectural lines, deep welt pockets, raglan shoulders, and a storm collar designed to withstand unpredictable weather.",
    category: "Apparel & Knitwear",
    subcategory: "Tailored Outerwear",
    price: 390,
    compareAtPrice: 450,
    costPrice: 135,
    sku: "NOR-TC-007",
    stock: 18,
    lowStockThreshold: 5,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce667823?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Heritage Khaki", hex: "#ca8a04", inStock: true },
        { name: "Midnight Navy", hex: "#1e3a8a", inStock: true },
        { name: "Stone Grey", hex: "#9ca3af", inStock: true }
      ],
      sizes: ["S", "M", "L", "XL"]
    },
    rating: 4.8,
    reviewCount: 38,
    tags: ["coat", "outerwear", "waterproof", "apparel"],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: true,
    status: "active",
    specifications: {
      "Shell": "100% Japanese High-Density Cotton Gabardine",
      "Water Resistance": "DWR Fluorocarbon-Free Coating",
      "Lining": "100% Cupro Satin",
      "Length": "Below Knee Tailored Cut"
    },
    createdAt: "2026-03-25T11:00:00Z",
    updatedAt: "2026-08-16T17:00:00Z"
  },
  {
    id: "prod-8",
    name: "Slimline Bi-Fold Leather Cardholder",
    slug: "slimline-bifold-leather-cardholder",
    brand: "VANGUARD LEATHER",
    shortDescription: "Ultra-thin profile holding up to 10 cards with RFID shielding protection.",
    description: "Laser cut and saddle-stitched by master artisans using premium French Ch\xE8vre goat leather. Designed to maintain an ultra-slim pocket silhouette while securely carrying folded banknotes, 10 payment cards, and built-in RFID blocking fabric.",
    category: "Leather Goods & Bags",
    subcategory: "Bifold Wallets",
    price: 85,
    compareAtPrice: 110,
    costPrice: 22,
    sku: "VAN-WL-008",
    stock: 55,
    lowStockThreshold: 10,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Racing Green", hex: "#14532d", inStock: true },
        { name: "Saddle Tan", hex: "#b45309", inStock: true },
        { name: "Charcoal Black", hex: "#18181b", inStock: true }
      ]
    },
    rating: 4.9,
    reviewCount: 156,
    tags: ["wallet", "cardholder", "leather", "accessories"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: "active",
    specifications: {
      "Capacity": "6-10 Cards + Cash Slot",
      "Material": "French Ch\xE8vre Goatskin",
      "Protection": "Full RFID Signal Blocking",
      "Thickness": "Just 6mm when loaded"
    },
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-08-17T14:10:00Z"
  },
  {
    id: "prod-9",
    name: "Chronograph Pioneer Edition 42mm",
    slug: "chronograph-pioneer-edition-42mm",
    brand: "ATELIER HOROLOGY",
    shortDescription: "Dual-register chronograph with sunray dial and ceramic tachymeter bezel.",
    description: "Precision timing meets vintage motorsport heritage. The Pioneer Edition features mechanical chronograph pushers, a scratchproof high-polish black ceramic bezel, Swiss Super-LumiNova luminescence on indices, and a quick-adjust mesh bracelet.",
    category: "Timepieces & Horology",
    subcategory: "Chronograph",
    price: 620,
    compareAtPrice: 695,
    costPrice: 240,
    sku: "ATL-CH-009",
    stock: 8,
    lowStockThreshold: 3,
    images: [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Panda White/Black", hex: "#f4f4f5", inStock: true },
        { name: "Midnight Sunray", hex: "#0f172a", inStock: true }
      ],
      sizes: ["42mm Case"]
    },
    rating: 4.9,
    reviewCount: 32,
    tags: ["watch", "chronograph", "sports", "luxury"],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isOnSale: false,
    status: "active",
    specifications: {
      "Movement": "Seiko VK64 Meca-Quartz Hybrid Movement",
      "Bezel": "Polished Ceramic Tachymeter",
      "Luminescence": "Swiss Super-LumiNova BGW9",
      "Strap": "Solid 316L Stainless Steel Milanese Mesh"
    },
    createdAt: "2026-04-12T10:30:00Z",
    updatedAt: "2026-08-18T12:00:00Z"
  },
  {
    id: "prod-10",
    name: "Artisan Terracotta Aromatherapy Diffuser",
    slug: "artisan-terracotta-aroma-diffuser",
    brand: "KANSO OBJECTS",
    shortDescription: "Ultrasonic cold mist diffuser crafted from raw matte terracotta pottery.",
    description: "Transform your indoor atmosphere with gentle ultrasonic misting. Quietly diffuses pure botanical essential oils for up to 8 continuous hours, featuring a soft warm breathing ambient light ring and automatic shut-off safety.",
    category: "Living & Interior",
    subcategory: "Diffusers",
    price: 110,
    compareAtPrice: 135,
    costPrice: 35,
    sku: "KAN-DF-010",
    stock: 30,
    lowStockThreshold: 6,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Earthy Sienna", hex: "#9a3412", inStock: true },
        { name: "Raw Chalk White", hex: "#f5f5f4", inStock: true },
        { name: "Slate Stone", hex: "#475569", inStock: true }
      ]
    },
    rating: 4.8,
    reviewCount: 74,
    tags: ["wellness", "diffuser", "home", "aromatherapy"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: "active",
    specifications: {
      "Coverage": "Up to 500 sq ft",
      "Capacity": "250ml Water Reservoir",
      "Run Time": "8h Continuous / 16h Intermittent",
      "Noise Level": "< 20 dB Whisper Quiet"
    },
    createdAt: "2026-02-14T09:00:00Z",
    updatedAt: "2026-08-13T15:00:00Z"
  },
  {
    id: "prod-11",
    name: "Aura True Wireless Active Earbuds",
    slug: "aura-true-wireless-earbuds",
    brand: "AURA SOUND",
    shortDescription: "IPX7 waterproof earbuds with adaptive transparency and spatial audio.",
    description: "Designed for relentless movement and uncompromised audio dynamics. Featuring graphene acoustic diaphragms, 6 beamforming microphones for crystal-clear calls, wireless fast charging case, and personalized parametric equalizer app control.",
    category: "Audio & Acoustics",
    subcategory: "Earbuds",
    price: 189,
    compareAtPrice: 229,
    costPrice: 70,
    sku: "AUR-EB-011",
    stock: 64,
    lowStockThreshold: 12,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Pearl Matte", hex: "#f1f5f9", inStock: true },
        { name: "Carbon Black", hex: "#0f172a", inStock: true },
        { name: "Sage Green", hex: "#3f6212", inStock: true }
      ]
    },
    rating: 4.8,
    reviewCount: 110,
    tags: ["earbuds", "wireless", "sports", "audio"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: true,
    status: "active",
    specifications: {
      "Battery": "8h Earbuds + 28h Case",
      "Waterproof": "IPX7 Water & Sweat Resistant",
      "Charging": "Qi Wireless + USB-C Fast Charge",
      "Codecs": "aptX Lossless, AAC, LDAC"
    },
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-08-17T08:30:00Z"
  },
  {
    id: "prod-12",
    name: "Japanese Organic Cotton Heavyweight Tee",
    slug: "japanese-organic-cotton-tee",
    brand: "NORDIC ATELIER",
    shortDescription: "280 GSM heavyweight loopwheel knit cotton with reinforced bound collar.",
    description: "The archetype of the everyday t-shirt. Woven on vintage slow-spinning loopwheel machines in Wakayama, Japan. Has zero side seams, an exceptionally soft hand-feel, and dense 280 GSM structure that will never lose its shape.",
    category: "Apparel & Knitwear",
    subcategory: "Organic Tees",
    price: 68,
    compareAtPrice: 80,
    costPrice: 20,
    sku: "NOR-TS-012",
    stock: 90,
    lowStockThreshold: 15,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop"
    ],
    variants: {
      colors: [
        { name: "Natural Ecru", hex: "#f5f5f4", inStock: true },
        { name: "Washed Black", hex: "#27272a", inStock: true },
        { name: "Olive Drab", hex: "#365314", inStock: true },
        { name: "Indigo Blue", hex: "#1e3a8a", inStock: true }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    rating: 4.9,
    reviewCount: 215,
    tags: ["tshirt", "cotton", "everyday", "bestseller"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isOnSale: false,
    status: "active",
    specifications: {
      "Weight": "280 GSM Heavyweight Jersey",
      "Cotton": "100% Certified Organic Supima Cotton",
      "Construction": "Tubular Body (Seamless)",
      "Pre-shrunk": "Sanforized to prevent shrinkage"
    },
    createdAt: "2026-01-10T11:00:00Z",
    updatedAt: "2026-08-18T16:20:00Z"
  }
];
var INITIAL_SHIPPING_METHODS = [
  {
    id: "ship-std",
    name: "Standard Carbon-Neutral Delivery",
    description: "Tracked ground transit with certified carbon offset.",
    estimatedDays: "3\u20135 Business Days",
    price: 12,
    freeThreshold: 150
  },
  {
    id: "ship-exp",
    name: "Express Priority Air",
    description: "Fast-tracked air courier with signature required.",
    estimatedDays: "1\u20132 Business Days",
    price: 24
  },
  {
    id: "ship-overnight",
    name: "Overnight White-Glove Courier",
    description: "Guaranteed next morning delivery before 12:00 PM.",
    estimatedDays: "Next Day Morning",
    price: 45
  }
];
var INITIAL_COUPONS = [
  {
    id: "coup-1",
    code: "WELCOME10",
    description: "10% discount on your first order with AURA",
    discountType: "percentage",
    discountValue: 10,
    minSpend: 50,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 5e3,
    usageCount: 412,
    isActive: true
  },
  {
    id: "coup-2",
    code: "AURA20",
    description: "20% discount for orders over $200",
    discountType: "percentage",
    discountValue: 20,
    minSpend: 200,
    maxDiscount: 100,
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    usageLimit: 1e3,
    usageCount: 289,
    isActive: true
  },
  {
    id: "coup-3",
    code: "LUXURY50",
    description: "$50 flat discount for orders over $300",
    discountType: "fixed",
    discountValue: 50,
    minSpend: 300,
    startDate: "2026-05-01",
    endDate: "2026-11-30",
    usageLimit: 500,
    usageCount: 167,
    isActive: true
  },
  {
    id: "coup-4",
    code: "VIPEXCLUSIVE",
    description: "Exclusive 25% off storewide VIP pass",
    discountType: "percentage",
    discountValue: 25,
    minSpend: 150,
    startDate: "2026-08-01",
    endDate: "2026-09-30",
    usageLimit: 200,
    usageCount: 44,
    isActive: true
  }
];
var INITIAL_USERS = [
  {
    id: "usr-admin-1",
    name: "Elena Rostova",
    email: "admin@aura.store",
    role: "super_admin",
    phone: "+1 (555) 892-4112",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    status: "active",
    createdAt: "2025-10-01T09:00:00Z",
    addresses: [
      {
        fullName: "Elena Rostova",
        email: "admin@aura.store",
        phone: "+1 (555) 892-4112",
        street: "742 Evergreen Terrace, Suite 400",
        city: "San Francisco",
        state: "CA",
        postalCode: "94107",
        country: "United States",
        isDefault: true
      }
    ]
  },
  {
    id: "usr-mgr-1",
    name: "Marcus Vance",
    email: "marcus.vance@aura.store",
    role: "manager",
    phone: "+1 (555) 319-8744",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    status: "active",
    createdAt: "2025-11-15T14:20:00Z",
    addresses: []
  },
  {
    id: "usr-cust-1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "customer",
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    status: "active",
    createdAt: "2026-01-12T11:45:00Z",
    totalSpent: 1245,
    orderCount: 4,
    addresses: [
      {
        fullName: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+1 (555) 234-5678",
        street: "450 West 33rd Street, Apt 18B",
        apartment: "Apt 18B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
        isDefault: true
      },
      {
        fullName: "Jane Doe (Office)",
        email: "jane.doe@example.com",
        phone: "+1 (555) 234-5678",
        street: "120 Broadway, Floor 24",
        city: "New York",
        state: "NY",
        postalCode: "10271",
        country: "United States",
        isDefault: false
      }
    ]
  },
  {
    id: "usr-cust-2",
    name: "Alexander Hayes",
    email: "a.hayes@architect.design",
    role: "customer",
    phone: "+1 (555) 902-8114",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    status: "active",
    createdAt: "2026-02-04T16:10:00Z",
    totalSpent: 870,
    orderCount: 2,
    addresses: [
      {
        fullName: "Alexander Hayes",
        email: "a.hayes@architect.design",
        phone: "+1 (555) 902-8114",
        street: "880 Michigan Ave",
        city: "Chicago",
        state: "IL",
        postalCode: "60611",
        country: "United States",
        isDefault: true
      }
    ]
  },
  {
    id: "usr-cust-3",
    name: "Sophie Laurent",
    email: "sophie.laurent@paris.fr",
    role: "customer",
    phone: "+33 6 12 34 56 78",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    status: "active",
    createdAt: "2026-03-20T10:05:00Z",
    totalSpent: 480,
    orderCount: 1,
    addresses: [
      {
        fullName: "Sophie Laurent",
        email: "sophie.laurent@paris.fr",
        phone: "+33 6 12 34 56 78",
        street: "14 Rue de Rivoli",
        city: "Paris",
        state: "\xCEle-de-France",
        postalCode: "75004",
        country: "France",
        isDefault: true
      }
    ]
  }
];
var INITIAL_ORDERS = [
  {
    id: "ord-1001",
    orderNumber: "AUR-89410",
    customer: {
      id: "usr-cust-1",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 234-5678"
    },
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedVariant: {
          color: { name: "Matte Obsidian", hex: "#1c1c1e" }
        },
        unitPrice: 349
      },
      {
        id: "item-2",
        productId: "prod-8",
        product: INITIAL_PRODUCTS[7],
        quantity: 1,
        selectedVariant: {
          color: { name: "Saddle Tan", hex: "#b45309" }
        },
        unitPrice: 85
      }
    ],
    shippingAddress: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 234-5678",
      street: "450 West 33rd Street, Apt 18B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States"
    },
    billingAddress: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 234-5678",
      street: "450 West 33rd Street, Apt 18B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States"
    },
    shippingMethod: INITIAL_SHIPPING_METHODS[0],
    paymentMethod: {
      type: "credit_card",
      last4: "4242",
      brand: "Visa"
    },
    paymentStatus: "paid",
    status: "delivered",
    subtotal: 434,
    discount: 43.4,
    couponCode: "WELCOME10",
    shippingCost: 0,
    tax: 33.2,
    total: 423.8,
    trackingNumber: "TRK-9928174US",
    carrier: "FedEx Priority",
    notes: "Please leave at the concierge front desk.",
    timeline: [
      {
        id: "tl-1",
        status: "new",
        title: "Order Placed",
        description: "Payment authorized and verified.",
        timestamp: "2026-08-14T09:12:00Z"
      },
      {
        id: "tl-2",
        status: "confirmed",
        title: "Order Confirmed",
        description: "Inventory reserved at New York Fulfillment Center.",
        timestamp: "2026-08-14T09:30:00Z"
      },
      {
        id: "tl-3",
        status: "processing",
        title: "Packaging & Quality Check",
        description: "Packaged in recyclable luxury magnetic box with inspection seal.",
        timestamp: "2026-08-14T14:00:00Z"
      },
      {
        id: "tl-4",
        status: "shipped",
        title: "Dispatched via FedEx Priority",
        description: "Carrier picked up package. Tracking # TRK-9928174US.",
        timestamp: "2026-08-15T08:20:00Z",
        location: "Newark Dispatch Hub, NJ"
      },
      {
        id: "tl-5",
        status: "delivered",
        title: "Delivered",
        description: "Signed and accepted at building reception.",
        timestamp: "2026-08-16T13:45:00Z",
        location: "New York, NY 10001"
      }
    ],
    createdAt: "2026-08-14T09:12:00Z",
    updatedAt: "2026-08-16T13:45:00Z"
  },
  {
    id: "ord-1002",
    orderNumber: "AUR-89411",
    customer: {
      id: "usr-cust-2",
      name: "Alexander Hayes",
      email: "a.hayes@architect.design",
      phone: "+1 (555) 902-8114"
    },
    items: [
      {
        id: "item-3",
        productId: "prod-4",
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        selectedVariant: {
          color: { name: "Cognac Saddle", hex: "#9a3412" }
        },
        unitPrice: 480
      },
      {
        id: "item-4",
        productId: "prod-3",
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        selectedVariant: {
          color: { name: "Charcoal Melange", hex: "#374151" },
          size: "L"
        },
        unitPrice: 220
      }
    ],
    shippingAddress: {
      fullName: "Alexander Hayes",
      email: "a.hayes@architect.design",
      phone: "+1 (555) 902-8114",
      street: "880 Michigan Ave",
      city: "Chicago",
      state: "IL",
      postalCode: "60611",
      country: "United States"
    },
    billingAddress: {
      fullName: "Alexander Hayes",
      email: "a.hayes@architect.design",
      phone: "+1 (555) 902-8114",
      street: "880 Michigan Ave",
      city: "Chicago",
      state: "IL",
      postalCode: "60611",
      country: "United States"
    },
    shippingMethod: INITIAL_SHIPPING_METHODS[1],
    paymentMethod: {
      type: "apple_pay"
    },
    paymentStatus: "paid",
    status: "shipped",
    subtotal: 700,
    discount: 50,
    couponCode: "LUXURY50",
    shippingCost: 24,
    tax: 55.25,
    total: 729.25,
    trackingNumber: "DHL-558291048",
    carrier: "DHL Express",
    timeline: [
      {
        id: "tl-10",
        status: "new",
        title: "Order Placed",
        description: "Payment captured via Apple Pay.",
        timestamp: "2026-08-18T10:00:00Z"
      },
      {
        id: "tl-11",
        status: "confirmed",
        title: "Order Confirmed",
        description: "Items allocated from Chicago distribution warehouse.",
        timestamp: "2026-08-18T10:15:00Z"
      },
      {
        id: "tl-12",
        status: "processing",
        title: "Packed & Weighed",
        description: "Security tags affixed and custom dust bag included.",
        timestamp: "2026-08-18T16:00:00Z"
      },
      {
        id: "tl-13",
        status: "shipped",
        title: "In Transit with DHL Express",
        description: "Estimated delivery tomorrow by 3:00 PM.",
        timestamp: "2026-08-19T06:30:00Z",
        location: "O\u2019Hare Transit Facility, IL"
      }
    ],
    createdAt: "2026-08-18T10:00:00Z",
    updatedAt: "2026-08-19T06:30:00Z"
  },
  {
    id: "ord-1003",
    orderNumber: "AUR-89412",
    customer: {
      id: "usr-cust-3",
      name: "Sophie Laurent",
      email: "sophie.laurent@paris.fr",
      phone: "+33 6 12 34 56 78"
    },
    items: [
      {
        id: "item-5",
        productId: "prod-2",
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedVariant: {
          color: { name: "Rose Gold & Saddle", hex: "#b45309" },
          size: "38mm Case"
        },
        unitPrice: 495
      }
    ],
    shippingAddress: {
      fullName: "Sophie Laurent",
      email: "sophie.laurent@paris.fr",
      phone: "+33 6 12 34 56 78",
      street: "14 Rue de Rivoli",
      city: "Paris",
      state: "\xCEle-de-France",
      postalCode: "75004",
      country: "France"
    },
    billingAddress: {
      fullName: "Sophie Laurent",
      email: "sophie.laurent@paris.fr",
      phone: "+33 6 12 34 56 78",
      street: "14 Rue de Rivoli",
      city: "Paris",
      state: "\xCEle-de-France",
      postalCode: "75004",
      country: "France"
    },
    shippingMethod: INITIAL_SHIPPING_METHODS[0],
    paymentMethod: {
      type: "credit_card",
      last4: "9812",
      brand: "Mastercard"
    },
    paymentStatus: "paid",
    status: "processing",
    subtotal: 495,
    discount: 0,
    shippingCost: 0,
    tax: 42.08,
    total: 537.08,
    timeline: [
      {
        id: "tl-20",
        status: "new",
        title: "Order Placed",
        description: "Payment authorized.",
        timestamp: "2026-08-19T14:15:00Z"
      },
      {
        id: "tl-21",
        status: "confirmed",
        title: "Order Confirmed",
        description: "Authenticity certificate serial generated.",
        timestamp: "2026-08-19T14:40:00Z"
      },
      {
        id: "tl-22",
        status: "processing",
        title: "Hand Assembly & Inspection",
        description: "Watch regulated on timing machine prior to boxing.",
        timestamp: "2026-08-20T03:00:00Z"
      }
    ],
    createdAt: "2026-08-19T14:15:00Z",
    updatedAt: "2026-08-20T03:00:00Z"
  },
  {
    id: "ord-1004",
    orderNumber: "AUR-89413",
    customer: {
      name: "Oliver Thorne",
      email: "oliver.thorne@london.co.uk",
      phone: "+44 20 7946 0912"
    },
    items: [
      {
        id: "item-6",
        productId: "prod-5",
        product: INITIAL_PRODUCTS[4],
        quantity: 2,
        selectedVariant: {
          color: { name: "Warm Terracotta", hex: "#c2410c" }
        },
        unitPrice: 195
      }
    ],
    shippingAddress: {
      fullName: "Oliver Thorne",
      email: "oliver.thorne@london.co.uk",
      phone: "+44 20 7946 0912",
      street: "22 Kensington High St",
      city: "London",
      state: "Greater London",
      postalCode: "W8 4PT",
      country: "United Kingdom"
    },
    billingAddress: {
      fullName: "Oliver Thorne",
      email: "oliver.thorne@london.co.uk",
      phone: "+44 20 7946 0912",
      street: "22 Kensington High St",
      city: "London",
      state: "Greater London",
      postalCode: "W8 4PT",
      country: "United Kingdom"
    },
    shippingMethod: INITIAL_SHIPPING_METHODS[0],
    paymentMethod: {
      type: "paypal"
    },
    paymentStatus: "paid",
    status: "new",
    subtotal: 390,
    discount: 0,
    shippingCost: 0,
    tax: 33.15,
    total: 423.15,
    timeline: [
      {
        id: "tl-30",
        status: "new",
        title: "Order Placed",
        description: "Customer completed PayPal express checkout.",
        timestamp: "2026-08-20T05:10:00Z"
      }
    ],
    createdAt: "2026-08-20T05:10:00Z",
    updatedAt: "2026-08-20T05:10:00Z"
  }
];
var INITIAL_REVIEWS = [
  {
    id: "rev-1",
    productId: "prod-1",
    productName: "Aura Studio Lossless ANC Headphones",
    userId: "usr-cust-1",
    userName: "Jane Doe",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    title: "The acoustic resolution is astounding",
    comment: "I own several $800+ studio headphones, but the Aura Studio blew me away with its balanced mid-range and punchy sub-bass. The ANC blocks out subway rumble completely without creating ear pressure.",
    isVerifiedBuyer: true,
    status: "approved",
    createdAt: "2026-08-17T11:00:00Z",
    reply: {
      text: "Thank you Jane! Our acoustic engineering team spent 18 months fine-tuning those titanium drivers. We are thrilled you love the resolution.",
      repliedAt: "2026-08-17T14:30:00Z",
      repliedBy: "Aura Sound Team"
    }
  },
  {
    id: "rev-2",
    productId: "prod-4",
    productName: "Vanguard Italian Leather Weekender Bag",
    userId: "usr-cust-2",
    userName: "Alexander Hayes",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    title: "Incredible craftsmanship and patina",
    comment: "The scent of real Italian vachetta leather right when opening the box is unforgettable. Heavy duty brass zips and spacious enough for 4 days of travel with laptop and shoes separated.",
    isVerifiedBuyer: true,
    status: "approved",
    createdAt: "2026-08-18T15:20:00Z"
  },
  {
    id: "rev-3",
    productId: "prod-2",
    productName: "Atelier Minimalist Automatic Watch",
    userId: "usr-cust-3",
    userName: "Sophie Laurent",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    title: "Pure elegance on the wrist",
    comment: "The exhibition caseback showing the automatic rotor movement is mesmerizing. Clean dial, smooth sweeping second hand, and the Horween leather strap broke in on day one.",
    isVerifiedBuyer: true,
    status: "approved",
    createdAt: "2026-08-19T16:00:00Z"
  }
];
var INITIAL_ACTIVITY_LOGS = [
  {
    id: "act-1",
    userId: "usr-admin-1",
    userName: "Elena Rostova",
    userRole: "Super Admin",
    action: "Order Status Updated",
    entityType: "order",
    entityId: "AUR-89410",
    details: "Marked order as Delivered with FedEx tracking confirmation.",
    timestamp: "2026-08-16T13:45:00Z",
    ip: "192.168.1.104"
  },
  {
    id: "act-2",
    userId: "usr-admin-1",
    userName: "Elena Rostova",
    userRole: "Super Admin",
    action: "Product Inventory Updated",
    entityType: "product",
    entityId: "AUR-HP-001",
    details: "Restocked +20 units of Aura Studio ANC Headphones.",
    timestamp: "2026-08-17T09:15:00Z",
    ip: "192.168.1.104"
  },
  {
    id: "act-3",
    userId: "usr-mgr-1",
    userName: "Marcus Vance",
    userRole: "Manager",
    action: "Review Replied",
    entityType: "review",
    entityId: "rev-1",
    details: "Published official reply to Jane Doe review.",
    timestamp: "2026-08-17T14:30:00Z",
    ip: "192.168.1.118"
  },
  {
    id: "act-4",
    userId: "usr-mgr-1",
    userName: "Marcus Vance",
    userRole: "Manager",
    action: "Order Dispatched",
    entityType: "order",
    entityId: "AUR-89411",
    details: "Generated shipping label via DHL Express (DHL-558291048).",
    timestamp: "2026-08-19T06:30:00Z",
    ip: "192.168.1.118"
  }
];
var INITIAL_STORE_SETTINGS = {
  storeName: "AURA LUXURY ATELIER",
  storeTagline: "Modern Minimalist Goods Crafted for a Lifetime",
  currency: {
    code: "USD",
    symbol: "$",
    rate: 1
  },
  supportEmail: "concierge@aura.store",
  supportPhone: "+1 (800) 555-AURA",
  address: "742 Evergreen Terrace, San Francisco, CA 94107",
  taxRate: 8.5,
  freeShippingThreshold: 150,
  orderAutoConfirm: true,
  lowStockAlertThreshold: 5,
  maintenanceMode: false,
  socialLinks: {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com"
  }
};

// backend/seed.ts
async function seedDatabaseIfEmpty() {
  try {
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log("\u{1F331} Seeding initial products to MongoDB...");
      await ProductModel.insertMany(INITIAL_PRODUCTS);
    }
    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      console.log("\u{1F331} Seeding initial categories to MongoDB...");
      await CategoryModel.insertMany(INITIAL_CATEGORIES);
    }
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log("\u{1F331} Seeding initial users to MongoDB...");
      await UserModel.insertMany(INITIAL_USERS);
    }
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      console.log("\u{1F331} Seeding initial orders to MongoDB...");
      await OrderModel.insertMany(INITIAL_ORDERS);
    }
    const reviewCount = await ReviewModel.countDocuments();
    if (reviewCount === 0) {
      console.log("\u{1F331} Seeding initial reviews to MongoDB...");
      await ReviewModel.insertMany(INITIAL_REVIEWS);
    }
    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0) {
      console.log("\u{1F331} Seeding initial coupons to MongoDB...");
      await CouponModel.insertMany(INITIAL_COUPONS);
    }
    const settingDoc = await SettingModel.findOne({ key: "store_settings" });
    if (!settingDoc) {
      console.log("\u{1F331} Seeding initial store settings to MongoDB...");
      await SettingModel.create({
        key: "store_settings",
        value: INITIAL_STORE_SETTINGS
      });
    }
    const activityCount = await ActivityModel.countDocuments();
    if (activityCount === 0) {
      await ActivityModel.insertMany(INITIAL_ACTIVITY_LOGS);
    }
    console.log("\u2728 MongoDB Atlas aura data verified and ready.");
  } catch (error) {
    console.error("Error during database seed:", error);
  }
}

// backend/routes/auth.ts
import { Router } from "express";

// backend/auth.ts
import jwt from "jsonwebtoken";
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    CONFIG.JWT_SECRET,
    { expiresIn: "30d" }
  );
}
function verifyToken(token) {
  try {
    return jwt.verify(token, CONFIG.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (decoded) {
    req.user = decoded;
  }
  next();
}

// backend/routes/auth.ts
var authRouter = Router();
authRouter.use(authMiddleware);
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const existing = await UserModel.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    const userId = `usr-cst-${Date.now()}`;
    const newUser = await UserModel.create({
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      password: password || void 0,
      role: "customer",
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop`,
      addresses: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      totalSpent: 0,
      orderCount: 0,
      tier: "Bronze Member",
      status: "active"
    });
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    });
    return res.status(201).json({
      success: true,
      token,
      user: newUser.toJSON()
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: error?.message || "Registration failed." });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const cleanEmail = email.trim().toLowerCase();
    let user = await UserModel.findOne({ email: cleanEmail });
    if (!user) {
      const matchedPreset = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
      if (matchedPreset) {
        user = await UserModel.create(matchedPreset);
      }
    }
    if (!user) {
      return res.status(401).json({ error: "No account found with this email. Please register." });
    }
    if (user.status === "blocked") {
      return res.status(403).json({ error: "Your account has been suspended. Please contact concierge." });
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });
    return res.json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: error?.message || "Login failed." });
  }
});
authRouter.get("/me", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await UserModel.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ success: true, user: user.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch user" });
  }
});
authRouter.post("/demo-switch", async (req, res) => {
  try {
    const { role } = req.body;
    if (role === "guest") {
      return res.json({ success: true, user: null, token: null });
    }
    const preset = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    let user = await UserModel.findOne({ email: preset.email });
    if (!user) {
      user = await UserModel.create(preset);
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });
    return res.json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to switch demo persona" });
  }
});
authRouter.put("/profile", async (req, res) => {
  try {
    const { id, name, phone, avatar, addresses } = req.body;
    const targetId = req.user ? req.user.id : id;
    if (!targetId) {
      return res.status(400).json({ error: "User ID required" });
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== void 0) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    if (addresses) updateData.addresses = addresses;
    const updated = await UserModel.findOneAndUpdate(
      { id: targetId },
      { $set: updateData },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ success: true, user: updated.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update profile" });
  }
});

// backend/routes/products.ts
import { Router as Router2 } from "express";
var productsRouter = Router2();
productsRouter.get("/", async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search) {
      const searchRegex = new RegExp(String(search), "i");
      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { sku: searchRegex },
        { tags: searchRegex }
      ];
    }
    const products = await ProductModel.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch products" });
  }
});
productsRouter.get("/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product = await ProductModel.findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }]
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch product" });
  }
});
productsRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const productData = req.body;
    if (!productData.name || !productData.price) {
      return res.status(400).json({ error: "Product name and price are required." });
    }
    if (!productData.id) {
      productData.id = `prd-${Date.now()}`;
    }
    if (!productData.sku) {
      productData.sku = `AUR-${Math.floor(1e3 + Math.random() * 9e3)}`;
    }
    if (!productData.slug) {
      productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const newProduct = await ProductModel.create(productData);
    return res.status(201).json({ success: true, data: newProduct.toJSON() });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ error: error?.message || "Failed to create product" });
  }
});
productsRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    const updated = await ProductModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update product" });
  }
});
productsRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductModel.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ success: true, message: "Product deleted successfully", id });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to delete product" });
  }
});

// backend/routes/categories.ts
import { Router as Router3 } from "express";
var categoriesRouter = Router3();
categoriesRouter.get("/", async (_req, res) => {
  try {
    const categories = await CategoryModel.find({}).sort({ name: 1 });
    return res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch categories" });
  }
});
categoriesRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const catData = req.body;
    if (!catData.name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    if (!catData.id) {
      catData.id = `cat-${Date.now()}`;
    }
    if (!catData.slug) {
      catData.slug = catData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const newCat = await CategoryModel.create(catData);
    return res.status(201).json({ success: true, data: newCat.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to create category" });
  }
});
categoriesRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CategoryModel.findOneAndUpdate({ id }, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update category" });
  }
});
categoriesRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CategoryModel.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.json({ success: true, message: "Category deleted", id });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to delete category" });
  }
});

// backend/routes/orders.ts
import { Router as Router4 } from "express";
var ordersRouter = Router4();
ordersRouter.get("/", async (req, res) => {
  try {
    const { email, customerId, status } = req.query;
    const filter = {};
    if (email) filter["customer.email"] = String(email).toLowerCase();
    if (customerId) filter["customer.id"] = customerId;
    if (status && status !== "all") filter.status = status;
    const orders = await OrderModel.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch orders" });
  }
});
ordersRouter.get("/:idOrNumber", async (req, res) => {
  try {
    const { idOrNumber } = req.params;
    const order = await OrderModel.findOne({
      $or: [{ id: idOrNumber }, { orderNumber: idOrNumber }]
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json({ success: true, data: order.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch order" });
  }
});
ordersRouter.post("/", async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: "Order items are required." });
    }
    if (!orderData.id) {
      orderData.id = `ord-${Date.now()}`;
    }
    if (!orderData.orderNumber) {
      orderData.orderNumber = `AUR-${Math.floor(1e4 + Math.random() * 9e4)}`;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (!orderData.createdAt) orderData.createdAt = now;
    if (!orderData.updatedAt) orderData.updatedAt = now;
    if (!orderData.timeline || orderData.timeline.length === 0) {
      orderData.timeline = [
        {
          id: `tl-${Date.now()}-1`,
          status: "new",
          title: "Order Placed & Confirmed",
          description: "Payment authorized and order sent to fulfillment.",
          timestamp: now,
          location: "San Francisco, CA"
        }
      ];
    }
    const newOrder = await OrderModel.create(orderData);
    if (orderData.couponCode) {
      await CouponModel.findOneAndUpdate(
        { code: orderData.couponCode.toUpperCase() },
        { $inc: { usageCount: 1, usedCount: 1 } }
      );
    }
    if (orderData.customer?.email) {
      await UserModel.findOneAndUpdate(
        { email: orderData.customer.email.toLowerCase() },
        {
          $inc: { totalSpent: orderData.total, orderCount: 1 },
          $set: { tier: orderData.total > 500 ? "Gold VIP" : "Silver" }
        }
      );
    }
    await ActivityModel.create({
      id: `act-${Date.now()}`,
      userId: orderData.customer?.id || "guest",
      userName: orderData.customer?.name || "Customer",
      userRole: "customer",
      action: "Order Placed",
      entityType: "order",
      entityId: newOrder.orderNumber,
      details: `New order #${newOrder.orderNumber} placed for $${newOrder.total.toFixed(2)} (${newOrder.items.length} items).`,
      timestamp: now,
      ip: req.ip || "127.0.0.1"
    });
    return res.status(201).json({ success: true, data: newOrder.toJSON() });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ error: error?.message || "Failed to place order" });
  }
});
ordersRouter.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, note } = req.body;
    const order = await OrderModel.findOne({ id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.status = status;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const statusTitles = {
      new: "Order Received",
      confirmed: "Order Confirmed",
      processing: "Packaging in Atelier",
      shipped: "Dispatched with Courier",
      delivered: "Delivered to Recipient",
      cancelled: "Order Cancelled"
    };
    order.timeline.push({
      id: `tl-${Date.now()}`,
      status,
      title: statusTitles[status] || `Status Updated: ${status}`,
      description: note || `Consignment marked as ${status}.`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      location: location || "Distribution Center"
    });
    await order.save();
    return res.json({ success: true, data: order.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update order status" });
  }
});
ordersRouter.patch("/:id/tracking", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, carrier } = req.body;
    const updated = await OrderModel.findOneAndUpdate(
      { id },
      {
        $set: {
          trackingNumber,
          carrier,
          status: "shipped",
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        $push: {
          timeline: {
            id: `tl-${Date.now()}`,
            status: "shipped",
            title: `Shipped via ${carrier || "Courier"}`,
            description: `Tracking number: ${trackingNumber}`,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            location: "Main Logistics Hub"
          }
        }
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update tracking" });
  }
});

// backend/routes/coupons.ts
import { Router as Router5 } from "express";
var couponsRouter = Router5();
couponsRouter.get("/", async (_req, res) => {
  try {
    const coupons = await CouponModel.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch coupons" });
  }
});
couponsRouter.post("/validate", async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: "Coupon code required" });
    }
    const coupon = await CouponModel.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });
    if (!coupon) {
      return res.status(404).json({ valid: false, message: "Invalid or expired promotional code." });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < /* @__PURE__ */ new Date()) {
      return res.status(400).json({ valid: false, message: "This coupon code has expired." });
    }
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order spend of $${coupon.minSpend} required for this code.`
      });
    }
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = subtotal * coupon.discountValue / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }
    return res.json({
      valid: true,
      coupon: coupon.toJSON(),
      discountAmount: discount,
      message: `Coupon applied successfully! Saved $${discount.toFixed(2)}`
    });
  } catch (error) {
    return res.status(500).json({ valid: false, message: error?.message || "Validation failed" });
  }
});
couponsRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    if (!data.code || data.discountValue === void 0) {
      return res.status(400).json({ error: "Code and discount value required" });
    }
    if (!data.id) data.id = `cpn-${Date.now()}`;
    data.code = data.code.trim().toUpperCase();
    const created = await CouponModel.create(data);
    return res.status(201).json({ success: true, data: created.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to create coupon" });
  }
});
couponsRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CouponModel.findOneAndUpdate({ id }, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update coupon" });
  }
});
couponsRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CouponModel.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    return res.json({ success: true, message: "Coupon deleted", id });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to delete coupon" });
  }
});

// backend/routes/reviews.ts
import { Router as Router6 } from "express";
var reviewsRouter = Router6();
reviewsRouter.get("/", async (req, res) => {
  try {
    const { productId, status } = req.query;
    const filter = {};
    if (productId) filter.productId = productId;
    if (status && status !== "all") filter.status = status;
    const reviews = await ReviewModel.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch reviews" });
  }
});
reviewsRouter.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (!data.productId || !data.rating || !data.comment) {
      return res.status(400).json({ error: "Product ID, rating, and comment are required." });
    }
    if (!data.id) data.id = `rev-${Date.now()}`;
    if (!data.createdAt) data.createdAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!data.status) data.status = "approved";
    const newRev = await ReviewModel.create(data);
    const productReviews = await ReviewModel.find({
      productId: data.productId,
      status: "approved"
    });
    if (productReviews.length > 0) {
      const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      await ProductModel.findOneAndUpdate(
        { id: data.productId },
        {
          $set: {
            rating: parseFloat(avg.toFixed(1)),
            reviewCount: productReviews.length
          }
        }
      );
    }
    return res.status(201).json({ success: true, data: newRev.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to submit review" });
  }
});
reviewsRouter.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await ReviewModel.findOneAndUpdate(
      { id },
      { $set: { status } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Review not found" });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update review status" });
  }
});
reviewsRouter.post("/:id/reply", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, repliedBy } = req.body;
    const updated = await ReviewModel.findOneAndUpdate(
      { id },
      {
        $set: {
          reply: {
            text,
            repliedAt: (/* @__PURE__ */ new Date()).toISOString(),
            repliedBy: repliedBy || "Store Concierge"
          }
        }
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Review not found" });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to reply to review" });
  }
});
reviewsRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ReviewModel.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Review not found" });
    }
    return res.json({ success: true, message: "Review deleted", id });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to delete review" });
  }
});

// backend/routes/users.ts
import { Router as Router7 } from "express";
var usersRouter = Router7();
usersRouter.get("/", async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};
    if (role && role !== "all") filter.role = role;
    if (status && status !== "all") filter.status = status;
    if (search) {
      const searchRegex = new RegExp(String(search), "i");
      filter.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }
    const users = await UserModel.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch users" });
  }
});
usersRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = await UserModel.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ error: "User with this email already exists." });
    }
    if (!data.id) data.id = `usr-${Date.now()}`;
    if (!data.createdAt) data.createdAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!data.addresses) data.addresses = [];
    const newUser = await UserModel.create(data);
    return res.status(201).json({ success: true, data: newUser.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to create user" });
  }
});
usersRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await UserModel.findOneAndUpdate({ id }, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update user" });
  }
});
usersRouter.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await UserModel.findOneAndUpdate({ id }, { $set: { status } }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update user status" });
  }
});
usersRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ success: true, message: "User deleted", id });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to delete user" });
  }
});

// backend/routes/settings.ts
import { Router as Router8 } from "express";
var settingsRouter = Router8();
settingsRouter.get("/", async (_req, res) => {
  try {
    let settingDoc = await SettingModel.findOne({ key: "store_settings" });
    if (!settingDoc) {
      settingDoc = await SettingModel.create({
        key: "store_settings",
        value: INITIAL_STORE_SETTINGS
      });
    }
    return res.json({ success: true, data: settingDoc.value });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch settings" });
  }
});
settingsRouter.put("/", authMiddleware, async (req, res) => {
  try {
    const newSettings = req.body;
    const updated = await SettingModel.findOneAndUpdate(
      { key: "store_settings" },
      { $set: { value: newSettings, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } },
      { upsert: true, new: true }
    );
    return res.json({ success: true, data: updated?.value || newSettings });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to update settings" });
  }
});
settingsRouter.post("/reset", authMiddleware, async (_req, res) => {
  try {
    await ProductModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await UserModel.deleteMany({});
    await OrderModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await CouponModel.deleteMany({});
    await SettingModel.deleteMany({});
    await ActivityModel.deleteMany({});
    await ProductModel.insertMany(INITIAL_PRODUCTS);
    await CategoryModel.insertMany(INITIAL_CATEGORIES);
    await UserModel.insertMany(INITIAL_USERS);
    await OrderModel.insertMany(INITIAL_ORDERS);
    await ReviewModel.insertMany(INITIAL_REVIEWS);
    await CouponModel.insertMany(INITIAL_COUPONS);
    await ActivityModel.insertMany(INITIAL_ACTIVITY_LOGS);
    await SettingModel.create({
      key: "store_settings",
      value: INITIAL_STORE_SETTINGS
    });
    return res.json({ success: true, message: "Factory default data restored successfully." });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to reset data" });
  }
});
settingsRouter.get("/activity", async (_req, res) => {
  try {
    const logs = await ActivityModel.find({}).sort({ timestamp: -1 }).limit(100);
    return res.json({ success: true, data: logs });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Failed to fetch activity logs" });
  }
});

// backend/routes/upload.ts
import { Router as Router9 } from "express";

// backend/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY.CLOUD_NAME,
  api_key: CONFIG.CLOUDINARY.API_KEY,
  api_secret: CONFIG.CLOUDINARY.API_SECRET,
  secure: true
});
async function uploadImageToCloudinary(fileOrBase64, folder = "blinkupz_store") {
  try {
    const result = await cloudinary.uploader.upload(fileOrBase64, {
      folder,
      resource_type: "auto",
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ]
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(error?.message || "Failed to upload image to Cloudinary");
  }
}

// backend/routes/upload.ts
var uploadRouter = Router9();
uploadRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { image, folder = "blinkupz_products" } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image data (base64 or URL) is required." });
    }
    const uploadResult = await uploadImageToCloudinary(image, folder);
    return res.json({
      success: true,
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      message: "Image successfully uploaded to Cloudinary CDN"
    });
  } catch (error) {
    console.error("Upload route error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to upload image to Cloudinary CDN"
    });
  }
});

// backend/routes/health.ts
import { Router as Router10 } from "express";
var healthRouter = Router10();
healthRouter.get("/", async (_req, res) => {
  const dbStatus = isDbConnected();
  return res.json({
    status: "online",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    services: {
      mongodb: {
        status: dbStatus ? "connected" : "connecting",
        database: "BlinkUpZ",
        cluster: "cluster0.20jynkx.mongodb.net"
      },
      cloudinary: {
        status: "configured",
        cloudName: CONFIG.CLOUDINARY.CLOUD_NAME,
        apiKey: CONFIG.CLOUDINARY.API_KEY ? "***" + CONFIG.CLOUDINARY.API_KEY.slice(-4) : "none"
      },
      jwt: {
        status: "configured",
        algorithm: "HS256"
      }
    }
  });
});

// backend/app.ts
function createExpressApp() {
  const app2 = express();
  app2.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
  );
  app2.use(express.json({ limit: "50mb" }));
  app2.use(express.urlencoded({ limit: "50mb", extended: true }));
  connectDB().then((connected) => {
    if (connected) {
      seedDatabaseIfEmpty();
    }
  }).catch((err) => {
    console.warn("Initial DB connect attempt in background:", err);
  });
  app2.get("/", (req, res) => {
    res.json({
      status: "online",
      name: "Aura Luxury Ecommerce API",
      version: "1.0.0",
      database: "MongoDB Atlas",
      endpoints: {
        health: "/api/health",
        products: "/api/products",
        categories: "/api/categories",
        orders: "/api/orders",
        auth: "/api/auth"
      }
    });
  });
  app2.get("/healthz", (req, res) => {
    res.status(200).send("OK");
  });
  app2.use("/api/health", healthRouter);
  app2.use("/api/auth", authRouter);
  app2.use("/api/products", productsRouter);
  app2.use("/api/categories", categoriesRouter);
  app2.use("/api/orders", ordersRouter);
  app2.use("/api/coupons", couponsRouter);
  app2.use("/api/reviews", reviewsRouter);
  app2.use("/api/users", usersRouter);
  app2.use("/api/settings", settingsRouter);
  app2.use("/api/upload", uploadRouter);
  return app2;
}

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = createExpressApp();
var port = Number(process.env.PORT) || Number(CONFIG.PORT) || 3e3;
var distPath = path.resolve(__dirname, "dist");
var distExists = fs.existsSync(distPath);
if (distExists) {
  app.use(express2.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/healthz") {
      return next();
    }
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}
app.listen(port, "0.0.0.0", () => {
  console.log(`\u{1F680} Aura Atelier Server running at http://0.0.0.0:${port}`);
  console.log(`\u{1F343} Connected to MongoDB Atlas & Cloudinary`);
});

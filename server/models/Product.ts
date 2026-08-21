import mongoose, { Schema } from 'mongoose';

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  variants: {
    sizes?: string[];
    colors?: Array<{
      name: string;
      hex: string;
      image?: string;
      inStock?: boolean;
    }>;
    materials?: string[];
  };
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  status: 'active' | 'draft' | 'archived';
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

const ProductSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    brand: { type: String, default: 'AURA' },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
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
          inStock: { type: Boolean, default: true },
        },
      ],
      materials: [{ type: String }],
    },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    specifications: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: false,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ProductModel: mongoose.Model<any> = mongoose.models.Product || mongoose.model('Product', ProductSchema);

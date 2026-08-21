import mongoose, { Schema } from 'mongoose';

export interface ICoupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  expiresAt?: string;
  usageLimit?: number;
  usageCount: number;
  usedCount?: number;
  isActive: boolean;
}

const CouponSchema = new Schema<ICoupon>(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minSpend: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    startDate: { type: String },
    endDate: { type: String },
    expiresAt: { type: String },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    toJSON: {
      transform(_doc, ret: any) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const CouponModel = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

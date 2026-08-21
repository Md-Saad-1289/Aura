import mongoose, { Schema } from 'mongoose';

export interface IReview {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  orderNumber?: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  reply?: {
    text: string;
    repliedAt: string;
    repliedBy: string;
  };
}

const ReviewSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true },
    title: { type: String, default: '' },
    comment: { type: String, required: true },
    isVerifiedBuyer: { type: Boolean, default: true },
    orderNumber: { type: String },
    status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    reply: {
      text: String,
      repliedAt: String,
      repliedBy: String,
    },
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

export const ReviewModel: mongoose.Model<any> = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

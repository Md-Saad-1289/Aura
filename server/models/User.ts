import mongoose, { Schema } from 'mongoose';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'support' | 'customer';
  avatar?: string;
  phone?: string;
  addresses?: any[];
  orderCount?: number;
  totalSpent?: number;
  status: 'active' | 'blocked';
  createdAt: string;
}

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'manager', 'support', 'customer'],
      default: 'customer',
    },
    avatar: { type: String },
    phone: { type: String },
    addresses: [{ type: Schema.Types.Mixed }],
    orderCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    toJSON: {
      transform(_doc, ret: any) {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export const UserModel: mongoose.Model<any> = mongoose.models.User || mongoose.model('User', UserSchema);

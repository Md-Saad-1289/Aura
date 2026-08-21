import mongoose, { Schema } from 'mongoose';

export interface IOrder {
  id: string;
  orderNumber: string;
  customer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    productId: string;
    product: any;
    quantity: number;
    selectedVariant: any;
    unitPrice: number;
  }>;
  shippingAddress: any;
  billingAddress: any;
  shippingMethod: any;
  paymentMethod: {
    type: string;
    last4?: string;
    brand?: string;
  };
  paymentStatus: string;
  status: string;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  timeline: Array<{
    id: string;
    status: string;
    title: string;
    description: string;
    timestamp: string;
    location?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const OrderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      id: String,
      name: { type: String, required: true },
      email: { type: String, required: true, index: true },
      phone: { type: String, default: '' },
    },
    items: [
      {
        id: String,
        productId: { type: String, required: true },
        product: Schema.Types.Mixed,
        quantity: { type: Number, required: true },
        selectedVariant: Schema.Types.Mixed,
        unitPrice: { type: Number, required: true },
      },
    ],
    shippingAddress: { type: Schema.Types.Mixed, required: true },
    billingAddress: Schema.Types.Mixed,
    shippingMethod: { type: Schema.Types.Mixed, required: true },
    paymentMethod: {
      type: { type: String, default: 'card' },
      last4: String,
      brand: String,
    },
    paymentStatus: { type: String, default: 'paid' },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'new',
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
        location: String,
      },
    ],
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

export const OrderModel: mongoose.Model<any> = mongoose.models.Order || mongoose.model('Order', OrderSchema);

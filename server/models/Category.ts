import mongoose, { Schema } from 'mongoose';

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName?: string;
  productCount: number;
  isFeatured?: boolean;
  subcategories: string[];
}

const CategorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    iconName: { type: String },
    productCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    subcategories: [{ type: String }],
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

export const CategoryModel: mongoose.Model<any> = mongoose.models.Category || mongoose.model('Category', CategorySchema);

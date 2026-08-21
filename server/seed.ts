import { ProductModel } from './models/Product';
import { CategoryModel } from './models/Category';
import { OrderModel } from './models/Order';
import { UserModel } from './models/User';
import { ReviewModel } from './models/Review';
import { CouponModel } from './models/Coupon';
import { SettingModel } from './models/Setting';
import { ActivityModel } from './models/Activity';

import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_STORE_SETTINGS,
} from '../src/data/initialData';

export async function seedDatabaseIfEmpty() {
  try {
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding initial products to MongoDB...');
      await ProductModel.insertMany(INITIAL_PRODUCTS as any[]);
    }

    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding initial categories to MongoDB...');
      await CategoryModel.insertMany(INITIAL_CATEGORIES as any[]);
    }

    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial users to MongoDB...');
      await UserModel.insertMany(INITIAL_USERS as any[]);
    }

    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      console.log('🌱 Seeding initial orders to MongoDB...');
      await OrderModel.insertMany(INITIAL_ORDERS as any[]);
    }

    const reviewCount = await ReviewModel.countDocuments();
    if (reviewCount === 0) {
      console.log('🌱 Seeding initial reviews to MongoDB...');
      await ReviewModel.insertMany(INITIAL_REVIEWS as any[]);
    }

    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0) {
      console.log('🌱 Seeding initial coupons to MongoDB...');
      await CouponModel.insertMany(INITIAL_COUPONS as any[]);
    }

    const settingDoc = await SettingModel.findOne({ key: 'store_settings' } as any);
    if (!settingDoc) {
      console.log('🌱 Seeding initial store settings to MongoDB...');
      await SettingModel.create({
        key: 'store_settings',
        value: INITIAL_STORE_SETTINGS,
      });
    }

    const activityCount = await ActivityModel.countDocuments();
    if (activityCount === 0) {
      await ActivityModel.insertMany(INITIAL_ACTIVITY_LOGS as any[]);
    }

    console.log('✨ MongoDB Atlas BlinkUpZ data verified and ready.');
  } catch (error) {
    console.error('Error during database seed:', error);
  }
}

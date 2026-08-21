import { Router } from 'express';
import { SettingModel } from '../models/Setting';
import { ProductModel } from '../models/Product';
import { CategoryModel } from '../models/Category';
import { OrderModel } from '../models/Order';
import { UserModel } from '../models/User';
import { ReviewModel } from '../models/Review';
import { CouponModel } from '../models/Coupon';
import { ActivityModel } from '../models/Activity';

import {
  INITIAL_STORE_SETTINGS,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_ACTIVITY_LOGS,
} from '../../src/data/initialData';
import { authMiddleware } from '../auth';

export const settingsRouter = Router();

// GET store settings
settingsRouter.get('/', async (_req, res) => {
  try {
    let settingDoc = await SettingModel.findOne({ key: 'store_settings' } as any);
    if (!settingDoc) {
      settingDoc = await SettingModel.create({
        key: 'store_settings',
        value: INITIAL_STORE_SETTINGS,
      });
    }
    return res.json({ success: true, data: settingDoc.value });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch settings' });
  }
});

// PUT update store settings
settingsRouter.put('/', authMiddleware, async (req, res) => {
  try {
    const newSettings = req.body;
    const updated = await SettingModel.findOneAndUpdate(
      { key: 'store_settings' } as any,
      { $set: { value: newSettings, updatedAt: new Date().toISOString() } },
      { upsert: true, new: true }
    );
    return res.json({ success: true, data: updated?.value || newSettings });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update settings' });
  }
});

// POST reset to factory defaults
settingsRouter.post('/reset', authMiddleware, async (_req, res) => {
  try {
    await ProductModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await UserModel.deleteMany({});
    await OrderModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await CouponModel.deleteMany({});
    await SettingModel.deleteMany({});
    await ActivityModel.deleteMany({});

    await ProductModel.insertMany(INITIAL_PRODUCTS as any[]);
    await CategoryModel.insertMany(INITIAL_CATEGORIES as any[]);
    await UserModel.insertMany(INITIAL_USERS as any[]);
    await OrderModel.insertMany(INITIAL_ORDERS as any[]);
    await ReviewModel.insertMany(INITIAL_REVIEWS as any[]);
    await CouponModel.insertMany(INITIAL_COUPONS as any[]);
    await ActivityModel.insertMany(INITIAL_ACTIVITY_LOGS as any[]);

    await SettingModel.create({
      key: 'store_settings',
      value: INITIAL_STORE_SETTINGS,
    });

    return res.json({ success: true, message: 'Factory default data restored successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to reset data' });
  }
});

// GET activity logs
settingsRouter.get('/activity', async (_req, res) => {
  try {
    const logs = await ActivityModel.find({}).sort({ timestamp: -1 }).limit(100);
    return res.json({ success: true, data: logs });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch activity logs' });
  }
});

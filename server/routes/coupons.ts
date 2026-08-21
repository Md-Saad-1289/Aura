import { Router } from 'express';
import { CouponModel } from '../models/Coupon';
import { authMiddleware } from '../auth';

export const couponsRouter = Router();

// GET all coupons
couponsRouter.get('/', async (_req, res) => {
  try {
    const coupons = await CouponModel.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch coupons' });
  }
});

// POST validate coupon
couponsRouter.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code required' });
    }

    const coupon = await CouponModel.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Invalid or expired promotional code.' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, message: 'This coupon code has expired.' });
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order spend of $${coupon.minSpend} required for this code.`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
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
      message: `Coupon applied successfully! Saved $${discount.toFixed(2)}`,
    });
  } catch (error: any) {
    return res.status(500).json({ valid: false, message: error?.message || 'Validation failed' });
  }
});

// POST create coupon
couponsRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    if (!data.code || data.discountValue === undefined) {
      return res.status(400).json({ error: 'Code and discount value required' });
    }

    if (!data.id) data.id = `cpn-${Date.now()}`;
    data.code = data.code.trim().toUpperCase();

    const created = await CouponModel.create(data);
    return res.status(201).json({ success: true, data: created.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to create coupon' });
  }
});

// PUT update coupon
couponsRouter.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CouponModel.findOneAndUpdate({ id }, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update coupon' });
  }
});

// DELETE coupon
couponsRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CouponModel.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    return res.json({ success: true, message: 'Coupon deleted', id });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to delete coupon' });
  }
});

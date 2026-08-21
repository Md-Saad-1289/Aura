import { Router } from 'express';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { UserModel } from '../models/User';
import { CouponModel } from '../models/Coupon';
import { ActivityModel } from '../models/Activity';
import { authMiddleware } from '../auth';

export const ordersRouter = Router();

// GET orders
ordersRouter.get('/', async (req, res) => {
  try {
    const { email, customerId, status } = req.query;
    const filter: any = {};
    if (email) filter['customer.email'] = String(email).toLowerCase();
    if (customerId) filter['customer.id'] = customerId;
    if (status && status !== 'all') filter.status = status;

    const orders = await OrderModel.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch orders' });
  }
});

// GET single order by id or orderNumber
ordersRouter.get('/:idOrNumber', async (req, res) => {
  try {
    const { idOrNumber } = req.params;
    const order = await OrderModel.findOne({
      $or: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json({ success: true, data: order.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch order' });
  }
});

// POST create order
ordersRouter.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Order items are required.' });
    }

    if (!orderData.id) {
      orderData.id = `ord-${Date.now()}`;
    }
    if (!orderData.orderNumber) {
      orderData.orderNumber = `AUR-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    const now = new Date().toISOString();
    if (!orderData.createdAt) orderData.createdAt = now;
    if (!orderData.updatedAt) orderData.updatedAt = now;

    if (!orderData.timeline || orderData.timeline.length === 0) {
      orderData.timeline = [
        {
          id: `tl-${Date.now()}-1`,
          status: 'new',
          title: 'Order Placed & Confirmed',
          description: 'Payment authorized and order sent to fulfillment.',
          timestamp: now,
          location: 'San Francisco, CA',
        },
      ];
    }

    const newOrder = await OrderModel.create(orderData);

    // Increment coupon usage if used
    if (orderData.couponCode) {
      await CouponModel.findOneAndUpdate(
        { code: orderData.couponCode.toUpperCase() },
        { $inc: { usageCount: 1, usedCount: 1 } }
      );
    }

    // Update customer stats if user exists
    if (orderData.customer?.email) {
      await UserModel.findOneAndUpdate(
        { email: orderData.customer.email.toLowerCase() },
        {
          $inc: { totalSpent: orderData.total, orderCount: 1 },
          $set: { tier: orderData.total > 500 ? 'Gold VIP' : 'Silver' },
        }
      );
    }

    // Log Activity
    await ActivityModel.create({
      id: `act-${Date.now()}`,
      userId: orderData.customer?.id || 'guest',
      userName: orderData.customer?.name || 'Customer',
      userRole: 'customer',
      action: 'Order Placed',
      entityType: 'order',
      entityId: newOrder.orderNumber,
      details: `New order #${newOrder.orderNumber} placed for $${newOrder.total.toFixed(2)} (${newOrder.items.length} items).`,
      timestamp: now,
      ip: req.ip || '127.0.0.1',
    });

    return res.status(201).json({ success: true, data: newOrder.toJSON() });
  } catch (error: any) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to place order' });
  }
});

// PATCH update status
ordersRouter.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, note } = req.body;

    const order = await OrderModel.findOne({ id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    const statusTitles: Record<string, string> = {
      new: 'Order Received',
      confirmed: 'Order Confirmed',
      processing: 'Packaging in Atelier',
      shipped: 'Dispatched with Courier',
      delivered: 'Delivered to Recipient',
      cancelled: 'Order Cancelled',
    };

    order.timeline.push({
      id: `tl-${Date.now()}`,
      status,
      title: statusTitles[status] || `Status Updated: ${status}`,
      description: note || `Consignment marked as ${status}.`,
      timestamp: new Date().toISOString(),
      location: location || 'Distribution Center',
    });

    await order.save();
    return res.json({ success: true, data: order.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update order status' });
  }
});

// PATCH update tracking
ordersRouter.patch('/:id/tracking', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, carrier } = req.body;

    const updated = await OrderModel.findOneAndUpdate(
      { id },
      {
        $set: {
          trackingNumber,
          carrier,
          status: 'shipped',
          updatedAt: new Date().toISOString(),
        },
        $push: {
          timeline: {
            id: `tl-${Date.now()}`,
            status: 'shipped',
            title: `Shipped via ${carrier || 'Courier'}`,
            description: `Tracking number: ${trackingNumber}`,
            timestamp: new Date().toISOString(),
            location: 'Main Logistics Hub',
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json({ success: true, data: updated.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update tracking' });
  }
});

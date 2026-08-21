import { Router } from 'express';
import { ReviewModel } from '../models/Review';
import { ProductModel } from '../models/Product';
import { authMiddleware } from '../auth';

export const reviewsRouter = Router();

// GET all reviews (optional by productId)
reviewsRouter.get('/', async (req, res) => {
  try {
    const { productId, status } = req.query;
    const filter: any = {};
    if (productId) filter.productId = productId;
    if (status && status !== 'all') filter.status = status;

    const reviews = await ReviewModel.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch reviews' });
  }
});

// POST add review
reviewsRouter.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.productId || !data.rating || !data.comment) {
      return res.status(400).json({ error: 'Product ID, rating, and comment are required.' });
    }

    if (!data.id) data.id = `rev-${Date.now()}`;
    if (!data.createdAt) data.createdAt = new Date().toISOString();
    if (!data.status) data.status = 'approved';

    const newRev = await ReviewModel.create(data);

    // Update Product review rating & count
    const productReviews = await ReviewModel.find({
      productId: data.productId,
      status: 'approved',
    });
    if (productReviews.length > 0) {
      const avg =
        productReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / productReviews.length;
      await ProductModel.findOneAndUpdate(
        { id: data.productId } as any,
        {
          $set: {
            rating: parseFloat(avg.toFixed(1)),
            reviewCount: productReviews.length,
          },
        }
      );
    }

    return res.status(201).json({ success: true, data: newRev.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to submit review' });
  }
});

// PATCH review status
reviewsRouter.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await ReviewModel.findOneAndUpdate(
      { id } as any,
      { $set: { status } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update review status' });
  }
});

// POST reply to review
reviewsRouter.post('/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, repliedBy } = req.body;

    const updated = await ReviewModel.findOneAndUpdate(
      { id } as any,
      {
        $set: {
          reply: {
            text,
            repliedAt: new Date().toISOString(),
            repliedBy: repliedBy || 'Store Concierge',
          },
        },
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to reply to review' });
  }
});

// DELETE review
reviewsRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ReviewModel.findOneAndDelete({ id } as any);
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.json({ success: true, message: 'Review deleted', id });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to delete review' });
  }
});

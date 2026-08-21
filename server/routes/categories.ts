import { Router } from 'express';
import { CategoryModel } from '../models/Category';
import { authMiddleware } from '../auth';

export const categoriesRouter = Router();

// GET all categories
categoriesRouter.get('/', async (_req, res) => {
  try {
    const categories = await CategoryModel.find({}).sort({ name: 1 });
    return res.json({ success: true, count: categories.length, data: categories });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch categories' });
  }
});

// POST create category
categoriesRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const catData = req.body;
    if (!catData.name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    if (!catData.id) {
      catData.id = `cat-${Date.now()}`;
    }
    if (!catData.slug) {
      catData.slug = catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const newCat = await CategoryModel.create(catData);
    return res.status(201).json({ success: true, data: newCat.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to create category' });
  }
});

// PUT update category
categoriesRouter.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CategoryModel.findOneAndUpdate({ id }, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update category' });
  }
});

// DELETE category
categoriesRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CategoryModel.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json({ success: true, message: 'Category deleted', id });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to delete category' });
  }
});

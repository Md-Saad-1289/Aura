import { Router } from 'express';
import { ProductModel } from '../models/Product';
import { authMiddleware, requireAdmin } from '../auth';

export const productsRouter = Router();

// GET all products (with optional filter)
productsRouter.get('/', async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const filter: any = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { sku: searchRegex },
        { tags: searchRegex },
      ];
    }

    const products = await ProductModel.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch products' });
  }
});

// GET single product by id or slug
productsRouter.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product = await ProductModel.findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }],
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch product' });
  }
});

// POST create product
productsRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const productData = req.body;
    if (!productData.name || !productData.price) {
      return res.status(400).json({ error: 'Product name and price are required.' });
    }

    if (!productData.id) {
      productData.id = `prd-${Date.now()}`;
    }
    if (!productData.sku) {
      productData.sku = `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    if (!productData.slug) {
      productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const newProduct = await ProductModel.create(productData);
    return res.status(201).json({ success: true, data: newProduct.toJSON() });
  } catch (error: any) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to create product' });
  }
});

// PUT update product
productsRouter.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };

    const updated = await ProductModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ success: true, data: updated.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update product' });
  }
});

// DELETE product
productsRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductModel.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ success: true, message: 'Product deleted successfully', id });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to delete product' });
  }
});

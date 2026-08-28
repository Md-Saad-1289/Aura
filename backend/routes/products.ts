import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Products list',
    products: [],
    status: 'ok',
  });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Product details', id: req.params.id, status: 'ok' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Product created', status: 'ok' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Product updated', status: 'ok' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Product deleted', status: 'ok' });
});

export { router as productsRouter };

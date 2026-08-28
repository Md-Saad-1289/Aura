import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Categories list', categories: [], status: 'ok' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Category created', status: 'ok' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Category updated', status: 'ok' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Category deleted', status: 'ok' });
});

export { router as categoriesRouter };

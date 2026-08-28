import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Orders list', orders: [], status: 'ok' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Order details', id: req.params.id, status: 'ok' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Order created', status: 'ok' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Order updated', status: 'ok' });
});

export { router as ordersRouter };

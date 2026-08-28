import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Coupons list', coupons: [], status: 'ok' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Coupon created', status: 'ok' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Coupon deleted', status: 'ok' });
});

export { router as couponsRouter };

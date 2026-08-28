import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Reviews list', reviews: [], status: 'ok' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Review created', status: 'ok' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Review deleted', status: 'ok' });
});

export { router as reviewsRouter };

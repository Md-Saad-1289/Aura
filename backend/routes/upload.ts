import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  res.json({ message: 'File upload endpoint', status: 'ok', url: '' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'File deleted', status: 'ok' });
});

export { router as uploadRouter };

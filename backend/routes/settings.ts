import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Settings', settings: {}, status: 'ok' });
});

router.put('/', (req, res) => {
  res.json({ message: 'Settings updated', status: 'ok' });
});

export { router as settingsRouter };

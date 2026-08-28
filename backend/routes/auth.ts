import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint', status: 'ok' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint', status: 'ok' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint', status: 'ok' });
});

export { router as authRouter };

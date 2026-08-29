import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint', status: 'ok' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint', status: 'ok' });
});

router.post('/google', (req, res) => {
  const { email, name, avatar, googleId } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required from Google token' });
  }

  const user = {
    id: googleId ? `usr_g_${googleId.slice(0, 10)}` : `usr_${Date.now()}`,
    name: name || 'Google User',
    email,
    role: 'customer',
    avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'Google')}`,
    addresses: [],
    createdAt: new Date().toISOString(),
    status: 'active',
    authProvider: 'google',
    googleId
  };

  res.json({
    success: true,
    token: `jwt_google_${Buffer.from(email).toString('base64')}_${Date.now()}`,
    user
  });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint', status: 'ok' });
});

export { router as authRouter };

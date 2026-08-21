import { Router, Response } from 'express';
import { UserModel } from '../models/User';
import { generateToken, AuthRequest, authMiddleware } from '../auth';
import { INITIAL_USERS } from '../../src/data/initialData';
import { UserRole } from '../../src/types';

export const authRouter = Router();

authRouter.use(authMiddleware);

// Register new user
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await UserModel.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const userId = `usr-cst-${Date.now()}`;
    const newUser = await UserModel.create({
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      password: password || undefined,
      role: 'customer',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop`,
      addresses: [],
      createdAt: new Date().toISOString(),
      totalSpent: 0,
      orderCount: 0,
      tier: 'Bronze Member',
      status: 'active',
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    return res.status(201).json({
      success: true,
      token,
      user: newUser.toJSON(),
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error?.message || 'Registration failed.' });
  }
});

// Login user
authRouter.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await UserModel.findOne({ email: cleanEmail });

    // If not found in DB yet, check initial user presets and create if needed
    if (!user) {
      const matchedPreset = INITIAL_USERS.find(u => u.email.toLowerCase() === cleanEmail);
      if (matchedPreset) {
        user = await UserModel.create(matchedPreset);
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'No account found with this email. Please register.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact concierge.' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error?.message || 'Login failed.' });
  }
});

// Get current user profile
authRouter.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await UserModel.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ success: true, user: user.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch user' });
  }
});

// Demo switch role helper
authRouter.post('/demo-switch', async (req, res) => {
  try {
    const { role } = req.body as { role: UserRole | 'guest' };
    if (role === 'guest') {
      return res.json({ success: true, user: null, token: null });
    }

    const preset = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    let user = await UserModel.findOne({ email: preset.email });
    if (!user) {
      user = await UserModel.create(preset);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to switch demo persona' });
  }
});

// Update Profile
authRouter.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const { id, name, phone, avatar, addresses } = req.body;
    const targetId = req.user ? req.user.id : id;

    if (!targetId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    if (addresses) updateData.addresses = addresses;

    const updated = await UserModel.findOneAndUpdate(
      { id: targetId },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ success: true, user: updated.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update profile' });
  }
});

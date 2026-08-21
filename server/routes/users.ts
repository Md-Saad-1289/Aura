import { Router } from 'express';
import { UserModel } from '../models/User';
import { authMiddleware } from '../auth';

export const usersRouter = Router();

// GET all customers/users
usersRouter.get('/', async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const filter: any = {};
    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const users = await UserModel.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch users' });
  }
});

// POST add customer / admin
usersRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const existing = await UserModel.findOne({ email: cleanEmail } as any);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    if (!data.id) data.id = `usr-${Date.now()}`;
    if (!data.createdAt) data.createdAt = new Date().toISOString();
    if (!data.addresses) data.addresses = [];

    const newUser = await UserModel.create(data);
    return res.status(201).json({ success: true, data: newUser.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to create user' });
  }
});

// PUT update user
usersRouter.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await UserModel.findOneAndUpdate({ id } as any, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update user' });
  }
});

// PATCH user status (active / blocked)
usersRouter.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await UserModel.findOneAndUpdate({ id } as any, { $set: { status } }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ success: true, data: updated.toJSON() });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to update user status' });
  }
});

// DELETE user
usersRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.findOneAndDelete({ id } as any);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ success: true, message: 'User deleted', id });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to delete user' });
  }
});

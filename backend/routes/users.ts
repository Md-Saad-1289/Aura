import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Users list', users: [], status: 'ok' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'User details', id: req.params.id, status: 'ok' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'User updated', status: 'ok' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'User deleted', status: 'ok' });
});

export { router as usersRouter };

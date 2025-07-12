import { Router } from 'express';
import { store } from '../data/store.js';
import { auth } from '../auth.js';

const router = Router();

router.get('/me', auth, (req, res) => {
  const user = store.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    id: user.id,
    email: user.email,
    profile: user.profile,
    balance: user.balance,
    history: user.history
  });
});

router.post('/profile', auth, (req, res) => {
  const { nickname, image } = req.body;
  const user = store.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (nickname !== undefined) user.profile.nickname = nickname;
  if (image !== undefined) user.profile.image = image;
  res.json({ profile: user.profile });
});

router.post('/deposit', auth, (req, res) => {
  const { amount } = req.body;
  const user = store.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  user.balance += parsed;
  res.json({ balance: user.balance });
});

export default router;

import { Router } from 'express';
import { store } from '../data/store.js';

const router = Router();

router.post('/register', (req, res) => {
  const { email, password, nickname, image } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  if (store.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email exists' });
  }
  const user = {
    id: store.nextUserId++,
    email,
    password,
    profile: { nickname: nickname || '', image: image || '' },
    balance: 0,
    history: []
  };
  store.users.push(user);
  res.json({ id: user.id, email: user.email });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = store.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = Math.random().toString(36).substring(2);
  store.sessions[token] = user.id;
  res.json({ token });
});

export default router;

import { store } from './data/store.js';

export function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || !store.sessions[token]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = store.sessions[token];
  next();
}

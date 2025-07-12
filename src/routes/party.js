import { Router } from 'express';
import { store } from '../data/store.js';
import { auth } from '../auth.js';

const router = Router();

router.post('/party', auth, (req, res) => {
  const { name, deposit, serviceName, startDate } = req.body;
  if (!name || !serviceName) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const party = {
    id: store.nextPartyId++,
    name,
    deposit: deposit || 0,
    serviceName,
    startDate: startDate || new Date().toISOString(),
    owner: req.userId,
    members: [req.userId],
    deposits: {}
  };
  store.parties.push(party);
  const owner = store.users.find(u => u.id === req.userId);
  if (owner) {
    owner.history.push(party.id);
    if (party.deposit > 0) {
      if (owner.balance < party.deposit) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      owner.balance -= party.deposit;
      party.deposits[owner.id] = party.deposit;
    }
  }
  res.json(party);
});

router.get('/parties', (req, res) => {
  res.json(store.parties);
});

router.post('/party/:partyId/join', auth, (req, res) => {
  const party = store.parties.find(p => p.id === parseInt(req.params.partyId));
  if (!party) {
    return res.status(404).json({ error: 'Party not found' });
  }
  const user = store.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!party.members.includes(req.userId)) {
    if (party.deposit > 0) {
      if (user.balance < party.deposit) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      user.balance -= party.deposit;
      party.deposits[req.userId] = party.deposit;
    }
    party.members.push(req.userId);
    user.history.push(party.id);
  }
  res.json({ success: true });
});

export default router;

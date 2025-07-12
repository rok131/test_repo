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
    members: [req.userId]
  };
  store.parties.push(party);
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
  if (!party.members.includes(req.userId)) {
    party.members.push(req.userId);
  }
  res.json({ success: true });
});

export default router;

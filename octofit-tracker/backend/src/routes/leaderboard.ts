import { Router } from 'express';
import { Leaderboard } from '../models/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().populate('user team').sort({ points: -1, rank: 1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch leaderboard' });
  }
});

router.post('/', async (req, res) => {
  try {
    const entry = new Leaderboard(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create leaderboard entry', details: error });
  }
});

export default router;

import { Router } from 'express';
import { Team } from '../models/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('members creator');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch teams' });
  }
});

router.post('/', async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create team', details: error });
  }
});

export default router;

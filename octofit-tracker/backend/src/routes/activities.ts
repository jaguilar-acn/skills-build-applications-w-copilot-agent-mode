import { Router } from 'express';
import { Activity } from '../models/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().populate('user');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch activities' });
  }
});

router.post('/', async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create activity', details: error });
  }
});

export default router;

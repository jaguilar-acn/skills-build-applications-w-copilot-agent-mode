import { Router } from 'express';
import { Workout } from '../models/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().populate('createdBy');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch workouts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create workout', details: error });
  }
});

export default router;

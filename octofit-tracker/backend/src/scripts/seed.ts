import { connectDB } from '../db.js';
import { User, Team, Activity, Workout, Leaderboard } from '../models/index.js';

// Seed the octofit_db database with test data
console.log('Seed the octofit_db database with test data');

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Team.deleteMany(),
    Activity.deleteMany(),
    Workout.deleteMany(),
    Leaderboard.deleteMany(),
  ]);

  const users = await User.create([
    {
      username: 'kelly_runner',
      email: 'kelly@example.com',
      password: 'runner123',
      profile: { firstName: 'Kelly', lastName: 'Miles', avatar: 'https://i.pravatar.cc/150?img=47' },
    },
    {
      username: 'maria_fit',
      email: 'maria@example.com',
      password: 'strong456',
      profile: { firstName: 'Maria', lastName: 'Chen', avatar: 'https://i.pravatar.cc/150?img=12' },
    },
    {
      username: 'alex_coach',
      email: 'alex@example.com',
      password: 'coach789',
      profile: { firstName: 'Alex', lastName: 'Cruz', avatar: 'https://i.pravatar.cc/150?img=32' },
    },
  ]);

  const teams = await Team.create([
    {
      name: 'Sunrise Sprinters',
      description: 'Early morning runners who love community challenges.',
      creator: users[0]._id,
      members: [users[0]._id, users[1]._id],
    },
    {
      name: 'Weekend Warriors',
      description: 'Fitness friends who train hard on weekends.',
      creator: users[1]._id,
      members: [users[1]._id, users[2]._id],
    },
  ]);

  const workouts = await Workout.create([
    {
      title: 'Full-Body Strength Circuit',
      description: 'A balanced circuit for strength, endurance, and mobility.',
      difficulty: 'intermediate',
      duration: 45,
      exercises: [
        { name: 'Push-ups', sets: 4, reps: 12 },
        { name: 'Walking lunges', sets: 3, reps: 16 },
        { name: 'Plank hold', sets: 3, reps: 60 },
      ],
      createdBy: users[2]._id,
    },
    {
      title: 'Recovery Yoga Flow',
      description: 'Gentle yoga sequence to improve flexibility and recovery.',
      difficulty: 'beginner',
      duration: 30,
      exercises: [
        { name: 'Cat-Cow stretch', sets: 1, reps: 10 },
        { name: 'Downward dog', sets: 1, reps: 8 },
        { name: 'Child pose', sets: 1, reps: 1 },
      ],
      createdBy: users[0]._id,
    },
    {
      title: 'HIIT Sprint Session',
      description: 'High intensity interval training for speed and calorie burn.',
      difficulty: 'advanced',
      duration: 25,
      exercises: [
        { name: 'Sprints', sets: 8, reps: 30 },
        { name: 'Jump squats', sets: 4, reps: 15 },
        { name: 'Burpees', sets: 4, reps: 12 },
      ],
      createdBy: users[1]._id,
    },
  ]);

  const activities = await Activity.create([
    {
      user: users[0]._id,
      type: 'Running',
      duration: 38,
      distance: 6.2,
      calories: 520,
      date: new Date('2026-05-20T06:15:00Z'),
      notes: 'Morning tempo run along the river.',
    },
    {
      user: users[1]._id,
      type: 'Strength Training',
      duration: 50,
      distance: 0,
      calories: 460,
      date: new Date('2026-05-21T18:00:00Z'),
      notes: 'Focused on lower body and core stability.',
    },
    {
      user: users[2]._id,
      type: 'Yoga',
      duration: 35,
      distance: 0,
      calories: 180,
      date: new Date('2026-05-22T07:30:00Z'),
      notes: 'Recovery flow after a long week of training.',
    },
    {
      user: users[0]._id,
      type: 'Cycling',
      duration: 45,
      distance: 15.4,
      calories: 480,
      date: new Date('2026-05-23T07:00:00Z'),
      notes: 'Sunny ride with hill intervals.',
    },
  ]);

  const leaderboard = await Leaderboard.create([
    {
      user: users[0]._id,
      team: teams[0]._id,
      points: 1240,
      activitiesCompleted: 18,
      rank: 1,
    },
    {
      user: users[1]._id,
      team: teams[0]._id,
      points: 1130,
      activitiesCompleted: 15,
      rank: 2,
    },
    {
      user: users[2]._id,
      team: teams[1]._id,
      points: 980,
      activitiesCompleted: 12,
      rank: 1,
    },
  ]);

  console.log('Seed complete:');
  console.log(`  ${users.length} users created`);
  console.log(`  ${teams.length} teams created`);
  console.log(`  ${workouts.length} workouts created`);
  console.log(`  ${activities.length} activities created`);
  console.log(`  ${leaderboard.length} leaderboard entries created`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });

import express, { ErrorRequestHandler } from 'express';
import { connectDB } from './config/database.js';
import {
  usersRouter,
  teamsRouter,
  activitiesRouter,
  workoutsRouter,
  leaderboardRouter,
} from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Environment-aware base URL
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

// Route handlers
app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/leaderboard', leaderboardRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Octofit Tracker API is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

// Initialize and start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on ${baseUrl}`);
    console.log(`API available at ${baseUrl}/api`);
  });
}

startServer();

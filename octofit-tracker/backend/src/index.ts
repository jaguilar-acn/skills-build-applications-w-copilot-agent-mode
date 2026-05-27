import express from 'express';
import { connectDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Environment-aware base URL
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Octofit Tracker API is running' });
});

// Initialize and start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on ${baseUrl}`);
    console.log(`API available at ${baseUrl}/api`);
  });
}

startServer();

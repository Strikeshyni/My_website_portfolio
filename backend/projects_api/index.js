import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import testImagesSudokuRoutes from './routes/test_images_sudoku.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const getMongoDbName = (uri) => {
  const explicitDb = (process.env.MONGODB_DB || '').trim();
  if (explicitDb) {
    return explicitDb;
  }

  try {
    const parsed = new URL(uri);
    const pathDb = decodeURIComponent(parsed.pathname.replace(/^\//, '').split('/')[0] || '').trim();
    if (pathDb) {
      return pathDb;
    }
  } catch {
    // Ignore parse errors and fallback to default database name.
  }

  return 'portfolio';
};

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors(corsOrigins.length ? { origin: corsOrigins, credentials: true } : undefined));
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
const mongoDbName = getMongoDbName(mongoUri);

mongoose
  .connect(mongoUri, { dbName: mongoDbName })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/projects', projectRoutes);
app.use('/api/test-images-sudoku', testImagesSudokuRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Projects API is running' });
});
app.head('/api/health', (req, res) => {
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`Projects API running on port ${PORT}`);
});

export default app;

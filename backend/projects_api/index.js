import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import testImagesSudokuRoutes from './routes/test_images_sudoku.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors(corsOrigins.length ? { origin: corsOrigins, credentials: true } : undefined));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/projects', projectRoutes);
app.use('/api/test-images-sudoku', testImagesSudokuRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Projects API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Projects API running on port ${PORT}`);
});

export default app;

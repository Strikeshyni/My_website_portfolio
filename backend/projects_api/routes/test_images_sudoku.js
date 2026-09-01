import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');

router.get('/', (req, res) => {
  try {
    const dir = path.join(repoRoot, 'public', 'test_images_sudoku');
    if (!fs.existsSync(dir)) {
      return res.json({ images: [] });
    }

    const files = fs
      .readdirSync(dir)
      .filter((file) => /\.(png|jpe?g|webp|gif|bmp)$/i.test(file));

    res.json({ images: files });
  } catch (err) {
    console.error('Error reading test_images_sudoku:', err);
    res.status(500).json({ error: 'Could not list images' });
  }
});

export default router;

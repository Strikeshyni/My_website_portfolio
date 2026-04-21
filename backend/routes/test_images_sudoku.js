import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// GET /api/test-images-sudoku - list all images in public/test_images_sudoku
router.get('/', (req, res) => {
  try {
    const dir = path.join(process.cwd(), 'public', 'test_images_sudoku');
    if (!fs.existsSync(dir)) {
      return res.json({ images: [] });
    }

    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpe?g|webp|gif|bmp)$/i.test(f))
      .map(f => f);

    res.json({ images: files });
  } catch (err) {
    console.error('Error reading test_images_sudoku:', err);
    res.status(500).json({ error: 'Could not list images' });
  }
});

export default router;

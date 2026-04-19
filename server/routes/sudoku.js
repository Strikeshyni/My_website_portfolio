import express from 'express';

const router = express.Router();

// Sudoku solver algorithm
function isValid(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Solve sudoku endpoint
router.post('/solve', (req, res) => {
  try {
    const { grid } = req.body;
    
    if (!grid || !Array.isArray(grid) || grid.length !== 9) {
      return res.status(400).json({ error: 'Invalid grid format' });
    }

    // Create a copy of the grid
    const gridCopy = grid.map(row => [...row]);

    // Solve the sudoku
    const solved = solveSudoku(gridCopy);

    if (solved) {
      res.json({ solution: gridCopy, success: true });
    } else {
      res.json({ error: 'No solution exists', success: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

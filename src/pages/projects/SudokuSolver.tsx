import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, Play, RotateCcw, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../lib/api';

// Confetti component
const Confetti = () => {
  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
  const confettiCount = 50;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: confettiCount }).map((_, i) => {
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${left}vw`, opacity: 1, rotate: 0 }}
            animate={{ 
              y: '100vh', 
              opacity: 0, 
              rotate: Math.random() * 720 - 360,
              x: `${left + (Math.random() * 20 - 10)}vw`
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              delay: animationDelay,
              ease: 'easeOut'
            }}
            className="absolute"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            }}
          />
        );
      })}
    </div>
  );
};

const SudokuSolver = () => {
  const [gridSize, setGridSize] = useState<9 | 16 | 25>(9);
  const [grid, setGrid] = useState<number[][]>(
    Array(9).fill(null).map(() => Array(9).fill(0))
  );
  // Grid of initial (locked) cells
  const [initialCells, setInitialCells] = useState<boolean[][]>(
    Array(9).fill(null).map(() => Array(9).fill(false))
  );
  // Grid of hint-filled cells
  const [hintCells, setHintCells] = useState<boolean[][]>(
    Array(9).fill(null).map(() => Array(9).fill(false))
  );
  // Completed rows, columns, and boxes
  const [completedRows, setCompletedRows] = useState<Set<number>>(new Set());
  const [completedCols, setCompletedCols] = useState<Set<number>>(new Set());
  const [completedBoxes, setCompletedBoxes] = useState<Set<string>>(new Set());
  
  const [gameId, setGameId] = useState<string | null>(null);
  const [solving, setSolving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [invalidMove, setInvalidMove] = useState<{row: number, col: number} | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [solvedBySolver, setSolvedBySolver] = useState(false);
  const [solverTime, setSolverTime] = useState<number | null>(null);
  
  const MAX_HINTS = 3;

  // Check if a number is valid according to Sudoku rules
  const isValidMove = (row: number, col: number, num: number, currentGrid: number[][]): boolean => {
    if (num === 0) return true; // Effacer est toujours valide
    
    // Vérifier la ligne
    for (let j = 0; j < gridSize; j++) {
      if (j !== col && currentGrid[row][j] === num) return false;
    }
    
    // Vérifier la colonne
    for (let i = 0; i < gridSize; i++) {
      if (i !== row && currentGrid[i][col] === num) return false;
    }
    
    // Vérifier la boîte
    const boxSize = Math.sqrt(gridSize);
    const startRow = Math.floor(row / boxSize) * boxSize;
    const startCol = Math.floor(col / boxSize) * boxSize;
    
    for (let i = startRow; i < startRow + boxSize; i++) {
      for (let j = startCol; j < startCol + boxSize; j++) {
        if (i !== row && j !== col && currentGrid[i][j] === num) return false;
      }
    }
    
    return true;
  };

  // Check completions after each change
  const checkCompletions = (currentGrid: number[][]) => {
    const boxSize = Math.sqrt(gridSize);
    const newCompletedRows = new Set<number>();
    const newCompletedCols = new Set<number>();
    const newCompletedBoxes = new Set<string>();
    
    // Vérifier les lignes
    for (let i = 0; i < gridSize; i++) {
      const rowSet = new Set(currentGrid[i]);
      if (!rowSet.has(0) && rowSet.size === gridSize) {
        newCompletedRows.add(i);
      }
    }
    
    // Vérifier les colonnes
    for (let j = 0; j < gridSize; j++) {
      const colValues = currentGrid.map(row => row[j]);
      const colSet = new Set(colValues);
      if (!colSet.has(0) && colSet.size === gridSize) {
        newCompletedCols.add(j);
      }
    }
    
    // Vérifier les boîtes
    for (let boxRow = 0; boxRow < boxSize; boxRow++) {
      for (let boxCol = 0; boxCol < boxSize; boxCol++) {
        const boxValues: number[] = [];
        for (let i = 0; i < boxSize; i++) {
          for (let j = 0; j < boxSize; j++) {
            boxValues.push(currentGrid[boxRow * boxSize + i][boxCol * boxSize + j]);
          }
        }
        const boxSet = new Set(boxValues);
        if (!boxSet.has(0) && boxSet.size === gridSize) {
          newCompletedBoxes.add(`${boxRow}-${boxCol}`);
        }
      }
    }
    
    setCompletedRows(newCompletedRows);
    setCompletedCols(newCompletedCols);
    setCompletedBoxes(newCompletedBoxes);
    
    // Vérifier si la grille est complète
    const isGridComplete = newCompletedRows.size === gridSize && 
                           newCompletedCols.size === gridSize && 
                           newCompletedBoxes.size === gridSize;
    
    if (isGridComplete && !isCompleted) {
      setIsCompleted(true);
      setShowConfetti(true);
      if (!solvedBySolver && startTime) {
        setCompletionTime(Math.floor((Date.now() - startTime) / 1000));
      }
      // Arrêter les confettis après 5 secondes
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  // Elapsed game timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (startTime && !isCompleted) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isCompleted]);

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill(0)));
    setInitialCells(Array(gridSize).fill(null).map(() => Array(gridSize).fill(false)));
    setHintCells(Array(gridSize).fill(null).map(() => Array(gridSize).fill(false)));
    setCompletedRows(new Set());
    setCompletedCols(new Set());
    setCompletedBoxes(new Set());
    setGameId(null);
    setSelectedCell(null);
    setHintsUsed(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsCompleted(false);
    setCompletionTime(null);
    setSolvedBySolver(false);
    setSolverTime(null);
  }, [gridSize]);

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const response = await axios.get('/api/projects');
        const sudokuProject = response.data.find((p: any) => p.interactivePath === '/projects/sudoku-solver');
        if (sudokuProject) {
          setProjectId(sudokuProject._id);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProjectId();
  }, []);

  const handleCellChange = (row: number, col: number, value: string) => {
    // Do not allow changes to initial cells
    if (initialCells[row][col]) return;
    
    const num = parseInt(value) || 0;
    if (num >= 0 && num <= gridSize) {
      // Check if move is valid
      if (num !== 0 && !isValidMove(row, col, num, grid)) {
        // Invalid move with visual feedback
        setInvalidMove({ row, col });
        setTimeout(() => setInvalidMove(null), 500);
        return;
      }
      
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = num;
      setGrid(newGrid);
      
      // Remove hint status if user edits the cell
      if (hintCells[row][col]) {
        const newHintCells = hintCells.map(r => [...r]);
        newHintCells[row][col] = false;
        setHintCells(newHintCells);
      }
      
      // Recompute completions
      checkCompletions(newGrid);
    }
  };

  const handleNumberClick = (num: number) => {
    if (selectedCell && !initialCells[selectedCell.row][selectedCell.col]) {
      handleCellChange(selectedCell.row, selectedCell.col, num.toString());
    }
  };

  const generatePuzzle = async () => {
    setGenerating(true);
    
    // Timeouts aligned with backend (+5s margin)
    // Backend: 10s/20s/35s -> Frontend: 15s/25s/40s
    const timeoutMs = gridSize === 25 ? 40000 : gridSize === 16 ? 25000 : 15000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(apiUrl('/sudoku/api/sudoku/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, size: gridSize }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      if (data.success) {
        setGrid(data.puzzle);
        setGameId(data.gameId);
        
        // Marquer les cases non-vides comme initiales (verrouillées)
        const newInitialCells = data.puzzle.map((row: number[]) => 
          row.map((cell: number) => cell !== 0)
        );
        setInitialCells(newInitialCells);
        setHintCells(Array(gridSize).fill(null).map(() => Array(gridSize).fill(false)));
        setCompletedRows(new Set());
        setCompletedCols(new Set());
        setCompletedBoxes(new Set());
        
        // Réinitialiser les états de jeu
        setHintsUsed(0);
        setStartTime(Date.now());
        setElapsedTime(0);
        setIsCompleted(false);
        setCompletionTime(null);
        setSolvedBySolver(false);
        setSolverTime(null);
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        alert(`Generating the ${gridSize}x${gridSize} grid took too long. Please try again or choose a smaller size.`);
      } else if (error.message?.includes('timeout') || error.message?.includes('408')) {
        alert('Timeout: generation took too long. Please retry.');
      } else {
        console.error('Error generating puzzle:', error);
        alert('Error: make sure the Sudoku API is running.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const solveSudoku = async () => {
    setSolving(true);
    const solveStartTime = Date.now();
    
    // Timeouts aligned with backend (+5s margin)
    // Backend: 10s/20s/50s -> Frontend: 15s/25s/60s
    const timeoutMs = gridSize === 25 ? 60000 : gridSize === 16 ? 25000 : 15000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(apiUrl('/sudoku/api/sudoku/solve'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      // Handle backend timeout or error responses
      if (!response.ok || data.error) {
        const errorMessage = data.error || 'Error while solving the puzzle';
        alert(`Error: ${errorMessage}`);
        return;
      }
      
      if (data.solution) {
        const solveEndTime = Date.now();
        setSolverTime(Math.round((solveEndTime - solveStartTime) / 10) / 100); // En secondes avec 2 décimales
        setSolvedBySolver(true);
        setGrid(data.solution);
        checkCompletions(data.solution);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        alert(`Solving the ${gridSize}x${gridSize} grid took too long. You can retry, but the puzzle may be too complex for the current timeout.`);
      } else {
        console.error('Error solving sudoku:', error);
        alert('Error: make sure the Sudoku API is running.');
      }
    } finally {
      setSolving(false);
    }
  };

  const getHint = async () => {
    if (!gameId) {
      alert('Generate a puzzle first to request hints.');
      return;
    }
    
    if (hintsUsed >= MAX_HINTS) {
      alert(`You already used all hints (${MAX_HINTS}/${MAX_HINTS}).`);
      return;
    }

    try {
      const response = await fetch(apiUrl('/sudoku/api/sudoku/hint'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, currentGrid: grid }),
      });
      const data = await response.json();
      if (data.hint) {
        const { row, col, value } = data.hint;
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = value;
        setGrid(newGrid);
        
        // Mark cell as filled by hint
        const newHintCells = hintCells.map(r => [...r]);
        newHintCells[row][col] = true;
        setHintCells(newHintCells);
        
        // Increase hint counter
        setHintsUsed(prev => prev + 1);
        
        // Recompute completions
        checkCompletions(newGrid);
      } else {
        alert(data.message || 'No hint available.');
      }
    } catch (error) {
      console.error('Error getting hint:', error);
    }
  };

  const clearGrid = () => {
    // Clear only non-initial cells (user or hint entries)
    if (!gameId) {
      // If no game is active, clear everything
      setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill(0)));
      setInitialCells(Array(gridSize).fill(null).map(() => Array(gridSize).fill(false)));
      setHintCells(Array(gridSize).fill(null).map(() => Array(gridSize).fill(false)));
      setCompletedRows(new Set());
      setCompletedCols(new Set());
      setCompletedBoxes(new Set());
      setGameId(null);
    } else {
      // Otherwise keep initial cells and clear the rest
      const newGrid = grid.map((row, i) => 
        row.map((cell, j) => initialCells[i][j] ? cell : 0)
      );
      setGrid(newGrid);
      setHintCells(Array(gridSize).fill(null).map(() => Array(gridSize).fill(false)));
      setCompletedRows(new Set());
      setCompletedCols(new Set());
      setCompletedBoxes(new Set());
      setIsCompleted(false);
      setCompletionTime(null);
      setSolvedBySolver(false);
      setSolverTime(null);
      // Keep hints counter and timer untouched
    }
  };

  // Get text color based on cell type
  const getCellTextColor = (row: number, col: number, isSelected: boolean): string => {
    if (isSelected && !initialCells[row][col]) return 'text-primary';
    if (initialCells[row][col]) return 'text-white font-extrabold'; // Chiffres initiaux
    if (hintCells[row][col]) return 'text-amber-400'; // Chiffres donnés par indice
    return 'text-emerald-400'; // Chiffres entrés par l'utilisateur
  };

  // Check whether a cell belongs to a completed area
  const isCellCompleted = (row: number, col: number): boolean => {
    const boxSize = Math.sqrt(gridSize);
    const boxRow = Math.floor(row / boxSize);
    const boxCol = Math.floor(col / boxSize);
    
    return completedRows.has(row) || 
           completedCols.has(col) || 
           completedBoxes.has(`${boxRow}-${boxCol}`);
  };

  return (
    <div className="min-h-screen bg-dark section-padding">
      {/* Confetti */}
      {showConfetti && <Confetti />}
      
      {/* Victory modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCompleted(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-dark-light border border-primary/30 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold gradient-text mb-4">🎉 Great job! 🎉</h2>
              <p className="text-gray-300 mb-4">
                You completed the {gridSize}x{gridSize} grid on {
                  difficulty === 'easy' ? 'Easy' : 
                  difficulty === 'medium' ? 'Medium' : 
                  difficulty === 'hard' ? 'Hard' : 'Expert'
                } !
              </p>
              {solvedBySolver ? (
                <p className="text-lg text-secondary font-bold">
                  Solved by the algorithm in {solverTime}s
                </p>
              ) : (
                <p className="text-lg text-emerald-400 font-bold">
                  Your time: {formatTime(completionTime || elapsedTime)}
                </p>
              )}
              {hintsUsed > 0 && (
                <p className="text-sm text-amber-400 mt-2">
                  Hints used: {hintsUsed}/{MAX_HINTS}
                </p>
              )}
              <button
                onClick={() => setIsCompleted(false)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Link
        to={projectId ? `/project/${projectId}` : '/#projects'}
        className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back to project
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto"
      >
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-bold gradient-text">
            Interactive Sudoku Game
          </h1>
          
          {/* Timer and stats */}
          {startTime && (
            <div className="flex items-center gap-4 bg-dark-light/50 px-4 py-2 rounded-xl border border-gray-700">
              <div className="text-center">
                <span className="text-2xl font-mono font-bold text-primary">{formatTime(elapsedTime)}</span>
                <span className="text-xs text-gray-400 block">Time</span>
              </div>
              <div className="h-8 w-px bg-gray-700"></div>
              <div className="text-center">
                <span className={`text-lg font-bold ${hintsUsed >= MAX_HINTS ? 'text-red-400' : 'text-amber-400'}`}>
                  {hintsUsed}/{MAX_HINTS}
                </span>
                <span className="text-xs text-gray-400 block">Hints</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="glass-effect rounded-2xl p-8 mb-8">
          {/* Difficulty and size */}
          <div className="mb-6 flex flex-wrap gap-6">
            <div>
              <label className="block text-sm mb-3 text-gray-300">Difficulty</label>
              <div className="flex gap-2 flex-wrap">
                {(['easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      difficulty === diff
                        ? 'bg-primary text-white'
                        : 'bg-dark-light text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {diff === 'easy' && 'Easy'}
                    {diff === 'medium' && 'Medium'}
                    {diff === 'hard' && 'Hard'}
                    {diff === 'expert' && 'Expert'}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-3 text-gray-300">Grid size</label>
              <div className="flex gap-2">
                {([9, 16, 25] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setGridSize(size)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      gridSize === size
                        ? 'bg-secondary text-white'
                        : 'bg-dark-light text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Layout principal: Grille + Sidebar */}
          <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
            
              {/* Grid container */}
            <div className="w-full xl:w-auto overflow-x-auto flex justify-center p-4">
              <div 
                className="grid gap-0 bg-gray-700 border-2 border-gray-500 shadow-2xl"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, minmax(${gridSize > 16 ? '2rem' : '3rem'}, 1fr))`,
                  width: 'fit-content',
                }}
              >
                {grid.map((row, i) => (
                  row.map((cell, j) => {
                    const boxSize = Math.sqrt(gridSize);
                    const isRightBorder = (j + 1) % boxSize === 0 && j !== gridSize - 1;
                    const isBottomBorder = (i + 1) % boxSize === 0 && i !== gridSize - 1;
                    const isSelected = selectedCell?.row === i && selectedCell?.col === j;
                    const isInitial = initialCells[i][j];
                    const isCompleted = isCellCompleted(i, j);
                    const isInvalid = invalidMove?.row === i && invalidMove?.col === j;
                    
                    return (
                      <input
                        key={`${i}-${j}`}
                        type="number"
                        min="0"
                        max={gridSize}
                        value={cell || ''}
                        readOnly={isInitial}
                        onFocus={() => setSelectedCell({row: i, col: j})}
                        onChange={(e) => handleCellChange(i, j, e.target.value)}
                        className={`
                          w-full h-full aspect-square text-center 
                          border-gray-700 focus:outline-none font-bold no-spinner
                          ${gridSize > 16 ? 'text-xs sm:text-sm' : 'text-lg'}
                          ${isRightBorder ? 'border-r-2 border-r-gray-400' : 'border-r border-r-gray-700'}
                          ${isBottomBorder ? 'border-b-2 border-b-gray-400' : 'border-b border-b-gray-700'}
                          ${isSelected && !isInitial ? 'bg-primary/20' : ''}
                          ${isInitial ? 'bg-gray-800 cursor-not-allowed' : 'bg-dark-light hover:bg-gray-700'}
                          ${isCompleted ? 'animate-completed' : ''}
                          ${isInvalid ? 'bg-red-500/50 animate-shake' : ''}
                          ${getCellTextColor(i, j, isSelected)}
                          transition-colors
                        `}
                      />
                    );
                  })
                ))}
              </div>
            </div>

            {/* Sidebar: Number pad and actions */}
            <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
              
              {/* Number pad */}
              <div className="bg-dark-light/30 p-5 rounded-xl border border-gray-700 shadow-lg">
                <label className="block text-sm mb-4 text-gray-300 text-center font-medium uppercase tracking-wider">
                  Number Pad
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: gridSize }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      className="aspect-square rounded-lg bg-dark-light hover:bg-primary hover:text-white transition-all font-bold text-gray-300 border border-gray-600 text-sm sm:text-base shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNumberClick(0)}
                    className="aspect-square rounded-lg bg-red-900/30 hover:bg-red-600 hover:text-white transition-all font-bold text-red-400 border border-red-900/50 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    title="Clear cell"
                  >
                    X
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={generatePuzzle}
                  disabled={generating}
                  className="flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 font-bold shadow-lg"
                >
                  <Play size={20} />
                  {generating ? 'Generating...' : 'New Game'}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={solveSudoku}
                    disabled={solving}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-primary rounded-xl hover:bg-primary/80 transition-colors disabled:opacity-50 font-medium shadow-md"
                  >
                    {solving ? '...' : 'Solve'}
                  </button>
                  <button
                    onClick={getHint}
                    disabled={!gameId || hintsUsed >= MAX_HINTS}
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-colors font-medium shadow-md ${
                      hintsUsed >= MAX_HINTS 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-secondary hover:bg-secondary/80 disabled:opacity-50'
                    }`}
                  >
                    <Lightbulb size={18} />
                    {hintsUsed}/{MAX_HINTS}
                  </button>
                </div>
                
                <button
                  onClick={clearGrid}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors text-sm font-medium shadow-md"
                >
                  <RotateCcw size={18} />
                  Effacer la grille
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-gray-400 space-y-3">
          <p className="font-bold text-white">Comment jouer :</p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Choisissez une difficulté et cliquez sur "Nouvelle Partie"</li>
            <li>Remplissez la grille en respectant les règles du Sudoku</li>
            <li>Vous avez droit à <span className="text-amber-400 font-bold">{MAX_HINTS} indices</span> par partie</li>
            <li>Cliquez sur "Résoudre" pour voir la solution (avec le temps du solveur)</li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
};

export default SudokuSolver;

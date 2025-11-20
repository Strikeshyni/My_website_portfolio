import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, Play, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SudokuSolver = () => {
  const [grid, setGrid] = useState<number[][]>(
    Array(9).fill(null).map(() => Array(9).fill(0))
  );
  const [gameId, setGameId] = useState<string | null>(null);
  const [solving, setSolving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [projectId, setProjectId] = useState<string | null>(null);

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
    const num = parseInt(value) || 0;
    if (num >= 0 && num <= 9) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = num;
      setGrid(newGrid);
    }
  };

  const generatePuzzle = async () => {
    setGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/sudoku/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty }),
      });
      const data = await response.json();
      if (data.success) {
        setGrid(data.puzzle);
        setGameId(data.gameId);
      }
    } catch (error) {
      console.error('Error generating puzzle:', error);
      alert('Erreur: Assurez-vous que l\'API Python est lancée (python server/sudoku_api.py)');
    } finally {
      setGenerating(false);
    }
  };

  const solveSudoku = async () => {
    setSolving(true);
    try {
      const response = await fetch('http://localhost:5000/api/sudoku/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid }),
      });
      const data = await response.json();
      if (data.solution) {
        setGrid(data.solution);
      }
    } catch (error) {
      console.error('Error solving sudoku:', error);
      alert('Erreur: Assurez-vous que l\'API Python est lancée (python server/sudoku_api.py)');
    } finally {
      setSolving(false);
    }
  };

  const getHint = async () => {
    if (!gameId) {
      alert('Générez d\'abord un puzzle pour obtenir des indices');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/sudoku/hint', {
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
        alert(`Indice: Case (${row + 1}, ${col + 1}) = ${value}`);
      } else {
        alert(data.message || 'Aucun indice disponible');
      }
    } catch (error) {
      console.error('Error getting hint:', error);
    }
  };

  const clearGrid = () => {
    setGrid(Array(9).fill(null).map(() => Array(9).fill(0)));
    setGameId(null);
  };

  return (
    <div className="min-h-screen bg-dark section-padding">
      <Link
        to={projectId ? `/project/${projectId}` : '/#projects'}
        className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Retour au projet
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 gradient-text">
          Jeu de Sudoku Interactif
        </h1>
        
        <div className="glass-effect rounded-2xl p-8 mb-8">
          {/* Sélection de difficulté */}
          <div className="mb-6">
            <label className="block text-sm mb-3 text-gray-300">Difficulté</label>
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
                  {diff === 'easy' && 'Facile'}
                  {diff === 'medium' && 'Moyen'}
                  {diff === 'hard' && 'Difficile'}
                  {diff === 'expert' && 'Expert'}
                </button>
              ))}
            </div>
          </div>

          {/* Grille de Sudoku */}
          <div className="grid grid-cols-9 gap-1 mb-8 max-w-xl mx-auto">
            {grid.map((row, i) => (
              row.map((cell, j) => (
                <input
                  key={`${i}-${j}`}
                  type="number"
                  min="0"
                  max="9"
                  value={cell || ''}
                  onChange={(e) => handleCellChange(i, j, e.target.value)}
                  className={`w-12 h-12 text-center bg-dark-light border ${
                    (Math.floor(i / 3) + Math.floor(j / 3)) % 2 === 0
                      ? 'border-gray-600'
                      : 'border-gray-700'
                  } focus:border-primary focus:outline-none rounded font-bold text-lg`}
                />
              ))
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={generatePuzzle}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Play size={20} />
              {generating ? 'Génération...' : 'Nouvelle Partie'}
            </button>
            <button
              onClick={solveSudoku}
              disabled={solving}
              className="flex items-center gap-2 px-6 py-3 bg-primary rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {solving ? 'Résolution...' : 'Résoudre'}
            </button>
            <button
              onClick={getHint}
              disabled={!gameId}
              className="flex items-center gap-2 px-6 py-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <Lightbulb size={20} />
              Indice
            </button>
            <button
              onClick={clearGrid}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw size={20} />
              Effacer
            </button>
          </div>
        </div>

        <div className="text-gray-400 space-y-3">
          <p className="font-bold text-white">🎮 Comment jouer :</p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Choisissez une difficulté et cliquez sur "Nouvelle Partie"</li>
            <li>Remplissez la grille en respectant les règles du Sudoku</li>
            <li>Utilisez "Indice" si vous êtes bloqué</li>
            <li>Cliquez sur "Résoudre" pour voir la solution</li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
};

export default SudokuSolver;

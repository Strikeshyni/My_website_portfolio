import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import SudokuSolver from './pages/projects/SudokuSolver';
import ChatBot from './pages/projects/ChatBot';
import MushroomClassifier from './pages/projects/MushroomClassifier';
import StockPrediction from './pages/projects/StockPrediction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/projects/sudoku-solver" element={<SudokuSolver />} />
        <Route path="/projects/chatbot" element={<ChatBot />} />
        <Route path="/projects/mushroom-classifier" element={<MushroomClassifier />} />
        <Route path="/projects/stock-prediction" element={<StockPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;

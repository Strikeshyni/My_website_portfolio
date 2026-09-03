import { useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ChatBot from './ChatBot';
import MushroomClassifier from './MushroomClassifier';
import StockPrediction from './StockPrediction';
import SudokuOCR from './SudokuOCR';
import SudokuSolver from './SudokuSolver';
import { ProjectContext } from '../../context/ProjectContext';

const ProjectDemo = () => {
  const { slug } = useParams();
  const context = useContext(ProjectContext);
  const loading = context ? context.loading : true;
  const projects = context?.projects || [];
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!project.interactive || !project.interactivePath || project.demoEnabled === false) {
    const detailPath = slug ? `/projects/${slug}` : '/';
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Demo not available</h1>
          <p className="text-gray-400 mb-6">
            This project does not have a public demo yet.
          </p>
          <Link to={detailPath} className="text-primary hover:underline">
            Back to project
          </Link>
        </div>
      </div>
    );
  }

  switch (slug) {
    case 'sudoku-solver':
      return <SudokuSolver />;
    case 'chatbot':
      return <ChatBot />;
    case 'mushroom-classifier':
      return <MushroomClassifier />;
    case 'stock-prediction':
      return <StockPrediction />;
    case 'ocr-sudoku':
      return <SudokuOCR />;
    default:
      return (
        <div className="min-h-screen bg-dark flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Demo not available</h1>
            <p className="text-gray-400 mb-6">
              This project does not have a public demo yet.
            </p>
            <Link to={`/projects/${slug}`} className="text-primary hover:underline">
              Back to project
            </Link>
          </div>
        </div>
      );
  }
};

export default ProjectDemo;

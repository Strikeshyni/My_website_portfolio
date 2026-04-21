import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Project } from '../../types';
import ChatBot from './ChatBot';
import MushroomClassifier from './MushroomClassifier';
import StockPrediction from './StockPrediction';
import SudokuOCR from './SudokuOCR';
import SudokuSolver from './SudokuSolver';

const ProjectDemo = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug || slug === 'undefined') {
        setProject(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/projects/slug/${slug}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project || !project.interactive || !project.interactivePath || !project.demoEnabled) {
    const detailPath = slug ? `/projects/${slug}` : '/';
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Demo not found</h1>
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
            <h1 className="text-4xl font-bold mb-4">Demo not found</h1>
            <Link to={`/projects/${slug}`} className="text-primary hover:underline">
              Back to project
            </Link>
          </div>
        </div>
      );
  }
};

export default ProjectDemo;

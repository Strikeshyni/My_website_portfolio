import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Project } from '../types';
import { apiUrl } from '../lib/api';

export const ProjectContext = createContext<{
  projects: Project[];
  loading: boolean;
  healthStatus: Record<string, boolean>;
  checkAllHealth: (projectList: Project[]) => Promise<void>;
} | null>(null);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<Record<string, boolean>>({});

  /**
   * Performs health checks on a list of projects.
   * Defined with useCallback(..., []) to maintain a stable function reference
   * that won't trigger re-renders or effect loops.
   */
  const checkAllHealth = useCallback(async (projectList: Project[]) => {
    if (!projectList || projectList.length === 0) return;

    const status: Record<string, boolean> = {};
    const checks = projectList.map(async (project) => {
      if (!project.healthCheckUrl) return null;
      try {
        const is_http = project.healthCheckUrl.startsWith('http');
        const healthUrl = is_http
          ? project.healthCheckUrl
          : apiUrl(project.healthCheckUrl);

        const response = await axios.get(healthUrl, { timeout: 10000 });
        
        // Safety check: If the response is HTML, it might be a redirect to a 404 page
        // instead of a real API response (common on some hosting providers).
        const isHtml = typeof response.data === 'string' && (response.data.trim().startsWith('<!doctype html>') && !is_http);

        return { id: project._id, isHealthy: !isHtml };
      } catch (error) {
        return { id: project._id, isHealthy: false };
      }
    });

    const results = await Promise.all(checks);
    results.forEach((result) => {
      if (result) status[result.id] = result.isHealthy;
    });

    setHealthStatus((prev) => ({ ...prev, ...status }));
  }, []);

  /**
   * Main initialization effect. 
   * Fetches projects from the backend and immediately triggers health checks.
   */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(apiUrl('/api/projects'), { timeout: 8000 });
        const rawProjects = res.data;
        const fetchedProjects = Array.isArray(rawProjects)
          ? rawProjects
          : (rawProjects?.projects || rawProjects?.data || []);

        if (!Array.isArray(fetchedProjects)) {
          throw new Error('Projects API did not return an array');
        }

        setProjects(fetchedProjects);

        // Trigger health checks for live data
        checkAllHealth(fetchedProjects);
      } catch (err) {
        console.error('Failed to fetch projects, using fallback data:', err);
        const fallback: Project[] = [
          {
            _id: 'sudoku-solver',
            slug: 'sudoku-solver',
            title: 'Sudoku Solver and Game',
            description: 'Sudoku generator and solver with advanced optimization algorithms in Python',
            longDescription: `A complete Sudoku game developed in Python with automatic grid generation and optimized solving.
            
        Features:
        - Support for 9x9 and 16x16 grids
        - Grid generation with 4 difficulty levels (easy, medium, hard, expert)
        - Modern interface with a numeric keypad and intuitive input
        - Ultra-fast solving with optimized backtracking
        - Smart hint system
        - Real-time move validation
        - REST API for frontend integration`,
            technologies: ['Python', 'Flask', 'Algorithms', 'React', 'TypeScript'],
            imageUrl: '/images/projects/sudoku.jpg',
            bannerUrl: '/images/projects/sudoku-banner.jpg',
            githubUrl: 'https://github.com/Strikeshyni/SudokuSolver_optimisation',
            category: 'other',
            featured: true,
            interactive: true,
            interactivePath: '/projects/sudoku-solver/demo',
            healthCheckUrl: '/sudoku/health',
            maturity: 'stable',
            createdAt: new Date('2025-11-20'),
          },
          {
            _id: 'chatbot',
            slug: 'chatbot',
            title: 'Conversational AI Chatbot',
            description: 'Intelligent assistant with natural language processing',
            longDescription: 'An AI chatbot able to understand and answer user questions contextually.',
            technologies: ['Python', 'NLP', 'Machine Learning', 'React', 'TypeScript'],
            imageUrl: '/images/projects/chatbot.jpg',
            bannerUrl: '/images/projects/chatbot-banner.jpg',
            category: 'ai',
            featured: true,
            interactive: true,
            interactivePath: '/projects/chatbot/demo',
            healthCheckUrl: '/chatbot/health',
            maturity: 'stable',
            createdAt: new Date('2025-03-15'),
          },
          {
            _id: 'mushroom-classifier',
            slug: 'mushroom-classifier',
            title: 'Mushroom Classification with Conformal Prediction',
            description: 'CNN model with conformal prediction to classify 169 mushroom species',
            longDescription: 'A Deep Learning project applying conformal prediction to mushroom classification.',
            technologies: ['Python', 'PyTorch', 'Deep Learning', 'Conformal Prediction', 'CNN', 'React'],
            imageUrl: '/images/projects/mushroom.jpg',
            bannerUrl: '/images/projects/mushroom-banner.jpg',
            githubUrl: 'https://github.com/Strikeshyni/conformal_prediction',
            category: 'ai',
            featured: true,
            interactive: true,
            interactivePath: '/projects/mushroom-classifier/demo',
            healthCheckUrl: '/mushroom/health',
            maturity: 'beta',
            createdAt: new Date('2025-10-15'),
          },
          {
            _id: 'stock-prediction',
            slug: 'stock-prediction',
            title: 'CAC40 Stock Price Prediction',
            description: 'LSTM model to predict stock prices and simulate trading strategies',
            longDescription: 'Stock prediction system using LSTM neural networks with simulation.',
            technologies: ['Python', 'TensorFlow', 'LSTM', 'FastAPI', 'React'],
            imageUrl: '/images/projects/stock.jpg',
            bannerUrl: '/images/projects/stock-banner.jpg',
            githubUrl: 'https://github.com/Strikeshyni/CAC40_prediction',
            category: 'ai',
            featured: true,
            interactive: true,
            interactivePath: '/projects/stock-prediction/demo',
            healthCheckUrl: '/stock/health',
            maturity: 'beta',
            createdAt: new Date('2024-10-10'),
          },
          {
            _id: 'portfolio',
            slug: 'portfolio',
            title: 'Dynamic Portfolio',
            description: 'Modern portfolio website with animations and modular architecture',
            longDescription: 'A modern and high-performance portfolio.',
            technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
            imageUrl: '/images/projects/portfolio.png',
            bannerUrl: '/images/projects/portfolio-banner.jpg',
            githubUrl: 'https://github.com/Strikeshyni/My_website_portfolio',
            category: 'web',
            featured: true,
            interactive: false,
            maturity: 'stable',
            createdAt: new Date('2025-11-20'),
          },
          {
            _id: 'ocr-sudoku',
            slug: 'ocr-sudoku',
            title: 'OCR Sudoku Solver',
            description: 'Sudoku solver in C with OCR and a CNN built from scratch',
            longDescription: 'Complete Sudoku solver in pure C with OCR and CNN.',
            technologies: ['C', 'CNN', 'OCR', 'Image Processing'],
            imageUrl: '/images/projects/ocr-sudoku.png',
            bannerUrl: '/images/projects/ocr-sudoku-banner.png',
            githubUrl: 'https://github.com/Strikeshyni/OCR_Sudoku',
            category: 'ai',
            featured: true,
            interactive: true,
            interactivePath: '/projects/ocr-sudoku/demo',
            healthCheckUrl: '/ocr-sudoku/health',
            maturity: 'stable',
            createdAt: new Date('2022-09-10'),
          },
        ];
        setProjects(fallback);
        
        // Trigger health checks for fallback data
        checkAllHealth(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [checkAllHealth]);

  return (
    <ProjectContext.Provider value={{ projects, loading, healthStatus, checkAllHealth }}>
      {children}
    </ProjectContext.Provider>
  );
};
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../lib/api';
import { Project } from '../types';

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkHealth = async () => {
      const status: Record<string, boolean> = {};
      
      const checks = projects.map(async (project) => {
        if (project.healthCheckUrl) {
          try {
            const healthUrl = project.healthCheckUrl.startsWith('http')
              ? project.healthCheckUrl
              : apiUrl(project.healthCheckUrl);
            const response = await axios.get(healthUrl, { timeout: 5000 });
            // Verify that we didn't get the HTML fallback page
            const isHtml = typeof response.data === 'string' && response.data.trim().startsWith('<!doctype html>');
            if (isHtml) {
                throw new Error('Received HTML instead of JSON');
            }
            return { id: project._id, isHealthy: true };
          } catch (error: any) {
            if (error?.code !== 'ERR_CANCELED') {
              console.warn(`Health check failed for ${project.title}`);
            }
            return { id: project._id, isHealthy: false };
          }
        }
        return null;
      });

      const results = await Promise.all(checks);
      
      results.forEach(result => {
        if (result) {
          status[result.id] = result.isHealthy;
        }
      });

      if (Object.keys(status).length > 0) {
        setHealthStatus(prev => ({ ...prev, ...status }));
      }
    };

    if (projects.length > 0) {
      checkHealth();
    }
  }, [projects]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const response = await axios.get(apiUrl('/api/projects'), {
          signal: controller.signal,
          timeout: 10000,
        });
        setProjects(response.data);
      } catch (error: any) {
        if (error?.code !== 'ERR_CANCELED') {
          console.error('Error fetching projects:', error);
        }
        // Fallback to static data if API fails
        setProjects([
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
        - REST API for frontend integration

        Technologies:
        - Python for game logic
        - Backtracking algorithm with heuristics
        - Flask for the REST API
        - React + TypeScript for the interface

        The algorithm can solve any Sudoku grid (up to 16x16) in just a few milliseconds thanks to advanced optimizations.`,
            technologies: ['Python', 'Flask', 'Algorithms', 'React', 'TypeScript'],
            imageUrl: '/images/projects/sudoku.jpg',
            bannerUrl: '/images/projects/sudoku-banner.jpg',
            githubUrl: 'https://github.com/Strikeshyni/SudokuSolver_optimisation',
            category: 'other',
            featured: true,
            interactive: true,
            interactivePath: '/projects/sudoku-solver/demo',
            healthCheckUrl: '/sudoku/api/sudoku/health',
            maturity: 'stable',
            createdAt: new Date('2025-11-20'),
          },
          {
            _id: 'chatbot',
            slug: 'chatbot',
            title: 'Conversational AI Chatbot',
            description: 'Intelligent assistant with natural language processing',
            longDescription: `An AI chatbot able to understand and answer user questions contextually.`,
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
            longDescription: `A Deep Learning project applying conformal prediction to mushroom classification.`,
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
            longDescription: `Stock prediction system using LSTM neural networks with simulation.`,
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
            longDescription: `A modern and high-performance portfolio.`,
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
            longDescription: `Complete Sudoku solver in pure C with OCR and CNN.`,
            technologies: ['C', 'CNN', 'OCR', 'Image Processing'],
            imageUrl: '/images/projects/ocr-sudoku.png',
            bannerUrl: '/images/projects/ocr-sudoku-banner.png',
            githubUrl: 'https://github.com/Strikeshyni/OCR_Sudoku',
            category: 'ai',
            featured: true,
            interactive: true,
            interactivePath: '/projects/ocr-sudoku/demo',
            healthCheckUrl: '/ocr-sudoku/health',
            maturity: 'beta',
            createdAt: new Date('2022-09-10'),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, []);

  const categories = ['all', 'web', 'ai', 'data', 'other'];
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const getMaturityBadge = (maturity?: string) => {
    switch (maturity) {
      case 'stable':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-green-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Stable</span>;
      case 'beta':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Beta</span>;
      case 'alpha':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-orange-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Alpha</span>;
      default:
        return null;
    }
  };

  return (
    <section id="projects" className="section-padding bg-dark-light">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 gradient-text">Projects</h2>

        {/* Maturity Legend */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 glass-effect rounded-lg">
          <span className="text-sm text-gray-400 mr-2">Legend:</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-300">Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-xs text-gray-300">Beta (Testing/Might contain bugs)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-xs text-gray-300">Alpha (In development/Might contain bugs)</span>
          </div>
        </div>

        {/* Global Health Warning */}
        {Object.values(healthStatus).some(status => status === false) && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            <p className="flex items-center gap-2">
              Demos require backend services and some of them are currently unavailable. You can still explore the project details and source code.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full transition-all ${
                filter === cat
                  ? 'bg-gradient-to-r from-primary to-secondary'
                  : 'glass-effect hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredProjects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-effect rounded-xl overflow-hidden group flex flex-col h-full"
            >
              <Link to={`/projects/${project.slug || project._id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {healthStatus[project._id] === false && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full backdrop-blur-sm z-10">
                      Demo Unavailable
                    </span>
                  )}
                  {getMaturityBadge(project.maturity)}
                </div>
              </Link>

              <div className="p-4 sm:p-6 flex flex-col flex-1">
                <Link to={`/projects/${project.slug || project._id}`}>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-2">{project.description}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary/20 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>

                <div className="flex gap-3 sm:gap-4 mt-auto">
                  <Link
                    to={`/projects/${project.slug || project._id}`}
                    className="flex-1 text-center px-3 py-1.5 sm:px-4 sm:py-2 bg-primary rounded-lg hover:bg-primary/80 transition-colors text-sm sm:text-base"
                  >
                    Details
                  </Link>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2 glass-effect rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Github size={18} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        <div className="mt-10 glass-effect rounded-xl p-4 sm:p-6 text-gray-300 text-sm sm:text-base">
          More projects are on the way. Some are already finished, but they need a clean website version before going live.
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;

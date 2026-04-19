import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ExternalLink, Github } from 'lucide-react';
import axios from 'axios';
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
            await axios.get(project.healthCheckUrl, { timeout: 5000 });
            return { id: project._id, isHealthy: true };
          } catch (error) {
            console.warn(`Health check failed for ${project.title}`);
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
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback sur des données statiques en cas d'erreur
        const demoProjects: Project[] = [
          {
            _id: '1',
            title: 'Solveur de Sudoku Optimisé',
            description: 'Algorithme avancé de résolution de Sudoku avec backtracking optimisé',
            longDescription: 'Un solveur de Sudoku performant utilisant des techniques d\'optimisation avancées et du backtracking intelligent pour résoudre n\'importe quelle grille.',
            technologies: ['Python', 'Algorithmes', 'Optimisation'],
            imageUrl: '/images/projects/sudoku.jpg',
            bannerUrl: '/images/projects/sudoku-banner.jpg',
            githubUrl: 'https://github.com/Strikeshyni/SudokuSolver_optimisation',
            category: 'other',
            featured: true,
            interactive: true,
            interactivePath: '/projects/sudoku-solver',
            healthCheckUrl: '/sudoku/api/sudoku/health',
            maturity: 'stable',
            createdAt: new Date(),
          },
          {
            _id: '2',
            title: 'Chatbot IA',
            description: 'Assistant conversationnel intelligent avec apprentissage automatique',
            longDescription: 'Un chatbot IA capable de comprendre et répondre de manière contextuelle aux questions des utilisateurs.',
            technologies: ['Python', 'NLP', 'Machine Learning', 'React'],
            imageUrl: '/images/projects/chatbot.jpg',
            bannerUrl: '/images/projects/chatbot-banner.jpg',
            category: 'ai',
            featured: true,
            interactive: true,
            interactivePath: '/projects/chatbot',
            healthCheckUrl: '/chatbot/health',
            maturity: 'beta',
            createdAt: new Date(),
          },
          {
            _id: '4',
            title: 'Classification de Champignons',
            description: 'Modèle CNN avec prédiction conforme pour classifier 169 espèces de champignons',
            longDescription: 'Projet de Deep Learning appliquant la prédiction conforme à la classification de champignons.',
            technologies: ['Python', 'PyTorch', 'Deep Learning', 'React'],
            imageUrl: '/images/projects/mushroom.jpg',
            bannerUrl: '/images/projects/mushroom-banner.jpg',
            category: 'ai',
            featured: true,
            interactive: true,
            interactivePath: '/projects/mushroom-classifier',
            healthCheckUrl: '/mushroom/health',
            maturity: 'alpha',
            createdAt: new Date(),
          },
          {
            _id: '3',
            title: 'Portfolio Dynamique',
            description: 'Site portfolio moderne avec animations et effets de scroll',
            longDescription: 'Un portfolio moderne et performant avec des animations fluides et une architecture modulaire.',
            technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
            imageUrl: '/images/projects/portfolio.jpg',
            bannerUrl: '/images/projects/portfolio-banner.jpg',
            category: 'web',
            featured: true,
            maturity: 'stable',
            createdAt: new Date(),
          },
        ];
        setProjects(demoProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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
        return <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Bêta</span>;
      case 'alpha':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-orange-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Alpha</span>;
      case 'deprecated':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-red-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Obsolète</span>;
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
        <h2 className="text-5xl font-bold mb-12 gradient-text">Projets</h2>

        {/* Maturity Legend */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 glass-effect rounded-lg">
          <span className="text-sm text-gray-400 mr-2">Légende :</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-300">Stable (Production)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-xs text-gray-300">Bêta (Test/Peu contenir des bugs)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-xs text-gray-300">Alpha (Dev/Peu contenir des bugs/Projet volontairement incomplet)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-xs text-gray-300">Obsolète (Projet volontairement incomplet/Non maintenu)</span>
          </div>
        </div>

        {/* Global Health Warning */}
        {Object.values(healthStatus).some(status => status === false) && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Les démos requièrent des serveurs pour tourner et certaines sont donc indisponibles pour le moment.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full transition-all ${
                filter === cat
                  ? 'bg-gradient-to-r from-primary to-secondary'
                  : 'glass-effect hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
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
              <Link to={`/project/${project._id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {healthStatus[project._id] === false && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full backdrop-blur-sm z-10">
                      Démo Indisponible
                    </span>
                  )}
                  {getMaturityBadge(project.maturity)}
                </div>
              </Link>

              <div className="p-6 flex flex-col flex-1">
                <Link to={`/project/${project._id}`}>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-2">{project.description}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      {new Date(project.createdAt).toLocaleDateString('fr-FR', {
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

                <div className="flex gap-4 mt-auto">
                  <Link
                    to={`/project/${project._id}`}
                    className="flex-1 text-center px-4 py-2 bg-primary rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Détails
                  </Link>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 glass-effect rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Github size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </motion.div>
    </section>
  );
};

export default Projects;

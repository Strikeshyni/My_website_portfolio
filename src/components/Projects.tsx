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
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6 flex flex-col flex-1">
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

                <div className="flex gap-4 mt-4">
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

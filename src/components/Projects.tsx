import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { ProjectContext } from '../context/ProjectContext';

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 1. Correctly consume the context
  const context = useContext(ProjectContext);

  // 2. Handle null check (since context can be null)
  if (!context) return null; 

  const { projects, loading, healthStatus } = context;

  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'web', 'ai', 'other'];
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const getMaturityBadge = (maturity?: string) => {
    switch (maturity) {
      case 'stable':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-green-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Stable</span>;
      case 'beta':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Beta</span>;
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
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-300">Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-xs text-gray-300">Beta (Testing/Might contain bugs)</span>
          </div>
        </div>

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
                  {healthStatus[project._id] && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-green-600/90 text-white text-xs font-bold rounded-full backdrop-blur-sm z-10">
                      Demo Available
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
                      {(Array.isArray(project.technologies) ? project.technologies : [])
                        .slice(0, 3)
                        .map((tech) => (
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

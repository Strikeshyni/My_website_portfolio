import { useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { ProjectContext } from '../context/ProjectContext';
import { Project } from '../types';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // 1. Consume context
  const context = useContext(ProjectContext);

  // 2. Handle the null context case for TypeScript
  if (!context) {
    return null; // Or a generic error message
  }

  const { projects, loading: contextLoading, healthStatus } = context;

  // 3. Find project and type the parameter 'p'
  const project = projects.find((p: Project) => p.slug === slug);

  // 4. Determine health status from the context dictionary using the project ID
  const isHealthy = project ? healthStatus[project._id] : null;

  const handleBackToProjects = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getMaturityBadge = (maturity?: string) => {
    switch (maturity) {
      case 'stable':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-green-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Stable</span>;
      case 'beta':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Beta</span>;
      case 'alpha':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-orange-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Alpha</span>;
      case 'deprecated':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-red-500/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">Deprecated</span>;
      default:
        return null;
    }
  };

  if (contextLoading) {
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

  return (
    <div className="min-h-screen bg-dark">
      <div className="section-padding">
        <button
          onClick={handleBackToProjects}
          className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-8 cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft size={20} />
          Back to projects
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Health Warning Banner */}
          {isHealthy === false && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
              <p className="flex items-center gap-2">
                Note: The demo for this project is currently unavailable (Backend service offline).
              </p>
            </div>
          )}

          {/* Banner */}
          <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-12">
            <img
              src={project.bannerUrl || project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{project.title}</h1>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-primary/20 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {getMaturityBadge(project.maturity)}
            
            <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 left-4 sm:left-auto flex flex-wrap justify-end gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-dark/80 backdrop-blur-sm border border-primary/50 rounded-lg hover:bg-primary/20 hover:border-primary transition-all"
                >
                  <Github size={20} />
                  <span className="hidden sm:inline">Source code</span>
                </a>
              )}

              {project.interactive && project.interactivePath && (
                project.demoEnabled === false ? (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-lg cursor-not-allowed text-red-400"
                  >
                    <ExternalLink size={20} />
                    <span className="hidden sm:inline">Demo Disabled</span>
                  </button>
                ) : isHealthy === false ? (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-lg cursor-not-allowed text-red-400"
                  >
                    <ExternalLink size={20} />
                    <span className="hidden sm:inline">Demo Offline</span>
                  </button>
                ) : (
                  <Link
                    to={project.interactivePath}
                    className="flex items-center gap-2 px-4 py-2 bg-dark/80 backdrop-blur-sm border border-secondary/50 rounded-lg hover:bg-secondary/20 hover:border-secondary transition-all"
                  >
                    <ExternalLink size={20} />
                    <span className="hidden sm:inline">Try Demo</span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert max-w-none">
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed whitespace-pre-line">
                {project.longDescription}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import axios from 'axios';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const hasFetched = useRef(false);

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

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProject = async () => {
      try {
        if (!slug || slug === 'undefined') {
          setProject(null);
          return;
        }

        const response = await axios.get(`/api/projects/slug/${slug}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (!project?.healthCheckUrl) return;

    const checkHealth = async () => {
      try {
        const response = await axios.get(project.healthCheckUrl!, { timeout: 5000 });
        // Verify that we didn't get the HTML fallback page
        const isHtml = typeof response.data === 'string' && response.data.trim().startsWith('<!doctype html>');
        if (isHtml) {
            throw new Error('Received HTML instead of JSON');
        }
        setIsHealthy(true);
      } catch (error) {
        console.warn('Health check failed:', error);
        setIsHealthy(false);
      }
    };

    const timeout = setTimeout(() => {
      checkHealth();
    }, 300);

    return () => clearTimeout(timeout);
  }, [project]);

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
                This project demo needs a GPU, and sadly my wallet is still in beta mode :)
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
            <div className="absolute bottom-0 left-0 p-4 sm:p-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{project.title}</h1>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
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
            
            {/* Boutons en bas à droite */}
            <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 left-4 sm:left-auto flex flex-wrap justify-end gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-dark/80 backdrop-blur-sm border border-primary/50 rounded-lg hover:bg-primary/20 hover:border-primary transition-all"
                  title="Source code"
                >
                  <Github size={20} />
                  <span className="hidden sm:inline">Source code</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-dark/80 backdrop-blur-sm border border-secondary/50 rounded-lg hover:bg-secondary/20 hover:border-secondary transition-all"
                  title="View project"
                >
                  <ExternalLink size={20} />
                  <span className="hidden sm:inline">Demo</span>
                </a>
              )}
              {project.interactive && project.interactivePath && (
                project.demoEnabled === false ? (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-lg cursor-not-allowed text-red-400"
                    title="Demo disabled"
                  >
                    <ExternalLink size={20} />
                    <span className="hidden sm:inline">Demo Disabled</span>
                  </button>
                ) : isHealthy === false ? (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-lg cursor-not-allowed text-red-400"
                    title="Demo unavailable"
                  >
                    <ExternalLink size={20} />
                    <span className="hidden sm:inline">Demo Unavailable</span>
                  </button>
                ) : (
                  <Link
                    to={project.interactivePath}
                    className="flex items-center gap-2 px-4 py-2 bg-dark/80 backdrop-blur-sm border border-secondary/50 rounded-lg hover:bg-secondary/20 hover:border-secondary transition-all"
                    title="Interactive demo"
                  >
                    <ExternalLink size={20} />
                    <span className="hidden sm:inline">Demo</span>
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

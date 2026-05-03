import { useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { ProjectContext } from '../context/ProjectContext';
import { Project } from '../types';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from '../utils/langage_switcher';

const ProjectDetail = () => {
  const { t, i18n } = useTranslation();
  const isFr = i18n.language.startsWith('fr');
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const context = useContext(ProjectContext);

  if (!context) {
    return null;
  }

  const { projects, loading: contextLoading, healthStatus } = context;

  const project = projects.find((p: Project) => p.slug === slug);

  const isHealthy = project ? healthStatus[project._id] : null;

  // Localized Data extraction
  const currentTitle = project ? (isFr ? project.titleFr : project.title) : '';
  const currentLongDescription = project ? (isFr ? project.longDescriptionFr : project.longDescription) : '';
  const currentDetails = project ? (isFr ? project.detailsFr : project.details) : null;
  const currentTechs = project ? (isFr ? project.technologiesFr : project.technologies) : [];

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
      default:
        return null;
    }
  };

  const ProjectAbout = ({ details }: { details: any }) => (
    <div className="bg-dark-light p-6 rounded-2xl border border-white/10 shadow-lg">
      <h2 className="text-2xl font-bold mt-2 text-center">{t("about_project")}</h2>
      <p className="text-gray-300 leading-relaxed mb-4">{details.why}</p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
        <div><strong>{t("context")}:</strong> {details.context}</div>
        <div><strong>{t("duration")}:</strong> {details.duration}</div>
        <div><strong>{t("team")}:</strong> {details.team}</div>
        <div><strong>{t("role")}:</strong> {details.role}</div>
      </div>
    </div>
  );

  const ProjectTech = ({ description }: { description?: string }) => (
    <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/10 shadow-lg">
      <h2 className="text-2xl font-bold mt-2 text-center text-primary">{t("technical_details")}</h2>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {description || ""}
      </ReactMarkdown>
    </div>
  );

  const ProjectInsights = ({ details }: {details :any}) => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20">
        <h3 className="text-xl font-bold mt-1 text-center text-green-500">{t("what_i_learned")}</h3>
        <ul className="space-y-2 text-gray-300">
          {details.learnings.map((l:any, i:any) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>

      <div className="bg-yellow-900/10 p-6 rounded-2xl border border-yellow-500/20">
        <h3 className="text-xl font-bold mt-1 text-center text-yellow-500">{t("future_improvements")}</h3>
        <ul className="space-y-2 text-gray-300">
          {details.improvements.map((l:any, i:any) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );

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
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToProjects}
            className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft size={20} />
            {t("back_to_projects")}
          </button>
          <span className="ml-auto align-center">
            <LanguageSwitcher />
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Health Warning Banner */}
          {isHealthy === false && (
            <div className="mb-8 p-4 bg-red-900/20 border border-orange-500/50 rounded-lg text-orange-200">
              <p className="flex items-center gap-2">
                {t("demo_unavailable_message")}
              </p>
            </div>
          )}

          {/* Banner */}
          <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-12">
            <img
              src={project.bannerUrl || project.imageUrl}
              alt={currentTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{currentTitle}</h1>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                {new Date(project.createdAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentTechs.map((tech: string) => (
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
                  <span className="hidden sm:inline">{t("source_code")}</span>
                </a>
              )}

              {project.interactive && project.interactivePath && (
                project.demoEnabled === false ? (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-lg cursor-not-allowed text-red-400"
                  >
                    <ExternalLink size={20} />
                    <span className="hidden sm:inline">{t("demo_disabled")}</span>
                  </button>
                ) : isHealthy === false ? (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-lg cursor-not-allowed text-red-400"
                  >
                    <ExternalLink size={20} />
                    <span className="hidden sm:inline">{t("demo_offline")}</span>
                  </button>
                ) : (
                  <Link
                    to={project.interactivePath}
                    className="flex items-center gap-2 px-4 py-2 bg-dark/80 backdrop-blur-sm border border-secondary/50 rounded-lg hover:bg-secondary/20 hover:border-secondary transition-all"
                  >
                    <ExternalLink size={20} />
                    <span className="hidden sm:inline">{t("try_demo")}</span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="space-y-12">
              <ProjectAbout details={currentDetails} />
              <ProjectTech description={currentLongDescription} />
              <ProjectInsights details={currentDetails} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
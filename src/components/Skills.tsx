import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Code2, Brain, Wrench, Award, ExternalLink, 
  ChevronLeft, ChevronRight, Maximize2, Minimize2 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Certification {
  title: string;
  year: string;
  link: string;
  color: 'cyan' | 'purple' | 'emerald' | 'amber' | 'blue' | 'teal';
}

const Skills: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // États pour le carrousel
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // --- Données existantes ---
  const languages: string[] = ['Python', 'Java', 'JavaScript', 'TypeScript', 'C#', 'C', 'C++', 'SQL', 'HTML', 'OCaml', 'Lua'];
  const aiFrameworks: string[] = ['PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'NumPy', 'Pandas', 'Scikit-learn'];
  const dataFrameworks: string[] = ['MongoDB', 'PostgreSQL', 'MySQL', 'ElasticSearch', 'Neo4j', 'Redis', 'PySpark', 'Hadoop'];
  const deploymentandfrontend: string[] = ['FastAPI', 'Flask', 'Uvicorn', 'React', 'Angular', 'Vue', 'Tailwind CSS', 'Framer Motion'];
  const tools: string[] = ['Git', 'Docker', 'MLflow', 'S3', 'Kubernetes', 'Dataiku', 'MinIO', 'Jira', 'Markdown', 'LaTex'];
  const aiSkills: string[] = [
    'Machine Learning', 'Deep Learning', 'Reinforcement Learning', 
    'Natural Language Processing (NLP)', 
    'Computer Vision (OCR, Image Classification, Object Detection, etc.)', 
    'Generative AI (GANs, Diffusion Models)', 'Time Series Analysis', 
    'Anomaly Detection', 'Recommendation Systems'
  ];
  const dataSkills: string[] = [
    'Data Pipelines', 'Feature Engineering', 'Statistical Modeling', 
    'Experiment Tracking (MLflow, MinIO)', 'Data Version Control (DVC)', 
    'Multi-service Deployment (Kubernetes, Docker Compose)', 
    'Derive & retrain detections', 'CI/CD (GitHub Actions, GitLab CI/CD)', 
    'Monitoring (Prometheus, Grafana, Evidently)'
  ];

  // --- Certifications Dataiku ---
  const certifications: Certification[] = [
    { title: "Dataiku Developer", year: "2026", link: "https://verify.skilljar.com/c/gdu28ka7d467", color: "purple" },
    { title: "Dataiku Generative AI & Agentic Practitioner", year: "2026", link: "https://verify.skilljar.com/c/63hc45qu2jhr", color: "amber" },
    { title: "Dataiku MLOps Practitioner", year: "2026", link: "https://verify.skilljar.com/c/eymd7zpthufp", color: "emerald" },
    { title: "Dataiku ML Practitioner", year: "2026", link: "https://verify.skilljar.com/c/9yzj7jmu4bfz", color: "emerald" },
    { title: "Dataiku Advanced Designer", year: "2026", link: "https://verify.skilljar.com/c/4pbxkv9qeb6e", color: "blue" },
    { title: "Dataiku Core Designer", year: "2026", link: "https://verify.skilljar.com/c/kehj8at9yzrh", color: "blue" }
  ];

  const chipClass = 'px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors';

  const colorMap: Record<Certification['color'], { border: string; bg: string; text: string }> = {
    cyan: { border: "border-cyan-500/40", bg: "from-cyan-500/10", text: "text-cyan-400" },
    purple: { border: "border-purple-500/40", bg: "from-purple-500/10", text: "text-purple-300" },
    emerald: { border: "border-emerald-500/40", bg: "from-emerald-500/10", text: "text-emerald-400" },
    amber: { border: "border-amber-500/40", bg: "from-amber-500/10", text: "text-amber-300" },
    blue: { border: "border-blue-500/40", bg: "from-blue-500/10", text: "text-blue-400" },
    teal: { border: "border-teal-500/40", bg: "from-teal-500/10", text: "text-teal-300" }
  };

  // Auto-scroll pour le mode carrousel
  useEffect(() => {
    if (isExpanded || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % certifications.length);
    }, 4000); // Défilement toutes les 4 secondes

    return () => clearInterval(timer);
  }, [isExpanded, isPaused, certifications.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % certifications.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + certifications.length) % certifications.length);
  };

  const gridVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section id="skills" className="section-padding">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 gradient-text text-center">
          {t("skills")}
        </h2>

        <div className="space-y-10">

          {/* SECTION CERTIFICATIONS INTERACTIVE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-effect p-6 sm:p-8 rounded-2xl relative overflow-hidden"
          >
            {/* Header section avec bouton "Tout voir / Agrandir" */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-cyan-400">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{t("certifications.title")}</h3>
                </div>
              </div>

              {/* Contrôles : Navigation Carrousel + Bouton Agrandir/Tout voir */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                {!isExpanded && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                      aria-label="Next"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}

                {/* Bouton Toggle mode "Tout voir" (Agrandir la grille) */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-medium transition-all"
                >
                  {isExpanded ? (
                    <>
                      <Minimize2 size={16} />
                      <span>{t("certifications.carouselView")}</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 size={16} />
                      <span>{t("certifications.showAll")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* VUE 1 : Mode Carrousel Auto-Scrollable (Défaut) */}
            {!isExpanded && (
              <div 
                className="relative min-h-[190px] sm:min-h-[160px] flex items-center"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full"
                  >
                    {(() => {
                      const cert = certifications[currentIndex];
                      const style = colorMap[cert.color];
                      return (
                        <div className={`p-5 sm:p-6 rounded-xl border ${style.border} bg-gradient-to-r ${style.bg} to-black/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between sm:justify-start gap-4">
                              <div className="flex items-center gap-2">
                                <img 
                                  src="/images/dataiku.png" 
                                  alt="Dataiku Logo" 
                                  className="h-7 w-auto hidden sm:block opacity-90"
                                />
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                                  Dataiku • {cert.year}
                                </span>
                              </div>
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold text-white">
                              {cert.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-4">
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-medium transition-all group shrink-0"
                            >
                              <span>{t("certifications.verify")}</span>
                              <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Puces d'indications pour le carrousel */}
            {!isExpanded && (
              <div className="flex justify-center items-center gap-2 mt-6">
                {certifications.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-8 bg-cyan-400'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* VUE 2 : Mode Grille Agrandie ("Tout voir d'un coup" avec Zoom au survol) */}
            {isExpanded && (
              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2"
              >
                {certifications.map((cert, index) => {
                  const style = colorMap[cert.color];
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -4 }} // Effet Zoom & Lift
                      transition={{ duration: 0.2 }}
                      className={`p-5 rounded-xl border ${style.border} bg-gradient-to-br ${style.bg} to-black/40 backdrop-blur-md flex flex-col justify-between gap-4 group cursor-pointer`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img 
                              src="/images/dataiku.png" 
                              alt="Dataiku Logo" 
                              className="h-5 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <span className="text-xs font-semibold text-gray-300">Dataiku • {cert.year}</span>
                          </div>
                        </div>
                        <h4 className="text-base font-bold text-white leading-snug">
                          {cert.title}
                        </h4>
                      </div>

                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-medium transition-all group shrink-0 w-full"
                      >
                        <span>{t("certifications.verify")}</span>
                        <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

          </motion.div>

          {/* Programming */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
            transition={{ duration: 0.6 }} 
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="text-primary" size={26} />
              <h3 className="text-xl sm:text-2xl font-bold">{t("programming")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((item) => (
                <span key={item} className={`${chipClass} bg-primary/10 text-primary border-primary/30`}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Frameworks */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
            transition={{ duration: 0.6, delay: 0.1 }} 
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain className="text-secondary" size={26} />
              <h3 className="text-xl sm:text-2xl font-bold">{t("technologies")}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">AI / ML</p>
                <div className="flex flex-wrap gap-2">
                  {aiFrameworks.map((item) => (
                    <span key={item} className={`${chipClass} bg-secondary/10 text-secondary border-secondary/30`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Data</p>
                <div className="flex flex-wrap gap-2">
                  {dataFrameworks.map((item) => (
                    <span key={item} className={`${chipClass} bg-secondary/10 text-secondary border-secondary/30`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Backend / Frontend</p>
                <div className="flex flex-wrap gap-2">
                  {deploymentandfrontend.map((item) => (
                    <span key={item} className={`${chipClass} bg-secondary/10 text-secondary border-secondary/30`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tools */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="text-accent" size={26} />
              <h3 className="text-xl sm:text-2xl font-bold">{t("tools and environment")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((item) => (
                <span key={item} className={`${chipClass} bg-accent/10 text-accent border-accent/30`}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Expertise */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
            transition={{ duration: 0.6, delay: 0.3 }} 
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-4">{t("ai expertise")}</h3>
              <ul className="space-y-2 text-gray-300">
                {aiSkills.map((skill) => (
                  <li key={skill} className="text-xs sm:text-sm">• {skill}</li>
                ))}
              </ul>
            </div>
            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-secondary mb-4">{t("MLOps / DevOps expertise")}</h3>
              <ul className="space-y-2 text-gray-300">
                {dataSkills.map((skill) => (
                  <li key={skill} className="text-xs sm:text-sm">• {skill}</li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default Skills;
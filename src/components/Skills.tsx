import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Brain, Wrench } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useTheme } from '../context/ThemeContext';

const Skills = () => {
  const { t } = useTranslation();
  const { visual } = useTheme();
  const isClassic = visual === 'classic';
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Core programming
  const languages = [
    'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'C', 'OCaml', 'Lua'
  ];

  // AI / Data frameworks
  const aiFrameworks = [
    'PyTorch', 'TensorFlow', 'Keras', 'OpenCV'
  ];

  const dataFrameworks = [
    'MongoDB', 'PostgreSQL', 'PySpark'
  ];

  // Backend / Frontend
  const deploymentandfrontend = [
    'FastAPI', 'Flask', 'Uvicorn', 'React', 'Angular', 'Vue', 'Tailwind CSS', 'Framer Motion'
  ];

  // Tools
  const tools = [
    'Git', 'Docker', 'MLflow', 'AWS', 'VS Code', 'PyCharm', 'IntelliJ', 'Jira', 'Agile Scrum', 'Markdown', 'LaTex'
  ];

  // AI expertise
  const aiSkills = [
    'Machine Learning',
    'Deep Learning',
    'Reinforcement Learning',
    'Natural Language Processing (NLP)',
    'Computer Vision (OCR, Image Classification, Object Detection, etc.)',
    'Generative AI (GANs, Diffusion Models)',
    'Anomaly Detection',
    'Recommendation Systems'
  ];

  // Data / MLOps
  const dataSkills = [
    'Data Pipelines',
    'Feature Engineering',
    'Data Cleaning & Preprocessing',
    'Statistical Modeling',
    'Forecasting & Time Series',
    'Experiment Tracking',
    'MLOps & Model Deployment'
  ];

  const chipClass = 'px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors';
  const cardClass = isClassic ? 'glass-effect' : 'card-surface';

  return (
    <section id="skills" className="section-padding">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 gradient-text text-center">{t("skills")}</h2>

        <div className="space-y-10">

          {/* Programming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className={`${cardClass} p-6 rounded-2xl`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Code2 className={isClassic ? 'text-primary' : 'text-accent'} size={26} />
              <h3 className="text-xl sm:text-2xl font-bold">{t("programming")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((item) => (
                <span
                  key={item}
                  className={isClassic ? `${chipClass} bg-primary/10 text-primary border-primary/30` : `${chipClass} chip`}
                >
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
            className={`${cardClass} p-6 rounded-2xl`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain className={isClassic ? 'text-secondary' : 'text-accent-2'} size={26} />
              <h3 className="text-xl sm:text-2xl font-bold">{t("technologies")}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className={isClassic ? 'text-sm text-gray-400 mb-2' : 'text-sm text-subtle mb-2'}>AI / ML</p>
                <div className="flex flex-wrap gap-2">
                  {aiFrameworks.map((item) => (
                    <span
                      key={item}
                      className={isClassic ? `${chipClass} bg-secondary/10 text-secondary border-secondary/30` : `${chipClass} chip-secondary`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

                            <div>
                <p className={isClassic ? 'text-sm text-gray-400 mb-2' : 'text-sm text-subtle mb-2'}>Data</p>
                <div className="flex flex-wrap gap-2">
                  {dataFrameworks.map((item) => (
                    <span
                      key={item}
                      className={isClassic ? `${chipClass} bg-secondary/10 text-secondary border-secondary/30` : `${chipClass} chip-secondary`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className={isClassic ? 'text-sm text-gray-400 mb-2' : 'text-sm text-subtle mb-2'}>Backend / Frontend</p>
                <div className="flex flex-wrap gap-2">
                  {deploymentandfrontend.map((item) => (
                    <span
                      key={item}
                      className={isClassic ? `${chipClass} bg-secondary/10 text-secondary border-secondary/30` : `${chipClass} chip-secondary`}
                    >
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
            className={`${cardClass} p-6 rounded-2xl`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Wrench className={isClassic ? 'text-accent' : 'text-accent-3'} size={26} />
              <h3 className="text-xl sm:text-2xl font-bold">{t("tools and environment")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((item) => (
                <span
                  key={item}
                  className={isClassic ? `${chipClass} bg-accent/10 text-accent border-accent/30` : `${chipClass} chip-accent`}
                >
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
            <div className={`${cardClass} p-6 rounded-2xl`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-4 ${isClassic ? 'text-primary' : 'text-accent'}`}>
                {t("ai expertise")}
              </h3>
              <ul className={`space-y-2 ${isClassic ? 'text-gray-300' : 'text-muted'}`}>
                {aiSkills.map((skill) => (
                  <li key={skill} className="text-xs sm:text-sm">• {skill}</li>
                ))}
              </ul>
            </div>

            <div className={`${cardClass} p-6 rounded-2xl`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-4 ${isClassic ? 'text-secondary' : 'text-accent-2'}`}>
                {t("data and mlops")}
              </h3>
              <ul className={`space-y-2 ${isClassic ? 'text-gray-300' : 'text-muted'}`}>
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
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Brain, Wrench } from 'lucide-react';

const Skills = () => {
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

  // Backend / Data engineering
  const backendFrameworks = [
    'FastAPI', 'Flask', 'Uvicorn', 'PySpark'
  ];

  // Frontend
  const frontend = [
    'React', 'Angular', 'Vue', 'Tailwind CSS', 'Framer Motion'
  ];

  // Tools
  const tools = [
    'Git', 'Docker', 'MLflow', 'AWS', 'VS Code', 'PyCharm', 'IntelliJ', 'Jira', 'LaTex'
  ];

  // AI expertise
  const aiSkills = [
    'Machine Learning',
    'Deep Learning',
    'Reinforcement Learning',
    'Natural Language Processing (NLP)',
    'Computer Vision (OCR)',
    'Generative AI',
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

  return (
    <section id="skills" className="section-padding">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 gradient-text text-center">Skills</h2>

        <div className="space-y-10">

          {/* Programming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="text-primary" size={26} />
              <h3 className="text-xl sm:text-2xl font-bold">Programming</h3>
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
              <h3 className="text-xl sm:text-2xl font-bold">Technologies</h3>
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
                <p className="text-sm text-gray-400 mb-2">Backend & Data</p>
                <div className="flex flex-wrap gap-2">
                  {backendFrameworks.map((item) => (
                    <span key={item} className={`${chipClass} bg-secondary/10 text-secondary border-secondary/30`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Frontend</p>
                <div className="flex flex-wrap gap-2">
                  {frontend.map((item) => (
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
              <h3 className="text-xl sm:text-2xl font-bold">Tools & Environment</h3>
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
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-4">AI Expertise</h3>
              <ul className="space-y-2 text-gray-300">
                {aiSkills.map((skill) => (
                  <li key={skill} className="text-xs sm:text-sm">• {skill}</li>
                ))}
              </ul>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-secondary mb-4">Data & MLOps</h3>
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
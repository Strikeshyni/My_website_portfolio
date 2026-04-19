import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Brain, Database, Wrench } from 'lucide-react';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const languages = ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'C', 'OCaml', 'Lua'];
  const frameworks = ['PyTorch', 'TensorFlow', 'Keras', 'OpenCV', 'PySpark', 'React', 'FastAPI', 'Flask'];
  const tools = ['VS Code', 'PyCharm', 'IntelliJ', 'Git', 'Docker', 'Unity', 'MLflow', 'Jira', 'Agile/Scrum'];

  const aiSkills = [
    'Machine Learning',
    'Deep Learning',
    'Reinforcement Learning',
    'Natural Language Processing (NLP)',
    'Computer Vision (OCR)',
    'MLOps & Model Deployment',
    'Time Series Analysis',
    'Generative AI',
    'Anomaly Detection',
    'Recommendation Systems',
  ];

  const dataSkills = [
    'Big Data',
    'Analytics',
    'Data Visualization',
    'Statistical Modeling',
    'Feature Engineering',
    'Data Cleaning & Preprocessing',
    'A/B Testing',
    'Forecasting',
    'Data Pipelines',
    'Experiment Tracking',
  ];
  const chipClass = 'px-3 py-1.5 rounded-full text-sm border transition-colors';

  return (
    <section id="skills" className="section-padding">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-5xl font-bold mb-12 gradient-text text-center">Skills</h2>

        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="text-primary" size={26} />
              <h3 className="text-2xl font-bold">Programming Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((item) => (
                <span key={item} className={`${chipClass} bg-primary/10 text-primary border-primary/30 hover:bg-primary/20`}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-secondary" size={26} />
              <h3 className="text-2xl font-bold">Frameworks & Libraries</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {frameworks.map((item) => (
                <span key={item} className={`${chipClass} bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20`}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="text-accent" size={26} />
              <h3 className="text-2xl font-bold">Tools & Delivery</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((item) => (
                <span key={item} className={`${chipClass} bg-accent/10 text-accent border-accent/30 hover:bg-accent/20`}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="glass-effect p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-primary" size={24} />
                <h3 className="text-xl font-bold text-primary">Artificial Intelligence</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                {aiSkills.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-secondary" size={24} />
                <h3 className="text-xl font-bold text-secondary">Data Science</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                {dataSkills.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-secondary" />
                    {skill}
                  </li>
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

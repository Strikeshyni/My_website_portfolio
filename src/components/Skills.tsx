import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Brain, Database, Wrench } from 'lucide-react';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Langages de programmation avec tailles variées pour effet nuage
  const languages = [
    { name: 'Python', size: 'large', color: 'primary' },
    { name: 'Java', size: 'large', color: 'primary' },
    { name: 'C++', size: 'large', color: 'primary' },
    { name: 'JavaScript', size: 'large', color: 'primary' },
    { name: 'C', size: 'large', color: 'primary' },
    { name: 'OCaml', size: 'large', color: 'primary' },
    { name: 'Lua', size: 'large', color: 'primary' },
  ];

  // Frameworks & Bibliothèques
  const frameworks = [
    { name: 'PyTorch', size: 'large', color: 'secondary' },
    { name: 'TensorFlow', size: 'large', color: 'secondary' },
    { name: 'Keras', size: 'large', color: 'secondary' },
    { name: 'OpenCV', size: 'large', color: 'secondary' },
    { name: 'PySpark', size: 'large', color: 'secondary' },
    { name: 'React', size: 'large', color: 'secondary' },
  ];

  // Outils
  const tools = [
    { name: 'VS Code', size: 'large', color: 'accent' },
    { name: 'PyCharm', size: 'large', color: 'accent' },
    { name: 'IntelliJ', size: 'large', color: 'accent' },
    { name: 'Git', size: 'large', color: 'accent' },
    { name: 'Vim', size: 'large', color: 'accent' },
    { name: 'Unity', size: 'large', color: 'accent' }
  ];

  // Compétences en IA & Data (format textuel)
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
  ];

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'large':
        return 'text-2xl md:text-3xl px-6 py-3';
      case 'medium':
        return 'text-lg md:text-xl px-5 py-2.5';
      case 'small':
        return 'text-base md:text-lg px-4 py-2';
      default:
        return 'text-lg px-4 py-2';
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20';
      case 'accent':
        return 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/20';
      default:
        return 'bg-primary/10 text-primary border-primary/30';
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
        <h2 className="text-5xl font-bold mb-16 gradient-text text-center">Compétences</h2>

        {/* Langages de Programmation - Nuage de tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="text-primary" size={32} />
            <h3 className="text-3xl font-bold">Langages de Programmation</h3>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {languages.map((lang, idx) => (
              <motion.span
                key={lang.name}
                className={`${getSizeClass(lang.size)} ${getColorClass(lang.color)} 
                  border-2 rounded-full font-bold transition-all cursor-default
                  shadow-lg hover:shadow-xl`}
              >
                {lang.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Frameworks & Bibliothèques */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Brain className="text-secondary" size={32} />
            <h3 className="text-3xl font-bold">Frameworks & Bibliothèques</h3>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {frameworks.map((framework, idx) => (
              <motion.span
                key={framework.name}
                className={`${getSizeClass(framework.size)} ${getColorClass(framework.color)} 
                  border-2 rounded-full font-bold transition-all cursor-default
                  shadow-lg hover:shadow-xl`}
              >
                {framework.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Outils & Environnements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="text-accent" size={32} />
            <h3 className="text-3xl font-bold">Outils & Environnements</h3>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {tools.map((tool, idx) => (
              <motion.span
                key={tool.name}
                className={`${getSizeClass(tool.size)} ${getColorClass(tool.color)} 
                  border-2 rounded-full font-bold transition-all cursor-default
                  shadow-lg hover:shadow-xl`}
              >
                {tool.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Compétences IA & Data - Format textuel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Intelligence Artificielle */}
          <div className="glass-effect p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-primary" size={28} />
              <h3 className="text-2xl font-bold text-primary">Intelligence Artificielle</h3>
            </div>
            <ul className="space-y-3">
              {aiSkills.map((skill, idx) => (
                <motion.li
                  key={skill}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.9 + idx * 0.1 }}
                  className="flex items-center gap-3 text-gray-300 text-lg"
                >
                  <span className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
                  {skill}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Data Science */}
          <div className="glass-effect p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-secondary" size={28} />
              <h3 className="text-2xl font-bold text-secondary">Data Science</h3>
            </div>
            <ul className="space-y-3">
              {dataSkills.map((skill, idx) => (
                <motion.li
                  key={skill}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 1.0 + idx * 0.1 }}
                  className="flex items-center gap-3 text-gray-300 text-lg"
                >
                  <span className="w-2 h-2 bg-gradient-to-r from-secondary to-accent rounded-full"></span>
                  {skill}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Skills;

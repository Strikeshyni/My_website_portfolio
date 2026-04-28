import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="section-padding bg-dark-light">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 gradient-text">About</h2>

        <div className="space-y-6 text-base sm:text-lg text-gray-300">
          <p>
            I am an engineering student at EPITA Lyon, specialized in AI and graph-based systems.
            What drives me is a deep curiosity about the underlying logic of the world. How complex systems behave, how patterns emerge, and how intelligence can be modeled and replicated.
          </p>
          <p>
            Through my work, I explore how artificial intelligence can go beyond predictions and become a powerful tool to help humans understand problems, anticipate outcomes, and make better decisions.
            I learn by building. From machine learning models and optimization algorithms to full-stack AI applications, I constantly develop small and large projects to experiment, fail, and improve. This portfolio itself is part of that process.
          </p>

          <p>
            My interests span across machine learning, deep learning, NLP, computer vision, and data engineering, with a particular focus on designing end-to-end systems that are both robust and practical.
            I am especially interested in the future of AI systems that can reason, adapt, and assist humans in solving complex real-world challenges.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default About;

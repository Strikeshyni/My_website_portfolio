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
        <h2 className="text-5xl font-bold mb-12 gradient-text">À propos</h2>

        <div className="space-y-6 text-lg text-gray-300">
          <p>
            Étudiant ingénieur à EPITA Lyon, je me passionne pour l'algorithmie et l'intelligence 
            artificielle. Mes études et projets personnels m'ont permis de développer des compétences 
            solides dans de nombreux langages et technologies.
          </p>
          <p>
            Mon expertise couvre le Machine Learning, Deep Learning, Reinforcement Learning, 
            le traitement de données (Big Data, Data Visualization), ainsi que des domaines spécialisés comme 
            l'OCR, le NLP, la détection d'anomalies et l'opérationnel (MLOps, DevOps)
          </p>
          <p>
            J'aime résoudre des problèmes complexes à travers l'algorithmie et créer des solutions 
            innovantes. Mes projets vont de l'optimisation d'algorithmes aux applications d'IA.
            J'aime également me challenger en réalisant des défis sur CodinGame, LeetCode ou encore LeekWars.
          </p>
        </div>

        {/* <div className="grid md:grid-cols-3 gap-6 mt-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-effect p-6 rounded-xl text-center"
          >
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-gray-400">Projets réalisés en IA</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-effect p-6 rounded-xl text-center"
          >
            <div className="text-4xl font-bold text-secondary mb-2">10+</div>
            <div className="text-gray-400">Technologies maîtrisées</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-effect p-6 rounded-xl text-center"
          >
            <div className="text-4xl font-bold text-accent mb-2">100%</div>
            <div className="text-gray-400">Engagement qualité</div>
          </motion.div>
        </div> */}
      </motion.div>
    </section>
  );
};

export default About;

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowDown, Code2, Trophy } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 gradient-text">
            Abel Aubron
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl text-gray-300 mb-6 sm:mb-8">
            AI Engineer | EPITA Lyon
          </p>
          <p className="text-base sm:text-lg text-gray-400 mb-10 sm:mb-12 max-w-2xl mx-auto">
            Interested in the logic of complex systems and the use of AI to understand and solve real-world problems.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 sm:mb-12">
            <motion.a
              href="https://github.com/Strikeshyni"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover:bg-primary/20 transition-colors"
              title="GitHub"
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/abel-aubron/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover:bg-primary/20 transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a
              href="https://www.codingame.com/profile/490be14918211c1d61d97992a2bee96e2780386"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover:bg-secondary/20 transition-colors"
              title="CodinGame"
            >
              <Code2 size={24} />
            </motion.a>
            <motion.a
              href="https://leetcode.com/u/L_Strom/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover:bg-accent/20 transition-colors"
              title="LeetCode"
            >
              <Code2 size={24} />
            </motion.a>
                        <motion.a
              href="https://leekwars.com/farmer/90987"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover:bg-accent/20 transition-colors"
              title="LeekWars"
            >
              <Trophy size={24} />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover:bg-primary/20 transition-colors"
              title="Contact"
            >
              <Mail size={24} />
            </motion.a>
          </div>

          <motion.a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-base sm:text-lg font-semibold hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
          >
            Explore my projects
            <ArrowDown size={20} />
          </motion.a>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown size={32} className="text-gray-600" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

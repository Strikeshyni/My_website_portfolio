import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowDown, Code2, Trophy } from 'lucide-react';
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
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
          <p className="text-lg sm:text-2xl md:text-3xl text-muted mb-6 sm:mb-8">
            {t("hero_title")}
          </p>
          <p className="text-base sm:text-lg text-subtle mb-10 sm:mb-12 max-w-2xl mx-auto">
            {t("hero_sentence")}
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 sm:mb-12">
            <motion.a
              href="https://github.com/Strikeshyni"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover-accent-soft transition-colors"
              title="GitHub"
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/abel-aubron/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover-accent-soft transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a
              href="https://www.codingame.com/profile/490be14918211c1d61d97992a2bee96e2780386"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover-accent-soft transition-colors"
              title="CodinGame"
            >
              <Code2 size={24} />
            </motion.a>
            <motion.a
              href="https://leetcode.com/u/L_Strom/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover-accent-soft transition-colors"
              title="LeetCode"
            >
              <Code2 size={24} />
            </motion.a>
                        <motion.a
              href="https://leekwars.com/farmer/90987"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover-accent-soft transition-colors"
              title="LeekWars"
            >
              <Trophy size={24} />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.1 }}
              className="p-3 sm:p-4 glass-effect rounded-full hover-accent-soft transition-colors"
              title="Contact"
            >
              <Mail size={24} />
            </motion.a>
          </div>

          <motion.a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 btn-primary rounded-full text-base sm:text-lg font-semibold transition-transform"
            whileHover={{ scale: 1.05 }}
          >
            {t("hero_see_projects")}
            <ArrowDown size={20} strokeWidth={2} className="text-white" />
          </motion.a>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown size={32} strokeWidth={2} className="text-subtle" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

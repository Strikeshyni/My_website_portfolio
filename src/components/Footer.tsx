import { motion } from 'framer-motion';
import { Code2, Github, Linkedin, Mail, Trophy } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-light section-padding py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-2">Abel Aubron</h3>
            <p className="text-gray-400">Ingénieur & Développeur IA</p>
          </div>

          <div className="flex gap-6">
            <a
              href="https://github.com/Strikeshyni"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-effect rounded-full hover:bg-primary/20 transition-colors"
              title="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/abel-aubron/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-effect rounded-full hover:bg-primary/20 transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://www.codingame.com/profile/490be14918211c1d61d97992a2bee96e2780386"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-effect rounded-full hover:bg-secondary/20 transition-colors"
              title="CodinGame"
            >
              <Code2 size={24} />
            </a>
            <a
              href="https://leetcode.com/u/L_Strom/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-effect rounded-full hover:bg-accent/20 transition-colors"
              title="LeetCode"
            >
              <Trophy size={24} />
            </a>
            <a
              href="https://leekwars.com/farmer/90987"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-effect rounded-full hover:bg-accent/20 transition-colors"
              title="LeekWars"
            >
              <Trophy size={24} />
            </a>
            <a
              href="#contact"
              rel="noopener noreferrer"
              className="p-3 glass-effect rounded-full hover:bg-primary/20 transition-colors"
              title="Contact"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Abel Aubron. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

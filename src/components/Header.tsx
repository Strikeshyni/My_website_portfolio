import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../utils/langage_switcher';
import ThemeControls from './ThemeControls';

const Header = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: t("home"), href: '#home' },
    { label: t('about'), href: '#about' },
    { label: t('skills'), href: '#skills' },
    { label: t('projects'), href: '#projects' },
    { label: t('contact'), href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'glass-effect shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="section-padding py-1 sm:py-5 md:py-6 lg:py-8 [@media(max-height:700px)]:py-1">
        <div className="flex items-center justify-between">
          <a href="#home" className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">
            Abel Aubron
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted hover:text-strong transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-4">
              <ThemeControls />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 space-y-4"
          >
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-muted hover:text-strong transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-4">
              <ThemeControls />
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;

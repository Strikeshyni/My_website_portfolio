import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const switchLanguage = () => {
    i18n.changeLanguage(currentLang.startsWith('en') ? 'fr' : 'en');
  };

  return (
    <div className="flex items-center bg-blue/10 backdrop-blur-md rounded-full border border-white/10 shadow-lg w-max">
      <motion.button 
        whileHover={{ scale: 1.03 }} 
        className="flex" 
        onClick={switchLanguage}
      >
        <span className={`px-4 py-1.5 flex items-center justify-center rounded-full transition-all ${
          currentLang.startsWith("en")
            ? "bg-gradient-to-r from-primary to-secondary text-white"
            : "text-gray-300 hover:text-white"
        }`}>
          <img 
            src="https://flagcdn.com/w40/us.png" 
            alt="English" 
            className="w-5 h-auto rounded-sm object-cover" 
          />
        </span>
        <span className={`px-4 py-1.5 flex items-center justify-center rounded-full transition-all ${
          currentLang.startsWith("fr")
            ? "bg-gradient-to-r from-primary to-secondary text-white"
            : "text-gray-300 hover:text-white"
        }`}>
          <img 
            src="https://flagcdn.com/w40/fr.png" 
            alt="Français" 
            className="w-5 h-auto rounded-sm object-cover" 
          />
        </span>
      </motion.button>
    </div>
  );
};

export default LanguageSwitcher;
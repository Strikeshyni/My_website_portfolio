import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language;

  const switchLanguage = () => {
    i18n.changeLanguage(currentLang === 'en' ? 'fr' : 'en');
  };

  return (
      <div className="flex items-center bg-blue/10 backdrop-blur-md rounded-full border border-white/10 shadow-lg w-max">
        <motion.button whileHover={{ scale: 1.03 }} className="py-0.5" onClick={() => switchLanguage()}>
          <span className={`px-4 py-1.5 text-center rounded-full transition-all ${
            currentLang === "en"
              ? "bg-gradient-to-r from-primary to-secondary text-white"
              : "text-gray-300 hover:text-white"
          }`}>🇬🇧</span>
          <span className={`px-4 py-1.5 text-center rounded-full transition-all ${
            currentLang === "fr"
              ? "bg-gradient-to-r from-primary to-secondary text-white"
              : "text-gray-300 hover:text-white"
          }`}>🇫🇷</span>
        </motion.button>
      </div>
  );
};

export default LanguageSwitcher;
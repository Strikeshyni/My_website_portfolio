import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language;

  const switchLanguage = () => {
    i18n.changeLanguage(currentLang === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="flex items-center glass-effect rounded-full w-max">
      <motion.button whileHover={{ scale: 1.03 }} className="py-0.5" onClick={() => switchLanguage()}>
        <span className={`px-4 py-1.5 text-center rounded-full transition-all ${
          currentLang === "en"
            ? "btn-primary"
            : "text-muted hover:text-strong"
        }`}>
          🇬🇧
        </span>
        <span className={`px-4 py-1.5 text-center rounded-full transition-all ${
          currentLang === "fr"
            ? "btn-primary"
            : "text-muted hover:text-strong"
        }`}>
          🇫🇷
        </span>
      </motion.button>
    </div>
  );
};

export default LanguageSwitcher;
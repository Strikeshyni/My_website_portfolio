import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from "react-i18next";

const companies = [
  { name: "Aubay", logo: "/logos/logo_aubay.png", url: "https://www.aubay.com/" },
  { name: "EnnoAi", logo: "/logos/logo_ennoai.png", url: "https://www.enno.ai/" },
  { name: "CNS Communications", logo: "/logos/logo_cns_com.svg", url: "https://www.cns-com.com/" },
  { name: "Duguit Technologies", logo: "/logos/logo_duguit_technologies.png", url: "https://www.duguit-technologies.com/fr/" },
  { name: "Le Mas du Paradis", logo: "/logos/logo_le_mas_du_paradis.jpg", url: "https://lemasduparadispivat.wixsite.com/lemasduparadis-pivat" },
];

const About = () => {
  const { t } = useTranslation();
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
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 gradient-text">
          {t("about")}
        </h2>

        <div className="space-y-6 text-base sm:text-lg text-gray-300 text-justify leading-relaxed">
          <p>{t("about_content_1")}</p>
          <p>{t("about_content_2")}</p>
          <p>{t("about_content_3")}</p>
          <p>{t("about_content_4")}</p>
        </div>

        {/* Bouton Télécharger le CV - Centré sur tous les écrans */}
        <div className="mt-10 flex justify-center">
          <a
            href="/CV_Abel_AUBRON_2026_DATA_IA_web_version.pdf"
            download="CV_Abel_AUBRON_2026_web_version.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {t("download_cv")}
          </a>
        </div>

        {/* Nuage de logos - Logos agrandis */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold text-gray-400 text-center mb-8">
            {t("companies_title")}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {companies.map((company, index) => (
              <motion.a
                key={index}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="opacity-60 hover:opacity-100 hover:grayscale transition-all duration-300"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-20 sm:h-14 md:h-16 w-auto object-contain"
                />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
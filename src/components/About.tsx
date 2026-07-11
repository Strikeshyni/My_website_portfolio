import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="section-padding bg-page-alt">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 gradient-text">{t("about")}</h2>

        <div className="space-y-6 text-base sm:text-lg text-muted text-justify leading-relaxed">
          <p>
            {t("about_content_1")}
          </p>
          <p>
            {t("about_content_2")}
          </p>
          <p>
            {t("about_content_3")}
          </p>
          <p>
            {t("about_content_4")}
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default About;

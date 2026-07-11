// import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail } from 'lucide-react';
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="contact" className="section-padding">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 sm:mb-16 gradient-text text-center">{t("contact")}</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">{t("contact_reach_out")}</h3>
            <p className="text-subtle mb-6">
              {t("contact_message")}
            </p>

            <div className="space-y-4">
              <a href="mailto:abel.aubron@epita.fr" className="flex items-center gap-4">
                <div className="p-3 chip rounded-lg">
                  <Mail size={24} className="text-accent hover-accent-2" />
                </div>
                <div>
                  <p className="text-sm text-subtle">{t("contact_email")}</p>
                  <p className="text-strong link-accent">
                    abel.aubron@epita.fr
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;

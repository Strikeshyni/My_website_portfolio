import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Send } from 'lucide-react';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Simulation d'envoi - À remplacer par votre API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section-padding">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-5xl font-bold mb-16 gradient-text text-center">Contact</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">N'hésitez pas à me contacter</h3>
            <p className="text-gray-400 mb-6">
              Si vous avez un projet en tête ou souhaitez simplement échanger sur un sujet qui pourrait m'intéresser, 
              je serais ravi d'échanger avec vous.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Mail size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href="mailto:abelpong@gmail.com" className="text-white hover:text-primary">
                    abelpong@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm mb-2">
                Nom
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-dark-light border border-gray-700 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-dark-light border border-gray-700 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 bg-dark-light border border-gray-700 rounded-lg focus:border-primary focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'sending' ? (
                'Envoi en cours...'
              ) : status === 'sent' ? (
                'Message envoyé !'
              ) : (
                <>
                  Envoyer <Send size={20} />
                </>
              )}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-sm">
                Une erreur est survenue. Veuillez réessayer.
              </p>
            )}
          </form> */}
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;

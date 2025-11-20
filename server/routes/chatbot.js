import express from 'express';

const router = express.Router();

// Simple chatbot responses (à remplacer par une vraie IA)
const responses = {
  greeting: [
    "Bonjour ! Comment puis-je vous aider ?",
    "Salut ! Que puis-je faire pour vous ?",
    "Hello ! En quoi puis-je vous être utile ?"
  ],
  portfolio: [
    "Ce portfolio a été créé avec React, TypeScript et MongoDB. Il présente mes projets et compétences.",
    "Mon portfolio met en avant mes compétences en développement web, IA et optimisation d'algorithmes."
  ],
  skills: [
    "Je maîtrise React, TypeScript, Python, Node.js, MongoDB et bien d'autres technologies !",
    "Mes compétences couvrent le développement full-stack, l'IA et l'optimisation d'algorithmes."
  ],
  contact: [
    "Vous pouvez me contacter via le formulaire de contact sur cette page ou sur LinkedIn.",
    "N'hésitez pas à me contacter pour discuter de vos projets !"
  ],
  default: [
    "C'est une question intéressante ! Pour plus d'informations, n'hésitez pas à explorer mon portfolio.",
    "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ?",
    "Intéressant ! Voulez-vous en savoir plus sur mes projets ou mes compétences ?"
  ]
};

function getResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.match(/bonjour|salut|hello|hi/)) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (lowerMessage.match(/portfolio|site|projet/)) {
    return responses.portfolio[Math.floor(Math.random() * responses.portfolio.length)];
  } else if (lowerMessage.match(/compétence|skill|technologie|langage/)) {
    return responses.skills[Math.floor(Math.random() * responses.skills.length)];
  } else if (lowerMessage.match(/contact|email|joindre/)) {
    return responses.contact[Math.floor(Math.random() * responses.contact.length)];
  } else {
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }
}

// Chatbot message endpoint
router.post('/message', (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = getResponse(message);

    res.json({ response, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors(corsOrigins.length ? { origin: corsOrigins, credentials: true } : undefined));
app.use(express.json());

const responses = {
  greeting: [
    'Bonjour ! Comment puis-je vous aider ?',
    'Salut ! Que puis-je faire pour vous ?',
    'Hello ! En quoi puis-je vous etre utile ?'
  ],
  portfolio: [
    'Ce portfolio a ete cree avec React, TypeScript et MongoDB. Il presente mes projets et competences.',
    'Mon portfolio met en avant mes competences en developpement web, IA et optimisation d\'algorithmes.'
  ],
  skills: [
    'Je maitrise React, TypeScript, Python, Node.js, MongoDB et bien d\'autres technologies !',
    'Mes competences couvrent le developpement full-stack, l\'IA et l\'optimisation d\'algorithmes.'
  ],
  contact: [
    'Vous pouvez me contacter via le formulaire de contact sur cette page ou sur LinkedIn.',
    'N\'hesitez pas a me contacter pour discuter de vos projets !'
  ],
  default: [
    'C\'est une question interessante ! Pour plus d\'informations, n\'hesitez pas a explorer mon portfolio.',
    'Je ne suis pas sur de comprendre. Pouvez-vous reformuler ?',
    'Interessant ! Voulez-vous en savoir plus sur mes projets ou mes competences ?'
  ]
};

const pickResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.match(/bonjour|salut|hello|hi/)) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  if (lowerMessage.match(/portfolio|site|projet/)) {
    return responses.portfolio[Math.floor(Math.random() * responses.portfolio.length)];
  }
  if (lowerMessage.match(/competence|skill|technologie|langage/)) {
    return responses.skills[Math.floor(Math.random() * responses.skills.length)];
  }
  if (lowerMessage.match(/contact|email|joindre/)) {
    return responses.contact[Math.floor(Math.random() * responses.contact.length)];
  }
  return responses.default[Math.floor(Math.random() * responses.default.length)];
};

app.post('/chat', (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = pickResponse(message);
    res.json({ response, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'chatbot' });
});

app.head('/health', (req, res) => {
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`🤖 Chatbot API running on port ${PORT}`);
});

export default app;

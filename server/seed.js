import Project from './models/Project.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const sampleProjects = [
  {
    title: 'Solveur et Jeu de Sudoku',
    description: 'Générateur et solveur de Sudoku avec algorithme d\'optimisation avancé en Python',
    longDescription: `Un jeu de Sudoku complet développé en Python avec génération automatique de grilles et résolution optimisée.
    
    Fonctionnalités :
    - Génération de grilles avec 4 niveaux de difficulté (facile, moyen, difficile, expert)
    - Résolution ultra-rapide avec backtracking optimisé
    - Système d'indices intelligent
    - Validation en temps réel des coups
    - API REST pour intégration frontend
    
    Technologies :
    - Python pour la logique du jeu
    - Algorithme de backtracking avec heuristiques
    - Flask pour l'API REST
    - React + TypeScript pour l'interface
    
    L'algorithme peut générer et résoudre n'importe quelle grille de Sudoku en quelques millisecondes grâce à des optimisations avancées.`,
    technologies: ['Python', 'Flask', 'Algorithmes', 'React', 'TypeScript'],
    imageUrl: '/images/projects/sudoku.jpg',
    bannerUrl: '/images/projects/sudoku-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/SudokuSolver_optimisation',
    category: 'other',
    featured: true,
    interactive: true,
    interactivePath: '/projects/sudoku-solver',
    healthCheckUrl: '/sudoku/api/sudoku/health',
    maturity: 'alpha',
    createdAt: new Date('2025-11-20'),
  },
  {
    title: 'Chatbot IA Conversationnel',
    description: 'Assistant intelligent avec traitement du langage naturel',
    longDescription: `Un chatbot IA capable de comprendre et répondre de manière contextuelle aux questions des utilisateurs.
    
    Fonctionnalités :
    - Compréhension du langage naturel
    - Réponses contextuelles intelligentes
    - Interface conversationnelle moderne
    - Historique des conversations
    
    Le chatbot peut être entraîné sur des domaines spécifiques pour fournir des réponses personnalisées et pertinentes.`,
    technologies: ['Python', 'NLP', 'Machine Learning', 'React', 'TypeScript'],
    imageUrl: '/images/projects/chatbot.jpg',
    bannerUrl: '/images/projects/chatbot-banner.jpg',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/chatbot',
    healthCheckUrl: '/chatbot/health',
    maturity: 'stable',
    createdAt: new Date('2025-03-15'),
  },
  {
    title: 'Classification de Champignons avec Prédiction Conforme',
    description: 'Modèle CNN avec prédiction conforme pour classifier 169 espèces de champignons',
    longDescription: `Projet de Deep Learning appliquant la prédiction conforme à la classification de champignons.
    
    Problématique :
    La classification des champignons est critique (risque d'intoxication). La prédiction conforme quantifie l'incertitude en fournissant des ensembles de classes possibles avec garanties de couverture statistique.
    
    Architecture technique :
    - CNN personnalisé (4 blocs conv, 256 filtres, dropout 0.5)
    - 169 classes de champignons du dataset Kaggle Mushroom Classification
    - Split Conformal Prediction avec garantie de couverture ≥ 1-α
    - Ensembles de prédiction adaptatifs selon l'incertitude
    
    Résultats :
    - Couverture empirique : ~90% (α=0.1)
    - Ensemble moyen : ~8 classes sur 169 (4.7%)
    - Accuracy top-1 : 53.02%
    - Trade-off ajustable : confiance vs taille de l'ensemble
    
    Application pratique :
    Upload d'images pour obtenir un ensemble de prédictions avec niveau de confiance configurable. Alerte si espèce toxique détectée dans l'ensemble.`,
    technologies: ['Python', 'PyTorch', 'Deep Learning', 'Conformal Prediction', 'CNN', 'React'],
    imageUrl: '/images/projects/mushroom.jpg',
    bannerUrl: '/images/projects/mushroom-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/conformal_prediction',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/mushroom-classifier',
    healthCheckUrl: '/mushroom/health',
    maturity: 'beta',
    createdAt: new Date('2025-10-15'),
  },
  {
    title: 'Prédiction de Prix d\'Actions CAC40',
    description: 'Modèle LSTM pour prédire les prix d\'actions et simuler des stratégies de trading',
    longDescription: `Système complet de prédiction de prix d'actions utilisant des réseaux de neurones LSTM avec optimisation des hyperparamètres et simulation de trading.
    
    Fonctionnalités principales :
    - Entraînement de modèles LSTM sur données historiques Yahoo Finance
    - Optimisation automatique des hyperparamètres avec Keras Tuner
    - Prédictions multi-jours avec fenêtre temporelle configurable
    - Simulation historique de stratégies de trading (backtesting)
    - Suivi en temps réel de l'entraînement via WebSocket
    
    Architecture technique :
    - Modèle LSTM avec couches denses et dropout pour régularisation
    - Prétraitement : normalisation MinMaxScaler, séquences temporelles
    - Optimisation : Random Search sur learning rate, units, dropout
    - API REST FastAPI avec jobs asynchrones en arrière-plan
    - Frontend React avec interface à onglets (entraînement/prédiction/simulation)
    
    Données et couverture :
    - Actions CAC40 : Engie, TotalEnergies, Airbus, BNP Paribas, Sanofi, LVMH, L'Oréal, Schneider Electric
    - Historique : jusqu'à 20 ans de données quotidiennes
    - Fenêtre temporelle : 10-500 jours pour prédire le jour suivant
    
    Stratégie de trading simulée :
    - Achat si prédiction > prix actuel (tendance haussière)
    - Vente si prédiction < prix actuel (tendance baissière)
    - Métriques : rendement %, taux de réussite, nombre de trades
    - Visualisation jour par jour des décisions et de la balance
    
    Performance et limites :
    - Les marchés financiers sont hautement stochastiques et difficiles à prédire
    - Les résultats passés ne garantissent pas les performances futures
    - L'objectif est pédagogique : démontrer l'application du Deep Learning aux séries temporelles
    - La simulation permet de comparer prédictions vs réalité sur données historiques
    
    Interface utilisateur :
    - Onglet Entraînement : configuration complète, barre de progression temps réel
    - Onglet Prédictions : prédire les N prochains jours après entraînement
    - Onglet Simulation : backtesting sur période passée avec bilan détaillé`,
    technologies: ['Python', 'TensorFlow', 'LSTM', 'Keras Tuner', 'FastAPI', 'WebSocket', 'React', 'TypeScript', 'Yahoo Finance'],
    imageUrl: '/images/projects/stock.jpg',
    bannerUrl: '/images/projects/stock-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/CAC40_prediction',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/stock-prediction',
    healthCheckUrl: '/stock/health',
    maturity: 'beta',
    createdAt: new Date('2024-10-10'),
  },
  {
    title: 'Portfolio Dynamique',
    description: 'Site portfolio moderne avec animations et architecture modulaire',
    longDescription: `Un portfolio moderne et performant avec des animations fluides et une architecture complète.
    
    Points clés :
    - React + TypeScript pour la type-safety
    - TailwindCSS pour un design responsive
    - Framer Motion pour des animations fluides
    - MongoDB + Express pour le backend
    - Projets interactifs intégrés
    
    Le site est optimisé pour les performances et le SEO, avec un design moderne et élégant.`,
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'MongoDB', 'Node.js'],
    imageUrl: '/images/projects/portfolio.png',
    bannerUrl: '/images/projects/portfolio-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/My_website_portfolio',
    category: 'web',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2025-11-20'),
  },
  {
    title: 'OCR Sudoku Solver',
    description: 'Solveur de Sudoku en C avec OCR et CNN from scratch',
    longDescription: `Solveur de Sudoku complet en C pur avec reconnaissance optique de caractères (OCR) basée sur un réseau de neurones convolutif (CNN) implémenté from scratch.

    Fonctionnalités :
    - Prétraitement d'image : conversion en niveaux de gris, binarisation Otsu, débruitage
    - Détection de grille : détection des lignes via transformée de Hough
    - Extraction de cases : découpage de la grille en 81 cases
    - Reconnaissance de chiffres : CNN implémenté en C (backpropagation, SGD/Adam)
    - Résolution : algorithme de backtracking optimisé avec heuristique MRV
    - Reconstruction : génération de l'image finale avec les chiffres complétés
    
    Performance :
    - Précision OCR > 98.3% sur chiffres manuscrits
    - Temps résolution < 100ms par grille
    
    Architecture :
    - C99 standard sans dépendances lourdes (pas d'OpenCV/TensorFlow)
    - Entraînement sur dataset MNIST`,
    technologies: ['C', 'CNN', 'OCR', 'Image Processing', 'Make'],
    imageUrl: '/images/projects/ocr-sudoku.png',
    bannerUrl: '/images/projects/ocr-sudoku-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/OCR_Sudoku',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/ocr-sudoku',
    healthCheckUrl: '/ocr-sudoku/health',
    maturity: 'beta',
    createdAt: new Date('2022-09-10'),
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Insert sample projects
    await Project.insertMany(sampleProjects);
    console.log('Sample projects inserted');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

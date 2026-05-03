import Project from './models/Project.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

function getMongoUri() {
  const uri = (process.env.MONGODB_URI || '').trim();
  return uri || 'mongodb://localhost:27017';
}

function getMongoDbName(uri) {
  const explicitDb = (process.env.MONGODB_DB || '').trim();
  if (explicitDb) {
    return explicitDb;
  }

  try {
    const parsed = new URL(uri);
    const pathDb = decodeURIComponent(parsed.pathname.replace(/^\//, '').split('/')[0] || '').trim();
    if (pathDb) {
      return pathDb;
    }
  } catch {
    // Ignore parse errors and fallback to default database name.
  }

  return 'portfolio';
}

const sampleProjects = [
  {
    slug: 'sudoku-solver',
    title: 'Sudoku Solver and Game',
    titleFr: 'Solveur et Jeu de Sudoku',
    description: 'Sudoku generator and solver with advanced optimization algorithms in Python',
    descriptionFr: 'Générateur et solveur de Sudoku avec des algorithmes d\'optimisation avancés en Python',
    longDescription: `## Sudoku Solver & Generator Engine

A constraint-based system for solving and generating Sudoku puzzles efficiently.

---

## Core Solving Algorithm

The solver is based on a **depth-first backtracking approach**:

- Recursive exploration of candidate values
- Constraint validation:
  - Row uniqueness
  - Column uniqueness
  - Subgrid consistency

### Optimization

- Randomized candidate ordering reduces worst-case exploration
- Early pruning drastically reduces branching factor

---

## Complexity Insight

Worst-case complexity:

O(9^n)

Where:
- \\( n \\) = number of empty cells

Optimizations reduce the **effective search space** significantly.

---

## Generation Pipeline

1. Generate valid full grid
2. Remove values progressively
3. Control difficulty via removal ratio

---

## Design Philosophy

- Minimize memory overhead (in-place mutation)
- Balance **performance vs simplicity**
- Keep solver fast enough for real-time usage`,
    longDescriptionFr: `## Moteur de Génération & Résolution de Sudoku

Un système basé sur les contraintes pour résoudre et générer des grilles de Sudoku efficacement.

---

## Algorithme de Résolution Principal

Le solveur est basé sur une **approche de retour sur trace (backtracking) en profondeur** :

- Exploration récursive des valeurs candidates
- Validation des contraintes :
  - Unicité par ligne
  - Unicité par colonne
  - Cohérence par sous-grille

### Optimisation

- L'ordonnancement aléatoire des candidats réduit l'exploration dans le pire des cas
- L'élagage précoce réduit drastiquement le facteur de branchement

---

## Aperçu de la Complexité

Complexité dans le pire des cas :

O(9^n)

Où :
- \\( n \\) = nombre de cellules vides

Les optimisations réduisent considérablement l'**espace de recherche effectif**.

---

## Pipeline de Génération

1. Générer une grille complète valide
2. Supprimer des valeurs progressivement
3. Contrôler la difficulté via le ratio de suppression

---

## Philosophie de Conception

- Minimiser la surcharge mémoire (mutation sur place)
- Équilibrer **performances vs simplicité**
- Garder le solveur suffisamment rapide pour une utilisation en temps réel`,
    details: {
      context: "Algorithmic personal project",
      duration: "1 week",
      team: "Solo",
      role: "Full-Stack + Algorithm engineer",
      why: "Explore constraint satisfaction problems and optimize backtracking performance on combinatorial search spaces.",
      learnings: [
        "Backtracking optimization techniques",
        "Constraint propagation and pruning strategies",
        "Trade-offs between performance and solution guarantees",
        "Designing efficient recursive algorithms"
      ],
      improvements: [
        "Implement Dancing Links (Knuth Algorithm X) or other advanced techniques for further performance gains",
        "Parallelize solving for large-scale benchmarking"
      ]
    },
    detailsFr: {
      context: "Projet personnel algorithmique",
      duration: "1 semaine",
      team: "Solo",
      role: "Ingénieur Full-Stack + Algorithmique",
      why: "Explorer les problèmes de satisfaction de contraintes et optimiser les performances du backtracking sur des espaces de recherche combinatoires.",
      learnings: [
        "Techniques d'optimisation du backtracking",
        "Stratégies de propagation de contraintes et d'élagage",
        "Compromis entre performances et garanties de solution",
        "Conception d'algorithmes récursifs efficaces"
      ],
      improvements: [
        "Implémenter les Liens Dansants (Algorithme X de Knuth) ou d'autres techniques avancées pour des gains de performances supplémentaires",
        "Paralléliser la résolution pour des tests de performance à grande échelle"
      ]
    },
    technologies: ['Python', 'Algorithms', 'Backtracking', 'Optimization'],
    technologiesFr: ['Python', 'Algorithmes', 'Backtracking', 'Optimisation'],
    imageUrl: '/images/projects/sudoku.jpg',
    bannerUrl: '/images/projects/sudoku-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/SudokuSolver_optimisation',
    category: 'other',
    featured: true,
    interactive: true,
    interactivePath: '/projects/sudoku-solver/demo',
    healthCheckUrl: '/sudoku/health',
    maturity: 'stable',
    createdAt: new Date('2025-11-20'),
  },
  {
    slug: 'chatbot',
    title: 'Conversational AI Chatbot',
    titleFr: 'Chatbot IA Conversationnelle',
    description: 'Intelligent assistant with natural language processing',
    descriptionFr: 'Assistant intelligent avec traitement du langage naturel',
    longDescription: `Context-aware conversational AI system designed around modern NLP and LLM-inspired architecture principles.

---

## Core NLP pipeline
- Text preprocessing (tokenization, normalization, intent extraction)
- Semantic embedding generation for user queries
- Vector-based similarity matching for intent retrieval
- Context tracking across multi-turn conversations

---

## Architecture
- Context window management to maintain conversational coherence
- Sliding memory buffer for recent interactions
- Long-term context abstraction using summarized embeddings
- Modular response generator supporting rule-based + neural hybrid logic

---

## Embedding-based reasoning
- Dense vector representations of user inputs (semantic embeddings)
- Similarity search over stored conversational states
- Context-aware ranking of candidate responses

---

## Dialogue management
- State tracking for multi-turn dependency resolution
- Intent classification + slot filling for structured queries
- Context injection into response generation pipeline

---

## Design goals
- Maintain coherence over long conversations
- Reduce hallucination via context grounding
- Support extensible integration with external knowledge sources

---

This project focuses on bridging classical NLP techniques with modern embedding-based conversational systems.`,
    longDescriptionFr: `Système d'IA conversationnelle sensible au contexte, conçu autour des principes d'architecture modernes de la NLP et inspiré des LLMs.

---

## Pipeline NLP principal
- Prétraitement du texte (tokénisation, normalisation, extraction d'intention)
- Génération d'embeddings sémantiques pour les requêtes utilisateur
- Correspondance de similarité vectorielle pour la recherche d'intentions
- Suivi du contexte sur plusieurs tours de conversation

---

## Architecture
- Gestion de la fenêtre de contexte pour maintenir la cohérence de la conversation
- Tampon de mémoire glissant pour les interactions récentes
- Abstraction du contexte à long terme utilisant des embeddings résumés
- Générateur de réponses modulaire supportant une logique hybride (basée sur des règles + neuronale)

---

## Raisonnement basé sur les embeddings
- Représentations vectorielles denses des entrées utilisateur (embeddings sémantiques)
- Recherche de similarité sur les états conversationnels stockés
- Classement des réponses candidates tenant compte du contexte

---

## Gestion du dialogue
- Suivi d'état pour la résolution des dépendances multi-tours
- Classification d'intentions + remplissage d'entités (slot filling) pour les requêtes structurées
- Injection du contexte dans le pipeline de génération de réponses

---

## Objectifs de conception
- Maintenir la cohérence lors de longues conversations
- Réduire les hallucinations via un ancrage contextuel
- Supporter une intégration extensible avec des sources de connaissances externes

---

Ce projet se concentre sur le pont entre les techniques NLP classiques et les systèmes conversationnels modernes basés sur les embeddings.`,
    details: {
      context: "NLP exploration personal project",
      duration: "2 weeks",
      team: "Solo",
      role: "ML + system design",
      why: "Understand how modern conversational systems manage context, embeddings, and semantic reasoning.",
      learnings: [
        "Semantic embeddings and similarity search",
        "Context management in multi-turn conversations",
        "Designing conversational pipelines"
      ],
      improvements: [
        "Improve long-term memory handling",
        "Add retrieval from external knowledge bases"
      ]
    },
    detailsFr: {
      context: "Projet personnel d'exploration NLP",
      duration: "2 semaines",
      team: "Solo",
      role: "ML + conception système",
      why: "Comprendre comment les systèmes conversationnels modernes gèrent le contexte, les embeddings et le raisonnement sémantique.",
      learnings: [
        "Embeddings sémantiques et recherche de similarité",
        "Gestion du contexte dans les conversations multi-tours",
        "Conception de pipelines conversationnels"
      ],
      improvements: [
        "Améliorer la gestion de la mémoire à long terme",
        "Ajouter la récupération depuis des bases de connaissances externes"
      ]
    },
    technologies: ['Python', 'NLP', 'Embeddings', 'Machine Learning', 'React', 'TypeScript'],
    technologiesFr: ['Python', 'NLP', 'Embeddings', 'Apprentissage Automatique', 'React', 'TypeScript'],
    imageUrl: '/images/projects/chatbot.jpg',
    bannerUrl: '/images/projects/chatbot-banner.png',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/chatbot/demo',
    healthCheckUrl: '/chatbot/health',
    maturity: 'stable',
    createdAt: new Date('2025-03-15'),
  },
  {
    slug: 'mushroom-classifier',
    title: 'Mushroom Classification with Conformal Prediction',
    titleFr: 'Classification de Champignons avec Prédiction Conforme',
    description: 'CNN model with conformal prediction to classify 169 mushroom species',
    descriptionFr: 'Modèle CNN avec prédiction conforme pour classifier 169 espèces de champignons',
    longDescription: `## Deep learning system for large-scale mushroom classification enhanced with conformal prediction to provide statistically valid uncertainty estimates.

---

## Problem context
- Fine-grained visual classification over 169 mushroom species
- High intra-class similarity and inter-class ambiguity
- Safety-critical domain (misclassification may lead to poisoning)
- Strong class imbalance across dataset

---

## Dataset
- ~104,000 images across 169 classes (Kaggle Mushroom dataset)
- Highly imbalanced distribution (200 → 5,800 images per class)
- Significant morphological diversity (color, texture, shape variations)
- Split: 70% train / 15% validation / 15% test

---

## Model architecture
- Custom CNN (~9.7M parameters) implemented in PyTorch
- 4 convolutional blocks:
  - Conv → BatchNorm → ReLU ×2 + MaxPooling
  - Progressive feature expansion (32 → 64 → 128 → 256 channels)
- Fully connected head with dropout (0.5) for regularization
- Input normalization + data augmentation:
  - Random rotations, flips, color jitter
### Optimization
  - Cross-entropy loss
  - Adam optimizer with weight decay

---

## Training pipeline
- Mini-batch training with DataLoader parallelization
- Validation-based checkpointing (best model selection)
- GPU acceleration (CUDA) for efficient training
- Achieved validation accuracy: ~53% (top-1) on 169-class problem

---

## Conformal prediction layer
- Split conformal prediction applied on top of softmax outputs
- Calibration performed on held-out validation set
- Nonconformity score: 1 - P(true class)
- Quantile-based threshold selection ensuring coverage guarantee

---

## Prediction mechanism
- Instead of single-label output → prediction sets
- Each prediction = subset of plausible classes
- Confidence level controlled by α (e.g. α=0.1 → 90% coverage)

---

## Results
- Empirical coverage ≈ 90% (aligned with theoretical guarantee)
- Average prediction set size ≈ 8 classes (≈4.7% of label space)
- Top-1 accuracy: ~53%
- Adaptive uncertainty: larger sets for ambiguous samples

---

## System behavior
- High-confidence inputs → small prediction sets
- Ambiguous inputs → larger sets (uncertainty-aware)
- Natural robustness to visually similar species

---

## Practical application
- User uploads an image → receives a set of possible species
- Safety mechanism: alert triggered if any toxic species is included
- Adjustable confidence threshold to trade precision vs safety

---

## Design insights
- Classical classification is insufficient in high-risk domains
- Conformal prediction provides distribution-free uncertainty guarantees
- Trade-off between prediction set size and coverage is explicit and controllable

This project demonstrates how to extend deep learning models with statistically grounded uncertainty quantification for safer real-world decision systems`,
    longDescriptionFr: `## Système d'apprentissage profond pour la classification à grande échelle de champignons, amélioré par la prédiction conforme pour fournir des estimations d'incertitude statistiquement valides.

---

## Contexte du problème
- Classification visuelle fine sur 169 espèces de champignons
- Forte similarité intra-classe et ambiguïté inter-classe
- Domaine critique pour la sécurité (une mauvaise classification peut entraîner un empoisonnement)
- Fort déséquilibre des classes dans le jeu de données

---

## Jeu de données
- ~104 000 images réparties sur 169 classes (Jeu de données Mushroom de Kaggle)
- Distribution très déséquilibrée (200 → 5 800 images par classe)
- Diversité morphologique importante (variations de couleur, texture, forme)
- Répartition : 70% entraînement / 15% validation / 15% test

---

## Architecture du modèle
- CNN personnalisé (~9,7M de paramètres) implémenté en PyTorch
- 4 blocs convolutifs :
  - Conv → BatchNorm → ReLU ×2 + MaxPooling
  - Expansion progressive des caractéristiques (32 → 64 → 128 → 256 canaux)
  - Tête entièrement connectée avec dropout (0.5) pour la régularisation
- Normalisation des entrées + augmentation de données :
  - Rotations aléatoires, retournements, variations de couleur
### Optimisation
  - Perte d'entropie croisée (Cross-entropy loss)
  - Optimiseur Adam avec décroissance des poids (weight decay)

---

## Pipeline d'entraînement
- Entraînement par mini-lots avec parallélisation DataLoader
- Sauvegarde basée sur la validation (sélection du meilleur modèle)
- Accélération GPU (CUDA) pour un entraînement efficace
- Précision de validation atteinte : ~53% (top-1) sur un problème à 169 classes

---

## Couche de prédiction conforme
- Prédiction conforme fractionnée (split) appliquée aux sorties softmax
- Calibration effectuée sur un ensemble de validation mis de côté
- Score de non-conformité : 1 - P(classe réelle)
- Sélection de seuil basée sur les quantiles garantissant la couverture

---

## Mécanisme de prédiction
- Au lieu d'une sortie à étiquette unique → ensembles de prédictions
- Chaque prédiction = sous-ensemble de classes plausibles
- Niveau de confiance contrôlé par α (ex. α=0.1 → 90% de couverture)

---

## Résultats
- Couverture empirique ≈ 90% (alignée avec la garantie théorique)
- Taille moyenne de l'ensemble de prédiction ≈ 8 classes (≈4,7% de l'espace des étiquettes)
- Précision Top-1 : ~53%
- Incertitude adaptative : ensembles plus grands pour les échantillons ambigus

---

## Comportement du système
- Entrées à haute confiance → petits ensembles de prédiction
- Entrées ambiguës → ensembles plus grands (prise en compte de l'incertitude)
- Robustesse naturelle face aux espèces visuellement similaires

---

## Application pratique
- L'utilisateur télécharge une image → reçoit un ensemble d'espèces possibles
- Mécanisme de sécurité : alerte déclenchée si une espèce toxique est incluse
- Seuil de confiance ajustable pour trouver un compromis entre précision et sécurité

---

## Perspectives de conception
- La classification classique est insuffisante dans les domaines à haut risque
- La prédiction conforme fournit des garanties d'incertitude sans distribution
- Le compromis entre la taille de l'ensemble de prédiction et la couverture est explicite et contrôlable

Ce projet démontre comment étendre les modèles d'apprentissage profond avec une quantification de l'incertitude statistiquement fondée pour des systèmes de décision plus sûrs dans le monde réel`,
    details: {
      context: "EPITA - Conformal prediction project",
      duration: "2 weeks",
      team: "Solo",
      role: "ML engineer",
      why: "Work on uncertainty-aware AI for high-risk classification problems.",
      learnings: [
        "CNN architecture design",
        "Handling imbalanced datasets",
        "Conformal prediction theory",
        "Uncertainty quantification"
      ],
      improvements: [
        "Improve base model accuracy",
        "Use pretrained models (ResNet)",
        "Optimize prediction set size"
      ]
    },
    detailsFr: {
      context: "EPITA - Projet de prédiction conforme",
      duration: "2 semaines",
      team: "Solo",
      role: "Ingénieur ML",
      why: "Travailler sur une IA sensible à l'incertitude pour des problèmes de classification à haut risque.",
      learnings: [
        "Conception d'architecture CNN",
        "Gestion de jeux de données déséquilibrés",
        "Théorie de la prédiction conforme",
        "Quantification de l'incertitude"
      ],
      improvements: [
        "Améliorer la précision du modèle de base",
        "Utiliser des modèles pré-entraînés (ResNet)",
        "Optimiser la taille de l'ensemble de prédictions"
      ]
    },
    technologies: ['Python', 'PyTorch', 'Deep Learning', 'Conformal Prediction', 'CNN'],
    technologiesFr: ['Python', 'PyTorch', 'Apprentissage Profond', 'Prédiction Conforme', 'CNN'],
    imageUrl: '/images/projects/mushroom.jpg',
    bannerUrl: '/images/projects/mushroom-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/conformal_prediction',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/mushroom-classifier/demo',
    healthCheckUrl: '/mushroom/health',
    maturity: 'beta',
    createdAt: new Date('2025-10-15'),
  },
  {
    slug: 'stock-prediction',
    title: 'CAC40 Stock Price Prediction',
    titleFr: 'Prédiction des Prix des Actions du CAC40',
    description: 'ML models to predict stock prices and simulate trading strategies',
    descriptionFr: 'Modèles de ML pour prédire les prix des actions et simuler des stratégies de trading',
    longDescription: `**NEW version** of this project in progress - Using World wide stocks and Graph based models for better temporal and cross-feature modeling.

##  Multi-model financial forecasting and trading simulation system.

---

##  Models architecture tested
- Bi-directional LSTM for temporal sequence modeling
- Transformer encoder for attention-based long-range dependency capture
- XGBoost regressor for non-linear feature baselines
- Modular model interface enabling benchmark comparisons

---

## Data pipeline
- Yahoo Finance historical market data
- Feature engineering (returns, moving averages, volatility indicators)
- MinMax normalization and sliding window sequence generation

---

## Training system
- Asynchronous FastAPI-based training jobs
- Hyperparameter tuning via Keras Tuner (random search)
- Real-time training progress streamed via WebSocket

---

## Simulation engine
- Time-aware backtesting system with anti-data-leakage design
- "Time-travel training": model retrained per simulation step
- Multiple trading strategies (simple, threshold, conservative, aggressive)
- Portfolio evolution tracking with profit/loss analytics

---

## Benchmarking system
- Cross-model evaluation on identical time windows
- Metrics: MAE, directional accuracy, simulated ROI
- Comparative visualization of strategies and predictions

---

## Important design constraints
- Financial data treated as stochastic and non-stationary
- Emphasis on experimental validation rather than predictive certainty
- Strong separation between training, inference, and simulation layers

This project focuses on applied deep learning for financial time series and realistic trading simulation systems.`,
    longDescriptionFr: `**NOUVELLE version** de ce projet en cours - Utilisation d'actions mondiales et de modèles basés sur les graphes pour une meilleure modélisation temporelle et croisée des caractéristiques.

## Système de prévision financière multi-modèles et de simulation de trading.

---

## Architectures de modèles testées
- LSTM bidirectionnel pour la modélisation de séquences temporelles
- Encodeur Transformer pour la capture de dépendances à long terme basée sur l'attention
- Régresseur XGBoost pour les références de caractéristiques non linéaires
- Interface de modèle modulaire permettant des comparaisons de référence (benchmarks)

---

## Pipeline de données
- Données de marché historiques de Yahoo Finance
- Ingénierie des caractéristiques (rendements, moyennes mobiles, indicateurs de volatilité)
- Normalisation MinMax et génération de séquences par fenêtre glissante

---

## Système d'entraînement
- Tâches d'entraînement asynchrones basées sur FastAPI
- Réglage des hyperparamètres via Keras Tuner (recherche aléatoire)
- Progression de l'entraînement en temps réel diffusée via WebSocket

---

## Moteur de simulation
- Système de backtesting sensible au temps avec conception anti-fuite de données
- "Entraînement avec voyage dans le temps" : modèle ré-entraîné à chaque étape de la simulation
- Multiples stratégies de trading (simple, par seuil, conservatrice, agressive)
- Suivi de l'évolution du portefeuille avec analyse des profits/pertes

---

## Système de benchmarking
- Évaluation inter-modèles sur des fenêtres de temps identiques
- Métriques : MAE, précision directionnelle, ROI simulé
- Visualisation comparative des stratégies et des prédictions

---

## Contraintes de conception importantes
- Les données financières sont traitées comme stochastiques et non stationnaires
- Accent mis sur la validation expérimentale plutôt que sur la certitude prédictive
- Forte séparation entre les couches d'entraînement, d'inférence et de simulation

Ce projet se concentre sur l'apprentissage profond appliqué aux séries chronologiques financières et sur des systèmes de simulation de trading réalistes.`,
    details: {
      context: "Personal project",
      duration: "3-4 weeks",
      team: "Solo",
      role: "Full-stack + ML engineer",
      why: "Understand financial time series and stock market dynamics through simulations",
      learnings: [
        "Time-series modeling with LSTM and Transformers",
        "Financial feature engineering and data preprocessing",
        "Designing realistic backtesting systems with time-travel training",
        "Integrating ML models into interactive web applications",
      ],
      improvements: [
        "Use graph-based data (in progress)",
        "Use graph-based models (in progress)",
        "Incorporate external data (news, sentiment) for better predictions",
      ]
    },
    detailsFr: {
      context: "Projet personnel",
      duration: "3-4 semaines",
      team: "Solo",
      role: "Ingénieur Full-stack + ML",
      why: "Comprendre les séries chronologiques financières et la dynamique du marché boursier à travers des simulations",
      learnings: [
        "Modélisation de séries chronologiques avec LSTM et Transformers",
        "Ingénierie des caractéristiques financières et prétraitement des données",
        "Conception de systèmes de backtesting réalistes avec un entraînement progressif dans le temps",
        "Intégration de modèles ML dans des applications web interactives",
      ],
      improvements: [
        "Utiliser des données basées sur les graphes (en cours)",
        "Utiliser des modèles basés sur les graphes (en cours)",
        "Intégrer des données externes (actualités, sentiment) pour de meilleures prédictions",
      ]
    },
    technologies: ['Python', 'TensorFlow', 'Keras', 'LSTM', 'Transformers', 'XGBoost', 'FastAPI', 'WebSocket'],
    technologiesFr: ['Python', 'TensorFlow', 'Keras', 'LSTM', 'Transformers', 'XGBoost', 'FastAPI', 'WebSocket'],
    imageUrl: '/images/projects/stock.jpg',
    bannerUrl: '/images/projects/stock-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/CAC40_prediction',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/stock-prediction/demo',
    healthCheckUrl: '/stock/health',
    maturity: 'beta',
    createdAt: new Date('2024-10-10'),
  },
  {
    slug: 'portfolio',
    title: 'Dynamic Portfolio',
    titleFr: 'Portfolio Dynamique',
    description: 'Modern portfolio website with animations and modular architecture',
    descriptionFr: 'Site web portfolio moderne avec animations et architecture modulaire',
    longDescription: `## Full-stack interactive portfolio platform integrating machine learning demos and modular web architecture.

---

## Frontend architecture
- React + TypeScript SPA built with Vite
- Component-based modular UI design with reusable sections
- TailwindCSS utility-first styling system for responsive design
- Framer Motion for declarative animation system and micro-interactions

---

## Backend architecture
- Node.js + Express API layer
- MongoDB database for project metadata and dynamic content
- RESTful API design for project retrieval, routing, and demo orchestration

---

## ML integration layer
- External Python microservices (Flask/FastAPI) exposing inference APIs
- Hybrid architecture connecting frontend to ML services via HTTP calls
- Asynchronous communication model for non-blocking inference requests

---

## Deployment & infrastructure
- Frontend deployed on Vercel (serverless static hosting with CI/CD integration)
- Backend deployed on Render (free-tier Node.js service with cold start constraints)
- Database hosted on MongoDB Atlas (free cluster with storage and connection limits)
- Fully cloud-native architecture optimized for zero-cost deployment constraints

---

## Technical limitations & trade-offs
- Cold starts on Render free tier introduce initial API latency
- MongoDB Atlas free cluster imposes storage and connection pooling limits
- No dedicated GPU/compute for ML services → inference delegated to lightweight APIs
- System designed to remain fully functional within free-tier resource constraints

---

## SEO (Search Engine Optimization) engineering
- Server-side metadata optimization (Open Graph, meta tags, structured titles/descriptions)
- Semantic HTML structure for improved crawlability
- Pre-rendered static pages for better indexing by search engines
- Optimized routing strategy for indexable project pages (/projects/:slug)
- Performance optimization (lazy loading, code splitting)

---

## System design goals
- Maintain separation between UI, API, and ML services
- Ensure scalability despite free-tier infrastructure constraints
- Provide fast perceived performance via caching and lazy loading
- Deliver interactive ML demos in a production-like environment

This portfolio acts as a unified showcase of full-stack engineering, ML integration, and real-world deployment constraints under production-free infrastructure.`,
    longDescriptionFr: `## Plateforme portfolio interactive full-stack intégrant des démos de machine learning et une architecture web modulaire.

---

## Architecture Frontend
- SPA React + TypeScript construite avec Vite
- Conception d'interface modulaire basée sur des composants avec des sections réutilisables
- Système de style utilitaire TailwindCSS pour un design responsive
- Framer Motion pour un système d'animation déclaratif et des micro-interactions

---

## Architecture Backend
- Couche API Node.js + Express
- Base de données MongoDB pour les métadonnées des projets et le contenu dynamique
- Conception d'API RESTful pour la récupération de projets, le routage et l'orchestration de démos

---

## Couche d'intégration ML
- Microservices Python externes (Flask/FastAPI) exposant des API d'inférence
- Architecture hybride connectant le frontend aux services ML via des appels HTTP
- Modèle de communication asynchrone pour des requêtes d'inférence non bloquantes

---

## Déploiement & infrastructure
- Frontend déployé sur Vercel (hébergement statique serverless avec intégration CI/CD)
- Backend déployé sur Render (service Node.js niveau gratuit avec des contraintes de démarrage à froid)
- Base de données hébergée sur MongoDB Atlas (cluster gratuit avec limites de stockage et de connexions)
- Architecture entièrement cloud-native optimisée pour des contraintes de déploiement à coût nul

---

## Limites techniques & compromis
- Les démarrages à froid sur le niveau gratuit de Render introduisent une latence API initiale
- Le cluster gratuit MongoDB Atlas impose des limites de stockage et de regroupement de connexions
- Pas de GPU/calcul dédié pour les services ML → l'inférence est déléguée à des API légères
- Système conçu pour rester entièrement fonctionnel dans les limites de ressources du niveau gratuit

---

## Ingénierie SEO (Optimisation pour les moteurs de recherche)
- Optimisation des métadonnées côté serveur (Open Graph, balises meta, titres/descriptions structurés)
- Structure HTML sémantique pour une meilleure explorabilité (crawlability)
- Pages statiques pré-rendues pour une meilleure indexation par les moteurs de recherche
- Stratégie de routage optimisée pour les pages de projet indexables (/projects/:slug)
- Optimisation des performances (chargement paresseux, fractionnement du code)

---

## Objectifs de conception du système
- Maintenir la séparation entre l'UI, l'API et les services ML
- Assurer la scalabilité malgré les contraintes d'infrastructure du niveau gratuit
- Fournir des performances perçues rapides via la mise en cache et le chargement paresseux
- Livrer des démos ML interactives dans un environnement de type production

Ce portfolio agit comme une vitrine unifiée de l'ingénierie full-stack, de l'intégration ML et des contraintes de déploiement dans le monde réel sous une infrastructure de production gratuite.`,
    details: {
      context: "Full-stack production project",
      duration: "Ongoing, online since march 2026",
      team: "Solo",
      role: "Full-stack engineer",
      why: "Build a real-world system integrating frontend, backend, and ML services.",
      learnings: [
        "System architecture design",
        "Frontend performance optimization",
        "Deployment constraints",
        "SEO engineering"
      ],
      improvements: [
        "Improve backend for better projects demos",
        "Improve fontend UI and adaptability"
      ]
    },
    detailsFr: {
      context: "Projet full-stack en production",
      duration: "En cours, en ligne depuis mars 2026",
      team: "Solo",
      role: "Ingénieur Full-stack",
      why: "Construire un système du monde réel intégrant le frontend, le backend et les services ML.",
      learnings: [
        "Conception d'architecture système",
        "Optimisation des performances frontend",
        "Contraintes de déploiement",
        "Ingénierie SEO"
      ],
      improvements: [
        "Améliorer le backend pour de meilleures démos de projets",
        "Améliorer l'interface utilisateur frontend et son adaptabilité"
      ]
    },
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'MongoDB', 'Framer Motion', 'SEO Optimization', 'Free Tier Deployment'],
    technologiesFr: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'MongoDB', 'Framer Motion', 'Optimisation SEO', 'Déploiement Niveau Gratuit'],
    imageUrl: '/images/projects/portfolio.png',
    bannerUrl: '/images/projects/portfolio-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/My_website_portfolio',
    category: 'web',
    featured: true,
    interactive: true,
    interactivePath: 'https://aaubron.vercel.app',
    healthCheckUrl: 'https://aaubron.vercel.app',
    maturity: 'stable',
    createdAt: new Date('2025-11-20'),
  },
  {
    slug: 'ocr-sudoku',
    title: 'OCR Sudoku Solver',
    titleFr: 'Solveur de Sudoku OCR',
    description: 'Sudoku solver in C with OCR thanks to a CNN built from scratch',
    descriptionFr: 'Solveur de Sudoku en C avec OCR grace à un CNN créé de zéro',
    longDescription: `End-to-end Sudoku recognition and solving system implemented in pure C, combining classical computer vision with deep learning.

---

## Pipeline architecture
- Image preprocessing: grayscale conversion, noise reduction, Otsu thresholding
- Geometric correction: perspective transform and grid normalization
- Structural detection: line extraction using Hough transform
- Cell segmentation: decomposition into 81 normalized 28x28 patches

---

## OCR engine
- Convolutional Neural Network implemented from scratch (no ML frameworks)
- Manual implementation of:
  - Forward propagation
  - Backpropagation
  - Gradient descent optimization (SGD / Adam)
- Training on MNIST + augmented synthetic digit dataset

---

## Sudoku solving engine
- Optimized backtracking solver with MRV (Minimum Remaining Value) heuristic
- Constraint propagation to reduce search space
- Early pruning of invalid candidate paths

---

## Reconstruction pipeline
- Image reconstruction of computed solution

---

## Performance characteristics
- OCR accuracy = 98.3% on mixed datasets (printed + synthetic noise)
- Sub-100ms solving time per grid after digit recognition
- Fully dependency-free implementation (no OpenCV / TensorFlow)

This project demonstrates full-stack algorithmic vision + machine learning implemented at low level in C.`,
    longDescriptionFr: `Système de reconnaissance et de résolution de Sudoku de bout en bout implémenté en pur C, combinant la vision par ordinateur classique avec l'apprentissage profond.

---

## Architecture du pipeline
- Prétraitement de l'image : conversion en niveaux de gris, réduction du bruit, seuillage d'Otsu
- Correction géométrique : transformation de perspective et normalisation de la grille
- Détection structurelle : extraction de lignes via la transformée de Hough
- Segmentation des cellules : décomposition en 81 patchs normalisés de 28x28

---

## Moteur OCR
- Réseau de Neurones Convolutif (CNN) implémenté de zéro (sans frameworks ML)
- Implémentation manuelle de :
  - Propagation avant (Forward propagation)
  - Rétropropagation (Backpropagation)
  - Optimisation par descente de gradient (SGD / Adam)
- Entraînement sur MNIST + jeu de données de chiffres synthétiques augmenté

---

## Moteur de résolution de Sudoku
- Solveur de backtracking optimisé avec l'heuristique MRV (Minimum Remaining Value)
- Propagation des contraintes pour réduire l'espace de recherche
- Élagage précoce des chemins candidats invalides

---

## Pipeline de reconstruction
- Reconstruction d'image de la solution calculée

---

## Caractéristiques de performance
- Précision OCR = 98,3% sur des jeux de données mixtes (imprimés + bruit synthétique)
- Temps de résolution inférieur à 100 ms par grille après la reconnaissance des chiffres
- Implémentation entièrement sans dépendance (pas d'OpenCV / TensorFlow)

Ce projet démontre une vision algorithmique full-stack + un apprentissage automatique implémentés à bas niveau en C.`,
    details: {
      context: "EPITA - C Language learning + AI first project",
      duration: "4 weeks",
      team: "4 people originally, but redesigned and implemented in solo for this website demo",
      role: "UI + OCR architect & implementer originally, Full-stack implementer for the website demo",
      why: "Understand ML from scratch and combine it with image processing in C without any library.",
      learnings: [
        "CNN internals",
        "Image processing pipeline",
        "Low-level optimization in C",
        "End-to-end system design"
      ],
      improvements: [
        "Improve OCR robustness",
        "Improve line & grid detection",
      ]
    },
    detailsFr: {
      context: "EPITA - Apprentissage du langage C + Premier projet IA",
      duration: "4 semaines",
      team: "4 personnes à l'origine, mais repensé et implémenté en solo pour cette démo web",
      role: "Architecte & implémenteur UI + OCR, implémenteur Full-stack pour la démo web",
      why: "Comprendre le fonctionnement d'un CNN et le combiner avec le traitement d'images en C sans aucune bibliothèque.",
      learnings: [
        "Fonctionnement interne des CNN",
        "Pipeline de traitement d'image",
        "Optimisation bas niveau en C",
        "Conception de système de bout en bout"
      ],
      improvements: [
        "Améliorer la robustesse de l'OCR",
        "Améliorer la détection des lignes et de la grille",
      ]
    },
    technologies: ['C', 'CNN', 'OCR', 'Image Processing', 'Make'],
    technologiesFr: ['C', 'CNN', 'OCR', 'Traitement d\'Image', 'Make'],
    imageUrl: '/images/projects/ocr-sudoku.png',
    bannerUrl: '/images/projects/ocr-sudoku-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/OCR_Sudoku',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/ocr-sudoku/demo',
    healthCheckUrl: '/ocr-sudoku/health',
    maturity: 'beta',
    createdAt: new Date('2022-09-10'),
  },
  {
    slug: 'epitweet',
    title: 'EpiTweet - Distributed Microblogging Platform',
    titleFr: 'EpiTweet - Plateforme de Microblogging Distribuée',
    description: 'Twitter-like platform built with microservices, NoSQL databases and event-driven architecture',
    descriptionFr: 'Plateforme de type Twitter construite avec des microservices, des bases de données NoSQL et une architecture orientée événements',
    longDescription: `EpiTweet is a distributed microblogging platform designed to explore large-scale system architecture using microservices and event-driven communication.

---

## Architecture
- Backend implemented in Java using Quarkus with a strict clean architecture (domain, application, infrastructure layers)
- Fully decoupled microservices:
  - user-service: authentication and user management
  - repo-post: post CRUD and persistence
  - social-service: graph interactions (follow, like, block)
  - search-service: indexing and retrieval
  - home-timeline-service: feed generation
  - user-timeline-service: per-user content aggregation

---

## Data layer
- MongoDB: post storage (high write throughput)
- ElasticSearch: full-text search and hashtag indexing
- Neo4j: social graph modeling (followers, relationships)

---

## Communication
- REST APIs for synchronous interactions
- Redis Pub/Sub for asynchronous event propagation (timeline updates, indexing)

---

## Frontend
- Angular application consuming aggregated APIs

---

## Deployment
- Docker for local orchestration
- Kubernetes (K3s) with Kustomize for production-like deployment

---

## Key challenges
- Data consistency across services
- Event-driven timeline generation
- Scaling read-heavy operations (feeds & search)

This project focuses on designing scalable distributed systems with strong separation of concerns and heterogeneous data storage.`,
    longDescriptionFr: `EpiTweet est une plateforme de microblogging distribuée conçue pour explorer l'architecture système à grande échelle à l'aide de microservices et de communications basées sur des événements.

---

## Architecture
- Backend implémenté en Java avec Quarkus suivant une architecture propre stricte (domain, application, infrastructure layers)
- Microservices entièrement découplés :
  - user-service : authentification et gestion des utilisateurs
  - repo-post : opérations CRUD et persistance des posts
  - social-service : interactions de graphe (suivre, aimer, bloquer)
  - search-service : indexation et recherche
  - home-timeline-service : génération de flux (feed)
  - user-timeline-service : agrégation de contenu par utilisateur

---

## Couche de données
- MongoDB : stockage des posts (haut débit d'écriture)
- ElasticSearch : recherche en texte intégral et indexation des hashtags
- Neo4j : modélisation du graphe social (abonnés, relations)

---

## Communication
- API REST pour les interactions synchrones
- Redis Pub/Sub pour la propagation asynchrone des événements (mises à jour de la timeline, indexation)

---

## Frontend
- Application Angular consommant les API agrégées

---

## Déploiement
- Docker pour l'orchestration locale
- Kubernetes (K3s) avec Kustomize pour un déploiement de type production

---

## Défis clés
- Cohérence des données entre les services
- Génération de timeline orientée événements
- Mise à l'échelle des opérations à forte composante de lecture (flux & recherche)

Ce projet se concentre sur la conception de systèmes distribués évolutifs avec une forte séparation des préoccupations et un stockage de données hétérogène.`,
    details: {
      context: "EPITA INFO8 large-scale distributed systems project",
      duration: "2 months",
      team: "13 peoples",
      role: "DevOps (Kubernetes) + Search service + architecture contributor + Frontend lead",
      why: "Design and build a modern scalable distributed system similar to Twitter, focusing on microservices, data consistency, and real-time interactions.",
      learnings: [
        "Microservices architecture design",
        "Event-driven systems using Redis Pub/Sub",
        "Frontend-backend integration at scale",
        "Kubernetes deployment and orchestration",
        "Working in a large team with distributed responsibilities",
        "Handling data consistency across multiple services",
        "Designing search systems with Elasticsearch"
      ],
      improvements: [
        "Redoo deployment (as been shutdown since the project ended)",
        "Improve system observability (monitoring/logging)",
        "Optimize feed generation performance",
        "Add recommendation engine for personalized content",
        "Improve search relevance and ranking algorithms",
        "Improve fault tolerance between services"
      ]
    },
    detailsFr: {
      context: "EPITA INFO8 - Projet de systèmes distribués à grande échelle",
      duration: "2 mois",
      team: "13 personnes",
      role: "DevOps (Kubernetes) + Service de recherche + contributeur architecture + Lead Frontend",
      why: "Concevoir et construire un système distribué moderne et évolutif similaire à Twitter, axé sur les microservices, la cohérence des données et les interactions en temps réel.",
      learnings: [
        "Conception d'architecture de microservices",
        "Systèmes orientés événements utilisant Redis Pub/Sub",
        "Intégration frontend-backend à grande échelle",
        "Déploiement et orchestration Kubernetes",
        "Travail dans une grande équipe avec des responsabilités réparties",
        "Gestion de la cohérence des données sur plusieurs services",
        "Conception de systèmes de recherche avec Elasticsearch"
      ],
      improvements: [
        "Refaire le déploiement (a été arrêté depuis la fin du projet)",
        "Améliorer l'observabilité du système (surveillance/journaux)",
        "Optimiser les performances de génération de flux",
        "Ajouter un moteur de recommandation pour un contenu personnalisé",
        "Améliorer la pertinence de la recherche et les algorithmes de classement",
        "Améliorer la tolérance aux pannes entre les services"
      ]
    },
    technologies: ['Java', 'Quarkus', 'Angular', 'MongoDB', 'ElasticSearch', 'Neo4j', 'Redis', 'Docker', 'Kubernetes'],
    technologiesFr: ['Java', 'Quarkus', 'Angular', 'MongoDB', 'ElasticSearch', 'Neo4j', 'Redis', 'Docker', 'Kubernetes'],
    imageUrl: '/images/projects/uml_diagram_epitweet.png',
    bannerUrl: '/images/projects/uml_diagram_epitweet-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/2025-epitweet-tinyx-03',
    category: 'other',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2025-03-12'),
  },
  {
    slug: 'gnn-video-language',
    title: 'Graph-Based Audio-Visual Question Answering',
    titleFr: 'Réponse aux Questions Audio-Visuelles Basée sur les Graphes',
    description: 'GNN-based multimodal model for reasoning over video, audio and language',
    descriptionFr: 'Modèle multimodal basé sur les GNN pour le raisonnement sur la vidéo, l\'audio et le langage',
    longDescription: `Implementation of a Graph Neural Network architecture for Audio-Visual Question Answering (AVQA), based on multi-modal alignment between video, audio and textual queries.

---

## Model architecture

1. **Scene Graph Encoding:**
- Extract structured representations from video frames
- Nodes: objects/entities
- Edges: spatial and semantic relations
- Encoded using multiple GNN variants (GAT, GCN, GraphSAGE, GIN)

2. **Query Graph Encoding:**
- Natural language questions parsed into semantic graphs
- Captures relationships and roles within the query
- Separate GNN encoder

3. **Multi-Grained Audio-Visual Alignment (MgA):**
- Parallel 1D convolutions with kernel sizes {1, 3, 5}
- Captures temporal dependencies at multiple scales
- Cross-modal attention between audio and visual streams

4. **Hierarchical Matching:**
- Stage 1: intra-scale fusion
- Stage 2: inter-scale aggregation
- Graph-guided attention weighting

5. **Classification Head:**
- Gated fusion of multimodal features
- Final MLP for answer prediction

---

## Enhancements over original work
- Support for multiple GNN architectures with runtime selection
- Full evaluation pipeline (ablation, confusion matrix, per-question analysis)
- Visualization tools:
  - attention heatmaps
  - graph structures
  - training curves

---

## Training pipeline
- TensorBoard logging
- checkpointing & LR scheduling
- gradient clipping

---

## Dataset
- MUSIC-AVQA (audio-visual reasoning dataset)

This project explores structured reasoning over multimodal data using graph-based deep learning.`,
    longDescriptionFr: `Implémentation d'une architecture de réseau neuronal en graphes pour la réponse aux questions audio-visuelles (AVQA), basée sur un alignement multimodal entre la vidéo, l'audio et les requêtes textuelles.

---

## Architecture du modèle

1. **Encodage du graphe de scène :**
- Extraction de représentations structurées à partir des trames vidéo
- Nœuds : objets/entités
- Bords (edges) : relations spatiales et sémantiques
- Encodé avec diverses variantes de GNN (GAT, GCN, GraphSAGE, GIN)

2. **Encodage du graphe de requête :**
- Questions en langage naturel converties en graphes sémantiques
- Capture les relations et les rôles dans la requête
- Encodeur GNN séparé

3. **Alignement Audio-Visuel Multi-Grains (MgA) :**
- Convolutions 1D parallèles avec des tailles de noyau {1, 3, 5}
- Capture les dépendances temporelles à plusieurs échelles
- Attention inter-modale entre les flux audio et vidéo

4. **Correspondance hiérarchique :**
- Étape 1 : fusion intra-échelle
- Étape 2 : agrégation inter-échelle
- Pondération de l'attention guidée par le graphe

5. **Tête de classification :**
- Fusion contrôlée (gated) des caractéristiques multimodales
- MLP final pour la prédiction de la réponse

---

## Améliorations par rapport aux travaux originaux
- Support de plusieurs architectures GNN avec sélection à l'exécution
- Pipeline d'évaluation complet (ablation, matrice de confusion, analyse par question)
- Outils de visualisation :
  - cartes de chaleur d'attention
  - structures de graphes
  - courbes d'entraînement

---

## Pipeline d'entraînement
- Journalisation TensorBoard
- Checkpointing et planification du taux d'apprentissage (LR scheduling)
- Clipping des gradients

---

## Jeu de données
- MUSIC-AVQA (jeu de données de raisonnement audio-visuel)

Ce projet explore le raisonnement structuré sur des données multimodales à l'aide de l'apprentissage profond basé sur les graphes.`,
    details: {
      context: "EPITA Graph Neural Networks course project (paper reproduction)",
      duration: "2 weeks",
      team: "2 peoples",
      role: "Model implementation + experimentation",
      why: "Explore how graph structures can model complex relationships across modalities like video, audio, and language.",
      learnings: [
        "Graph Neural Network architectures (GAT, GCN, GraphSAGE, GIN)",
        "Multimodal learning and alignment",
        "Attention mechanisms across modalities",
        "Paper reproduction and experimental validation",
        "Debugging complex deep learning pipelines"
      ],
      improvements: [
        "Scale to larger datasets",
        "Improve multimodal fusion strategies"
      ]
    },
    detailsFr: {
      context: "EPITA - Projet de cours sur les réseaux neuronaux en graphes (reproduction d'article)",
      duration: "2 semaines",
      team: "2 personnes",
      role: "Implémentation de modèle + expérimentation",
      why: "Explorer comment les structures de graphes peuvent modéliser des relations complexes à travers des modalités telles que la vidéo, l'audio et le langage.",
      learnings: [
        "Architectures de réseaux neuronaux en graphes (GAT, GCN, GraphSAGE, GIN)",
        "Apprentissage et alignement multimodal",
        "Mécanismes d'attention entre modalités",
        "Reproduction de documents de recherche et validation expérimentale",
        "Débogage de pipelines d'apprentissage profond complexes"
      ],
      improvements: [
        "Mettre à l'échelle sur de plus grands jeux de données",
        "Améliorer les stratégies de fusion multimodale"
      ]
    },
    technologies: ['Python', 'PyTorch', 'GNN', 'Computer Vision', 'NLP', 'Multimodal Learning'],
    technologiesFr: ['Python', 'PyTorch', 'GNN', 'Vision par Ordinateur', 'NLP', 'Apprentissage Multimodal'],
    imageUrl: '/images/projects/gnn_avqa.png',
    bannerUrl: '/images/projects/gnn_avqa-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/GNN_Graph-Based_Video-Language_Learning',
    category: 'ai',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2026-01-03'),
  },
  {
    slug: 'diffusion-image-generation',
    title: 'Image Generation with Diffusion Models',
    titleFr: 'Génération d\'Images avec Modèles de Diffusion',
    description: 'Conditional diffusion model with classifier-free guidance for image synthesis',
    descriptionFr: 'Modèle de diffusion conditionnelle avec guidage sans classificateur pour la synthèse d\'images',
    longDescription: `Implementation of a conditional diffusion model for image generation, including classifier-free guidance and support for both grayscale and RGB datasets.

---

## Core concept
Learn to reverse a progressive noise process:
- Forward process: adds Gaussian noise over T steps
- Reverse process: neural network predicts noise ε to reconstruct the image

---

## Model
- U-Net architecture with:
  - time embedding (sinusoidal)
  - class embedding (for conditional generation)
  - optional self-attention layers for higher resolution

---

## Conditional generation
- Class embeddings combined with time embeddings
- Class dropout (≈10%) during training to enable classifier-free guidance

---

## Inference
- Reverse diffusion sampling from pure noise
- Guided prediction:\\
  ε_guided = ε_uncond + w * (ε_cond - ε_uncond)

- guidance_scale controls:
  - diversity vs fidelity trade-off
  - typical value ≈ 3.0

---

## Features
- Conditional digit generation (MNIST)
- Multi-sample generation per class
- Intermediate step visualization
- Full grid generation (0-9 x multiple variants)

---

## Extension to RGB
- Adaptation to CIFAR-like datasets (64x64)
- Deeper U-Net with:
  - multi-scale downsampling (64→32→16→8)
  - 3-channel support
  - self-attention layers

---

## Training
- up to 1000 diffusion steps
- early stopping
- data augmentation (flip, normalization)

This project demonstrates the internal mechanics of diffusion models and controlled image generation.`,
    longDescriptionFr: `Implémentation d'un modèle de diffusion conditionnelle pour la génération d'images, incluant un guidage sans classificateur et le support des jeux de données en niveaux de gris et RVB.

---

## Concept principal
Apprendre à inverser un processus de bruitage progressif :
- Processus avant : ajoute du bruit gaussien sur T étapes
- Processus inverse : le réseau de neurones prédit le bruit ε pour reconstruire l'image

---

## Modèle
- Architecture U-Net avec :
  - plongement temporel (time embedding, sinusoïdal)
  - plongement de classe (pour la génération conditionnelle)
  - couches d'auto-attention optionnelles pour des résolutions plus élevées

---

## Génération conditionnelle
- Plongements de classe combinés avec les plongements temporels
- Dropout de classe (≈10%) pendant l'entraînement pour permettre le guidage sans classificateur

---

## Inférence
- Échantillonnage par diffusion inverse à partir de bruit pur
- Prédiction guidée :\\
  ε_guided = ε_uncond + w * (ε_cond - ε_uncond)

- L'échelle de guidage (guidance_scale) contrôle :
  - le compromis entre diversité et fidélité
  - valeur typique ≈ 3.0

---

## Fonctionnalités
- Génération conditionnelle de chiffres (MNIST)
- Génération de plusieurs échantillons par classe
- Visualisation des étapes intermédiaires
- Génération de grille complète (0-9 x variantes multiples)

---

## Extension au RVB
- Adaptation aux jeux de données de type CIFAR (64x64)
- U-Net plus profond avec :
  - sous-échantillonnage multi-échelle (64→32→16→8)
  - support 3 canaux
  - couches d'auto-attention

---

## Entraînement
- jusqu'à 1000 étapes de diffusion
- arrêt précoce (early stopping)
- augmentation de données (retournement, normalisation)

Ce projet démontre la mécanique interne des modèles de diffusion et la génération d'images contrôlée.`,
    details: {
      context: "EPITA Stochastic course - Diffusion project",
      duration: "2 weeks",
      team: "2 peoples",
      role: "Deep learning engineer",
      why: "Understand the internal mechanics of diffusion models and how modern generative AI systems reconstruct data from noise.",
      learnings: [
        "Forward and reverse diffusion processes",
        "U-Net architectures for generative models",
        "Noise scheduling and time embeddings",
        "Classifier-free guidance mechanism",
        "Trade-off between diversity and fidelity"
      ],
      improvements: [
        "Train for more steps to improve sample quality",
      ]
    },
    detailsFr: {
      context: "EPITA Cours de stochastique - Projet de diffusion",
      duration: "2 semaines",
      team: "2 personnes",
      role: "Ingénieur en apprentissage profond",
      why: "Comprendre les mécanismes internes des modèles de diffusion et comment les systèmes modernes d'IA générative reconstruisent les données à partir du bruit.",
      learnings: [
        "Processus de diffusion avant et inverse",
        "Architectures U-Net pour les modèles génératifs",
        "Planification du bruit et plongements temporels",
        "Mécanisme de guidage sans classificateur",
        "Compromis entre diversité et fidélité"
      ],
      improvements: [
        "S'entraîner sur plus d'étapes pour améliorer la qualité des échantillons",
      ]
    },
    technologies: ['Python', 'PyTorch', 'Diffusion Models', 'Deep Learning'],
    technologiesFr: ['Python', 'PyTorch', 'Modèles de Diffusion', 'Apprentissage Profond'],
    imageUrl: '/images/projects/diffusion.png',
    bannerUrl: '/images/projects/diffusion-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/image-generation-using-diffusion',
    category: 'ai',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2026-01-09'),
  },
  {
    slug: 'rl-dash-agent',
    title: 'Reinforcement Learning Agent - Geometry Dash',
    titleFr: 'Agent d\'Apprentissage par Renforcement - Geometry Dash',
    description: 'Custom RL environment with DQN agents trained on a physics-based platform game',
    descriptionFr: 'Environnement RL personnalisé avec des agents DQN entraînés sur un jeu de plateforme basé sur la physique',
    longDescription: `A reinforcement learning project combining a custom-built game engine with multiple RL agents to solve a Geometry Dash-like game.

---

## Environment
- Fully custom game engine:
  - physics simulation (gravity, velocity)
  - obstacle-based levels (spikes, blocks, orbs)
- Headless RL environment for fast training (~1000 episodes/min)

---

## State space (65-dimensional vector)
- player position & velocity
- grounded state / gravity direction
- level progression
- 20 nearest objects (type + relative position)

---

## Action space
- binary: jump / no jump

---

## Reward function
- +100: level completion
- -10: death
- +0.1: forward progress
- +0.05: stability bonus (avoiding constant jumping)
---

## Agents
- DQN (Deep Q-Network)
  - MLP (128 → 64)
  - experience replay
  - epsilon-greedy exploration
- Baselines
  - random agent
  - simple epsilon-greedy

---

## Training features
- grid search for hyperparameter optimization
- multi-level training
- evaluation & benchmarking tools

---

## Replay system
- record and replay trajectories
- visualization of agent behavior

---

## Tooling
- CLI training interface
- comparison mode between agents
- visualization utilities

---

## Challenges
- sparse rewards
- high temporal precision
- exploration vs exploitation balance

This project focuses on applying reinforcement learning to real-time environments with custom physics and efficient training pipelines.`,
    longDescriptionFr: `Un projet d'apprentissage par renforcement combinant un moteur de jeu sur mesure avec plusieurs agents RL pour résoudre un jeu similaire à Geometry Dash.

---

## Environnement
- Moteur de jeu entièrement personnalisé :
  - simulation physique (gravité, vélocité)
  - niveaux basés sur des obstacles (pointes, blocs, orbes)
- Environnement RL sans interface graphique (headless) pour un entraînement rapide (~1000 épisodes/min)

---

## Espace d'état (vecteur de dimension 65)
- position et vitesse du joueur
- état au sol / direction de la gravité
- progression dans le niveau
- 20 objets les plus proches (type + position relative)

---

## Espace d'action
- binaire : sauter / ne pas sauter

---

## Fonction de récompense
- +100 : niveau terminé
- -10 : mort
- +0.1 : progression vers l'avant
- +0.05 : bonus de stabilité (éviter les sauts constants)
---

## Agents
- DQN (Deep Q-Network)
  - MLP (128 → 64)
  - relecture d'expérience (experience replay)
  - exploration epsilon-greedy
- Références (Baselines)
  - agent aléatoire
  - epsilon-greedy simple

---

## Fonctionnalités d'entraînement
- recherche par grille (grid search) pour l'optimisation des hyperparamètres
- entraînement multi-niveaux
- outils d'évaluation et de benchmark

---

## Système de relecture (Replay)
- enregistrer et rejouer les trajectoires
- visualisation du comportement de l'agent

---

## Outils
- interface d'entraînement en ligne de commande (CLI)
- mode de comparaison entre agents
- utilitaires de visualisation

---

## Défis
- récompenses clairsemées (sparse rewards)
- haute précision temporelle
- équilibre entre exploration et exploitation

Ce projet se concentre sur l'application de l'apprentissage par renforcement à des environnements en temps réel avec une physique personnalisée et des pipelines d'entraînement efficaces.`,
    details: {
      context: "EPITA Reinforcement Learning project",
      duration: "1 week",
      team: "2 people",
      role: "RL engineer + environment design",
      why: "Understand how reinforcement learning agents behave in real-time environments with physics constraints and sparse rewards.",
      learnings: [
        "Designing RL environments (state, action, reward)",
        "Handling sparse reward problems",
        "Training DQN agents with experience replay",
        "Balancing exploration vs exploitation"
      ],
      improvements: [
        "Improve reward shaping for faster convergence",
        "Add curriculum learning (progressive difficulty levels)",
        "Use convolutional input instead of engineered state vector"
      ]
    },
    detailsFr: {
      context: "EPITA - Projet d'apprentissage par renforcement",
      duration: "1 semaine",
      team: "2 personnes",
      role: "Ingénieur RL + conception d'environnement",
      why: "Comprendre comment les agents d'apprentissage par renforcement se comportent dans des environnements en temps réel avec des contraintes physiques et des récompenses clairsemées.",
      learnings: [
        "Conception d'environnements RL (état, action, récompense)",
        "Gestion des problèmes de récompenses clairsemées",
        "Entraînement d'agents DQN avec relecture d'expérience",
        "Équilibrer l'exploration et l'exploitation"
      ],
      improvements: [
        "Améliorer la mise en forme de la récompense (reward shaping) pour une convergence plus rapide",
        "Ajouter l'apprentissage par cursus (curriculum learning - niveaux de difficulté progressifs)",
        "Utiliser une entrée convolutive au lieu d'un vecteur d'état prédéfini"
      ]
    },
    technologies: ['Python', 'Reinforcement Learning', 'DQN', 'PyTorch', 'Game Simulation'],
    technologiesFr: ['Python', 'Apprentissage par Renforcement', 'DQN', 'PyTorch', 'Simulation de Jeu'],
    imageUrl: '/images/projects/rl_dash.jpg',
    bannerUrl: '/images/projects/rl_dash-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/Dash_reinforcment_learning_agent',
    category: 'ai',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2026-01-20'),
  }
];

const seed = async () => {
  const uri = getMongoUri();
  const dbName = getMongoDbName(uri);

  await mongoose.connect(uri, {
    dbName,
  });

  await Project.deleteMany({});
  await Project.insertMany(sampleProjects);

  console.log('Database seeded successfully');
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

# Portfolio Abel Aubron

Portfolio moderne et interactif avec projets de Machine Learning intégrés.

## Technologies

### Frontend

- React 18 + TypeScript
- TailwindCSS + Framer Motion
- Vite
- Axios

### Backend

- Node.js + Express
- MongoDB (Mongoose)
- FastAPI (Python) pour ML
- Flask pour services spécifiques

## Installation rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos configurations

# 3. Lancer tous les services
./start-all-services.sh

# 4. Accéder à l'application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
```

## Structure du projet

```
my_website/
├── src/                    # Frontend React
│   ├── components/        # Composants réutilisables
│   ├── pages/            # Pages et projets interactifs
│   └── types/            # Types TypeScript
├── server/               # Backend Node.js
│   ├── models/          # Modèles MongoDB
│   ├── routes/          # Routes API
│   └── prediction_conform/  # API Mushroom (Flask)
├── public/              # Fichiers statiques
└── docs/               # Documentation détaillée
```

## Projets interactifs

### 1. Chatbot IA (RAG)

- Port: 8000 (FastAPI)
- Chemin: `/chatbot`
- Conversational AI avec Retrieval-Augmented Generation

### 2. Solveur de Sudoku

- Port: 5000 (Flask)
- Chemin: `/sudoku`
- Résolution par backtracking optimisé

### 3. Classification de Champignons

- Port: 8001 (Flask)
- Chemin: `/mushroom`
- Prédiction conforme (conformal prediction)

### 4. Prédiction Stock CAC40

- Port: 8002 (FastAPI)
- Chemin: `/stock`
- LSTM pour prédiction de prix + simulations trading

## API Endpoints principaux

### Backend (port 3001)

- `GET /api/projects` - Liste des projets
- `GET /api/projects/:id` - Détail projet
- `POST /api/contact` - Formulaire de contact

### Services ML

- `POST /chatbot/api/chat` - Message chatbot
- `POST /sudoku/api/solve` - Résoudre sudoku
- `POST /mushroom/api/predict` - Prédire champignon
- `POST /stock/api/train` - Entraîner modèle stock
- `POST /stock/api/simulate` - Simuler trading

## Configuration

### MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=3001
```

### Services Python

Les services ML nécessitent leurs propres environnements virtuels.
Voir `docs/` pour les instructions détaillées.

## Développement

```bash
# Frontend seul
npm run dev

# Backend seul
npm run server

# Tous les services
./start-all-services.sh
```

## Documentation complète

- `docs/SETUP.md` - Installation détaillée
- `docs/API.md` - Documentation API complète
- `docs/README.md` - Guide des projets interactifs

## License

Projet personnel - Abel Aubron © 2025

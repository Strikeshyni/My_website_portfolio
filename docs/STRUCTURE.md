# Structure du Projet

## Fichiers racine

- `README.md` - Documentation principale
- `package.json` - Dependances Node.js
- `vite.config.ts` - Configuration Vite (dev server + proxies)
- `tailwind.config.js` - Configuration TailwindCSS
- `tsconfig.json` - Configuration TypeScript
- `start-all-services.sh` - Script de demarrage complet
- `setup-images.sh` - Script de preparation des images

## Dossiers principaux

### `/src` - Frontend React

```
src/
├── components/         # Composants React reutilisables
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── pages/             # Pages de l'application
│   ├── Home.tsx
│   ├── ProjectDetail.tsx
│   └── projects/
│       ├── ChatBot.tsx
│       ├── SudokuSolver.tsx
│       ├── MushroomClassifier.tsx
│       └── StockPrediction.tsx
├── types/             # Types TypeScript
├── App.tsx            # Composant principal
├── main.tsx           # Point d'entree
└── index.css          # Styles globaux
```

### `/server` - Backend Node.js + Services Python

```
server/
├── models/            # Modeles MongoDB
│   └── Project.js
├── routes/            # Routes Express API
│   └── projects.js
├── prediction_conform/ # Service Mushroom (Flask)
│   ├── mushroom_api.py
│   ├── conformal_predictor.py
│   └── generate_calibration.py
├── sudoku/            # Service Sudoku (Flask)
│   └── api.py
├── seed.js            # Script d'initialisation DB
└── index.js           # Serveur Express principal
```

### `/public` - Fichiers statiques

```
public/
├── images/
│   ├── avatar.jpg
│   └── projects/
│       ├── chatbot.jpg
│       ├── sudoku.jpg
│       ├── mushroom.jpg
│       └── stock.jpg
└── samples/
    └── mushroom_samples.json
```

### `/docs` - Documentation

```
docs/
├── README.md           # Index de la documentation
├── SETUP.md           # Guide d'installation
├── API.md             # Reference API
├── README_API.md      # API Stock detaillee
├── STRATEGIES_GUIDE.md # Guide strategies trading
└── CHANGELOG.md       # Historique des versions
```

## Services externes

### Chatbot (Port 8000)
Localisation: `../chatbot_perso/`
Type: FastAPI
Description: IA conversationnelle avec RAG

### Stock Prediction (Port 8002)
Localisation: `../CAC40_stock_prediction/`
Type: FastAPI
Description: LSTM pour prediction de prix + simulations

## Ports utilises

- 5173: Frontend (Vite)
- 3001: Backend API (Express)
- 27017: MongoDB
- 8000: Chatbot API (FastAPI)
- 8004: Sudoku API (Flask)
- 8001: Mushroom API (Flask)
- 8002: Stock API (FastAPI)

## Configuration

### Variables d'environnement (.env)

```env
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=3001
NODE_ENV=development
```

### Proxies Vite (vite.config.ts)

- `/api` → http://localhost:3001
- `/chatbot` → http://localhost:8000
- `/mushroom` → http://localhost:8001
- `/stock` → http://localhost:8002

## Scripts NPM

```bash
npm run dev          # Lancer frontend (port 5173)
npm run server       # Lancer backend (port 3001)
npm run build        # Build production
npm run preview      # Preview build production
npm run seed         # Initialiser la base de donnees
```

## Workflow de developpement

1. Lancer MongoDB
2. Executer `./start-all-services.sh`
3. Ouvrir http://localhost:5173
4. Modifier le code (hot reload automatique)

## Notes

- Les services Python necessitent leurs propres environnements virtuels
- MongoDB doit etre lance avant le backend
- Les modeles ML sont stockes dans leurs projets respectifs
- La documentation API interactive est disponible sur /docs pour les services FastAPI

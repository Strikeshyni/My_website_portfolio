# Documentation

## Guides principaux

### [Installation](SETUP.md)

Guide complet d'installation et configuration de tous les services.

### [API Reference](API.md)

Documentation detaillee de tous les endpoints API disponibles.

### [Structure du Projet](STRUCTURE.md)

Organisation des fichiers et dossiers du projet.

### [Strategies de Trading](STRATEGIES_GUIDE.md)

Guide des 5 strategies de trading pour les simulations stock.

### [API Stock CAC40](README_API.md)

Documentation complete de l'API de prediction de stock et simulations.

### [Changelog](CHANGELOG.md)

Historique des modifications et versions.

## Structure du projet

```
my_website/
├── src/                    # Frontend React + TypeScript
├── server/                 # Backend Node.js + Services Python
├── public/                 # Fichiers statiques
└── docs/                   # Documentation
```

## Services disponibles

| Service | Port | Type | Description |
|---------|------|------|-------------|
| Frontend | 5173 | Vite | Application React |
| Backend | 3001 | Express | API principale + MongoDB |
| Chatbot | 8000 | FastAPI | IA conversationnelle RAG |
| Sudoku | 8004 | Flask | Solveur de grilles |
| Mushroom | 8001 | Flask | Classification conforme |
| Stock | 8002 | FastAPI | Prediction LSTM + Trading |

## Demarrage rapide

```bash
# Tout demarrer
./start-all-services.sh

# Ou separement
npm run dev          # Frontend
npm run server       # Backend
```

## Liens utiles

- Repository: https://github.com/Strikeshyni/My_website_portfolio
- Documentation API interactive Stock: http://localhost:8002/docs
- Documentation API interactive Chatbot: http://localhost:8000/docs

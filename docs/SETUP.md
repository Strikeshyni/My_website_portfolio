# Guide d'installation

## Prérequis

- Node.js 18+
- Python 3.8+
- MongoDB

## Installation Backend Node.js

```bash
npm install
```

Configuration MongoDB dans `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=3001
NODE_ENV=development
```

Initialiser la base de données:

Si pas lancé:
```bash
docker run -d -p 27017:27017 --name mongodb mongo

```

```bash
npm run seed
```

## Installation Services Python

### 1. Chatbot (RAG)

Localisation: Projet externe `chatbot_perso/`

```bash
cd ../chatbot_perso
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Configuration: Voir documentation du projet chatbot

### 2. Solveur Sudoku

Localisation: `server/sudoku/`

```bash
cd server/sudoku
python -m venv venv
source venv/bin/activate
pip install flask flask-cors
```

### 3. Classification Champignons

Localisation: `server/prediction_conform/`

```bash
cd server/prediction_conform
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Générer les scores de calibration:

```bash
python generate_calibration.py
```

### 4. Prédiction Stock CAC40

Localisation: Projet externe `CAC40_stock_prediction/`

```bash
cd ../CAC40_stock_prediction
pip install keras-tuner yfinance tensorflow scikit-learn pandas numpy
```

### 5. OCR Sudoku

Localisation: `server/ocr_sudoku/`

```bash
cd server/ocr_sudoku
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Démarrage

### Option 1: Tout démarrer automatiquement

```bash
./start-all-services.sh
```

### Option 2: Démarrer manuellement

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

Terminal 3 - Chatbot:
```bash
cd ../chatbot_perso
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8000
```

Terminal 4 - Sudoku:
```bash
cd server/sudoku
source venv/bin/activate
python api.py
```

Terminal 5 - Mushroom:
```bash
cd server/prediction_conform
source venv/bin/activate
python mushroom_api.py
```

Terminal 6 - Stock:
```bash
cd ../CAC40_stock_prediction
uvicorn api.main:app --host 0.0.0.0 --port 8002
```

Terminal 7 - OCR Sudoku:
```bash
cd server/ocr_sudoku
source venv/bin/activate
uvicorn api:app --host 0.0.0.0 --port 8003
```

## Vérification

Accéder aux services:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Chatbot API: http://localhost:8000/docs
- Sudoku API: http://localhost:8004
- Mushroom API: http://localhost:8001
- Stock API: http://localhost:8002/docs
- OCR Sudoku API: http://localhost:8003/docs

## Problèmes courants

### MongoDB ne démarre pas

```bash
# Avec Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Ou vérifier le service local
sudo systemctl status mongod
```

### Port déjà utilisé

```bash
# Trouver le processus
lsof -i :3001

# Tuer le processus
kill -9 <PID>
```

### Modules Python manquants

Vérifier que l'environnement virtuel est activé:

```bash
which python  # Doit pointer vers venv/bin/python
```

Réinstaller les dépendances:

```bash
pip install -r requirements.txt
```

# Documentation API

## Backend Principal (Port 3001)

### Projets

**Liste des projets**
```
GET /api/projects
```

Réponse:
```json
[
  {
    "_id": "...",
    "title": "Nom du projet",
    "description": "Description courte",
    "longDescription": "Description détaillée",
    "technologies": ["React", "TypeScript"],
    "category": "web",
    "featured": true,
    "interactive": true,
    "interactivePath": "/projects/demo",
    "githubUrl": "https://github.com/...",
    "liveUrl": "https://..."
  }
]
```

**Détails d'un projet**
```
GET /api/projects/:id
```

**Créer un projet**
```
POST /api/projects
Content-Type: application/json

{
  "title": "Nouveau projet",
  "description": "Description",
  "technologies": ["Tech1", "Tech2"],
  "category": "web"
}
```

**Modifier un projet**
```
PUT /api/projects/:id
```

**Supprimer un projet**
```
DELETE /api/projects/:id
```

### Contact

```
POST /api/contact
Content-Type: application/json

{
  "name": "Nom",
  "email": "email@example.com",
  "message": "Message"
}
```

## Chatbot IA (Port 8000)

**Envoyer un message**
```
POST /api/chat
Content-Type: application/json

{
  "message": "Votre question",
  "conversation_id": "optional-id"
}
```

Réponse:
```json
{
  "response": "Réponse du chatbot",
  "conversation_id": "id-unique",
  "sources": ["source1.pdf", "source2.txt"]
}
```

Documentation interactive: http://localhost:8000/docs

## Solveur Sudoku (Port 8004)

**Résoudre une grille**
```
POST /api/solve
Content-Type: application/json

{
  "grid": [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    ...
  ]
}
```

Réponse:
```json
{
  "solved": true,
  "solution": [[5,3,4,...], ...],
  "steps": 245,
  "time": 0.123
}
```

## Classification Champignons (Port 8001)

**Prédire la classe**
```
POST /api/predict
Content-Type: application/json

{
  "features": {
    "cap-shape": "x",
    "cap-surface": "s",
    "cap-color": "n",
    ...
  }
}
```

Réponse:
```json
{
  "prediction_set": ["edible", "poisonous"],
  "top_prediction": "edible",
  "confidence": 0.92,
  "alpha": 0.1,
  "threshold": 0.88
}
```

**Obtenir les features disponibles**
```
GET /api/features
```

## Prédiction Stock CAC40 (Port 8002)

### Entraînement

**Lancer un entraînement**
```
POST /api/train
Content-Type: application/json

{
  "stock_name": "ENGI.PA",
  "from_date": "2015-01-01",
  "to_date": "2024-12-31",
  "train_size_percent": 0.8,
  "val_size_percent": 0.2,
  "time_step": 300,
  "global_tuning": true
}
```

Réponse:
```json
{
  "job_id": "uuid",
  "status": "pending",
  "message": "Training job started"
}
```

**Vérifier le statut**
```
GET /api/train/{job_id}/status
```

**WebSocket pour suivi temps réel**
```
WS /ws/training/{job_id}
```

### Prédictions

**Faire des prédictions**
```
POST /api/predict
Content-Type: application/json

{
  "job_id": "uuid-du-modele-entraine",
  "n_days": 5
}
```

Réponse:
```json
{
  "job_id": "uuid",
  "stock_name": "ENGI.PA",
  "predictions": [
    {"day": 1, "predicted_price": 12.45},
    {"day": 2, "predicted_price": 12.52},
    ...
  ],
  "last_actual_price": 12.40,
  "last_actual_date": "2025-01-01"
}
```

### Simulation

**Lancer une simulation**
```
POST /api/simulate
Content-Type: application/json

{
  "stock_name": "ENGI.PA",
  "from_date": "2024-01-01",
  "to_date": "2024-12-31",
  "initial_balance": 100.0,
  "time_step": 300,
  "nb_years_data": 10,
  "strategy": "conservative",
  "buy_threshold": 2.0,
  "min_profit_percentage": 5.0
}
```

Réponse immédiate:
```json
{
  "sim_id": "uuid",
  "status": "pending",
  "stock_name": "ENGI.PA"
}
```

**Vérifier le statut de simulation**
```
GET /api/simulate/{sim_id}/status
```

**WebSocket pour suivi temps réel**
```
WS /ws/simulation/{sim_id}
```

**Récupérer les résultats**
```
GET /api/simulate/{sim_id}/results
```

Réponse:
```json
{
  "sim_id": "uuid",
  "status": "completed",
  "stock_name": "ENGI.PA",
  "initial_balance": 100.0,
  "final_balance": 125.50,
  "benefit": 25.50,
  "benefit_percentage": 25.5,
  "strategy_used": "conservative",
  "summary": {
    "total_trades": 23,
    "buy_trades": 12,
    "sell_trades": 11,
    "win_rate": 72.73
  }
}
```

**Récupérer les transactions**
```
GET /api/simulate/{sim_id}/transactions
```

Documentation interactive: http://localhost:8002/docs

## Stratégies de trading

### Simple
Achète si hausse prédite, vend si baisse prédite.

Paramètres: Aucun

### Threshold
Trade uniquement si différence > seuil en euros.

Paramètres:
- `buy_threshold`: Seuil d'achat en euros (0.1-5.0)
- `sell_threshold`: Seuil de vente en euros (0.1-5.0)

### Percentage
Trade selon le pourcentage de changement.

Paramètres:
- `buy_threshold`: Pourcentage minimal pour acheter (0.1-10.0)
- `sell_threshold`: Pourcentage minimal pour vendre (0.1-10.0)

### Conservative
Attend un profit cible avant de vendre.

Paramètres:
- `min_profit_percentage`: Profit minimum requis (1-20)
- `buy_threshold`: Pourcentage de hausse pour acheter (0.5-10.0)

### Aggressive
Trade fréquent avec stop-loss.

Paramètres:
- `buy_threshold`: Seuil très bas pour acheter (0.1-2.0)
- `max_loss_percentage`: Stop-loss automatique (1-10)

## Codes d'erreur

### Backend (3001)
- 400: Requête invalide
- 404: Ressource non trouvée
- 500: Erreur serveur

### Services Python
- 400: Validation échouée
- 404: Job/Simulation non trouvé
- 422: Données invalides
- 500: Erreur interne

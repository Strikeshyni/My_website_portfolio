# Mushroom Classification API

API Flask pour la classification de champignons avec prédiction conforme.

## Installation

```bash
pip install -r requirements.txt
```

## Lancer l'API

```bash
python mushroom_api.py
```

L'API démarrera sur `http://localhost:8001`

## Fichiers nécessaires

- `best_mushroom_model.pth` - Modèle PyTorch pré-entraîné (déjà présent)
- `calibration_scores.npy` - Scores de calibration (optionnel, utilise des valeurs par défaut si absent)
- `mushroom_classes.json` - Noms des 169 classes (optionnel)
- `toxic_species.json` - Liste des espèces toxiques (optionnel)

## Endpoints

### GET /health
Vérifier l'état de l'API

### POST /predict
Classifier une image de champignon

**Paramètres:**
- `image`: fichier image (multipart/form-data)
- `alpha`: niveau de signification (optionnel, défaut 0.1)

**Exemple:**
```bash
curl -X POST http://localhost:8001/predict \
  -F "image=@champignon.jpg" \
  -F "alpha=0.1"
```

## Configuration

Modifiez `mushroom_api.py` pour personnaliser:
- `MUSHROOM_CLASSES`: noms des 169 espèces
- `TOXIC_SPECIES`: espèces toxiques à détecter

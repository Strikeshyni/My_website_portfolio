"""
API Flask pour la classification de champignons avec prédiction conforme
Utilise un modèle PyTorch pré-entraîné pour l'inférence uniquement
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
import numpy as np
import io
import os

app = Flask(__name__)
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
CORS(app, resources={r"/*": {"origins": allowed_origins}})

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, 'best_mushroom_model.pth')
CALIBRATION_SCORES_PATH = os.path.join(SCRIPT_DIR, 'calibration_scores.npy')

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")


# Architecture du modèle CNN (identique au notebook)
class MushroomCNN(nn.Module):
    def __init__(self, num_classes=169):
        super(MushroomCNN, self).__init__()
        
        # Bloc 1
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 32, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(32)
        self.pool1 = nn.MaxPool2d(2, 2)
        
        # Bloc 2
        self.conv3 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(64)
        self.conv4 = nn.Conv2d(64, 64, kernel_size=3, padding=1)
        self.bn4 = nn.BatchNorm2d(64)
        self.pool2 = nn.MaxPool2d(2, 2)
        
        # Bloc 3
        self.conv5 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn5 = nn.BatchNorm2d(128)
        self.conv6 = nn.Conv2d(128, 128, kernel_size=3, padding=1)
        self.bn6 = nn.BatchNorm2d(128)
        self.pool3 = nn.MaxPool2d(2, 2)
        
        # Bloc 4
        self.conv7 = nn.Conv2d(128, 256, kernel_size=3, padding=1)
        self.bn7 = nn.BatchNorm2d(256)
        self.conv8 = nn.Conv2d(256, 256, kernel_size=3, padding=1)
        self.bn8 = nn.BatchNorm2d(256)
        self.pool4 = nn.MaxPool2d(2, 2)
        
        # FC
        self.fc1 = nn.Linear(256 * 8 * 8, 512)
        self.dropout1 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(512, 256)
        self.dropout2 = nn.Dropout(0.5)
        self.fc3 = nn.Linear(256, num_classes)
    
    def forward(self, x):
        x = F.relu(self.bn1(self.conv1(x)))
        x = F.relu(self.bn2(self.conv2(x)))
        x = self.pool1(x)
        
        x = F.relu(self.bn3(self.conv3(x)))
        x = F.relu(self.bn4(self.conv4(x)))
        x = self.pool2(x)
        
        x = F.relu(self.bn5(self.conv5(x)))
        x = F.relu(self.bn6(self.conv6(x)))
        x = self.pool3(x)
        
        x = F.relu(self.bn7(self.conv7(x)))
        x = F.relu(self.bn8(self.conv8(x)))
        x = self.pool4(x)
        
        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = self.dropout1(x)
        x = F.relu(self.fc2(x))
        x = self.dropout2(x)
        x = self.fc3(x)
        
        return x


# Classe de prédiction conforme
class ConformalPredictor:
    def __init__(self, model, calibration_scores, alpha=0.1, device='cpu'):
        self.model = model
        self.alpha = alpha
        self.device = device
        self.calibration_scores = np.sort(calibration_scores)
        
    def predict(self, inputs):
        """Créer des ensembles de prédiction conformes"""
        self.model.eval()
        
        with torch.no_grad():
            outputs = self.model(inputs)
            probabilities = F.softmax(outputs, dim=1)
            
            # Calculer le seuil de calibration (comme dans le notebook)
            n = len(self.calibration_scores)
            q_level = np.ceil((n + 1) * (1 - self.alpha)) / n
            q_level = min(q_level, 1.0)
            threshold = np.quantile(self.calibration_scores, q_level)
            
            # Créer les ensembles de prédiction
            # Score de non-conformité = 1 - probabilité
            nonconformity_scores = 1 - probabilities
            prediction_sets = nonconformity_scores <= threshold
            
            # GARANTIE: Toujours inclure au moins la classe top-1
            # (évite les ensembles vides quand le seuil est trop strict)
            for i in range(len(prediction_sets)):
                if not prediction_sets[i].any():  # Si ensemble vide
                    top1_idx = torch.argmax(probabilities[i])
                    prediction_sets[i, top1_idx] = True
            
        return prediction_sets.cpu().numpy(), probabilities.cpu().numpy(), threshold


# Charger les noms réels des classes
MUSHROOM_CLASSES_FILE = os.path.join(SCRIPT_DIR, 'mushroom_classes_real.txt')
if os.path.exists(MUSHROOM_CLASSES_FILE):
    with open(MUSHROOM_CLASSES_FILE, 'r', encoding='utf-8') as f:
        MUSHROOM_CLASSES = [line.strip() for line in f.readlines()]
    print(f"✅ Loaded {len(MUSHROOM_CLASSES)} real species names")
else:
    # Fallback aux noms génériques
    MUSHROOM_CLASSES = [f"Espèce_{i:03d}" for i in range(169)]
    print(f"⚠️  Using generic species names")

# Charger les espèces toxiques
TOXIC_SPECIES_FILE = os.path.join(SCRIPT_DIR, 'toxic_species_real.txt')
if os.path.exists(TOXIC_SPECIES_FILE):
    with open(TOXIC_SPECIES_FILE, 'r', encoding='utf-8') as f:
        TOXIC_SPECIES = [line.strip() for line in f.readlines()]
    print(f"✅ Loaded {len(TOXIC_SPECIES)} toxic species")
else:
    # Fallback
    TOXIC_SPECIES = ["Amanita muscaria", "Amanita phalloides", "Psilocybe cyanescens"]
    print(f"⚠️  Using default toxic species")

# Transformation pour les images
transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Charger le modèle pré-entraîné
print(f"Loading model from: {MODEL_PATH}")
model = MushroomCNN(num_classes=169)

if os.path.exists(MODEL_PATH):
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    print("✅ Pre-trained model loaded successfully!")
else:
    print("⚠️  Model file not found, using random initialization")

model.eval()
model = model.to(device)

# Charger les scores de calibration
if os.path.exists(CALIBRATION_SCORES_PATH):
    calibration_scores = np.load(CALIBRATION_SCORES_PATH)
    print(f"✅ Calibration scores loaded: {len(calibration_scores)} samples")
else:
    # Scores par défaut (distribution Beta)
    calibration_scores = np.random.beta(2, 5, size=1000)
    print("⚠️  Using default calibration scores")


@app.route('/health', methods=['GET'])
def health():
    """Vérifier l'état de l'API"""
    return jsonify({
        'status': 'healthy',
        'device': str(device),
        'model_loaded': os.path.exists(MODEL_PATH),
        'num_classes': 169
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Prédire l'espèce de champignon avec prédiction conforme
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        alpha = float(request.form.get('alpha', 0.1))
        
        # Charger et transformer l'image
        image = Image.open(io.BytesIO(image_file.read())).convert('RGB')
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Prédicteur conforme
        cp = ConformalPredictor(model, calibration_scores, alpha=alpha, device=device)
        
        # Prédiction
        pred_sets, probs, threshold = cp.predict(image_tensor)
        pred_set = pred_sets[0]
        prob = probs[0]
        
        # Trier TOUTES les classes par probabilité (pour affichage complet)
        all_indices = np.argsort(prob)[::-1]  # Du plus probable au moins probable
        all_classes = [MUSHROOM_CLASSES[i] for i in all_indices]
        all_probs = prob[all_indices]
        
        # Classes dans l'ensemble de prédiction conforme
        predicted_indices = np.where(pred_set)[0]
        predicted_probs = prob[predicted_indices]
        
        # Trier par probabilité
        sorted_indices = np.argsort(predicted_probs)[::-1]
        predicted_indices = predicted_indices[sorted_indices]
        predicted_probs = predicted_probs[sorted_indices]
        
        conformal_set_classes = [MUSHROOM_CLASSES[i] for i in predicted_indices]
        
        # Top-1
        top1_idx = np.argmax(prob)
        top1_class = MUSHROOM_CLASSES[top1_idx]
        top1_prob = float(prob[top1_idx])
        
        # Vérifier toxicité
        toxic_in_set = [cls for cls in conformal_set_classes if cls in TOXIC_SPECIES]
        
        result = {
            # Ensemble de prédiction conforme
            'predicted_classes': conformal_set_classes,
            'probabilities': predicted_probs.tolist(),
            'set_size': len(conformal_set_classes),
            
            # TOUTES les classes triées par probabilité
            'all_classes': all_classes,
            'all_probabilities': all_probs.tolist(),
            
            # Métadonnées
            'coverage': 1 - alpha,
            'top1_class': top1_class,
            'top1_prob': top1_prob,
            'has_toxic': len(toxic_in_set) > 0,
            'toxic_species': toxic_in_set,
            'alpha': alpha,
            'threshold': float(threshold)
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*70)
    print("🍄 Mushroom Classification API with Conformal Prediction")
    print("="*70)
    print(f"Device: {device}")
    print(f"Model: MushroomCNN (169 classes)")
    print(f"Model file: {'✅ Found' if os.path.exists(MODEL_PATH) else '❌ Not found'}")
    print(f"Calibration: {'✅ Found' if os.path.exists(CALIBRATION_SCORES_PATH) else '⚠️  Using defaults'}")
    print(f"Server: http://localhost:8001")
    print("="*70 + "\n")
    
    app.run(host='0.0.0.0', port=8001, debug=True)

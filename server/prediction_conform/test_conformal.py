"""
Script de test pour vérifier la prédiction conforme
"""

import numpy as np

# Charger les scores
scores = np.load('calibration_scores.npy')

print("="*70)
print("ANALYSE DES SCORES DE CALIBRATION")
print("="*70)

print(f"\n📊 Statistiques générales:")
print(f"   • Nombre de scores: {len(scores)}")
print(f"   • Moyenne: {np.mean(scores):.4f}")
print(f"   • Médiane: {np.median(scores):.4f}")
print(f"   • Écart-type: {np.std(scores):.4f}")
print(f"   • Min: {np.min(scores):.4f} → Prob max: {1-np.min(scores):.2%}")
print(f"   • Max: {np.max(scores):.4f} → Prob min: {1-np.max(scores):.2%}")

print(f"\n🎯 Seuils pour différents niveaux de confiance:")
alphas = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3]
for alpha in alphas:
    n = len(scores)
    q_level = np.ceil((n + 1) * (1 - alpha)) / n
    q_level = min(q_level, 1.0)
    threshold = np.quantile(scores, q_level)
    min_prob = 1 - threshold
    
    print(f"   • α={alpha:.2f} (confiance {1-alpha:.0%}): "
          f"seuil={threshold:.4f} → prob min={min_prob:.2%}")

print(f"\n📈 Distribution des scores:")
bins = [0, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 1.0]
labels = [
    "Excellentes (prob > 70%)",
    "Bonnes (prob 50-70%)",
    "Moyennes (prob 30-50%)",
    "Faibles (prob 20-30%)",
    "Très faibles (prob 10-20%)",
    "Mauvaises (prob 5-10%)",
    "Très mauvaises (prob < 5%)"
]

for i in range(len(bins)-1):
    count = np.sum((scores >= bins[i]) & (scores < bins[i+1]))
    pct = 100 * count / len(scores)
    bar = "█" * int(pct / 2)
    print(f"   {labels[i]:30s}: {count:4d} ({pct:5.1f}%) {bar}")

print(f"\n💡 Interprétation:")
print(f"   Avec α=0.1 (confiance 90%), le seuil est à {np.quantile(scores, 0.9):.4f}")
print(f"   Cela signifie que toutes les classes avec probabilité > {1-np.quantile(scores, 0.9):.1%}")
print(f"   seront incluses dans l'ensemble de prédiction.")
print(f"\n   Si le modèle prédit la vraie classe avec prob > {1-np.quantile(scores, 0.9):.1%},")
print(f"   elle sera dans l'ensemble avec une garantie statistique ≥ 90%.")
print("="*70)

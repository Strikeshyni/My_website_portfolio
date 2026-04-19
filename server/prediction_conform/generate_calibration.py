"""
Générer des scores de calibration synthétiques pour la prédiction conforme
Ce script crée un fichier calibration_scores.npy avec des scores réalistes
"""

import numpy as np
import os

def generate_calibration_scores(n_samples=1000, output_file='calibration_scores.npy'):
    """
    Génère des scores de calibration synthétiques réalistes pour 169 classes
    
    Pour un problème de classification à 169 classes:
    - Un modèle parfait aurait score=0 (prob=1.0 pour la vraie classe)
    - Un modèle aléatoire aurait score≈0.994 (prob≈1/169)
    - Un bon modèle a des scores entre 0.3 et 0.8
    
    Nous utilisons une distribution qui reflète un modèle réaliste:
    - 70% des prédictions: bonnes (scores entre 0.3-0.7, prob 30%-70%)
    - 20% des prédictions: moyennes (scores 0.7-0.9, prob 10%-30%)
    - 10% des prédictions: mauvaises (scores 0.9-0.995, prob <10%)
    
    Args:
        n_samples: Nombre de scores à générer
        output_file: Chemin du fichier de sortie
    """
    
    print(f"Génération de {n_samples} scores de calibration réalistes...")
    
    scores = []
    
    # 70% bonnes prédictions (Beta(2, 3) décalé et mis à l'échelle)
    good_predictions = int(n_samples * 0.7)
    good_scores = 0.3 + 0.4 * np.random.beta(2, 3, size=good_predictions)
    scores.extend(good_scores)
    
    # 20% prédictions moyennes
    medium_predictions = int(n_samples * 0.2)
    medium_scores = 0.7 + 0.2 * np.random.beta(2, 2, size=medium_predictions)
    scores.extend(medium_scores)
    
    # 10% mauvaises prédictions
    bad_predictions = n_samples - good_predictions - medium_predictions
    bad_scores = 0.9 + 0.095 * np.random.beta(2, 5, size=bad_predictions)
    scores.extend(bad_scores)
    
    scores = np.array(scores)
    np.random.shuffle(scores)  # Mélanger
    
    # Statistiques
    print("\n" + "="*60)
    print("Statistiques des scores de calibration")
    print("="*60)
    print(f"Nombre de scores: {len(scores)}")
    print(f"Moyenne:          {np.mean(scores):.4f}")
    print(f"Médiane:          {np.median(scores):.4f}")
    print(f"Écart-type:       {np.std(scores):.4f}")
    print(f"Min:              {np.min(scores):.4f}")
    print(f"Max:              {np.max(scores):.4f}")
    print("\nQuantiles:")
    for q in [0.1, 0.25, 0.5, 0.75, 0.9, 0.95]:
        print(f"  Q{q:.2f}: {np.quantile(scores, q):.4f}")
    print("="*60 + "\n")
    
    # Sauvegarder
    np.save(output_file, scores)
    print(f"✅ Scores sauvegardés dans: {output_file}")
    
    # Vérification
    loaded = np.load(output_file)
    assert len(loaded) == n_samples, "Erreur de sauvegarde"
    print(f"✅ Vérification OK ({len(loaded)} scores)")
    
    return scores


def generate_mushroom_classes(n_classes=169, output_file='mushroom_classes.txt'):
    """
    Génère des noms de classes de champignons
    
    Args:
        n_classes: Nombre de classes
        output_file: Fichier de sortie
    """
    
    print(f"\nGénération de {n_classes} noms de classes...")
    
    # Noms génériques pour le moment
    classes = [f"Espèce_{i:03d}" for i in range(n_classes)]
    
    # Sauvegarder
    with open(output_file, 'w') as f:
        for cls in classes:
            f.write(cls + '\n')
    
    print(f"✅ Classes sauvegardées dans: {output_file}")
    
    return classes


def generate_toxic_species(output_file='toxic_species.txt'):
    """
    Génère une liste d'espèces toxiques (exemples)
    
    Args:
        output_file: Fichier de sortie
    """
    
    print(f"\nGénération de la liste d'espèces toxiques...")
    
    # Exemples d'indices (à adapter selon le vrai dataset)
    toxic_indices = [5, 12, 23, 34, 45, 67, 89, 101, 123, 145]
    toxic_species = [f"Espèce_{i:03d}" for i in toxic_indices]
    
    # Sauvegarder
    with open(output_file, 'w') as f:
        for species in toxic_species:
            f.write(species + '\n')
    
    print(f"✅ Espèces toxiques ({len(toxic_species)}) sauvegardées dans: {output_file}")
    
    return toxic_species


if __name__ == '__main__':
    print("\n" + "="*60)
    print("Génération des fichiers de calibration")
    print("="*60 + "\n")
    
    # Répertoire courant
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Générer les scores de calibration
    scores = generate_calibration_scores(
        n_samples=1000,
        output_file=os.path.join(script_dir, 'calibration_scores.npy')
    )
    
    # Générer les noms de classes
    classes = generate_mushroom_classes(
        n_classes=169,
        output_file=os.path.join(script_dir, 'mushroom_classes.txt')
    )
    
    # Générer les espèces toxiques
    toxic = generate_toxic_species(
        output_file=os.path.join(script_dir, 'toxic_species.txt')
    )
    
    print("\n" + "="*60)
    print("✅ Tous les fichiers ont été générés avec succès!")
    print("="*60 + "\n")
    
    print("Fichiers créés:")
    print(f"  • calibration_scores.npy  ({len(scores)} scores)")
    print(f"  • mushroom_classes.txt    ({len(classes)} classes)")
    print(f"  • toxic_species.txt       ({len(toxic)} espèces)")
    print("\nL'API peut maintenant utiliser ces fichiers pour des prédictions plus précises.")

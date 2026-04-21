# Test Set - Images de Champignons

12 images d'exemple pour tester la démo de classification de champignons avec prédiction conforme.

## Images disponibles

| # | Espèce | Comestibilité | Fichier |
|---|--------|---------------|---------|
| 1 | Amanita muscaria | ☠️ Très toxique | `00_Amanita_muscaria.jpg` |
| 2 | Boletus edulis | ✅ Excellent | `01_Boletus_edulis.jpg` |
| 3 | Cantharellus cibarius | ✅ Excellent | `02_Cantharellus_cibarius.jpg` |
| 4 | Psilocybe cyanescens | ☠️ Hallucinogène | `03_Psilocybe_cyanescens.jpg` |
| 5 | Lactarius deliciosus | ✅ Bon | `04_Lactarius_deliciosus.jpg` |
| 6 | Phallus impudicus | ⚠️ Comestible jeune | `05_Phallus_impudicus.jpg` |
| 7 | Trametes versicolor | ❌ Non comestible | `06_Trametes_versicolor.jpg` |
| 8 | Ganoderma applanatum | ❌ Non comestible | `07_Ganoderma_applanatum.jpg` |
| 9 | Grifola frondosa | ✅ Bon | `08_Grifola_frondosa.jpg` |
| 10 | Cerioporus squamosus | ⚠️ Comestible jeune | `09_Cerioporus_squamosus.jpg` |
| 11 | Cladonia fimbriata | ℹ️ Lichen | `10_Cladonia_fimbriata.jpg` |
| 12 | Agaricus augustus | ✅ Bon | `11_Agaricus_augustus.jpg` |

## Utilisation

Ces images sont :
- ✅ Directement accessibles dans la démo via la galerie
- ✅ Sélectionnables en un clic
- ✅ Représentatives de différentes espèces (comestibles, toxiques, non comestibles)
- ✅ Issues du dataset Kaggle Mushroom1 (169 classes)

## Espèces toxiques

⚠️ **Attention** : 2 espèces toxiques sont incluses pour démonstration :
- **Amanita muscaria** : Hallucinogène, peut être mortelle à forte dose
- **Psilocybe cyanescens** : Hallucinogène puissant

Ces images servent à tester la détection d'espèces toxiques par le système.

## Source

Dataset : [Kaggle Mushroom1](https://www.kaggle.com/datasets/zlatan599/mushroom1)
- 169 espèces de champignons
- Images réelles de terrain
- Annotations scientifiques

## Métadonnées

Les métadonnées complètes sont dans `samples_info.json` :
```json
{
  "samples": [...],
  "total": 12,
  "source": "/home/abel/.cache/kagglehub/datasets/zlatan599/mushroom1/versions/2/merged_dataset"
}
```

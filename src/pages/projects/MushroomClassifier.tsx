import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, AlertTriangle, Info, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MUSHROOM_SAMPLES, getSamplePath } from '../../data/mushroomSamples';

interface PredictionResult {
  predicted_classes: string[];
  probabilities: number[];
  all_classes: string[];
  all_probabilities: number[];
  set_size: number;
  coverage: number;
  top1_class: string;
  top1_prob: number;
  has_toxic: boolean;
  toxic_species: string[];
  threshold: number;
}

const MushroomClassifier = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [alpha, setAlpha] = useState(0.1);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [groundTruth, setGroundTruth] = useState<string | null>(null); // Vraie classe si connue
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const response = await axios.get('/api/projects');
        const mushroomProject = response.data.find(
          (p: any) => p.interactivePath === '/projects/mushroom-classifier'
        );
        if (mushroomProject) {
          setProjectId(mushroomProject._id);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProjectId();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setGroundTruth(null); // Pas de ground truth pour les images uploadées
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleClick = async (sampleFile: string) => {
    try {
      // Trouver l'échantillon pour obtenir le ground truth
      const sample = MUSHROOM_SAMPLES.find(s => s.file === sampleFile);
      if (sample) {
        setGroundTruth(sample.species);
      }
      
      // Charger l'image depuis le dossier public
      const imagePath = `/samples/${sampleFile}`;
      const response = await fetch(imagePath);
      
      if (!response.ok) {
        throw new Error(`Failed to load image: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Créer un File object avec le bon type MIME
      const file = new File([blob], sampleFile, { type: 'image/jpeg' });
      
      // Convertir en DataURL pour l'affichage
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(blob);
      
      // Mettre à jour l'input file (pour le predict)
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
    } catch (error) {
      console.error('Error loading sample:', error);
      alert(`Erreur lors du chargement de l'image: ${error}`);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) return;

    setPredicting(true);
    try {
      // Convertir base64 en blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('image', blob, 'mushroom.jpg');
      formData.append('alpha', alpha.toString());

      const apiResponse = await axios.post(
        '/mushroom/predict',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setResult(apiResponse.data);
    } catch (error) {
      console.error('Error predicting:', error);
      alert('Erreur: Assurez-vous que l\'API Python est lancée sur le port 8001');
    } finally {
      setPredicting(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResult(null);
    setGroundTruth(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-dark section-padding">
      <Link
        to={projectId ? `/project/${projectId}` : '/#projects'}
        className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Retour au projet
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          Classification de Champignons avec Prédiction Conforme
        </h1>
        
        <p className="text-gray-300 mb-8">
          Sélectionnez une image d'exemple ci-dessous ou uploadez votre propre photo pour obtenir 
          une prédiction avec ensemble de classes possibles et garantie de couverture statistique.
        </p>

        {/* Galerie d'exemples */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="text-primary" size={24} />
            Images d'exemple - Cliquez pour tester
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MUSHROOM_SAMPLES.map((sample) => (
              <motion.div
                key={sample.file}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer glass-effect rounded-lg overflow-hidden group relative"
                onClick={() => handleSampleClick(sample.file)}
              >
                <div className="aspect-square relative">
                  <img
                    src={getSamplePath(sample.file)}
                    alt={sample.species}
                    className="w-full h-full object-cover"
                  />
                  {sample.toxic && (
                    <div className="absolute top-1 right-1 bg-red-500 p-1 rounded">
                      <AlertTriangle size={14} className="text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <p className="text-xs font-medium text-white p-2 leading-tight">
                      {sample.species}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Section Upload et Prédiction */}
          <div className="space-y-6">
            {/* Upload */}
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Upload className="text-primary" size={24} />
                Image de Champignon
              </h2>

              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="mushroom-upload"
                />
                
                {!selectedImage ? (
                  <label
                    htmlFor="mushroom-upload"
                    className="block w-full h-64 border-2 border-dashed border-gray-600 rounded-xl 
                             hover:border-primary transition-colors cursor-pointer
                             flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                      <p className="text-gray-400">Cliquez pour sélectionner une image</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</p>
                    </div>
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Champignon uploadé"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      onClick={handleClear}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg
                               hover:bg-red-600 transition-colors text-sm"
                    >
                      Effacer
                    </button>
                  </div>
                )}

                {/* Paramètres */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Niveau de confiance: {((1 - alpha) * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.3"
                    step="0.05"
                    value={alpha}
                    onChange={(e) => setAlpha(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>95% (α=0.05)</span>
                    <span>90% (α=0.1)</span>
                    <span>70% (α=0.3)</span>
                  </div>
                </div>

                {/* Bouton Prédire */}
                <button
                  onClick={handlePredict}
                  disabled={!selectedImage || predicting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg
                           hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:hover:scale-100 font-bold"
                >
                  {predicting ? 'Analyse en cours...' : 'Classifier'}
                </button>
              </div>
            </div>

            {/* Info Prédiction Conforme */}
            <div className="glass-effect p-4 rounded-xl">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <Info className="text-blue-400" size={20} />
                Qu'est-ce que la Prédiction Conforme ?
              </h3>
              <p className="text-sm text-gray-300">
                Au lieu d'une seule prédiction, vous obtenez un <strong>ensemble de classes possibles</strong> 
                avec une garantie statistique que la vraie espèce est dans cet ensemble 
                avec probabilité ≥ {((1 - alpha) * 100).toFixed(0)}%.
              </p>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Alerte Toxicité */}
                {result.has_toxic && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-effect p-4 rounded-xl border-2 border-red-500"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                      <div>
                        <h3 className="font-bold text-red-400 mb-1">
                          Espèce Toxique Détectée
                        </h3>
                        <p className="text-sm text-gray-300">
                          L'ensemble de prédiction contient des espèces potentiellement toxiques.
                          <strong className="block mt-1">NE PAS CONSOMMER sans expertise mycologique.</strong>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Statistiques */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-4">Résultats</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-dark-light p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Prédiction Top-1</p>
                      <p className="text-lg font-bold text-primary truncate" title={result.top1_class}>
                        {result.top1_class}
                      </p>
                      <p className="text-xs text-gray-500">
                        Confiance: {(result.top1_prob * 100).toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="bg-dark-light p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Taille Ensemble</p>
                      <p className="text-lg font-bold text-secondary">
                        {result.set_size} classe{result.set_size > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        sur 169 total ({((result.set_size / 169) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>

                  {/* Ground Truth et Couverture */}
                  {groundTruth && (
                    <div className={`mb-4 p-4 rounded-lg border-2 ${
                      result.predicted_classes.includes(groundTruth)
                        ? 'bg-green-900/20 border-green-500/50'
                        : 'bg-red-900/20 border-red-500/50'
                    }`}>
                      <p className="font-bold mb-2 flex items-center gap-2">
                        {result.predicted_classes.includes(groundTruth) ? (
                          <span className="text-green-400">✓ Couverture réussie</span>
                        ) : (
                          <span className="text-red-400">✗ Couverture échouée</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-300">
                        <strong>Vraie classe:</strong> {groundTruth}
                      </p>
                      {result.predicted_classes.includes(groundTruth) ? (
                        <p className="text-xs text-green-300 mt-1">
                          La vraie classe est bien dans l'ensemble de prédiction conforme.
                        </p>
                      ) : (
                        <p className="text-xs text-red-300 mt-1">
                          ⚠️ La vraie classe n'est PAS dans l'ensemble. Cela peut arriver dans {((1 - result.coverage) * 100).toFixed(0)}% des cas avec α={alpha}.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Info si ensemble très petit */}
                  {result.set_size === 1 && result.top1_prob < 0.5 && (
                    <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-yellow-300 flex items-center gap-2">
                        <Info size={16} />
                        <span>
                          <strong>Ensemble minimal:</strong> Le modèle est très incertain ou la probabilité de la classe la plus probable est assez forte. 
                          Seule la classe la plus probable est incluse (garantie min=1).
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Top Classes */}
                  <div>
                    <h3 className="font-bold mb-3 flex items-center justify-between">
                      <span>Classes Prédites (triées par confiance)</span>
                      <span className="text-sm text-gray-400 font-normal">
                        Affichage: Top {Math.min(20, result.all_classes.length)}
                      </span>
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {result.all_classes.slice(0, 20).map((cls, idx) => {
                        const prob = result.all_probabilities[idx];
                        const isToxic = result.toxic_species.includes(cls);
                        const isInConformalSet = result.predicted_classes.includes(cls);
                        const isGroundTruth = groundTruth === cls;
                        
                        // Déterminer la couleur et le style
                        let bgColor = 'bg-dark-light';
                        let barColor = 'bg-gray-500';
                        let iconColor = 'text-gray-400';
                        let icon = null;
                        
                        if (isGroundTruth) {
                          // Vraie classe : vert si dans l'ensemble, rouge sinon
                          if (isInConformalSet) {
                            bgColor = 'bg-green-900/30 border-2 border-green-500';
                            barColor = 'bg-green-500';
                            iconColor = 'text-green-400';
                            icon = '✓';
                          } else {
                            bgColor = 'bg-red-900/30 border-2 border-red-500';
                            barColor = 'bg-red-500';
                            iconColor = 'text-red-400';
                            icon = '✗';
                          }
                        } else if (isInConformalSet) {
                          // Dans l'ensemble conforme : bleu
                          bgColor = 'bg-blue-900/20 border border-blue-500/30';
                          barColor = 'bg-blue-500';
                          iconColor = 'text-blue-400';
                        }
                        
                        // Override pour toxiques (priorité visuelle)
                        if (isToxic && !isGroundTruth) {
                          icon = <AlertTriangle className="text-red-400" size={16} />;
                        }
                        
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg transition-all ${bgColor}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium flex items-center gap-2">
                                {isToxic && !isGroundTruth && icon}
                                {isGroundTruth && (
                                  <span className={`${iconColor} text-xs font-bold px-1.5 py-0.5 rounded`}>
                                    {icon}
                                  </span>
                                )}
                                {!isGroundTruth && isInConformalSet && (
                                  <span className="text-blue-400 text-xs font-bold px-1.5 py-0.5 bg-blue-500/20 rounded">
                                    ∈
                                  </span>
                                )}
                                <span className="truncate text-sm" title={cls}>
                                  #{idx + 1} {cls}
                                </span>
                              </span>
                              <span className="text-sm text-gray-400 ml-2 flex-shrink-0">
                                {(prob * 100).toFixed(2)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${barColor}`}
                                style={{ width: `${prob * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 bg-dark-light rounded-lg text-sm space-y-2">
                      <p className="text-gray-300 font-bold mb-2">Légende:</p>
                      {groundTruth && (
                        <>
                          <p className="text-green-300 flex items-center gap-2">
                            <span className="text-green-400 font-bold px-2 py-0.5 bg-green-500/20 rounded">✓</span>
                            Vraie classe DANS l'ensemble (couverture réussie)
                          </p>
                          <p className="text-red-300 flex items-center gap-2">
                            <span className="text-red-400 font-bold px-2 py-0.5 bg-red-500/20 rounded">✗</span>
                            Vraie classe HORS de l'ensemble (couverture échouée)
                          </p>
                        </>
                      )}
                      <p className="text-blue-300 flex items-center gap-2">
                        <span className="text-blue-400 font-bold px-2 py-0.5 bg-blue-500/20 rounded">∈</span>
                        Classe dans l'ensemble conforme ({result.set_size} classes)
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        Seuil de non-conformité: {result.threshold.toFixed(4)}
                      </p>
                    </div>

                    {result.all_classes.length > 20 && (
                      <p className="text-sm text-gray-400 mt-3 text-center">
                        ... et {result.all_classes.length - 20} autres classes (169 total)
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-effect p-12 rounded-2xl text-center">
                <Upload className="mx-auto mb-4 text-gray-600" size={64} />
                <p className="text-gray-400">
                  Uploadez une image pour voir les résultats
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-12 glass-effect p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6">À Propos du Projet</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-primary">Architecture</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Modèle:</strong> CNN personnalisé (4 blocs conv)</li>
                <li>• <strong>Dataset:</strong> 169 espèces de champignons</li>
                <li>• <strong>Méthode:</strong> Split Conformal Prediction</li>
                <li>• <strong>Framework:</strong> PyTorch + React</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-secondary">Performances</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Couverture empirique:</strong> ~90% (α=0.1)</li>
                <li>• <strong>Ensemble moyen:</strong> 8 classes sur 169</li>
                <li>• <strong>Garantie:</strong> Couverture ≥ 1-α</li>
                <li>• <strong>Efficacité:</strong> ~4.7% des classes</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong className="text-blue-400">Note importante:</strong> Cette démo est à but éducatif.
              Ne jamais consommer de champignons sans l'avis d'un mycologue expert. Certaines espèces toxiques
              peuvent être mortelles même en petites quantités.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MushroomClassifier;

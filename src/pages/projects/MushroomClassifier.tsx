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
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [groundTruth, setGroundTruth] = useState<string | null>(null); // Ground-truth class if known
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProjectId = async () => {
      try {
        const response = await axios.get('/api/projects');
        const mushroomProject = response.data.find(
          (p: any) => p.interactivePath === '/projects/mushroom-classifier/demo'
        );
        if (mushroomProject?.slug) {
          setProjectSlug(mushroomProject.slug);
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
      // Find sample metadata to get ground truth
      const sample = MUSHROOM_SAMPLES.find(s => s.file === sampleFile);
      if (sample) {
        setGroundTruth(sample.species);
      }
      
      // Load image from public folder
      const imagePath = `/test_images_mushrooms/${sampleFile}`;
      const response = await fetch(imagePath);
      
      if (!response.ok) {
        throw new Error(`Failed to load image: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create a File object with a MIME type
      const file = new File([blob], sampleFile, { type: 'image/jpeg' });
      
      // Convert to DataURL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(blob);
      
      // Sync file input for prediction
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
    } catch (error) {
      console.error('Error loading sample:', error);
      alert(`Error loading image: ${error}`);
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
      alert('Error: make sure the Mushroom API is running.');
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
        to={projectSlug ? `/projects/${projectSlug}` : '/#projects'}
        className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back to project
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          Mushroom Classification with Conformal Prediction
        </h1>
        
        <p className="text-gray-300 mb-8">
          Select a sample image below or upload your own photo to get predictions with
          a statistically guaranteed conformal prediction set.
        </p>

        {/* Sample gallery */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="text-primary" size={24} />
            Sample images - Click to test
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
            {/* Upload and prediction */}
          <div className="space-y-6">
            {/* Upload */}
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Upload className="text-primary" size={24} />
                Mushroom Image
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
                      <p className="text-gray-400">Click to select an image</p>
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
                      Clear
                    </button>
                  </div>
                )}

                {/* Paramètres */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Confidence level: {((1 - alpha) * 100).toFixed(0)}%
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
                  {predicting ? 'Analyzing...' : 'Classify'}
                </button>
              </div>
            </div>

            {/* Conformal prediction info */}
            <div className="glass-effect p-4 rounded-xl">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <Info className="text-blue-400" size={20} />
                What is Conformal Prediction?
              </h3>
              <p className="text-sm text-gray-300">
                Instead of a single class, you get a <strong>set of plausible classes</strong>
                with a statistical guarantee that the true species is included with
                probability ≥ {((1 - alpha) * 100).toFixed(0)}%.
              </p>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Toxicity warning */}
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
                          Toxic Species Detected
                        </h3>
                        <p className="text-sm text-gray-300">
                          The prediction set contains potentially toxic species.
                          <strong className="block mt-1">DO NOT CONSUME without expert mycological guidance.</strong>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Statistiques */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-4">Results</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-dark-light p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Top-1 prediction</p>
                      <p className="text-lg font-bold text-primary truncate" title={result.top1_class}>
                        {result.top1_class}
                      </p>
                      <p className="text-xs text-gray-500">
                        Confidence: {(result.top1_prob * 100).toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="bg-dark-light p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Set size</p>
                      <p className="text-lg font-bold text-secondary">
                        {result.set_size} class{result.set_size > 1 ? 'es' : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        sur 169 total ({((result.set_size / 169) * 100).toFixed(1)}%)
                      </p>
                    </div>
                    <div className="bg-dark-light p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Non-conformity threshold</p>
                      <p className="text-lg font-bold text-blue-300">
                        {result.threshold.toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Alpha: {alpha.toFixed(2)} (coverage {(1 - alpha).toFixed(2)})
                      </p>
                    </div>
                    <div className="bg-dark-light p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Probability cutoff</p>
                      <p className="text-lg font-bold text-blue-200">
                        {(1 - result.threshold).toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Classes with p ≥ {((1 - result.threshold) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                      {/* Ground truth and coverage */}
                  {groundTruth && (
                    <div className={`mb-4 p-4 rounded-lg border-2 ${
                      result.predicted_classes.includes(groundTruth)
                        ? 'bg-green-900/20 border-green-500/50'
                        : 'bg-red-900/20 border-red-500/50'
                    }`}>
                      <p className="font-bold mb-2 flex items-center gap-2">
                        {result.predicted_classes.includes(groundTruth) ? (
                            <span className="text-green-400">✓ Coverage success</span>
                        ) : (
                            <span className="text-red-400">✗ Coverage miss</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-300">
                        <strong>Ground truth:</strong> {groundTruth}
                      </p>
                      {result.predicted_classes.includes(groundTruth) ? (
                        <p className="text-xs text-green-300 mt-1">
                          The true class is included in the conformal prediction set.
                        </p>
                      ) : (
                        <p className="text-xs text-red-300 mt-1">
                          ⚠️ The true class is NOT in the set. This can happen in {((1 - result.coverage) * 100).toFixed(0)}% of cases with α={alpha}.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Note when set is very small */}
                  {result.set_size === 1 && result.top1_prob < 0.5 && (
                    <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-yellow-300 flex items-center gap-2">
                        <Info size={16} />
                        <span>
                          <strong>Minimal set:</strong> The model uncertainty and threshold lead to a very small set.
                          Only the top class with probability superior to the probability cutoff are included.
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Top Classes */}
                  <div>
                    <h3 className="font-bold mb-3 flex items-center justify-between">
                      <span>Predicted classes (sorted by confidence)</span>
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
                      <p className="text-gray-300 font-bold mb-2">Legend:</p>
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
          <h2 className="text-3xl font-bold mb-6">About this project</h2>
          
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
              <strong className="text-blue-400">Important note:</strong> This demo is educational only.
              Never consume mushrooms without expert mycologist advice. Some toxic species can be lethal,
              even in small quantities.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MushroomClassifier;

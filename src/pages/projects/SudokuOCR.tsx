import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Play, Terminal, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface SolveResult {
  message: string;
  stdout: string;
  stderr: string;
}

const DEBUG_IMAGES = [
  { name: "debug_1_gray.png", label: "1. Niveaux de gris" },
  { name: "debug_2_blurred.png", label: "2. Flou Gaussien" },
  { name: "debug_3_binary.png", label: "3. Binarisation" },
  { name: "debug_4_grid_detected.png", label: "4. Détection Grille" },
  { name: "debug_5_rectified.png", label: "5. Perspective" },
  { name: "debug_6_cells.png", label: "6. Extraction Cases" }
];

const SudokuOCR = () => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<SolveResult | null>(null);
  const [debugImages, setDebugImages] = useState<string[]>([]);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProjectId = async () => {
    try {
        const response = await axios.get('/api/projects');
        const stockProject = response.data.find(
        (p: any) => p.interactivePath === '/projects/ocr-sudoku'
        );
        if (stockProject) {
        setProjectId(stockProject._id);
        }
    } catch (error) {
        console.error('Error fetching project:', error);
    }
    };
    fetchProjectId();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Reset state
        setResult(null);
        setDebugImages([]);
        setOutputImage(null);
        setError(null);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleSolve = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);
    setResult(null);
    setDebugImages([]);
    setOutputImage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/ocr-sudoku/solve', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      
      // Fetch output image
      const timestamp = new Date().getTime(); // Cache busting
      setOutputImage(`/ocr-sudoku/debug-images/output_api.png?t=${timestamp}`);

      // Check for debug images
      const availableDebugImages = [];
      for (const img of DEBUG_IMAGES) {
        try {
          // Just check if we can load it, or assume it exists if success
          // We'll just construct the URL
          availableDebugImages.push(`/ocr-sudoku/debug-images/${img.name}?t=${timestamp}`);
        } catch (e) {
          console.warn(`Debug image ${img.name} not found`);
        }
      }
      setDebugImages(availableDebugImages);

    } catch (err: any) {
      console.error('Error solving sudoku:', err);
      setError(err.response?.data?.detail || 'Erreur lors du traitement du Sudoku');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            OCR Sudoku Solver
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Reconnaissance optique de caractères et résolution de Sudoku utilisant un CNN personnalisé en C.
            Upload une image de grille de Sudoku pour voir le pipeline de traitement étape par étape.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Upload className="mr-3 text-primary" />
              Image Source
            </h2>

            <div 
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors relative min-h-[300px] flex flex-col items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Source" 
                  className="max-h-[400px] w-auto rounded-lg shadow-lg"
                />
              ) : (
                <div className="text-gray-400">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Cliquez ou glissez une image ici</p>
                  <p className="text-sm mt-2 text-gray-500">JPG, PNG supportés</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <button
              onClick={handleSolve}
              disabled={!file || processing}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                !file || processing
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-primary/25'
              }`}
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Play className="mr-2" />
                  Lancer la Résolution
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex items-start">
                <AlertTriangle className="mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle className="mr-3 text-green-500" />
              Résultat
            </h2>

            <div className="min-h-[300px] flex items-center justify-center bg-black/20 rounded-xl p-4">
              {outputImage ? (
                <img 
                  src={outputImage} 
                  alt="Résultat" 
                  className="max-h-[400px] w-auto rounded-lg shadow-lg"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <p>Le résultat s'affichera ici</p>
                </div>
              )}
            </div>

            {result && (
              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <Terminal className="mr-2 text-gray-400" size={16} />
                  <span className="text-sm text-gray-400">Logs du solveur</span>
                </div>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto max-h-48 overflow-y-auto">
                  <pre>{result.stdout}</pre>
                  {result.stderr && (
                    <pre className="text-red-400 mt-2 border-t border-gray-700 pt-2">{result.stderr}</pre>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Debug Steps */}
        {debugImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-8">Pipeline de Traitement</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {debugImages.map((imgSrc, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="aspect-square bg-black/20 rounded-xl overflow-hidden relative group">
                    <img 
                      src={imgSrc} 
                      alt={DEBUG_IMAGES[idx].label}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">{DEBUG_IMAGES[idx].label}</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-400">{DEBUG_IMAGES[idx].label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SudokuOCR;

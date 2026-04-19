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
  const [samples, setSamples] = useState<string[]>([]);
  const [parsedPredictions, setParsedPredictions] = useState<(null | {
    empty: boolean;
    top1?: { val: number; prob: number } | null;
    top2?: { val: number; prob: number } | null;
    top3?: { val: number; prob: number } | null;
  })[][]>(() => Array.from({ length: 9 }, () => Array(9).fill(null)));
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
    // fetch sample images list from the backend
    const fetchSamples = async () => {
      try {
        const res = await axios.get('/api/test-images-sudoku');
        if (res.data && Array.isArray(res.data.images)) {
          setSamples(res.data.images);
        }
      } catch (e) {
        console.warn('Could not fetch sudoku test images', e);
      }
    };
    fetchSamples();
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

  const handleSampleClick = async (filename: string) => {
    try {
      const imagePath = `/test_images_sudoku/${filename}`;
      const response = await fetch(imagePath);
      if (!response.ok) throw new Error('Failed to load sample');
      const blob = await response.blob();

      // create a File object so handleSolve can use it
      const fileObj = new File([blob], filename, { type: blob.type || 'image/png' });

      // update the file input programmatically
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(fileObj);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }

      // update local state for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setFile(fileObj);
        setResult(null);
        setDebugImages([]);
        setOutputImage(null);
        setError(null);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error('Error loading sample image', e);
      setError('Impossible de charger l\'image d\'exemple');
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
        // Try to parse raw predictions from solver stdout (if present)
        if (response.data && response.data.stdout) {
          const parsed = parseRawPredictions(response.data.stdout as string);
          if (parsed) setParsedPredictions(parsed);
        }
      
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

  // Parse the raw predictions table from solver logs into a 9x9 structure
  function parseRawPredictions(stdout: string) {
    const rows = Array.from({ length: 9 }, () => Array(9).fill(null));
    const lines = stdout.split('\n');

    for (const raw of lines) {
      const line = raw.trim();
      // match lines starting with a row number and a pipe
      if (!/^\d+\s*\|/.test(line)) continue;
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 6) continue;
      const row = parseInt(parts[0], 10);
      const col = parseInt(parts[1], 10);
      if (Number.isNaN(row) || Number.isNaN(col) || row < 0 || row > 8 || col < 0 || col > 8) continue;

      const empty = /^YES$/i.test(parts[2]);

      function parseTop(cellText: string) {
        if (!cellText || /^-+$/.test(cellText) || cellText === '-') return null;
        const m = cellText.match(/(\d+)\s*\(\s*([\d.]+)%\s*\)/);
        if (m) return { val: parseInt(m[1], 10), prob: parseFloat(m[2]) };
        return null;
      }

      const top1 = parseTop(parts[3]);
      const top2 = parseTop(parts[4]);
      const top3 = parseTop(parts[5]);

      rows[row][col] = { empty, top1, top2, top3 };
    }

    // check if any cell was parsed
    const any = rows.some(r => r.some(c => c !== null));
    return any ? rows : null;
  }

  // Convert a probability (0-100) to a CSS style with gradient background and border color
  function colorStyles(prob?: number) {
    if (prob === undefined || prob === null || Number.isNaN(prob)) {
      return {} as React.CSSProperties;
    }
    // Clamp
    const p = Math.max(0, Math.min(100, prob));
    // Map 0 -> red (0deg), 100 -> green (120deg)
    const hue = Math.round((p / 100) * 120);
    const borderColor = `hsl(${hue} 90% 50%)`;
    const bgStart = `hsla(${hue} 90% 45% / 0.18)`; // translucent
    const bgEnd = 'transparent';
    const backgroundImage = `linear-gradient(180deg, ${bgStart}, ${bgEnd})`;
    return {
      borderColor,
      backgroundImage,
    } as React.CSSProperties;
  }

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

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 glass-effect p-3 rounded-xl border-2 border-red-500"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-orange-500 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-orange-400 mb-1">
                Information importante
              </h3>
              <p className="text-sm text-gray-300">
                Vous pourrez parfois voir des prédictions incorrectes dues aux limitations du dataset du modèle d'OCR.
                <strong className="block mt-1">N'hésitez pas à regarder la table des prédictions de l'OCR. Vous y trouverez la source des erreurs</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {samples.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Images de test</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {samples.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSampleClick(s)}
                  className="w-36 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700 hover:border-primary transition-colors"
                  title={s}
                >
                  <img src={`/test_images_sudoku/${s}`} alt={s} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

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

        {/* Parsed OCR predictions table */}
        {parsedPredictions.some(r => r.some(c => c !== null)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect p-6 rounded-2xl mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Prédictions OCR (par case)</h2>
            <div className="grid grid-cols-9 gap-2">
              {parsedPredictions.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`p-2 rounded-md border ${cell ? 'bg-black/20' : 'border-dashed border-gray-700 bg-black/10'}`}
                    style={cell && cell.top1 ? colorStyles(cell.top1.prob) : undefined}
                    title={cell ? `Top1: ${cell.top1?.val} (${cell.top1?.prob}%)\nTop2: ${cell.top2?.val} (${cell.top2?.prob}%)\nTop3: ${cell.top3?.val} (${cell.top3?.prob}%)` : 'Aucune prédiction'}
                  >
                    {cell ? (
                      <div className="text-center">
                        <div className="text-lg font-bold">{cell.top1 ? cell.top1.val : '-'}</div>
                        <div className="text-xs text-gray-400">{cell.top1 ? `${cell.top1.prob}%` : ''}</div>
                        <div className="text-[10px] text-gray-500 mt-1">{cell.empty ? 'Vide' : 'Détectée'}</div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm">-</div>
                    )}
                  </div>
                ))
              )}
            </div>
            <p className="text-sm text-gray-400 mt-3">Passe la souris sur une case pour voir Top2/Top3.<br />
              Le dégradé de couleur indique la confiance.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SudokuOCR;

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, PlayCircle, BarChart3, 
  Clock, CheckCircle, XCircle, Loader, Info,
  Calendar, Target, History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Types
interface TrainingConfig {
  stock_name: string;
  from_date: string;
  to_date: string;
  train_size_percent: number;
  val_size_percent: number;
  time_step: number;
  global_tuning: boolean;
}

interface JobStatus {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  current_step: string;
  start_time: string;
  end_time: string | null;
  error: string | null;
  model_path: string | null;
}

interface Prediction {
  day: number;
  predicted_price: number;
}

interface SimulationStatus {
  sim_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  current_date: string;
  days_processed: number;
  total_days: number;
  current_balance: number;
  current_stocks: number;
  current_stock_value?: number;
  current_price?: number;
  total_transactions: number;
  estimated_time_remaining?: number;
  start_time: string;
  end_time: string | null;
  error: string | null;
  plot_path?: string;
}

interface StrategyDayResult {
  action: string;
  balance: number;
  stocks_owned: number;
  portfolio_value: number;
  decision_details?: any;
}

interface SimulationDayResult {
  date: string;
  actual_price?: number;
  predicted_price?: number;
  predicted_last_day?: number;
  error?: string;
  strategies?: Record<string, StrategyDayResult>;
  // Legacy fields for backward compatibility
  action?: string;
  balance?: number;
  stocks_owned?: number;
  portfolio_value?: number;
}

interface Transaction {
  transaction_id: number;
  date: string;
  transaction_type: 'buy' | 'sell';
  stock_price: number;
  quantity: number;
  total_value: number;
  balance_after: number;
  stocks_owned_after: number;
  reason: string;
  predicted_price: number;
  predicted_change_pct: number;
  strategy?: string;
}

interface StrategyResult {
  final_balance: number;
  benefit: number;
  benefit_percentage: number;
  total_trades: number;
  win_rate: number;
}

interface SimulationResult {
  sim_id: string;
  status: string;
  stock_name: string;
  simulation_period: { from: string; to: string };
  initial_balance: number;
  final_balance: number;
  final_stocks_owned?: number;
  final_stock_value?: number;
  benefit: number;
  benefit_percentage: number;
  strategy_used: string;
  daily_results: SimulationDayResult[];
  transactions?: Transaction[];
  strategies_results?: Record<string, StrategyResult>;
  summary: {
    total_trades: number;
    buy_trades: number;
    sell_trades: number;
    winning_trades: number;
    losing_trades: number;
    win_rate: number;
    total_days?: number;
    days_with_errors?: number;
  };
}

const POPULAR_STOCKS = [
  { symbol: 'ENGI.PA', name: 'Engie' },
  { symbol: 'TTE.PA', name: 'TotalEnergies' },
  { symbol: 'AIR.PA', name: 'Airbus' },
  { symbol: 'BNP.PA', name: 'BNP Paribas' },
  { symbol: 'SAN.PA', name: 'Sanofi' },
  { symbol: 'MC.PA', name: 'LVMH' },
  { symbol: 'OR.PA', name: "L'Oréal" },
  { symbol: 'SU.PA', name: 'Schneider Electric' },
];

// Tooltip component
const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 
                      bg-gray-900 border border-gray-700 rounded-lg shadow-xl text-xs text-gray-200">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 
                        border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

// Strategy descriptions
const STRATEGY_INFO: Record<string, { name: string; description: string }> = {
  simple: {
    name: 'Simple',
    description: 'Achète si hausse prédite, vend si baisse prédite. Stratégie de base pour débuter.',
  },
  threshold: {
    name: 'Seuil (€)',
    description: 'Trade uniquement si la différence de prix dépasse un seuil en euros. Réduit le nombre de trades.',
  },
  percentage: {
    name: 'Pourcentage (%)',
    description: 'Trade basé sur le pourcentage de changement. S\'adapte à la valeur de l\'action.',
  },
  conservative: {
    name: 'Conservatrice',
    description: 'Attend un profit cible avant de vendre. Minimise les pertes, idéal pour long terme.',
  },
  aggressive: {
    name: 'Agressive',
    description: 'Trade sur petits signaux avec stop-loss. Maximise les opportunités, plus risqué.',
  },
};

const StockPrediction = () => {
  const [activeTab, setActiveTab] = useState<'train' | 'predict' | 'simulate'>('train');
  const [projectId, setProjectId] = useState<string | null>(null);
  
  // Training states
  const [config, setConfig] = useState<TrainingConfig>({
    stock_name: 'ENGI.PA',
    from_date: '2015-01-01',
    to_date: '2024-12-31',
    train_size_percent: 0.8,
    val_size_percent: 0.2,
    time_step: 100,
    global_tuning: true,
  });
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  // Prediction states
  const [nDays, setNDays] = useState(5);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [predicting, setPredicting] = useState(false);
  
  // Simulation states
  const [simulationConfig, setSimulationConfig] = useState({
    stock_name: 'ENGI.PA',
    from_date: new Date(Date.now()-10*24*60*60*1000).toISOString().split('T')[0],
    to_date: new Date(Date.now()).toISOString().split('T')[0],
    initial_balance: 1000,
    time_step: 100,
    nb_years_data: 10,
    strategy: 'simple',
    strategies: ['simple', 'conservative'] as string[],
    retrain_interval: 5,
    buy_threshold: 1.0,
    sell_threshold: 1.0,
    min_profit_percentage: 1.0,
    max_loss_percentage: 1.0,
  });
  const [currentSimId, setCurrentSimId] = useState<string | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const simWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const response = await axios.get('/api/projects');
        const stockProject = response.data.find(
          (p: any) => p.interactivePath === '/projects/stock-prediction'
        );
        if (stockProject) {
          setProjectId(stockProject._id);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProjectId();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (simWsRef.current) {
        simWsRef.current.close();
      }
    };
  }, []);

  // Start training
  const handleStartTraining = async () => {
    setIsTraining(true);
    try {
      const response = await axios.post('/stock/api/train', config);
      const jobId = response.data.job_id;
      setCurrentJobId(jobId);
      
      // Connect WebSocket for real-time updates
      const ws = new WebSocket(`ws://localhost:8002/ws/training/${jobId}`);
      wsRef.current = ws;
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setJobStatus(data);
        
        if (data.status === 'completed' || data.status === 'failed') {
          ws.close();
          setIsTraining(false);
        }
      };
      
      ws.onerror = () => {
        // Fallback to polling
        pollJobStatus(jobId);
      };
    } catch (error) {
      console.error('Error starting training:', error);
      alert('Erreur: Assurez-vous que l\'API Stock est lancée sur le port 8002');
      setIsTraining(false);
    }
  };

  // Poll job status (fallback)
  const pollJobStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/stock/api/train/${jobId}/status`);
        setJobStatus(response.data);
        
        if (response.data.status === 'completed' || response.data.status === 'failed') {
          clearInterval(interval);
          setIsTraining(false);
        }
      } catch (error) {
        console.error('Error polling status:', error);
        clearInterval(interval);
        setIsTraining(false);
      }
    }, 2000);
  };

  // Make predictions
  const handlePredict = async () => {
    if (!currentJobId || jobStatus?.status !== 'completed') {
      alert('Veuillez d\'abord entraîner un modèle jusqu\'à la fin');
      return;
    }
    
    setPredicting(true);
    try {
      const response = await axios.post('/stock/api/predict', {
        job_id: currentJobId,
        n_days: nDays,
      });
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error('Error making predictions:', error);
      alert('Erreur lors de la prédiction');
    } finally {
      setPredicting(false);
    }
  };

  // Run simulation
  const handleSimulate = async () => {
    setSimulating(true);
    setSimulationResult(null);
    setSimulationStatus(null);
    
    try {
      const response = await axios.post('/stock/api/simulate', simulationConfig);
      const simId = response.data.sim_id;
      setCurrentSimId(simId);
      
      // Connect WebSocket for real-time updates
      const ws = new WebSocket(`ws://localhost:8002/ws/simulation/${simId}`);
      simWsRef.current = ws;
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setSimulationStatus(data);
        
        if (data.status === 'completed') {
          ws.close();
          fetchSimulationResults(simId);
        } else if (data.status === 'failed') {
          ws.close();
          setSimulating(false);
        }
      };
      
      ws.onerror = () => {
        // Fallback to polling
        pollSimulationStatus(simId);
      };
    } catch (error) {
      console.error('Error starting simulation:', error);
      alert('Erreur lors du démarrage de la simulation');
      setSimulating(false);
    }
  };

  // Poll simulation status (fallback)
  const pollSimulationStatus = async (simId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/stock/api/simulate/${simId}/status`);
        setSimulationStatus(response.data);
        
        if (response.data.status === 'completed') {
          clearInterval(interval);
          fetchSimulationResults(simId);
        } else if (response.data.status === 'failed') {
          clearInterval(interval);
          setSimulating(false);
        }
      } catch (error) {
        console.error('Error polling simulation status:', error);
        clearInterval(interval);
        setSimulating(false);
      }
    }, 2000);
  };

  // Fetch final simulation results
  const fetchSimulationResults = async (simId: string) => {
    try {
      const response = await axios.get(`/stock/api/simulate/${simId}/results`);
      setSimulationResult(response.data);
    } catch (error) {
      console.error('Error fetching simulation results:', error);
    } finally {
      setSimulating(false);
    }
  };

  // Estimate simulation time
  const estimateSimulationTime = () => {
    const fromDate = new Date(simulationConfig.from_date);
    const toDate = new Date(simulationConfig.to_date);
    const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Estimation: ~2-3 secondes par jour (entraînement d'un modèle par jour)
    const estimatedSeconds = days * 2.5;
    
    if (estimatedSeconds < 60) {
      return `~${Math.ceil(estimatedSeconds)} secondes`;
    } else if (estimatedSeconds < 3600) {
      return `~${Math.ceil(estimatedSeconds / 60)} minutes`;
    } else {
      const hours = Math.floor(estimatedSeconds / 3600);
      const minutes = Math.ceil((estimatedSeconds % 3600) / 60);
      return `~${hours}h ${minutes}min`;
    }
  };

  // Format remaining time
  const formatRemainingTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s restantes`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.ceil(seconds % 60);
      return `${mins}min ${secs}s restantes`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.ceil((seconds % 3600) / 60);
      return `${hours}h ${mins}min restantes`;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '-' : date.toLocaleString('fr-FR');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />;
      case 'running':
        return <Loader className="text-blue-400 animate-spin" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'failed':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return null;
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
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          Prédiction de Prix d'Actions CAC40
        </h1>
        <p className="text-gray-300 mb-8">
          Entraînez des modèles LSTM pour prédire les prix d'actions et simulez des stratégies de trading
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('train')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'train'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <PlayCircle size={20} />
            Entraînement
          </button>
          <button
            onClick={() => setActiveTab('predict')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'predict'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <TrendingUp size={20} />
            Prédictions
          </button>
          <button
            onClick={() => setActiveTab('simulate')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'simulate'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <BarChart3 size={20} />
            Simulation
          </button>
        </div>

        {/* Training Tab */}
        {activeTab === 'train' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration */}
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <PlayCircle className="text-primary" size={24} />
                Configuration de l'entraînement
              </h2>

              <div className="space-y-4">
                {/* Stock Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Action (Symbole)</label>
                  <select
                    value={config.stock_name}
                    onChange={(e) => setConfig({ ...config, stock_name: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    disabled={isTraining}
                  >
                    {POPULAR_STOCKS.map((stock) => (
                      <option key={stock.symbol} value={stock.symbol}>
                        {stock.name} ({stock.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de début</label>
                    <input
                      type="date"
                      value={config.from_date}
                      onChange={(e) => setConfig({ ...config, from_date: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      disabled={isTraining}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date de fin</label>
                    <input
                      type="date"
                      value={config.to_date}
                      onChange={(e) => setConfig({ ...config, to_date: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      disabled={isTraining}
                    />
                  </div>
                </div>

                {/* Time Step */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fenêtre temporelle (jours): {config.time_step}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={config.time_step}
                    onChange={(e) => setConfig({ ...config, time_step: parseInt(e.target.value) })}
                    className="w-full"
                    disabled={isTraining}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Nombre de jours utilisés pour prédire le jour suivant
                  </p>
                </div>

                {/* Global Tuning */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="global-tuning"
                    checked={config.global_tuning}
                    onChange={(e) => setConfig({ ...config, global_tuning: e.target.checked })}
                    className="w-5 h-5 accent-primary"
                    disabled={isTraining}
                  />
                  <label htmlFor="global-tuning" className="text-sm">
                    Optimisation globale des hyperparamètres (recommendé de laisser coché)<br />
                    Décocher fournis de meilleurs résultats mais peux multiplier par 5-10 le temps d'entraînement.
                  </label>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartTraining}
                  disabled={isTraining}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg
                           hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:hover:scale-100 font-bold flex items-center justify-center gap-2"
                >
                  {isTraining ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Entraînement en cours...
                    </>
                  ) : (
                    <>
                      <PlayCircle size={20} />
                      Lancer l'entraînement
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="text-secondary" size={24} />
                Statut de l'entraînement
              </h2>

              {!jobStatus ? (
                <div className="text-center py-12 text-gray-400">
                  <Info size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Aucun entraînement en cours</p>
                  <p className="text-sm mt-2">
                    Configurez les paramètres et lancez l'entraînement
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between p-4 bg-dark-light rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(jobStatus.status)}
                      <div>
                        <p className="font-bold capitalize">{jobStatus.status}</p>
                        <p className="text-xs text-gray-400">Job ID: {jobStatus.job_id.slice(0, 8)}...</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {(jobStatus.progress * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                      style={{ width: `${jobStatus.progress * 100}%` }}
                    />
                  </div>

                  {/* Current Step */}
                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-sm font-medium text-blue-300 mb-1">Étape en cours:</p>
                    <p className="text-white">{jobStatus.current_step}</p>
                  </div>

                  {/* Times */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-dark-light rounded-lg">
                      <p className="text-xs text-gray-400">Démarré</p>
                      <p className="text-sm">
                        {formatDate(jobStatus.start_time)}
                      </p>
                    </div>
                    {jobStatus.end_time && (
                      <div className="p-3 bg-dark-light rounded-lg">
                        <p className="text-xs text-gray-400">Terminé</p>
                        <p className="text-sm">
                          {formatDate(jobStatus.end_time)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {jobStatus.error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <p className="text-sm font-medium text-red-300 mb-1">Erreur:</p>
                      <p className="text-sm text-white">{jobStatus.error}</p>
                    </div>
                  )}

                  {/* Success */}
                  {jobStatus.status === 'completed' && (
                    <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-300 flex items-center gap-2">
                        <CheckCircle size={20} />
                        Modèle entraîné avec succès !
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Vous pouvez maintenant faire des prédictions
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prediction Tab */}
        {activeTab === 'predict' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary" size={24} />
                Faire des prédictions
              </h2>

              {!currentJobId || jobStatus?.status !== 'completed' ? (
                <div className="text-center py-12 text-gray-400">
                  <Info size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Aucun modèle entraîné disponible</p>
                  <p className="text-sm mt-2">
                    Entraînez d'abord un modèle dans l'onglet "Entraînement"
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-300">
                      Modèle prêt: {config.stock_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Période: {config.from_date} - {config.to_date}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nombre de jours à prédire: {nDays}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={nDays}
                      onChange={(e) => setNDays(parseInt(e.target.value))}
                      className="w-full"
                      disabled={predicting}
                    />
                  </div>

                  <button
                    onClick={handlePredict}
                    disabled={predicting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg
                             hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:hover:scale-100 font-bold flex items-center justify-center gap-2"
                  >
                    {predicting ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Prédiction en cours...
                      </>
                    ) : (
                      <>
                        <Target size={20} />
                        Prédire les prochains jours
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Prediction Results */}
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Résultats</h2>

              {!predictions ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Aucune prédiction disponible</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((pred) => (
                    <div
                      key={pred.day}
                      className="p-4 bg-dark-light rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-primary" />
                        <div>
                          <p className="font-medium">Jour +{pred.day}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(new Date(config.to_date).getTime() + pred.day * 86400000)
                              .toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-secondary">
                          {pred.predicted_price.toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Simulation Tab */}
        {activeTab === 'simulate' && (
          <div className="space-y-6">
            {/* Simulation Config */}
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="text-primary" size={24} />
                Configuration de la simulation
              </h2>

              {/* Basic Parameters */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                  <Info size={18} />
                  Paramètres de base
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Action
                      <Tooltip text="L'action du CAC40 à analyser. Chaque action a des caractéristiques différentes.">
                        <Info size={14} className="text-gray-400" />
                      </Tooltip>
                    </label>
                    <select
                      value={simulationConfig.stock_name}
                      onChange={(e) => setSimulationConfig({ ...simulationConfig, stock_name: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      disabled={simulating}
                    >
                      {POPULAR_STOCKS.map((stock) => (
                        <option key={stock.symbol} value={stock.symbol}>
                          {stock.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Date de début
                      <Tooltip text="Début de la période de simulation. La simulation commencera à partir de cette date.">
                        <Info size={14} className="text-gray-400" />
                      </Tooltip>
                    </label>
                    <input
                      type="date"
                      value={simulationConfig.from_date}
                      onChange={(e) => setSimulationConfig({ ...simulationConfig, from_date: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      disabled={simulating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Date de fin
                      <Tooltip text="Fin de la période de simulation. Plus la période est longue, plus la simulation prendra du temps.">
                        <Info size={14} className="text-gray-400" />
                      </Tooltip>
                    </label>
                    <input
                      type="date"
                      value={simulationConfig.to_date}
                      onChange={(e) => setSimulationConfig({ ...simulationConfig, to_date: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      disabled={simulating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Capital initial: {simulationConfig.initial_balance}€
                      <Tooltip text="Montant de départ pour la simulation. Permet de tester avec différents budgets sans affecter les résultats en pourcentage.">
                        <Info size={14} className="text-gray-400" />
                      </Tooltip>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="10000"
                      step="10"
                      value={simulationConfig.initial_balance}
                      onChange={(e) => setSimulationConfig({ ...simulationConfig, initial_balance: parseInt(e.target.value) })}
                      className="w-full"
                      disabled={simulating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Fenêtre temporelle: {simulationConfig.time_step}
                      <Tooltip text="Nombre de jours utilisés pour prédire le jour suivant. Une fenêtre plus large capture les tendances long terme, mais ralentit la simulation.">
                        <Info size={14} className="text-gray-400" />
                      </Tooltip>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={simulationConfig.time_step}
                      onChange={(e) => setSimulationConfig({ ...simulationConfig, time_step: parseInt(e.target.value) })}
                      className="w-full"
                      disabled={simulating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Années de données: {simulationConfig.nb_years_data}
                      <Tooltip text="Quantité d'historique utilisée pour entraîner chaque modèle. Plus de données = modèle plus robuste mais simulation plus lente.">
                        <Info size={14} className="text-gray-400" />
                      </Tooltip>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={simulationConfig.nb_years_data}
                      onChange={(e) => setSimulationConfig({ ...simulationConfig, nb_years_data: parseInt(e.target.value) })}
                      className="w-full"
                      disabled={simulating}
                    />
                  </div>
                </div>
              </div>

                {/* Strategy Parameters */}
              <div className="space-y-4 border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                  <Target size={18} />
                  Stratégie de trading
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    Mode de simulation
                  </label>
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setSimulationConfig({ ...simulationConfig, strategies: [] })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        simulationConfig.strategies.length === 0
                          ? 'bg-primary text-white'
                          : 'bg-dark-light text-gray-400 hover:text-white'
                      }`}
                    >
                      Stratégie Unique
                    </button>
                    <button
                      onClick={() => setSimulationConfig({ ...simulationConfig, strategies: ['simple', 'conservative'] })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        simulationConfig.strategies.length > 0
                          ? 'bg-primary text-white'
                          : 'bg-dark-light text-gray-400 hover:text-white'
                      }`}
                    >
                      Multi-Stratégies (Comparaison)
                    </button>
                  </div>
                </div>

                {simulationConfig.strategies.length > 0 ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium mb-2">
                      Sélectionnez les stratégies à comparer
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(STRATEGY_INFO).map(([key, info]) => (
                        <div
                          key={key}
                          onClick={() => {
                            const newStrategies = simulationConfig.strategies.includes(key)
                              ? simulationConfig.strategies.filter(s => s !== key)
                              : [...simulationConfig.strategies, key];
                            setSimulationConfig({ ...simulationConfig, strategies: newStrategies });
                          }}
                          className={`p-3 rounded-lg cursor-pointer border transition-all ${
                            simulationConfig.strategies.includes(key)
                              ? 'bg-primary/20 border-primary text-white'
                              : 'bg-dark-light border-transparent text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <div className="font-bold text-sm">{info.name}</div>
                          <div className="text-xs opacity-70 line-clamp-2">{info.description}</div>
                        </div>
                      ))}
                    </div>
                    {simulationConfig.strategies.length === 0 && (
                      <p className="text-red-400 text-xs">Veuillez sélectionner au moins une stratégie</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      Type de stratégie
                      <Tooltip text={STRATEGY_INFO[simulationConfig.strategy].description}>
                        <Info size={14} className="text-gray-400" />
                      </Tooltip>
                    </label>
                    <select
                      value={simulationConfig.strategy}
                      onChange={(e) => setSimulationConfig({ ...simulationConfig, strategy: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-light rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      disabled={simulating}
                    >
                      {Object.entries(STRATEGY_INFO).map(([key, info]) => (
                        <option key={key} value={key}>
                          {info.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      {STRATEGY_INFO[simulationConfig.strategy].description}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    Intervalle de ré-entraînement (jours): {simulationConfig.retrain_interval}
                    <Tooltip text="Fréquence à laquelle le modèle est ré-entraîné. 1 = tous les jours (lent), 5 = tous les 5 jours (plus rapide).">
                      <Info size={14} className="text-gray-400" />
                    </Tooltip>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={simulationConfig.retrain_interval}
                    onChange={(e) => setSimulationConfig({ ...simulationConfig, retrain_interval: parseInt(e.target.value) })}
                    className="w-full"
                    disabled={simulating}
                  />
                </div>

                {/* Strategy-specific parameters */}
                {(simulationConfig.strategy === 'threshold' || simulationConfig.strategy === 'percentage' || simulationConfig.strategies.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        Seuil d'achat: {simulationConfig.buy_threshold}
                        {simulationConfig.strategy === 'threshold' && simulationConfig.strategies.length === 0 ? '€' : '%'}
                        <Tooltip text="Seuil déclencheur pour l'achat.">
                          <Info size={14} className="text-gray-400" />
                        </Tooltip>
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="10.0"
                        step="0.1"
                        value={simulationConfig.buy_threshold}
                        onChange={(e) => setSimulationConfig({ ...simulationConfig, buy_threshold: parseFloat(e.target.value) })}
                        className="w-full"
                        disabled={simulating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        Seuil de vente: {simulationConfig.sell_threshold}
                        {simulationConfig.strategy === 'threshold' && simulationConfig.strategies.length === 0 ? '€' : '%'}
                        <Tooltip text="Seuil déclencheur pour la vente.">
                          <Info size={14} className="text-gray-400" />
                        </Tooltip>
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="10.0"
                        step="0.1"
                        value={simulationConfig.sell_threshold}
                        onChange={(e) => setSimulationConfig({ ...simulationConfig, sell_threshold: parseFloat(e.target.value) })}
                        className="w-full"
                        disabled={simulating}
                      />
                    </div>
                  </div>
                )}

                {simulationConfig.strategy === 'conservative' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        Profit minimum: {simulationConfig.min_profit_percentage}%
                        <Tooltip text="Ne vend que si le profit atteint ce pourcentage. Ex: 5% = attend 5% de gain avant de vendre. Stratégie patiente.">
                          <Info size={14} className="text-gray-400" />
                        </Tooltip>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={simulationConfig.min_profit_percentage}
                        onChange={(e) => setSimulationConfig({ ...simulationConfig, min_profit_percentage: parseFloat(e.target.value) })}
                        className="w-full"
                        disabled={simulating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        Seuil d'achat: {simulationConfig.buy_threshold}%
                        <Tooltip text="Pourcentage minimal de hausse prédite pour acheter. Ex: 2% = achète uniquement si hausse >= 2% est prédite.">
                          <Info size={14} className="text-gray-400" />
                        </Tooltip>
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={simulationConfig.buy_threshold}
                        onChange={(e) => setSimulationConfig({ ...simulationConfig, buy_threshold: parseFloat(e.target.value) })}
                        className="w-full"
                        disabled={simulating}
                      />
                    </div>
                  </div>
                )}

                {simulationConfig.strategy === 'aggressive' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        Stop-loss: {simulationConfig.max_loss_percentage}%
                        <Tooltip text="Vente automatique si la perte atteint ce pourcentage. Protection contre les pertes importantes. Ex: 3% = vend si perte >= 3%.">
                          <Info size={14} className="text-gray-400" />
                        </Tooltip>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={simulationConfig.max_loss_percentage}
                        onChange={(e) => setSimulationConfig({ ...simulationConfig, max_loss_percentage: parseFloat(e.target.value) })}
                        className="w-full"
                        disabled={simulating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        Seuil d'achat: {simulationConfig.buy_threshold}%
                        <Tooltip text="Seuil très bas pour trading agressif. Ex: 0.3% = achète dès qu'une petite hausse est prédite.">
                          <Info size={14} className="text-gray-400" />
                        </Tooltip>
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={simulationConfig.buy_threshold}
                        onChange={(e) => setSimulationConfig({ ...simulationConfig, buy_threshold: parseFloat(e.target.value) })}
                        className="w-full"
                        disabled={simulating}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Time Estimation */}
              {/* <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300 flex items-center gap-2">
                  <Clock size={16} />
                  Temps estimé: {estimateSimulationTime()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  La simulation entraîne un modèle par jour (~2-3s/jour)
                </p>
              </div> */}

              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg
                         hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100 font-bold flex items-center justify-center gap-2"
              >
                {simulating ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Simulation en cours...
                  </>
                ) : (
                  <>
                    <PlayCircle size={20} />
                    Lancer la simulation
                  </>
                )}
              </button>
            </div>

            {/* Simulation Progress */}
            {simulationStatus && simulating && (
              <div className="glass-effect p-6 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Loader className="animate-spin text-primary" size={24} />
                  Progression de la simulation
                </h2>

                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">
                        {simulationStatus.days_processed} / {simulationStatus.total_days} jours
                      </span>
                      <span className="text-primary font-bold">
                        {(simulationStatus.progress * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div
                        className="h-4 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 flex items-center justify-end pr-2"
                        style={{ width: `${simulationStatus.progress * 100}%` }}
                      >
                        {simulationStatus.progress > 0.1 && (
                          <span className="text-xs font-bold text-white">
                            {(simulationStatus.progress * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Current Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-dark-light rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Date en cours</p>
                      <p className="text-lg font-bold text-white flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        {new Date(simulationStatus.current_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="p-4 bg-dark-light rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Temps restant</p>
                      <p className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock size={16} className="text-secondary" />
                        {simulationStatus.estimated_time_remaining
                          ? formatRemainingTime(simulationStatus.estimated_time_remaining)
                          : 'Calcul...'}
                      </p>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <p className="text-xs text-gray-400">Balance</p>
                      <p className="text-xl font-bold text-green-400">
                        {simulationStatus.current_balance?.toFixed(2) || '0.00'}€
                      </p>
                    </div>
                    <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <p className="text-xs text-gray-400">Actions détenues</p>
                      <p className="text-xl font-bold text-blue-400">
                        {simulationStatus.current_stocks?.toFixed(4) || '0.0000'}
                      </p>
                    </div>
                    <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
                      <p className="text-xs text-gray-400">Valeur Actions</p>
                      <p className="text-xl font-bold text-indigo-400">
                        {simulationStatus.current_stock_value 
                          ? simulationStatus.current_stock_value.toFixed(2)
                          : '0.00'}€
                      </p>
                    </div>
                    <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                      <p className="text-xs text-gray-400">Transactions</p>
                      <p className="text-xl font-bold text-purple-400">
                        {simulationStatus.total_transactions || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Simulation Results */}
            {simulationResult && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass-effect p-4 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Capital initial</p>
                    <p className="text-2xl font-bold text-gray-300">
                      {simulationResult.initial_balance?.toFixed(2) || '0.00'}€
                    </p>
                  </div>
                  <div className="glass-effect p-4 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Capital final (Cash)</p>
                    <p className="text-2xl font-bold text-secondary">
                      {simulationResult.final_balance?.toFixed(2) || '0.00'}€
                    </p>
                  </div>
                  <div className="glass-effect p-4 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Valeur Actions</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {simulationResult.final_stock_value?.toFixed(2) || '0.00'}€
                    </p>
                    <p className="text-xs text-gray-500">
                      {simulationResult.final_stocks_owned?.toFixed(4) || '0'} actions
                    </p>
                  </div>
                  <div className="glass-effect p-4 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Valeur Totale</p>
                    <p className="text-2xl font-bold text-white">
                      {((simulationResult.final_balance || 0) + (simulationResult.final_stock_value || 0)).toFixed(2)}€
                    </p>
                  </div>
                  <div className="glass-effect p-4 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Bénéfice</p>
                    <p className={`text-2xl font-bold ${simulationResult.benefit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {simulationResult.benefit >= 0 ? '+' : ''}{simulationResult.benefit?.toFixed(2) || '0.00'}€
                    </p>
                  </div>
                  <div className="glass-effect p-4 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Rendement</p>
                    <p className={`text-2xl font-bold ${simulationResult.benefit_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {simulationResult.benefit_percentage >= 0 ? '+' : ''}{simulationResult.benefit_percentage?.toFixed(1) || '0.0'}%
                    </p>
                  </div>
                </div>

                {/* Simulation Plot */}
                {simulationStatus?.sim_id && (
                  <div className="glass-effect p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <TrendingUp size={20} className="text-primary" />
                      Graphique de performance
                    </h3>
                    <div className="w-full bg-dark-light rounded-lg overflow-hidden border border-gray-700">
                      <img 
                        src={`/stock/api/simulate/${simulationStatus.sim_id}/plot`} 
                        alt="Graphique de la simulation" 
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<p class="p-4 text-center text-gray-400">Graphique non disponible</p>';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Strategy Comparison (Multi-Strategy Mode) */}
                {simulationResult.strategies_results && Object.keys(simulationResult.strategies_results).length > 0 && (
                  <div className="glass-effect p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Target size={20} className="text-primary" />
                      Comparaison des stratégies
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-dark-light">
                          <tr>
                            <th className="px-4 py-3 rounded-l-lg">Stratégie</th>
                            <th className="px-4 py-3">Capital Final</th>
                            <th className="px-4 py-3">Bénéfice</th>
                            <th className="px-4 py-3">Rendement</th>
                            <th className="px-4 py-3">Trades</th>
                            <th className="px-4 py-3 rounded-r-lg">Win Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(simulationResult.strategies_results).map(([name, result], idx) => (
                            <tr key={name} className="border-b border-gray-700 last:border-0 hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 font-medium text-white capitalize">
                                {STRATEGY_INFO[name]?.name || name}
                              </td>
                              <td className="px-4 py-3 font-bold text-white">
                                {result.final_balance?.toFixed(2) || '0.00'}€
                              </td>
                              <td className={`px-4 py-3 font-bold ${result.benefit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {result.benefit >= 0 ? '+' : ''}{result.benefit?.toFixed(2) || '0.00'}€
                              </td>
                              <td className={`px-4 py-3 font-bold ${result.benefit_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {result.benefit_percentage?.toFixed(2) || '0.00'}%
                              </td>
                              <td className="px-4 py-3 text-gray-300">
                                {result.trades}
                              </td>
                              <td className="px-4 py-3 text-primary font-bold">
                                {result.win_rate?.toFixed(1) || '0.0'}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Trading Summary */}
                <div className="glass-effect p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Statistiques de trading</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-3 bg-dark-light rounded-lg">
                      <p className="text-sm text-gray-400">Total trades</p>
                      <p className="text-xl font-bold">{simulationResult.summary.total_trades}</p>
                    </div>
                    <div className="p-3 bg-dark-light rounded-lg">
                      <p className="text-sm text-gray-400">Achats / Ventes</p>
                      <p className="text-xl font-bold">
                        {simulationResult.summary.buy_trades} / {simulationResult.summary.sell_trades}
                      </p>
                    </div>
                    <div className="p-3 bg-dark-light rounded-lg">
                      <p className="text-sm text-gray-400">Taux de réussite</p>
                      <p className="text-xl font-bold text-primary">
                        {simulationResult.summary.win_rate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Daily Results */}
                <div className="glass-effect p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">
                      Résultats quotidiens (derniers 10 jours)
                    </h3>
                    {simulationConfig.strategies.length > 1 && (
                      <div className="text-xs text-gray-400">
                        Affichage: <span className="text-primary font-bold">{simulationConfig.strategies[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {simulationResult.daily_results.slice(-10).reverse().map((day, idx) => {
                      if (day.error || day.actual_price === undefined) {
                        return (
                          <div key={idx} className="p-3 bg-dark-light rounded-lg text-sm border border-red-500/30 bg-red-900/10">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs text-gray-400">Date</p>
                                <p className="font-medium">{new Date(day.date).toLocaleDateString('fr-FR')}</p>
                              </div>
                              <div className="text-red-400 italic flex-1 text-right">
                                {day.error || "Données manquantes"}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Determine which strategy data to show
                      // Priority: 1. First selected strategy, 2. 'simple', 3. First available, 4. Legacy flat structure
                      const strategyName = simulationConfig.strategies.length > 0 ? simulationConfig.strategies[0] : 'simple';
                      const strategyData = day.strategies 
                        ? (day.strategies[strategyName] || Object.values(day.strategies)[0]) 
                        : day;

                      // If we still don't have data (e.g. strategy not found), fallback to empty object
                      const data = strategyData || { action: '-', stocks_owned: 0, balance: 0, portfolio_value: 0 };

                      return (
                        <div key={idx} className="p-3 bg-dark-light rounded-lg grid grid-cols-7 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-400">Date</p>
                            <p className="font-medium">{new Date(day.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Prix réel</p>
                            <p className="font-medium">{day.actual_price?.toFixed(2)}€</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Prédiction</p>
                            <p className="font-medium">{day.predicted_price?.toFixed(2)}€</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Action</p>
                            <p className={`font-bold uppercase ${
                              data.action === 'buy' ? 'text-green-400' : 
                              data.action === 'sell' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {data.action || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Actions</p>
                            <p className="font-medium">{data.stocks_owned?.toFixed(4) || '0.0000'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Balance</p>
                            <p className="font-medium">{data.balance?.toFixed(2) || '0.00'}€</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Valeur Totale</p>
                            <p className="font-medium text-blue-300">
                              {(data.portfolio_value || ((data.balance || 0) + (data.stocks_owned || 0) * (day.actual_price || 0)))?.toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Transaction History */}
                {simulationResult.transactions && simulationResult.transactions.length > 0 && (
                  <div className="glass-effect p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <History size={20} className="text-primary" />
                      Historique des transactions
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {simulationResult.transactions.slice().reverse().map((tx, idx) => (
                        <div key={idx} className="p-3 bg-dark-light rounded-lg grid grid-cols-7 gap-2 text-sm items-center">
                          <div>
                            <p className="text-xs text-gray-400">Date</p>
                            <p className="font-medium">{new Date(tx.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Stratégie</p>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-700 rounded capitalize">
                              {tx.strategy || simulationResult.strategy_used || 'Unknown'}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Action</p>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                              tx.transaction_type === 'buy' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                            }`}>
                              {tx.transaction_type === 'buy' ? 'ACHAT' : 'VENTE'}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Prix</p>
                            <p className="font-medium">{tx.stock_price?.toFixed(2) || '0.00'}€</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Quantité</p>
                            <p className="font-medium">{tx.quantity?.toFixed(4) || '0.0000'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Montant</p>
                            <p className="font-medium text-white">{tx.total_value?.toFixed(2) || '0.00'}€</p>
                          </div>
                          <div className="col-span-1">
                            <p className="text-xs text-gray-400">Raison</p>
                            <p className="text-xs italic text-gray-400 truncate" title={tx.reason}>
                              {tx.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StockPrediction;

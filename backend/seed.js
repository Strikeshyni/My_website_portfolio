import Project from './models/Project.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

function getMongoUri() {
  const uri = (process.env.MONGODB_URI || '').trim();
  return uri || 'mongodb://localhost:27017';
}

function getMongoDbName(uri) {
  const explicitDb = (process.env.MONGODB_DB || '').trim();
  if (explicitDb) {
    return explicitDb;
  }

  try {
    const parsed = new URL(uri);
    const pathDb = decodeURIComponent(parsed.pathname.replace(/^\//, '').split('/')[0] || '').trim();
    if (pathDb) {
      return pathDb;
    }
  } catch {
    // Ignore parse errors and fallback to default database name.
  }

  return 'portfolio';
}

const sampleProjects = [
  {
    slug: 'sudoku-solver',
    title: 'Sudoku Solver and Game',
    description: 'Sudoku generator and solver with advanced optimization algorithms in Python',
    longDescription: `A complete Sudoku game developed in Python with automatic grid generation and optimized solving.
    
    Features:
    - Support for 9x9 and 16x16 grids
    - Grid generation with 4 difficulty levels (easy, medium, hard, expert)
    - Modern interface with a numeric keypad and intuitive input
    - Ultra-fast solving with optimized backtracking
    - Smart hint system
    - Real-time move validation
    - REST API for frontend integration
    
    Technologies:
    - Python for game logic
    - Backtracking algorithm with heuristics
    - Flask for the REST API
    - React + TypeScript for the interface
    
    The algorithm can solve any Sudoku grid (up to 16x16) in just a few milliseconds thanks to advanced optimizations.`,
    technologies: ['Python', 'Flask', 'Algorithms', 'React', 'TypeScript'],
    imageUrl: '/images/projects/sudoku.jpg',
    bannerUrl: '/images/projects/sudoku-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/SudokuSolver_optimisation',
    category: 'other',
    featured: true,
    interactive: true,
    interactivePath: '/projects/sudoku-solver/demo',
    healthCheckUrl: '/sudoku/api/sudoku/health',
    maturity: 'stable',
    createdAt: new Date('2025-11-20'),
  },
  {
    slug: 'chatbot',
    title: 'Conversational AI Chatbot',
    description: 'Intelligent assistant with natural language processing',
    longDescription: `An AI chatbot able to understand and answer user questions contextually.
    
    Features:
    - Natural language understanding
    - Smart contextual responses
    - Modern conversational interface
    - Conversation history
    
    The chatbot can be trained on specific domains to provide personalized and relevant responses.`,
    technologies: ['Python', 'NLP', 'Machine Learning', 'React', 'TypeScript'],
    imageUrl: '/images/projects/chatbot.jpg',
    bannerUrl: '/images/projects/chatbot-banner.jpg',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/chatbot/demo',
    healthCheckUrl: '/chatbot/health',
    maturity: 'stable',
    createdAt: new Date('2025-03-15'),
  },
  {
    slug: 'mushroom-classifier',
    title: 'Mushroom Classification with Conformal Prediction',
    description: 'CNN model with conformal prediction to classify 169 mushroom species',
    longDescription: `A Deep Learning project applying conformal prediction to mushroom classification.
    
    Challenge:
    Mushroom classification is critical (risk of poisoning). Conformal prediction quantifies uncertainty by returning sets of possible classes with statistical coverage guarantees.
    
    Technical architecture:
    - Custom CNN (4 conv blocks, 256 filters, dropout 0.5)
    - 169 mushroom classes from the Kaggle Mushroom Classification dataset
    - Split Conformal Prediction with coverage guarantee >= 1-alpha
    - Adaptive prediction sets based on uncertainty
    
    Results:
    - Empirical coverage: ~90% (alpha=0.1)
    - Average set size: ~8 classes out of 169 (4.7%)
    - Top-1 accuracy: 53.02%
    - Adjustable trade-off: confidence vs set size
    
    Practical use:
    Upload images to receive a prediction set with configurable confidence. A warning is triggered if a toxic species appears in the set.`,
    technologies: ['Python', 'PyTorch', 'Deep Learning', 'Conformal Prediction', 'CNN', 'React'],
    imageUrl: '/images/projects/mushroom.jpg',
    bannerUrl: '/images/projects/mushroom-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/conformal_prediction',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/mushroom-classifier/demo',
    healthCheckUrl: '/mushroom/health',
    maturity: 'beta',
    createdAt: new Date('2025-10-15'),
  },
  {
    slug: 'stock-prediction',
    title: 'CAC40 Stock Price Prediction',
    description: 'LSTM model to predict stock prices and simulate trading strategies',
    longDescription: `
    New version in progress:
    A new version of this project is currently being developed to push the technique further and handle global markets using graph neural networks.
   
    Complete stock price prediction system using LSTM neural networks with hyperparameter optimization and trading simulation.
    
    Main features:
    - Training LSTM models on Yahoo Finance historical data
    - Automatic hyperparameter optimization with Keras Tuner
    - Multi-day predictions with configurable time window
    - Historical simulation of trading strategies (backtesting)
    - Real-time training monitoring via WebSocket
    
    Technical architecture:
    - LSTM model with dense layers and dropout for regularization
    - Preprocessing: MinMaxScaler normalization, time sequences
    - Optimization: Random Search over learning rate, units, dropout
    - FastAPI REST API with asynchronous background jobs
    - React frontend with tabbed interface (training/prediction/simulation)
    
    Data and coverage:
    - CAC40 stocks: Engie, TotalEnergies, Airbus, BNP Paribas, Sanofi, LVMH, L'Oreal, Schneider Electric
    - History: up to 20 years of daily data
    - Time window: 10-500 days to predict the next day
    
    Simulated trading strategy:
    - Buy if prediction > current price (uptrend)
    - Sell if prediction < current price (downtrend)
    - Metrics: return %, win rate, number of trades
    - Day-by-day visualization of decisions and account balance
    
    Performance and limitations:
    - Financial markets are highly stochastic and hard to predict
    - Past results do not guarantee future performance
    - The goal is educational: demonstrate Deep Learning for time series
    - Simulation enables comparison of predictions vs reality on historical data
    
    User interface:
    - Training tab: full configuration, real-time progress bar
    - Predictions tab: predict the next N days after training
    - Simulation tab: backtesting on past periods with detailed reports`,

    technologies: ['Python', 'TensorFlow', 'LSTM', 'Keras Tuner', 'FastAPI', 'WebSocket', 'React', 'TypeScript', 'Yahoo Finance'],
    imageUrl: '/images/projects/stock.jpg',
    bannerUrl: '/images/projects/stock-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/CAC40_prediction',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/stock-prediction/demo',
    healthCheckUrl: '/stock/health',
    maturity: 'beta',
    createdAt: new Date('2024-10-10'),
  },
  {
    slug: 'portfolio',
    title: 'Dynamic Portfolio',
    description: 'Modern portfolio website with animations and modular architecture',
    longDescription: `A modern and high-performance portfolio with smooth animations and a complete architecture.
    
    Key points:
    - React + TypeScript
    - TailwindCSS for responsive design
    - Framer Motion for smooth animations
    - MongoDB + Express for backend
    - Integrated interactive projects
    
    The website is optimized for performance and SEO, with a modern and elegant design.`,
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'MongoDB', 'Node.js'],
    imageUrl: '/images/projects/portfolio.png',
    bannerUrl: '/images/projects/portfolio-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/My_website_portfolio',
    category: 'web',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2025-11-20'),
  },
  {
    slug: 'ocr-sudoku',
    title: 'OCR Sudoku Solver',
    description: 'Sudoku solver in C with OCR and a CNN built from scratch',
    longDescription: `Complete Sudoku solver in pure C with optical character recognition (OCR) based on a convolutional neural network (CNN) implemented from scratch.

    Features:
    - Image preprocessing: grayscale conversion, Otsu binarization, denoising
    - Grid detection: line detection using the Hough transform
    - Cell extraction: splitting the grid into 81 cells
    - Digit recognition: CNN implemented in C (backpropagation, SGD/Adam)
    - Solving: optimized backtracking algorithm with MRV heuristic
    - Reconstruction: generation of the final image with completed digits
    
    Performance:
    - OCR accuracy > 98.3% on handwritten digits
    - Solving time < 100ms per grid
    
    Architecture:
    - Standard C99 with no heavy dependencies (no OpenCV/TensorFlow)
    - Training on the MNIST dataset`,
    technologies: ['C', 'CNN', 'OCR', 'Image Processing', 'Make'],
    imageUrl: '/images/projects/ocr-sudoku.png',
    bannerUrl: '/images/projects/ocr-sudoku-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/OCR_Sudoku',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/ocr-sudoku/demo',
    healthCheckUrl: '/ocr-sudoku/health',
    maturity: 'stable',
    createdAt: new Date('2022-09-10'),
  },
];

async function seedDatabase() {
  try {
    const mongoUri = getMongoUri();
    const mongoDbName = getMongoDbName(mongoUri);

    await mongoose.connect(mongoUri, { dbName: mongoDbName });
    console.log('Connected to MongoDB:', mongoUri);
    console.log('Using database:', mongoDbName);

    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Insert sample projects
    await Project.insertMany(sampleProjects);
    console.log('Sample projects inserted');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

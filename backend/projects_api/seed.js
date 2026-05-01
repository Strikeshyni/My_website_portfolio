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
    longDescription: `Interactive Sudoku engine implementing both puzzle generation and constraint-based solving using optimized backtracking techniques.

  Core solver architecture:
  - Depth-first backtracking search with randomized candidate ordering to reduce worst-case exploration
  - Constraint validation optimized per step (row, column, subgrid pruning)
  - Early termination using timeout control to prevent exponential blowups on pathological grids
  - Diagonal seeding strategy for faster generation of valid full boards
  - In-place state mutation to minimize memory overhead during recursion

  Generation pipeline:
  - Construction of valid full grid via partially pre-filled diagonal sub-boxes
  - Recursive completion using optimized solver
  - Puzzle carving by controlled removal of cells based on difficulty ratios

  Optimization strategies:
  - Reduced branching factor via shuffled candidate ordering
  - Constant-time validity checks for row constraints
  - Precomputed box indexing for subgrid validation
  - Deep copy minimization during puzzle generation

  Difficulty system:
  - Controlled density of removed cells (easy → expert scaling from ~35% to ~65%)
  - Ensures solvability without enforcing uniqueness checks (performance trade-off)

  Performance characteristics:
  - Average-case solving time: milliseconds for standard 9x9 grids
  - Exponential worst-case mitigated via heuristics and timeout guard
  - Suitable for real-time gameplay and API integration

  The system is designed as a lightweight but efficient Sudoku engine balancing correctness, speed, and simplicity.`,
    technologies: ['Python', 'Algorithms', 'Backtracking', 'Optimization'],
    imageUrl: '/images/projects/sudoku.jpg',
    bannerUrl: '/images/projects/sudoku-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/SudokuSolver_optimisation',
    category: 'other',
    featured: true,
    interactive: true,
    interactivePath: '/projects/sudoku-solver/demo',
    healthCheckUrl: '/sudoku/health',
    maturity: 'stable',
    createdAt: new Date('2025-11-20'),
  },
  {
    slug: 'chatbot',
    title: 'Conversational AI Chatbot',
    description: 'Intelligent assistant with natural language processing',
    longDescription: `Context-aware conversational AI system designed around modern NLP and LLM-inspired architecture principles.

  Core NLP pipeline:
  - Text preprocessing (tokenization, normalization, intent extraction)
  - Semantic embedding generation for user queries
  - Vector-based similarity matching for intent retrieval
  - Context tracking across multi-turn conversations

  Architecture:
  - Context window management to maintain conversational coherence
  - Sliding memory buffer for recent interactions
  - Long-term context abstraction using summarized embeddings
  - Modular response generator supporting rule-based + neural hybrid logic

  Embedding & retrieval layer:
  - Dense vector representations of user inputs (semantic embeddings)
  - Similarity search over stored conversational states
  - Context-aware ranking of candidate responses
  - Optional retrieval-augmented generation (RAG-style design pattern)

  Dialogue management:
  - State tracking for multi-turn dependency resolution
  - Intent classification + slot filling for structured queries
  - Context injection into response generation pipeline

  Design goals:
  - Maintain coherence over long conversations
  - Reduce hallucination via context grounding
  - Support extensible integration with external knowledge sources

  This project focuses on bridging classical NLP techniques with modern embedding-based conversational systems.`,
    technologies: ['Python', 'NLP', 'Embeddings', 'Machine Learning', 'React', 'TypeScript'],
    imageUrl: '/images/projects/chatbot.jpg',
    bannerUrl: '/images/projects/chatbot-banner.png',
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
    description: 'ML models to predict stock prices and simulate trading strategies',
    longDescription: `NEW version of this project in progress - Using World wide stocks and Graph based models for better temporal and cross-feature modeling.
    
  Multi-model financial forecasting and trading simulation system designed for time-series prediction and strategy evaluation.

  Models architecture tested:
  - Bi-directional LSTM for temporal sequence modeling
  - Transformer encoder for attention-based long-range dependency capture
  - XGBoost regressor for non-linear feature baselines
  - Modular model interface enabling benchmark comparisons

  Data pipeline:
  - Yahoo Finance historical market data
  - Feature engineering (returns, moving averages, volatility indicators)
  - MinMax normalization and sliding window sequence generation

  Training system:
  - Asynchronous FastAPI-based training jobs
  - Hyperparameter tuning via Keras Tuner (random search)
  - Real-time training progress streamed via WebSocket

  Simulation engine:
  - Time-aware backtesting system with anti-data-leakage design
  - "Time-travel training": model retrained per simulation step
  - Multiple trading strategies (simple, threshold, conservative, aggressive)
  - Portfolio evolution tracking with profit/loss analytics

  Benchmarking system:
  - Cross-model evaluation on identical time windows
  - Metrics: MAE, directional accuracy, simulated ROI
  - Comparative visualization of strategies and predictions

  Important design constraints:
  - Financial data treated as stochastic and non-stationary
  - Emphasis on experimental validation rather than predictive certainty
  - Strong separation between training, inference, and simulation layers

  This project focuses on applied deep learning for financial time series and realistic trading simulation systems.`,
    technologies: ['Python', 'TensorFlow', 'Keras', 'LSTM', 'Transformers', 'XGBoost', 'FastAPI', 'WebSocket'],
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
    longDescription: `Full-stack interactive portfolio platform integrating machine learning demos and modular web architecture.

  Frontend architecture:
  - React + TypeScript SPA built with Vite
  - Component-based modular UI design with reusable sections
  - TailwindCSS utility-first styling system for responsive design
  - Framer Motion for declarative animation system and micro-interactions

  Backend architecture:
  - Node.js + Express API layer
  - MongoDB database for project metadata and dynamic content
  - RESTful API design for project retrieval, routing, and demo orchestration

  ML integration layer:
  - External Python microservices (Flask/FastAPI) exposing inference APIs
  - Hybrid architecture connecting frontend to ML services via HTTP calls
  - Asynchronous communication model for non-blocking inference requests

  Deployment & infrastructure:
  - Frontend deployed on Vercel (serverless static hosting with CI/CD integration)
  - Backend deployed on Render (free-tier Node.js service with cold start constraints)
  - Database hosted on MongoDB Atlas (free cluster with storage and connection limits)
  - Fully cloud-native architecture optimized for zero-cost deployment constraints

  Technical limitations & trade-offs:
  - Cold starts on Render free tier introduce initial API latency
  - MongoDB Atlas free cluster imposes storage and connection pooling limits
  - No dedicated GPU/compute for ML services → inference delegated to lightweight APIs
  - System designed to remain fully functional within free-tier resource constraints

  SEO (Search Engine Optimization) engineering:
  - Server-side metadata optimization (Open Graph, meta tags, structured titles/descriptions)
  - Semantic HTML structure for improved crawlability
  - Pre-rendered static pages for better indexing by search engines
  - Optimized routing strategy for indexable project pages (/projects/:slug)
  - Performance optimization (lazy loading, image compression, code splitting)
  - Lighthouse-focused tuning for accessibility, performance, and SEO scores

  System design goals:
  - Maintain separation between UI, API, and ML services
  - Ensure scalability despite free-tier infrastructure constraints
  - Provide fast perceived performance via caching and lazy loading
  - Deliver interactive ML demos in a production-like environment

  This portfolio acts as a unified showcase of full-stack engineering, ML integration, and real-world deployment constraints under production-free infrastructure.`,
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'MongoDB', 'Framer Motion', 'SEO Optimization', 'Free Tier Deployment'],
    imageUrl: '/images/projects/portfolio.png',
    bannerUrl: '/images/projects/portfolio-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/My_website_portfolio',
    category: 'web',
    featured: true,
    interactive: true,
    interactivePath: '/',
    maturity: 'stable',
    createdAt: new Date('2025-11-20'),
  },
  {
    slug: 'ocr-sudoku',
    title: 'OCR Sudoku Solver',
    description: 'Sudoku solver in C with OCR and a CNN built from scratch',
    longDescription: `End-to-end Sudoku recognition and solving system implemented in pure C, combining classical computer vision with deep learning.

  Pipeline architecture:
  - Image preprocessing: grayscale conversion, noise reduction, Otsu thresholding
  - Geometric correction: perspective transform and grid normalization
  - Structural detection: line extraction using Hough transform
  - Cell segmentation: decomposition into 81 normalized 28x28 patches

  OCR engine:
  - Convolutional Neural Network implemented from scratch (no ML frameworks)
  - Manual implementation of:
    - Forward propagation
    - Backpropagation
    - Gradient descent optimization (SGD / Adam)
  - Training on MNIST + augmented synthetic digit dataset

  Sudoku solving engine:
  - Optimized backtracking solver with MRV (Minimum Remaining Value) heuristic
  - Constraint propagation to reduce search space
  - Early pruning of invalid candidate paths

  Reconstruction pipeline:
  - Image reconstruction of computed solution

  Performance characteristics:
  - OCR accuracy = 98.3% on mixed datasets (printed + synthetic noise)
  - Sub-100ms solving time per grid after digit recognition
  - Fully dependency-free implementation (no OpenCV / TensorFlow)

  This project demonstrates full-stack algorithmic vision + machine learning implemented at low level in C.`,
    technologies: ['C', 'CNN', 'OCR', 'Image Processing', 'Make'],
    imageUrl: '/images/projects/ocr-sudoku.png',
    bannerUrl: '/images/projects/ocr-sudoku-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/OCR_Sudoku',
    category: 'ai',
    featured: true,
    interactive: true,
    interactivePath: '/projects/ocr-sudoku/demo',
    healthCheckUrl: '/ocr-sudoku/health',
    maturity: 'beta',
    createdAt: new Date('2022-09-10'),
  },
  {
    slug: 'epitweet',
    title: 'EpiTweet - Distributed Microblogging Platform',
    description: 'Twitter-like platform built with microservices, NoSQL databases and event-driven architecture',
    longDescription: `EpiTweet is a distributed microblogging platform designed to explore large-scale system architecture using microservices and event-driven communication.

  Architecture:
  - Backend implemented in Java using Quarkus with a strict clean architecture (domain, application, infrastructure layers)
  - Fully decoupled microservices:
    - user-service: authentication and user management
    - repo-post: post CRUD and persistence
    - social-service: graph interactions (follow, like, block)
    - search-service: indexing and retrieval
    - home-timeline-service: feed generation
    - user-timeline-service: per-user content aggregation

  Data layer:
  - MongoDB: post storage (high write throughput)
  - ElasticSearch: full-text search and hashtag indexing
  - Neo4j: social graph modeling (followers, relationships)

  Communication:
  - REST APIs for synchronous interactions
  - Redis Pub/Sub for asynchronous event propagation (timeline updates, indexing)

  Frontend:
  - Angular application consuming aggregated APIs

  Deployment:
  - Docker for local orchestration
  - Kubernetes (K3s) with Kustomize for production-like deployment

  Key challenges:
  - Data consistency across services
  - Event-driven timeline generation
  - Scaling read-heavy operations (feeds & search)

  This project focuses on designing scalable distributed systems with strong separation of concerns and heterogeneous data storage.`,
    technologies: ['Java', 'Quarkus', 'Angular', 'MongoDB', 'ElasticSearch', 'Neo4j', 'Redis', 'Docker', 'Kubernetes'],
    imageUrl: '/images/projects/uml_diagram_epitweet.png',
    bannerUrl: '/images/projects/uml_diagram_epitweet-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/2025-epitweet-tinyx-03',
    category: 'other',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2025-03-12'),
  },
  {
    slug: 'gnn-video-language',
    title: 'Graph-Based Audio-Visual Question Answering',
    description: 'GNN-based multimodal model for reasoning over video, audio and language',
    longDescription: `Implementation of a Graph Neural Network architecture for Audio-Visual Question Answering (AVQA), based on multi-modal alignment between video, audio and textual queries.

  Model architecture:

  1. Scene Graph Encoding:
  - Extract structured representations from video frames
  - Nodes: objects/entities
  - Edges: spatial and semantic relations
  - Encoded using multiple GNN variants (GAT, GCN, GraphSAGE, GIN)

  2. Query Graph Encoding:
  - Natural language questions parsed into semantic graphs
  - Captures relationships and roles within the query
  - Separate GNN encoder

  3. Multi-Grained Audio-Visual Alignment (MgA):
  - Parallel 1D convolutions with kernel sizes {1, 3, 5}
  - Captures temporal dependencies at multiple scales
  - Cross-modal attention between audio and visual streams

  4. Hierarchical Matching:
  - Stage 1: intra-scale fusion
  - Stage 2: inter-scale aggregation
  - Graph-guided attention weighting

  5. Classification Head:
  - Gated fusion of multimodal features
  - Final MLP for answer prediction

  Enhancements over original work:
  - Support for multiple GNN architectures with runtime selection
  - Full evaluation pipeline (ablation, confusion matrix, per-question analysis)
  - Visualization tools:
    - attention heatmaps
    - graph structures
    - training curves

  Training pipeline:
  - TensorBoard logging
  - checkpointing & LR scheduling
  - gradient clipping

  Dataset:
  - MUSIC-AVQA (audio-visual reasoning dataset)

  This project explores structured reasoning over multimodal data using graph-based deep learning.`,
    technologies: ['Python', 'PyTorch', 'GNN', 'Computer Vision', 'NLP', 'Multimodal Learning'],
    imageUrl: '/images/projects/gnn_avqa.png',
    bannerUrl: '/images/projects/gnn_avqa-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/GNN_Graph-Based_Video-Language_Learning',
    category: 'ai',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2026-01-03'),
  },
  {
    slug: 'diffusion-image-generation',
    title: 'Image Generation with Diffusion Models',
    description: 'Conditional diffusion model with classifier-free guidance for image synthesis',
    longDescription: `Implementation of a conditional diffusion model for image generation, including classifier-free guidance and support for both grayscale and RGB datasets.

  Core concept:
  Learn to reverse a progressive noise process:
  - Forward process: adds Gaussian noise over T steps
  - Reverse process: neural network predicts noise ε to reconstruct the image

  Model:
  - U-Net architecture with:
    - time embedding (sinusoidal)
    - class embedding (for conditional generation)
    - optional self-attention layers for higher resolution

  Conditional generation:
  - Class embeddings combined with time embeddings
  - Class dropout (≈10%) during training to enable classifier-free guidance

  Inference:
  - Reverse diffusion sampling from pure noise
  - Guided prediction:
    ε_guided = ε_uncond + w * (ε_cond - ε_uncond)

  - guidance_scale controls:
    - diversity vs fidelity trade-off
    - typical value ≈ 3.0

  Features:
  - Conditional digit generation (MNIST)
  - Multi-sample generation per class
  - Intermediate step visualization
  - Full grid generation (0-9 x multiple variants)

  Extension to RGB:
  - Adaptation to CIFAR-like datasets (64x64)
  - Deeper U-Net with:
    - multi-scale downsampling (64→32→16→8)
    - 3-channel support
    - self-attention layers

  Training:
  - up to 1000 diffusion steps
  - early stopping
  - data augmentation (flip, normalization)

  This project demonstrates the internal mechanics of diffusion models and controlled image generation.`,
    technologies: ['Python', 'PyTorch', 'Diffusion Models', 'Deep Learning'],
    imageUrl: '/images/projects/diffusion.png',
    bannerUrl: '/images/projects/diffusion-banner.png',
    githubUrl: 'https://github.com/Strikeshyni/image-generation-using-diffusion',
    category: 'ai',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2026-01-09'),
  },
  {
    slug: 'rl-dash-agent',
    title: 'Reinforcement Learning Agent - Geometry Dash',
    description: 'Custom RL environment with DQN agents trained on a physics-based platform game',
    longDescription: `A reinforcement learning project combining a custom-built game engine with multiple RL agents to solve a Geometry Dash-like game.

  Environment:
  - Fully custom game engine:
    - physics simulation (gravity, velocity)
    - obstacle-based levels (spikes, blocks, orbs)
  - Headless RL environment for fast training (~1000 episodes/min)

  State space (65-dimensional vector):
  - player position & velocity
  - grounded state / gravity direction
  - level progression
  - 20 nearest objects (type + relative position)

  Action space:
  - binary: jump / no jump

  Reward function:
  - +100: level completion
  - -10: death
  - +0.1: forward progress
  - +0.05: stability bonus (avoiding constant jumping)

  Agents:
  - DQN (Deep Q-Network):
    - MLP (128 → 64)
    - experience replay
    - epsilon-greedy exploration
  - Baselines:
    - random agent
    - simple epsilon-greedy

  Training features:
  - grid search for hyperparameter optimization
  - multi-level training
  - evaluation & benchmarking tools

  Replay system:
  - record and replay trajectories
  - visualization of agent behavior

  Tooling:
  - CLI training interface
  - comparison mode between agents
  - visualization utilities

  Challenges:
  - sparse rewards
  - high temporal precision
  - exploration vs exploitation balance

  This project focuses on applying reinforcement learning to real-time environments with custom physics and efficient training pipelines.`,
    technologies: ['Python', 'Reinforcement Learning', 'DQN', 'PyTorch', 'Game Simulation'],
    imageUrl: '/images/projects/rl_dash.jpg',
    bannerUrl: '/images/projects/rl_dash-banner.jpg',
    githubUrl: 'https://github.com/Strikeshyni/Dash_reinforcment_learning_agent',
    category: 'ai',
    featured: true,
    interactive: false,
    maturity: 'stable',
    createdAt: new Date('2026-01-20'),
  }
];

const seed = async () => {
  const uri = getMongoUri();
  const dbName = getMongoDbName(uri);

  await mongoose.connect(uri, {
    dbName,
  });

  await Project.deleteMany({});
  await Project.insertMany(sampleProjects);

  console.log('Database seeded successfully');
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

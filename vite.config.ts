import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Helper pour gérer silencieusement les erreurs de proxy quand les services sont down
const configureProxy = (proxy: any) => {
  proxy.on('error', (err: any, _req: any, res: any) => {
    if (err.code === 'ECONNREFUSED') {
      // Le service est éteint, on renvoie juste une 503 sans spammer la console
      res.writeHead(503, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: 'Service unavailable' }));
    } else {
      console.error('Proxy error:', err);
    }
  });
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: configureProxy,
      },
      '/sudoku': {
        target: 'http://localhost:8004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sudoku/, ''),
        configure: configureProxy,
      },
      '/chatbot': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chatbot/, ''),
        configure: configureProxy,
      },
      '/mushroom': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mushroom/, ''),
        configure: configureProxy,
      },
      '/stock': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/stock/, ''),
        configure: configureProxy,
      },
      '/ocr-sudoku': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ocr-sudoku/, ''),
        configure: configureProxy,
      }
    }
  }
})

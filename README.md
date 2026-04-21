# Portfolio Abel Aubron

Portfolio moderne et interactif avec demos ML (chatbot, sudoku, OCR, prediction).

## Live

https://aaubron.vercel.app

## Stack

- Frontend: React + TypeScript + Vite + TailwindCSS
- Backend: Node.js + Express + MongoDB
- ML APIs: FastAPI/Flask (selon les services)

## Demarrage rapide

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173

## Structure

```
my_website/
├── src/              # Frontend
├── backend/          # Node.js + services ML
└── public/           # Assets statiques
```

## Routes principales

- Liste projets: `GET /api/projects`
- Detail projet: `GET /api/projects/slug/:slug`
- Detail public: `/projects/:slug`
- Demo: `/projects/:slug/demo`

## License

Projet personnel - Abel Aubron © 2026

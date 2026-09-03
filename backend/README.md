# Backend deployment guide

This backend is split into multiple Render web services plus a manager API that proxies all frontend traffic.

## Services and base URLs

- Manager API (FastAPI): `backend/unified_api`
- Projects API (Node + Mongo): `backend/projects_api`
- Chatbot API (Node): `backend/chatbot_api`
- Sudoku API (Flask): `backend/sudoku`
- Mushroom API (Flask): `backend/prediction_conform`
- OCR Sudoku API (FastAPI): `backend/ocr_sudoku`

## Manager routing map

The manager receives all frontend requests and forwards to the correct service.

- `/api/projects` and `/api/test-images-sudoku` -> Projects API
- `/chatbot/*` -> Chatbot API
- `/sudoku/*` -> Sudoku API
- `/mushroom/*` -> Mushroom API
- `/ocr-sudoku/*` -> OCR Sudoku API
- `/stock/*` -> Stock API (external)

## Render environment variables

### Manager API (backend/unified_api)

These URLs must point to the **base URL** of each service (no trailing slash).

- `PROJECTS_API_URL` (required) -> e.g. `https://portfolio-projects-api.onrender.com`
- `CHATBOT_API_URL` (required) -> e.g. `https://portfolio-chatbot-api.onrender.com`
- `SUDOKU_API_URL` (required) -> e.g. `https://portfolio-sudoku-api.onrender.com`
- `MUSHROOM_API_URL` (required) -> e.g. `https://portfolio-mushroom-api.onrender.com`
- `OCR_SUDOKU_API_URL` (required) -> e.g. `https://portfolio-ocr-sudoku-api.onrender.com`
- `STOCK_API_URL` (optional) -> base URL of your stock prediction API
- `CORS_ORIGINS` (recommended) -> `https://your-frontend-domain` or comma-separated list
- `ENABLED_DEMOS` (optional) -> comma list: `sudoku,mushroom,ocr-sudoku,chatbot,stock`

### Projects API (backend/projects_api)

- `MONGODB_URI` (required)
- `MONGODB_DB` (optional, default: `portfolio`)
- `PROJECTS_COLLECTION` (optional, default: `projects`)
- `CORS_ORIGINS` (recommended)

### Chatbot API (backend/chatbot_api)

- `CORS_ORIGINS` (recommended)

### Sudoku API (backend/sudoku)

- `CORS_ORIGINS` (recommended)

### Mushroom API (backend/prediction_conform)

- `CORS_ORIGINS` (recommended)

### OCR Sudoku API (backend/ocr_sudoku)

No env vars required by default.

## Frontend configuration

Set the frontend to use the manager API base URL.

- `VITE_API_BASE_URL` -> `https://portfolio-manager-api.onrender.com`
- `VITE_CHATBOT_API_URL` -> leave empty to use the manager proxy (optional override)

If you change any manager URLs, only the manager env vars need updating (frontend remains unchanged).
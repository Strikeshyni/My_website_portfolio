# Unified FastAPI Backend

This service aggregates all backend APIs into a single FastAPI app for one Render deployment.

## Run locally

```bash
cd server/unified_api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Required environment variables

- `MONGODB_URI` (required in production)
- `MONGODB_DB` (optional, default: `portfolio`)
- `PROJECTS_COLLECTION` (optional, default: `projects`)
- `CORS_ORIGINS` (comma-separated, e.g. `https://my-app.vercel.app,http://localhost:5173`)

## Optional external integrations

- `CHATBOT_EXTERNAL_URL` (if you want proxy to an external chatbot backend)
- `STOCK_EXTERNAL_URL` (if stock backend remains external)

If `CHATBOT_EXTERNAL_URL` is not set, a built-in lightweight chatbot response is used.
If `STOCK_EXTERNAL_URL` is not set, `/stock/*` returns HTTP 503.

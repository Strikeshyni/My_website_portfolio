#!/usr/bin/env bash

set -e

echo "Starting local dev stack (Docker-free)..."

# =========================
# GLOBAL CONFIG
# =========================

ROOT_DIR=$(pwd)

# Kill all on exit
cleanup() {
  echo "Stopping all services..."
  kill 0
}
trap cleanup EXIT

wait_for_port() {
  local port=$1
  echo "Waiting for port $port..."
  while ! nc -z localhost $port; do
    sleep 0.5
  done
  echo "Port $port is ready"
}

# =========================
# PROJECTS API (depends on mongo)
# =========================

echo "Starting Projects API..."

(
  cd backend/projects_api

  export MONGODB_URI="mongodb://localhost:27017"
  export MONGODB_DB="portfolio"
  export PROJECTS_COLLECTION="projects"
  export CORS_ORIGINS="http://localhost:5173"
  export PORT=3001

  npm start
) &

wait_for_port 3001

# =========================
# CHATBOT API
# =========================

echo "Starting Chatbot API..."

(
  cd backend/chatbot_api

  export CORS_ORIGINS="http://localhost:5173"
  export PORT=3002

  npm start
) &

wait_for_port 3002

# =========================
# SUDOKU API
# =========================

echo "Starting Sudoku API..."

(
  cd backend/sudoku

  export CORS_ORIGINS="http://localhost:5173"
  export PORT=8004

  pip install -r requirements.txt >/dev/null 2>&1
  python3 sudoku_api.py
) &

wait_for_port 8004

# =========================
# MUSHROOM API
# =========================

echo "Starting Mushroom API..."

(
  cd backend/prediction_conform

  export CORS_ORIGINS="http://localhost:5173"
  export PORT=8001

  python3 mushroom_api.py
) &

wait_for_port 8001

# =========================
# OCR SUDOKU API
# =========================

echo "Starting OCR Sudoku API..."

(
  cd backend/ocr_sudoku

  export PORT=8002

  uvicorn api:app --host 0.0.0.0 --port 8002
) &

wait_for_port 8002

# =========================
# MANAGER API (depends on all)
# =========================

echo "Starting Manager API..."

(
  cd backend/unified_api

  export PROJECTS_API_URL="http://localhost:3001"
  export CHATBOT_API_URL="http://localhost:3002"
  export SUDOKU_API_URL="http://localhost:8004"
  export MUSHROOM_API_URL="http://localhost:8001"
  export OCR_SUDOKU_API_URL="http://localhost:8002"

  export CORS_ORIGINS="http://localhost:5173"
  export ENABLED_DEMOS="sudoku,mushroom,ocr-sudoku"

  uvicorn main:app --host 0.0.0.0 --port 8000
) &

wait_for_port 8000

# =========================
# READY
# =========================

echo ""
echo "All services are running:"
echo "Manager API: http://localhost:8000"
echo ""

wait
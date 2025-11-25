#!/bin/bash

# Script pour démarrer tous les services du portfolio
# Usage: ./start-all-services.sh

echo "======================================"
echo " Démarrage des services du portfolio"
echo "======================================"
echo ""

# Couleurs pour le terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour tuer les processus sur un port
kill_port() {
    local port=$1
    echo -e "${YELLOW}Vérification du port ${port}...${NC}"
    lsof -ti:${port} | xargs kill -9 2>/dev/null
}

# Nettoyer les ports
echo -e "${BLUE}Nettoyage des ports...${NC}"
kill_port 3001  # MongoDB API
kill_port 5000  # Sudoku API
kill_port 5173  # Vite
kill_port 8000  # Chatbot API
kill_port 8001  # Mushroom API
# kill_port 8002  # Stock API
kill_port 8003  # OCR Sudoku API
echo ""

# Démarrer MongoDB
echo -e "${GREEN}1. MongoDB (port 27017)${NC}"
echo "Assurez-vous que MongoDB est démarré..."
echo ""

# Démarrer le backend Express
echo -e "${GREEN}2. Backend Express API (port 3001)${NC}"
cd "$(dirname "$0")"
npm run server &
BACKEND_PID=$!
sleep 2
echo ""

# Démarrer l'API Sudoku Python
echo -e "${GREEN}3. Sudoku API Python (port 5000)${NC}"
if [ -f "server/sudoku_api.py" ]; then
    python3 server/sudoku_api.py &
    SUDOKU_PID=$!
    echo "Sudoku API démarrée (PID: $SUDOKU_PID)"
else
    echo -e "${YELLOW}  sudoku_api.py non trouvé${NC}"
fi
sleep 2
echo ""

# Démarrer l'API Chatbot Python
echo -e "${GREEN}4. Chatbot API Python (port 8000)${NC}"
if [ -f "/home/abel/personnal_projects/chatbot_simple/main.py" ]; then
    python3 /home/abel/personnal_projects/chatbot_simple/main.py &
    CHATBOT_PID=$!
    echo "Chatbot API démarrée (PID: $CHATBOT_PID)"
else
    echo -e "${YELLOW}  /home/abel/personnal_projects/chatbot_simple/main.py non trouvé${NC}"
fi
sleep 2
echo ""

# Démarrer l'API Mushroom Python
echo -e "${GREEN}5. Mushroom Classification API (port 8001)${NC}"
if [ -f "server/prediction_conform/mushroom_api.py" ]; then
    python3 server/prediction_conform/mushroom_api.py &
    MUSHROOM_PID=$!
    echo "Mushroom API démarrée (PID: $MUSHROOM_PID)"
else
    echo -e "${YELLOW}  server/prediction_conform/mushroom_api.py non trouvé${NC}"
fi
sleep 2
echo ""

# Démarrer l'API Stock Python
echo -e "${GREEN}6. Stock Prediction API (port 8002)${NC}"
STOCK_DIR="/home/abel/personnal_projects/CAC40_stock_prediction"
if [ -d "$STOCK_DIR" ] && [ -f "$STOCK_DIR/api/main.py" ]; then
    cd "$STOCK_DIR"
    python3 -m uvicorn api.main:app --host 0.0.0.0 --port 8002 &
    STOCK_PID=$!
    cd - > /dev/null
    echo "Stock API démarrée (PID: $STOCK_PID)"
else
    echo -e "${YELLOW}  $STOCK_DIR/api/main.py non trouvé${NC}"
    STOCK_PID=""
fi
sleep 2
echo ""

# Démarrer l'API OCR Sudoku
echo -e "${GREEN}7. OCR Sudoku API (port 8003)${NC}"
OCR_DIR="server/ocr_sudoku"
if [ -d "$OCR_DIR" ] && [ -f "$OCR_DIR/api.py" ]; then
    cd "$OCR_DIR"
    # On suppose que l'environnement virtuel est déjà créé ou on utilise python3 direct
    # Idéalement: source venv/bin/activate
    python3 -m uvicorn api:app --host 0.0.0.0 --port 8003 &
    OCR_PID=$!
    cd - > /dev/null
    echo "OCR Sudoku API démarrée (PID: $OCR_PID)"
else
    echo -e "${YELLOW}  $OCR_DIR/api.py non trouvé${NC}"
    OCR_PID=""
fi
sleep 2
echo ""

# Démarrer Vite
echo -e "${GREEN}8. Frontend Vite (port 5173)${NC}"
npm run dev &
VITE_PID=$!
sleep 3
echo ""

echo "======================================"
echo -e "${GREEN} Tous les services sont démarrés!${NC}"
echo "======================================"
echo ""
echo "Services actifs:"
echo "  • Frontend:    http://localhost:5173"
echo "  • Backend API: http://localhost:3001"
echo "  • Sudoku API:  http://localhost:5000"
echo "  • Chatbot API: http://localhost:8000"
echo "  • Mushroom API: http://localhost:8001"
echo "  • Stock API:   http://localhost:8002"
echo "  • OCR API:     http://localhost:8003"
echo ""
echo "Process IDs:"
echo "  • Backend: $BACKEND_PID"
echo "  • Sudoku:  $SUDOKU_PID"
echo "  • Chatbot: $CHATBOT_PID"
echo "  • Mushroom: $MUSHROOM_PID"
[ -n "$STOCK_PID" ] && echo "  • Stock:   $STOCK_PID"
[ -n "$OCR_PID" ] && echo "  • OCR:     $OCR_PID"
echo "  • Vite:    $VITE_PID"
echo ""
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter tous les services${NC}"
echo ""

# Attendre et nettoyer à la sortie
trap "kill $BACKEND_PID $SUDOKU_PID $CHATBOT_PID $MUSHROOM_PID $STOCK_PID $OCR_PID $VITE_PID 2>/dev/null" EXIT
wait

"""
API Flask pour le jeu Sudoku
Connecte le jeu Python au frontend React
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from sudoku_game import SudokuGame
import json

app = Flask(__name__)
CORS(app)  # Permettre les requêtes depuis le frontend

# Stocker les parties en cours (en production, utiliser une vraie DB)
active_games = {}

sudoku = SudokuGame()


@app.route('/api/sudoku/generate', methods=['POST'])
def generate_puzzle():
    """Génère une nouvelle grille de Sudoku"""
    data = request.get_json()
    difficulty = data.get('difficulty', 'medium')
    size = data.get('size', 9)
    
    if difficulty not in ['easy', 'medium', 'hard', 'expert']:
        return jsonify({'error': 'Invalid difficulty'}), 400
    
    if size not in [9, 16]:
        return jsonify({'error': 'Invalid size. Must be 9 or 16'}), 400
    
    # Timeouts coordonnés avec le frontend (frontend = backend + 5s de marge)
    # 9x9: 10s, 16x16: 20s
    timeout = 10.0 if size == 9 else 20.0

    max_attempts = 1
    
    for attempt in range(max_attempts):
        try:
            game = SudokuGame(size=size, timeout=timeout)
            puzzle, solution = game.generate_puzzle(difficulty)
            
            # Générer un ID unique pour cette partie
            import uuid
            game_id = str(uuid.uuid4())
            
            # Stocker la solution
            active_games[game_id] = {
                'puzzle': puzzle,
                'solution': solution,
                'difficulty': difficulty,
                'size': size
            }
            
            return jsonify({
                'gameId': game_id,
                'puzzle': puzzle,
                'difficulty': difficulty,
                'size': size,
                'success': True
            })
        except TimeoutError:
            if attempt == max_attempts - 1:
                return jsonify({
                    'error': f'La génération de la grille {size}x{size} a pris trop de temps. Réessayez.',
                    'success': False
                }), 408
            continue
    
    return jsonify({
        'error': 'Échec de la génération',
        'success': False
    }), 500


@app.route('/api/sudoku/solve', methods=['POST'])
def solve_puzzle():
    """Résout une grille de Sudoku donnée"""
    data = request.get_json()
    grid = data.get('grid')
    
    if not grid:
        return jsonify({'error': 'Invalid grid format'}), 400
        
    size = len(grid)
    if size not in [9, 16] or any(len(row) != size for row in grid):
        return jsonify({'error': f'Invalid grid size. Must be {size}x{size}'}), 400
    
    # Créer une copie pour ne pas modifier l'original
    grid_copy = [row[:] for row in grid]
    
    # Timeouts coordonnés avec le frontend (frontend = backend + 5s de marge)
    # 9x9: 10s, 16x16: 20s
    timeout = 10.0 if size == 9 else 20.0
    
    try:
        game = SudokuGame(size=size, timeout=timeout)
        if game.solve(grid_copy, use_timeout=True):
            return jsonify({
                'solution': grid_copy,
                'success': True
            })
        else:
            return jsonify({
                'error': 'Aucune solution trouvée pour cette grille',
                'success': False
            }), 400
    except TimeoutError:
        return jsonify({
            'error': f'La résolution de la grille {size}x{size} a pris trop de temps. La grille est peut-être invalide ou trop complexe.',
            'success': False
        }), 408


@app.route('/api/sudoku/check', methods=['POST'])
def check_solution():
    """Vérifie si une solution est correcte"""
    data = request.get_json()
    game_id = data.get('gameId')
    user_solution = data.get('solution')
    
    if game_id not in active_games:
        return jsonify({'error': 'Game not found'}), 404
    
    game_data = active_games[game_id]
    puzzle = game_data['puzzle']
    size = game_data.get('size', 9)
    
    game = SudokuGame(size=size)
    is_correct = game.check_solution(puzzle, user_solution)
    
    return jsonify({
        'correct': is_correct,
        'success': True
    })


@app.route('/api/sudoku/hint', methods=['POST'])
def get_hint():
    """Retourne un indice pour le joueur"""
    data = request.get_json()
    game_id = data.get('gameId')
    current_grid = data.get('currentGrid')
    
    if game_id not in active_games:
        return jsonify({'error': 'Game not found'}), 404
    
    game_data = active_games[game_id]
    puzzle = game_data['puzzle']
    solution = game_data['solution']
    size = game_data.get('size', 9)
    
    game = SudokuGame(size=size)
    hint = game.get_hint(puzzle, current_grid, solution)
    
    if hint:
        row, col, value = hint
        return jsonify({
            'hint': {
                'row': row,
                'col': col,
                'value': value
            },
            'success': True
        })
    else:
        return jsonify({
            'message': 'Grille complète!',
            'success': True
        })


@app.route('/api/sudoku/validate-move', methods=['POST'])
def validate_move():
    """Valide si un coup est légal"""
    data = request.get_json()
    grid = data.get('grid')
    row = data.get('row')
    col = data.get('col')
    value = data.get('value')
    
    if not grid:
        return jsonify({'error': 'Invalid grid'}), 400
        
    size = len(grid)
    game = SudokuGame(size=size)
    is_valid = game.is_valid(grid, row, col, value)
    
    return jsonify({
        'valid': is_valid,
        'success': True
    })


@app.route('/api/sudoku/health', methods=['GET'])
def health_check():
    """Vérifier que l'API fonctionne"""
    return jsonify({
        'status': 'ok',
        'message': 'Sudoku API is running',
        'active_games': len(active_games)
    })


if __name__ == '__main__':
    print(" Sudoku API démarrée sur http://localhost:8004")
    print(" Endpoints disponibles:")
    print("  POST /api/sudoku/generate - Générer une grille")
    print("  POST /api/sudoku/solve - Résoudre une grille")
    print("  POST /api/sudoku/check - Vérifier une solution")
    print("  POST /api/sudoku/hint - Obtenir un indice")
    print("  POST /api/sudoku/validate-move - Valider un coup")
    print("  GET  /api/sudoku/health - Health check")
    
    app.run(debug=True, port=8004, host='0.0.0.0')

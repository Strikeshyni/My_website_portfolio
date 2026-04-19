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
    
    if difficulty not in ['easy', 'medium', 'hard', 'expert']:
        return jsonify({'error': 'Invalid difficulty'}), 400
    
    puzzle, solution = sudoku.generate_puzzle(difficulty)
    
    # Générer un ID unique pour cette partie
    import uuid
    game_id = str(uuid.uuid4())
    
    # Stocker la solution
    active_games[game_id] = {
        'puzzle': puzzle,
        'solution': solution,
        'difficulty': difficulty
    }
    
    return jsonify({
        'gameId': game_id,
        'puzzle': puzzle,
        'difficulty': difficulty,
        'success': True
    })


@app.route('/api/sudoku/solve', methods=['POST'])
def solve_puzzle():
    """Résout une grille de Sudoku donnée"""
    data = request.get_json()
    grid = data.get('grid')
    
    if not grid or len(grid) != 9 or any(len(row) != 9 for row in grid):
        return jsonify({'error': 'Invalid grid format'}), 400
    
    # Créer une copie pour ne pas modifier l'original
    grid_copy = [row[:] for row in grid]
    
    game = SudokuGame()
    if game.solve(grid_copy):
        return jsonify({
            'solution': grid_copy,
            'success': True
        })
    else:
        return jsonify({
            'error': 'No solution exists',
            'success': False
        }), 400


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
    
    game = SudokuGame()
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
    
    game = SudokuGame()
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
    
    game = SudokuGame()
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

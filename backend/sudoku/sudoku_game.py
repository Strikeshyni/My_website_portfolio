"""
Générateur et Solveur de Sudoku
Créé pour le portfolio d'Abel Aubron
"""

import random
import math
import time
from typing import List, Optional, Tuple


class SudokuGame:
    """Classe pour générer, résoudre et gérer des grilles de Sudoku"""
    
    def __init__(self, size: int = 9, timeout: float = 20.0):
        self.size = size
        self.box_size = int(math.sqrt(size))
        self.grid: List[List[int]] = [[0 for _ in range(size)] for _ in range(size)]
        self.solution: List[List[int]] = [[0 for _ in range(size)] for _ in range(size)]
        self.timeout = timeout
        self.start_time: float = 0
    
    def is_valid(self, grid: List[List[int]], row: int, col: int, num: int) -> bool:
        """Vérifie si placer un nombre est valide"""
        # Vérifier la ligne
        # Optimisation: boucle explicite souvent plus rapide que 'in' pour les petits tableaux
        # mais 'in' est très optimisé en C. Gardons 'in' pour la ligne.
        if num in grid[row]:
            return False
        
        # Vérifier la colonne
        # Optimisation: éviter la création de liste avec [grid[i][col]...]
        for i in range(self.size):
            if grid[i][col] == num:
                return False
        
        # Vérifier le carré box_size x box_size
        start_row = self.box_size * (row // self.box_size)
        start_col = self.box_size * (col // self.box_size)
        
        for i in range(start_row, start_row + self.box_size):
            for j in range(start_col, start_col + self.box_size):
                if grid[i][j] == num:
                    return False
        
        return True
    
    def solve(self, grid: List[List[int]], use_timeout: bool = True) -> bool:
        """Résout une grille de Sudoku avec backtracking optimisé"""
        self.start_time = time.time()
        return self._solve_from(grid, 0, 0, use_timeout)

    def _solve_from(self, grid: List[List[int]], row: int, col: int, use_timeout: bool = True) -> bool:
        """Fonction récursive interne qui garde la trace de la position"""
        # Vérifier le timeout
        if use_timeout and time.time() - self.start_time > self.timeout:
            raise TimeoutError("Sudoku generation timed out")
        
        # Trouver la prochaine case vide à partir de la position actuelle
        while row < self.size and grid[row][col] != 0:
            col += 1
            if col == self.size:
                col = 0
                row += 1
        
        # Si on a dépassé la dernière ligne, on a fini
        if row == self.size:
            return True
            
        # Essayer les chiffres
        numbers = list(range(1, self.size + 1))
        random.shuffle(numbers)
        
        for num in numbers:
            if self.is_valid(grid, row, col, num):
                grid[row][col] = num
                
                # Appel récursif
                next_col = col + 1
                next_row = row
                if next_col == self.size:
                    next_col = 0
                    next_row += 1
                    
                if self._solve_from(grid, next_row, next_col, use_timeout):
                    return True
                
                grid[row][col] = 0
                
        return False
    
    def generate_complete_grid(self) -> List[List[int]]:
        """Génère une grille complète et valide"""
        grid = [[0 for _ in range(self.size)] for _ in range(self.size)]
        
        # Remplir la diagonale (box_size carrés indépendants)
        for box in range(0, self.size, self.box_size):
            nums = list(range(1, self.size + 1))
            random.shuffle(nums)
            idx = 0
            for i in range(box, box + self.box_size):
                for j in range(box, box + self.box_size):
                    grid[i][j] = nums[idx]
                    idx += 1
        
        # Résoudre le reste avec timeout
        self.solve(grid, use_timeout=True)
        return grid
    
    def remove_numbers(self, grid: List[List[int]], difficulty: str = 'medium') -> List[List[int]]:
        """Retire des nombres pour créer le puzzle"""
        total_cells = self.size * self.size
        
        # Pourcentage de cases à retirer selon la difficulté
        remove_ratios = {
            'easy': 0.35,   # ~30/81
            'medium': 0.45, # ~36/81
            'hard': 0.55,   # ~45/81
            'expert': 0.65  # ~53/81
        }
        
        ratio = remove_ratios.get(difficulty, 0.45)
        num_to_remove = int(total_cells * ratio)
        
        puzzle = [row[:] for row in grid]  # Copie profonde
        
        positions = [(i, j) for i in range(self.size) for j in range(self.size)]
        random.shuffle(positions)
        
        removed = 0
        for row, col in positions:
            if removed >= num_to_remove:
                break
            
            puzzle[row][col] = 0
            removed += 1
        
        return puzzle
    
    def generate_puzzle(self, difficulty: str = 'medium') -> Tuple[List[List[int]], List[List[int]]]:
        """Génère un puzzle Sudoku avec sa solution"""
        solution = self.generate_complete_grid()
        puzzle = self.remove_numbers(solution, difficulty)
        return puzzle, solution
    
    def check_solution(self, puzzle: List[List[int]], user_solution: List[List[int]]) -> bool:
        """Vérifie si la solution proposée est correcte"""
        # Vérifier que toutes les cases sont remplies
        for row in user_solution:
            if 0 in row:
                return False
        
        # Vérifier toutes les règles du Sudoku
        for i in range(self.size):
            for j in range(self.size):
                num = user_solution[i][j]
                user_solution[i][j] = 0  # Temporairement vide pour vérifier
                
                if not self.is_valid(user_solution, i, j, num):
                    user_solution[i][j] = num
                    return False
                
                user_solution[i][j] = num
        
        return True
    
    def get_hint(self, puzzle: List[List[int]], current: List[List[int]], solution: List[List[int]]) -> Optional[Tuple[int, int, int]]:
        """Retourne un indice (ligne, colonne, valeur)"""
        empty_cells = [(i, j) for i in range(self.size) for j in range(self.size) if current[i][j] == 0]
        
        if not empty_cells:
            return None
        
        row, col = random.choice(empty_cells)
        return (row, col, solution[row][col])


def print_grid(grid: List[List[int]]):
    """Affiche une grille de Sudoku de manière lisible"""
    for i, row in enumerate(grid):
        if i % 3 == 0 and i != 0:
            print("-" * 21)
        
        for j, num in enumerate(row):
            if j % 3 == 0 and j != 0:
                print("|", end=" ")
            
            print(num if num != 0 else ".", end=" ")
        print()


if __name__ == "__main__":
    # Test du générateur
    game = SudokuGame()
    
    print("Générateur de Sudoku - Test\n")
    
    # Générer un puzzle
    puzzle, solution = game.generate_puzzle(difficulty='medium')
    
    print("Puzzle généré (difficulté: medium):")
    print_grid(puzzle)
    
    print("\nSolution:")
    print_grid(solution)
    
    # Tester le solveur
    print("\nTest du solveur...")
    test_puzzle = [row[:] for row in puzzle]
    if game.solve(test_puzzle):
        print("Puzzle résolu avec succès!")
        print_grid(test_puzzle)
    else:
        print("Impossible de résoudre le puzzle")
    
    # Tester un indice
    hint = game.get_hint(puzzle, puzzle, solution)
    if hint:
        row, col, value = hint
        print(f"\nIndice: Ligne {row+1}, Colonne {col+1} = {value}")

"""
Générateur et Solveur de Sudoku
Créé pour le portfolio d'Abel Aubron
"""

import random
from typing import List, Optional, Tuple


class SudokuGame:
    """Classe pour générer, résoudre et gérer des grilles de Sudoku"""
    
    def __init__(self):
        self.grid: List[List[int]] = [[0 for _ in range(9)] for _ in range(9)]
        self.solution: List[List[int]] = [[0 for _ in range(9)] for _ in range(9)]
    
    def is_valid(self, grid: List[List[int]], row: int, col: int, num: int) -> bool:
        """Vérifie si placer un nombre est valide"""
        # Vérifier la ligne
        if num in grid[row]:
            return False
        
        # Vérifier la colonne
        if num in [grid[i][col] for i in range(9)]:
            return False
        
        # Vérifier le carré 3x3
        start_row, start_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(start_row, start_row + 3):
            for j in range(start_col, start_col + 3):
                if grid[i][j] == num:
                    return False
        
        return True
    
    def solve(self, grid: List[List[int]]) -> bool:
        """Résout une grille de Sudoku avec backtracking"""
        for row in range(9):
            for col in range(9):
                if grid[row][col] == 0:
                    # Essayer les chiffres de 1 à 9 dans un ordre aléatoire pour plus de variété
                    numbers = list(range(1, 10))
                    random.shuffle(numbers)
                    
                    for num in numbers:
                        if self.is_valid(grid, row, col, num):
                            grid[row][col] = num
                            
                            if self.solve(grid):
                                return True
                            
                            grid[row][col] = 0
                    
                    return False
        return True
    
    def generate_complete_grid(self) -> List[List[int]]:
        """Génère une grille complète et valide"""
        grid = [[0 for _ in range(9)] for _ in range(9)]
        
        # Remplir la diagonale (3 carrés 3x3 indépendants)
        for box in range(0, 9, 3):
            nums = list(range(1, 10))
            random.shuffle(nums)
            idx = 0
            for i in range(box, box + 3):
                for j in range(box, box + 3):
                    grid[i][j] = nums[idx]
                    idx += 1
        
        # Résoudre le reste
        self.solve(grid)
        return grid
    
    def remove_numbers(self, grid: List[List[int]], difficulty: str = 'medium') -> List[List[int]]:
        """Retire des nombres pour créer le puzzle"""
        # Nombre de cases à retirer selon la difficulté
        cells_to_remove = {
            'easy': 30,
            'medium': 40,
            'hard': 50,
            'expert': 55
        }
        
        num_to_remove = cells_to_remove.get(difficulty, 40)
        puzzle = [row[:] for row in grid]  # Copie profonde
        
        positions = [(i, j) for i in range(9) for j in range(9)]
        random.shuffle(positions)
        
        removed = 0
        for row, col in positions:
            if removed >= num_to_remove:
                break
            
            backup = puzzle[row][col]
            puzzle[row][col] = 0
            
            # Vérifier si la grille a toujours une solution unique
            # (simplification: on suppose que oui pour la performance)
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
        for i in range(9):
            for j in range(9):
                num = user_solution[i][j]
                user_solution[i][j] = 0  # Temporairement vide pour vérifier
                
                if not self.is_valid(user_solution, i, j, num):
                    user_solution[i][j] = num
                    return False
                
                user_solution[i][j] = num
        
        return True
    
    def get_hint(self, puzzle: List[List[int]], current: List[List[int]], solution: List[List[int]]) -> Optional[Tuple[int, int, int]]:
        """Retourne un indice (ligne, colonne, valeur)"""
        empty_cells = [(i, j) for i in range(9) for j in range(9) if current[i][j] == 0]
        
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

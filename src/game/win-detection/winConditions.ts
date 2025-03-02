/**
 * Win detection logic for m,n,k-game
 */
import { BoardSize, CellPosition, WinCheckResult } from '../../types/game.types';
import { isValidPosition, DIRECTIONS } from '../gameUtils';

/**
 * Counts consecutive pieces in both directions along an axis
 */
const countAlongAxis = (
  board: (number | null)[][],
  row: number,
  col: number,
  dirX: number,
  dirY: number,
  player: number,
  boardSize: BoardSize
): { count: number; cells: CellPosition[] } => {
  const cells: CellPosition[] = [[row, col]]; // Start with the center cell
  let count = 1; // Start with 1 for the center cell
  
  // Check in both positive and negative directions
  for (const multiplier of [1, -1]) {
    // Check consecutive cells in this direction
    for (let step = 1; step < Math.max(boardSize.m, boardSize.n); step++) {
      const newRow = row + (dirX * multiplier * step);
      const newCol = col + (dirY * multiplier * step);
      
      // Check if cell is within bounds and has the player's symbol
      if (
        isValidPosition(newRow, newCol, boardSize) &&
        board[newRow][newCol] === player
      ) {
        count++;
        cells.push([newRow, newCol]);
      } else {
        break; // Stop checking this direction when we hit a boundary or different player
      }
    }
  }
  
  return { count, cells };
};

/**
 * Checks if the current move results in a win
 */
export const checkWin = (
  board: (number | null)[][],
  row: number,
  col: number,
  player: number,
  boardSize: BoardSize,
  winLength: number
): WinCheckResult => {
  // Check each of the four directions for a winning sequence
  for (const [dx, dy] of DIRECTIONS) {
    const { count, cells } = countAlongAxis(board, row, col, dx, dy, player, boardSize);
    
    if (count >= winLength) {
      return { isWin: true, winningCells: cells };
    }
  }
  
  return { isWin: false, winningCells: [] };
};

/**
 * Checks if the game is a draw
 */
export const checkDraw = (board: (number | null)[][]): boolean => {
  return board.every(row => row.every(cell => cell !== null));
}; 
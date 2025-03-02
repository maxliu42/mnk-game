/**
 * Win detection logic for m,n,k-game
 */
import { BoardSize, CellPosition, WinCheckResult } from '../../types/game.types';
import { isValidPosition, DIRECTIONS } from '../gameUtils';

/**
 * Counts consecutive pieces in a direction
 */
const countConsecutivePieces = (
  board: (number | null)[][],
  startRow: number,
  startCol: number,
  dirX: number,
  dirY: number,
  player: number,
  boardSize: BoardSize
): { count: number; cells: CellPosition[] } => {
  let count = 0;
  const cells: CellPosition[] = [];
  
  // Check consecutive cells in this direction
  for (let i = 0; i < Math.max(boardSize.m, boardSize.n); i++) {
    const newRow = startRow + dirX * i;
    const newCol = startCol + dirY * i;
    
    // Check if cell is within bounds and has the player's symbol
    if (
      isValidPosition(newRow, newCol, boardSize) &&
      board[newRow][newCol] === player
    ) {
      count++;
      cells.push([newRow, newCol]);
    } else {
      break;
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
  // Check each direction for winning sequence
  for (const [dx, dy] of DIRECTIONS) {
    // Check in positive direction (including the current cell)
    const { count: forwardCount, cells: forwardCells } = countConsecutivePieces(
      board, row, col, dx, dy, player, boardSize
    );
    
    // Check in negative direction (excluding the current cell to avoid counting it twice)
    const { count: backwardCount, cells: backwardCells } = countConsecutivePieces(
      board, row + (-dx), col + (-dy), -dx, -dy, player, boardSize
    );
    
    // Total count (forwardCount already includes the current cell)
    const totalCount = forwardCount + backwardCount;
    
    // If we found enough cells in a row, it's a win
    if (totalCount >= winLength) {
      // Combine cells from both directions
      const allCells = [...forwardCells, ...backwardCells];
      // Remove duplicate cells if any
      const uniqueCells = allCells.filter((cell, index, self) => 
        self.findIndex(c => c[0] === cell[0] && c[1] === cell[1]) === index
      );
      
      return { isWin: true, winningCells: uniqueCells };
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
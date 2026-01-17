import { BoardSize, CellPosition, WinCheckResult } from '../types/game.types';
import { isValidPosition, DIRECTIONS } from './gameUtils';

/** Counts consecutive pieces in both directions along an axis. Returns early once winLength is reached. */
const countAlongAxis = (
  board: (number | null)[][],
  row: number,
  col: number,
  dirX: number,
  dirY: number,
  player: number,
  boardSize: BoardSize,
  winLength: number
): { count: number; cells: CellPosition[] } => {
  const cells: CellPosition[] = [[row, col]];
  let count = 1;
  
  for (const multiplier of [1, -1]) {
    for (let step = 1; step < winLength; step++) {
      const newRow = row + (dirX * multiplier * step);
      const newCol = col + (dirY * multiplier * step);
      
      if (!isValidPosition(newRow, newCol, boardSize) || board[newRow][newCol] !== player) {
        break;
      }
      count++;
      cells.push([newRow, newCol]);
      if (count >= winLength) return { count, cells }; // Early exit
    }
  }
  
  return { count, cells };
};

export const checkWin = (
  board: (number | null)[][],
  row: number,
  col: number,
  player: number,
  boardSize: BoardSize,
  winLength: number
): WinCheckResult => {
  for (const [dx, dy] of DIRECTIONS) {
    const { count, cells } = countAlongAxis(board, row, col, dx, dy, player, boardSize, winLength);
    
    if (count >= winLength) {
      return { isWin: true, winningCells: cells };
    }
  }
  
  return { isWin: false, winningCells: [] };
};

export const checkDraw = (board: (number | null)[][]): boolean =>
  board.every(row => row.every(cell => cell !== null)); 
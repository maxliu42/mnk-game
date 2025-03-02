/**
 * Core utility functions for the m,n,k-game
 */
import { BoardSize, CellPosition, MoveType } from '../types/game.types';

/**
 * Direction vectors for win checking and neighbor detection
 */
export const DIRECTIONS = [
  [0, 1],   // horizontal
  [1, 0],   // vertical
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
];

/**
 * Checks if a position is valid on the board
 */
export const isValidPosition = (
  row: number, 
  col: number, 
  boardSize: BoardSize
): boolean => {
  return row >= 0 && row < boardSize.m && col >= 0 && col < boardSize.n;
};

/**
 * Gets all valid neighboring positions for a cell
 */
export const getNeighbors = (
  position: CellPosition,
  boardSize: BoardSize
): CellPosition[] => {
  const [row, col] = position;
  
  return DIRECTIONS
    .map(([dr, dc]) => [row + dr, col + dc] as CellPosition)
    .filter(([r, c]) => isValidPosition(r, c, boardSize));
};

/**
 * Creates a new empty game board
 */
export const createEmptyBoard = (m: number, n: number): (number | null)[][] => {
  return Array(m)
    .fill(null)
    .map(() => Array(n).fill(null));
}; 
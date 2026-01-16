/**
 * Core utility functions for the m,n,k-game
 */
import { BoardSize } from '../types/game.types';

/**
 * Direction vectors for win checking
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
 * Creates a new empty game board
 */
export const createEmptyBoard = (m: number, n: number): (number | null)[][] => {
  return Array(m)
    .fill(null)
    .map(() => Array(n).fill(null));
}; 
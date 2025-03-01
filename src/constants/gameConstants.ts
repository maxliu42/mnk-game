/**
 * Game constants
 * This file contains constants used throughout the game
 */

import { GridType } from '../types/game.types';

/**
 * Default board size
 */
export const DEFAULT_BOARD_SIZE = {
  m: 15,  // rows
  n: 15   // columns
};

/**
 * Default win length (number of pieces in a row to win)
 */
export const DEFAULT_WIN_LENGTH = 5;

/**
 * Default grid type
 */
export const DEFAULT_GRID_TYPE = GridType.SQUARE;

/**
 * Maximum number of players
 */
export const MAX_PLAYERS = 6;

/**
 * Default player symbols
 */
export const DEFAULT_PLAYER_SYMBOLS = ['X', 'O', '△', '□', '◇', '♡'];

/**
 * Default player colors
 */
export const DEFAULT_PLAYER_COLORS = [
  '#FF5252', // Red
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#FF9800'  // Orange
];

/**
 * Game presets for quick start
 */
export const GAME_PRESETS = [
  {
    name: 'Classic Tic-Tac-Toe',
    boardSize: { m: 3, n: 3 },
    winLength: 3,
    gridType: GridType.SQUARE,
    playerCount: 2
  },
  {
    name: 'Gomoku (Five in a Row)',
    boardSize: { m: 15, n: 15 },
    winLength: 5,
    gridType: GridType.SQUARE,
    playerCount: 2
  },
  {
    name: 'Connect Four',
    boardSize: { m: 6, n: 7 },
    winLength: 4,
    gridType: GridType.SQUARE,
    playerCount: 2
  },
  {
    name: 'Hex Battle (3 Players)',
    boardSize: { m: 15, n: 15 },
    winLength: 5,
    gridType: GridType.HEX,
    playerCount: 3
  }
]; 
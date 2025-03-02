/**
 * Game constants
 * This file contains constants used throughout the game
 */

import { BoardSize } from '../types/game.types';

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
 * Default player configurations
 */
export const DEFAULT_PLAYER_CONFIGS = [
  { symbol: "🦊", color: "#EF4444", name: "Player 1" },
  { symbol: "🐼", color: "#3B82F6", name: "Player 2" },
  { symbol: "🦄", color: "#10B981", name: "Player 3" },
  { symbol: "🐯", color: "#F59E0B", name: "Player 4" },
  { symbol: "🐸", color: "#8B5CF6", name: "Player 5" },
  { symbol: "🦁", color: "#EC4899", name: "Player 6" },
  { symbol: "🐙", color: "#06B6D4", name: "Player 7" },
  { symbol: "🦉", color: "#D97706", name: "Player 8" },
];

/**
 * Game presets for quick start
 */
export const GAME_PRESETS = [
  {
    name: 'Classic Tic-Tac-Toe',
    boardSize: { m: 3, n: 3 },
    winLength: 3,
    playerCount: 2
  },
  {
    name: 'Gomoku (Five in a Row)',
    boardSize: { m: 15, n: 15 },
    winLength: 5,
    playerCount: 2
  },
  {
    name: 'Connect Four',
    boardSize: { m: 6, n: 7 },
    winLength: 4,
    playerCount: 2
  },
  {
    name: 'Three Players (5 in a row)',
    boardSize: { m: 15, n: 15 },
    winLength: 5,
    playerCount: 3
  }
]; 
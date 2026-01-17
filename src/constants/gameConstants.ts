export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;
export const MIN_BOARD_DIMENSION = 3;
export const MIN_WIN_LENGTH = 3;

export const DEFAULT_BOARD_SIZE = { m: MIN_BOARD_DIMENSION, n: MIN_BOARD_DIMENSION };
export const DEFAULT_WIN_LENGTH = MIN_WIN_LENGTH;

/** Responsive cell sizing based on board dimensions */
export const BOARD_SIZE_CONFIG = [
  { maxDimension: 3, cellSize: 65, symbolClass: 'symbol-large', sizeClass: 'small-board' },
  { maxDimension: 5, cellSize: 50, symbolClass: 'symbol-medium', sizeClass: 'medium-board' },
  { maxDimension: 10, cellSize: 45, symbolClass: 'symbol-small', sizeClass: 'large-board' },
  { maxDimension: Infinity, cellSize: 35, symbolClass: 'symbol-xsmall', sizeClass: 'xlarge-board' }
] as const;

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

export const GAME_PRESETS = [
  { name: 'Tic-Tac-Toe', boardSize: { m: 3, n: 3 }, winLength: 3, playerCount: 2 },
  { name: 'Gomoku', boardSize: { m: 15, n: 15 }, winLength: 5, playerCount: 2 },
  { name: 'Connect Four', boardSize: { m: 6, n: 7 }, winLength: 4, playerCount: 2 },
]; 
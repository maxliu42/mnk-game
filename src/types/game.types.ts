/**
 * Game-related type definitions
 */

/**
 * Represents the board size with rows (m) and columns (n)
 */
export interface BoardSize {
  m: number;
  n: number;
}

/**
 * Represents a single cell position on the board
 */
export type CellPosition = [number, number];

/**
 * Possible move types in the game
 */
export enum MoveType {
  PLACE = 'place',
  MOVE = 'move'
}

/**
 * Represents a game move
 */
export interface GameMove {
  type: MoveType;
  player: number;
  position: CellPosition;
  // Only used for MOVE type - the original position of the piece
  fromPosition?: CellPosition;
}

/**
 * Represents the game state
 */
export interface GameState {
  board: (number | null)[][];
  currentPlayer: number;
  playerConfigs: PlayerConfig[];
  boardSize: BoardSize;
  winLength: number;
  moveType: MoveType;
  winner: number | null;
  isDraw: boolean;
  winningCells: CellPosition[];
  gameStarted: boolean;
  allowMovingOpponentPieces: boolean;
  selectedCell: CellPosition | null;
}

/**
 * Represents an individual player's configuration
 */
export interface PlayerConfig {
  symbol: string;
  color: string;
  name: string;
}

/**
 * Represents the game configuration
 */
export interface GameConfig {
  boardSize: BoardSize;
  winLength: number;
  allowMovingOpponentPieces: boolean;
  playerCount: number; // Number of players (2-6)
  playerConfigs?: PlayerConfig[]; // Optional player configurations
}

/**
 * Result of a win check
 */
export interface WinCheckResult {
  isWin: boolean;
  winningCells: CellPosition[];
} 
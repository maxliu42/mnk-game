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
  winner: number | null;
  isDraw: boolean;
  winningCells: CellPosition[];
  selectedCell: CellPosition | null;
  currentMoveType: MoveType;
  moveHistory: GameMove[];
}

/**
 * Grid type for the game board
 */
export enum GridType {
  SQUARE = 'square',
  HEX = 'hex'
}

/**
 * Represents the game configuration
 */
export interface GameConfig {
  boardSize: BoardSize;
  winLength: number;
  gridType: GridType;
  allowMovingOpponentPieces: boolean;
}

/**
 * Result of a win check
 */
export interface WinCheckResult {
  isWin: boolean;
  winningCells: CellPosition[];
} 
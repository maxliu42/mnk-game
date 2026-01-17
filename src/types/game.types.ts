export interface BoardSize {
  m: number;
  n: number;
}

export type CellPosition = [number, number];

export enum MoveType {
  PLACE = 'place',
  MOVE = 'move'
}

export interface GameMove {
  type: MoveType;
  player: number;
  position: CellPosition;
  fromPosition?: CellPosition; // Only for MOVE type
}

export interface GameState {
  board: (number | null)[][];
  currentPlayer: number;
  playerConfigs: PlayerConfig[];
  boardSize: BoardSize;
  winLength: number;
  winner: number | null;
  isDraw: boolean;
  winningCells: CellPosition[];
  gameStarted: boolean;
  allowMovingOpponentPieces: boolean;
  selectedCell: CellPosition | null;
  rematchRequests: boolean[];
}

export interface PlayerConfig {
  symbol: string;
  color: string;
  name: string;
}

export interface GameConfig {
  boardSize: BoardSize;
  winLength: number;
  allowMovingOpponentPieces: boolean;
  playerCount: number;
  playerConfigs?: PlayerConfig[];
}

export interface WinCheckResult {
  isWin: boolean;
  winningCells: CellPosition[];
}

export interface MoveResult {
  newBoard: (number | null)[][];
  winner: number | null;
  isDraw: boolean;
  winningCells: CellPosition[];
  nextPlayer: number;
}

export type ClickOutcome =
  | { kind: 'move'; to: CellPosition; from?: CellPosition }
  | { kind: 'select'; cell: CellPosition }
  | { kind: 'deselect' };
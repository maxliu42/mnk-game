import { BoardSize, CellPosition } from '../types/game.types';

/** [dx, dy] vectors: horizontal, vertical, diagonal-down-right, diagonal-down-left */
export const DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]];

export const sameCell = (a: CellPosition, b: CellPosition): boolean =>
  a[0] === b[0] && a[1] === b[1];

export const isValidPosition = (row: number, col: number, boardSize: BoardSize): boolean =>
  row >= 0 && row < boardSize.m && col >= 0 && col < boardSize.n;

export const createEmptyBoard = (boardSize: BoardSize): (number | null)[][] =>
  Array(boardSize.m).fill(null).map(() => Array(boardSize.n).fill(null));

export const isGameOver = (winner: number | null, isDraw: boolean): boolean =>
  winner !== null || isDraw; 
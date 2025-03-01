/**
 * Core utility functions for the m,n,k-game
 */
import { BoardSize, CellPosition, GridType, MoveType } from '../types/game.types';
import { getGridImplementation } from './grid';

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
 * Gets all valid neighboring positions for a cell based on grid type
 */
export const getNeighbors = (
  position: CellPosition,
  boardSize: BoardSize,
  gridType: GridType = GridType.SQUARE
): CellPosition[] => {
  const [row, col] = position;
  const gridImpl = getGridImplementation(gridType);
  const directions = gridImpl.DIRECTIONS;
  
  return directions
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

/**
 * Checks if a move is valid
 */
export const isValidMove = (
  board: (number | null)[][],
  position: CellPosition,
  moveType: MoveType,
  currentPlayer: number,
  fromPosition?: CellPosition
): boolean => {
  const [row, col] = position;
  
  if (moveType === MoveType.PLACE) {
    // For placement, the cell must be empty
    return board[row][col] === null;
  } else if (moveType === MoveType.MOVE && fromPosition) {
    const [fromRow, fromCol] = fromPosition;
    
    // For moving a piece, the destination must be empty
    // The source must contain an opponent's piece
    // Note: We're not checking if the move is "valid" in terms of distance/pattern
    // That would depend on specific game rules
    return (
      board[row][col] === null && 
      board[fromRow][fromCol] !== null && 
      board[fromRow][fromCol] !== currentPlayer
    );
  }
  
  return false;
}; 
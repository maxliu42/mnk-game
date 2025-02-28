/**
 * Game utility functions for the m,n,k-game
 */
import { BoardSize, CellPosition, GridType, MoveType, WinCheckResult } from '../types/game.types';

/**
 * Direction vectors for different grid types
 */
const DIRECTIONS = {
  [GridType.SQUARE]: [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1],  // diagonal down-left
  ],
  [GridType.HEX]: [
    [1, 0],    // down
    [0, 1],    // right
    [-1, 1],   // up-right
    [1, -1],   // down-left
    [-1, 0],   // up
    [0, -1],   // left
  ]
};

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
  const directions = DIRECTIONS[gridType];
  
  return directions
    .map(([dr, dc]) => [row + dr, col + dc] as CellPosition)
    .filter(([r, c]) => isValidPosition(r, c, boardSize));
};

/**
 * Checks if the current move results in a win
 */
export const checkWin = (
  board: (number | null)[][],
  row: number,
  col: number,
  player: number,
  boardSize: BoardSize,
  winLength: number,
  gridType: GridType = GridType.SQUARE
): WinCheckResult => {
  const directions = DIRECTIONS[gridType];
  
  for (const [dx, dy] of directions) {
    let count = 1; // Start with 1 for the current cell
    const winningCells: CellPosition[] = [[row, col]];
    
    // Check in both directions
    for (let dir = -1; dir <= 1; dir += 2) {
      // Skip the center (already counted)
      if (dir === 0) continue;
      
      // Check consecutive cells in this direction
      for (let i = 1; i < Math.max(boardSize.m, boardSize.n); i++) {
        const newRow = row + dir * dx * i;
        const newCol = col + dir * dy * i;
        
        // Check if cell is within bounds and has the player's symbol
        if (
          isValidPosition(newRow, newCol, boardSize) &&
          board[newRow][newCol] === player
        ) {
          count++;
          winningCells.push([newRow, newCol]);
        } else {
          break;
        }
      }
    }
    
    // If we found enough cells in a row, it's a win
    if (count >= winLength) {
      return { isWin: true, winningCells };
    }
  }
  
  return { isWin: false, winningCells: [] };
};

/**
 * Checks if the game is a draw
 */
export const checkDraw = (board: (number | null)[][]): boolean => {
  return board.every(row => row.every(cell => cell !== null));
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
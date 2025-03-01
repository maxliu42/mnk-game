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
 * Counts consecutive pieces in a direction
 */
const countConsecutivePieces = (
  board: (number | null)[][],
  startRow: number,
  startCol: number,
  dirX: number,
  dirY: number,
  player: number,
  boardSize: BoardSize
): { count: number; cells: CellPosition[] } => {
  let count = 0;
  const cells: CellPosition[] = [];
  
  // Check consecutive cells in this direction
  for (let i = 0; i < Math.max(boardSize.m, boardSize.n); i++) {
    const newRow = startRow + dirX * i;
    const newCol = startCol + dirY * i;
    
    // Check if cell is within bounds and has the player's symbol
    if (
      isValidPosition(newRow, newCol, boardSize) &&
      board[newRow][newCol] === player
    ) {
      count++;
      cells.push([newRow, newCol]);
    } else {
      break;
    }
  }
  
  return { count, cells };
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
    // Check in positive direction (including the current cell)
    const { count: forwardCount, cells: forwardCells } = countConsecutivePieces(
      board, row, col, dx, dy, player, boardSize
    );
    
    // Check in negative direction (excluding the current cell to avoid counting it twice)
    const { count: backwardCount, cells: backwardCells } = countConsecutivePieces(
      board, row + (-dx), col + (-dy), -dx, -dy, player, boardSize
    );
    
    // Total count (forwardCount already includes the current cell)
    const totalCount = forwardCount + backwardCount;
    
    // If we found enough cells in a row, it's a win
    if (totalCount >= winLength) {
      // Combine cells from both directions
      const allCells = [...forwardCells, ...backwardCells];
      // Remove duplicate cells if any
      const uniqueCells = allCells.filter((cell, index, self) => 
        self.findIndex(c => c[0] === cell[0] && c[1] === cell[1]) === index
      );
      
      return { isWin: true, winningCells: uniqueCells };
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
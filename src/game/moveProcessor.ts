import { BoardSize, CellPosition, MoveResult } from '../types/game.types';
import { checkWin, checkDraw } from './winConditions';

export type { MoveResult };

const copyBoard = <T>(board: T[][]): T[][] => board.map(row => [...row]);

export const processMove = (
  board: (number | null)[][],
  position: CellPosition,
  currentPlayer: number,
  boardSize: BoardSize,
  winLength: number,
  playerCount: number,
  fromPosition?: CellPosition
): MoveResult => {
  const [row, col] = position;
  const newBoard = copyBoard(board);
  let pieceOwner = currentPlayer;

  if (fromPosition) {
    // Moving existing piece
    const [fromRow, fromCol] = fromPosition;
    pieceOwner = newBoard[fromRow][fromCol]!;
    newBoard[row][col] = pieceOwner;
    newBoard[fromRow][fromCol] = null;
  } else {
    newBoard[row][col] = currentPlayer;
  }

  const winResult = checkWin(newBoard, row, col, pieceOwner, boardSize, winLength);
  const isDraw = !winResult.isWin && checkDraw(newBoard);
  const gameOver = winResult.isWin || isDraw;

  return {
    newBoard,
    winner: winResult.isWin ? pieceOwner : null,
    isDraw,
    winningCells: winResult.winningCells,
    nextPlayer: gameOver ? currentPlayer : (currentPlayer + 1) % playerCount,
  };
};

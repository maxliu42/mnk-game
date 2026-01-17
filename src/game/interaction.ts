import { CellPosition, ClickOutcome } from '../types/game.types';

export type { ClickOutcome };

interface InterpretClickParams {
  board: (number | null)[][];
  currentPlayer: number;
  selectedCell: CellPosition | null;
  allowMovingOpponentPieces: boolean;
  click: CellPosition;
}

const sameCell = (a: CellPosition, b: CellPosition): boolean => a[0] === b[0] && a[1] === b[1];

export const interpretCellClick = (params: InterpretClickParams): ClickOutcome => {
  const { board, currentPlayer, selectedCell, allowMovingOpponentPieces, click } = params;
  const [row, col] = click;
  const cellContent = board[row][col];

  // Empty cell: place or relocate piece
  if (cellContent === null) {
    return selectedCell ? { kind: 'move', to: click, from: selectedCell } : { kind: 'move', to: click };
  }

  // Clicking selected cell deselects
  if (selectedCell && sameCell(selectedCell, click)) return { kind: 'deselect' };

  // Select opponent's piece if allowed
  if (allowMovingOpponentPieces && cellContent !== currentPlayer) {
    return { kind: 'select', cell: click };
  }

  return { kind: 'deselect' };
};


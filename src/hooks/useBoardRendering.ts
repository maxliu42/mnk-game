/**
 * useBoardRendering hook - handles rendering calculations for the game board
 */
import { useMemo } from 'react';
import { CellPosition } from '../types/game.types';

const BOARD_SIZE_CONFIG = [
  { name: 'small', maxDimension: 3, cellSize: 65, symbolClass: 'symbol-large' },
  { name: 'medium', maxDimension: 5, cellSize: 50, symbolClass: 'symbol-medium' },
  { name: 'large', maxDimension: 10, cellSize: 45, symbolClass: 'symbol-small' },
  { name: 'xlarge', maxDimension: Infinity, cellSize: 35, symbolClass: 'symbol-xsmall' }
];

const cellKey = (row: number, col: number) => `${row},${col}`;

export const useBoardRendering = (
  board: (number | null)[][], 
  winningCells: CellPosition[],
  selectedCell: CellPosition | null
) => {
  const rowCount = board.length || 3;
  const colCount = board[0]?.length || 3;
  const maxDimension = Math.max(rowCount, colCount);
  
  const boardConfig = useMemo(() => 
    BOARD_SIZE_CONFIG.find(c => maxDimension <= c.maxDimension) || BOARD_SIZE_CONFIG[3],
  [maxDimension]);

  const gridClassName = `game-board ${boardConfig.name}-board square-grid`;
  
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${colCount}, 1fr)`,
    gridTemplateRows: `repeat(${rowCount}, 1fr)`,
    gap: '0',
  }), [rowCount, colCount]);

  // O(1) lookup using Set
  const winningCellSet = useMemo(() => 
    new Set(winningCells.map(([r, c]) => cellKey(r, c))),
  [winningCells]);

  const selectedCellKey = selectedCell ? cellKey(selectedCell[0], selectedCell[1]) : null;

  return {
    symbolSizeClass: boardConfig.symbolClass,
    gridClassName,
    gridStyle,
    optimalCellSize: `${boardConfig.cellSize}px`,
    isWinningCell: (row: number, col: number) => winningCellSet.has(cellKey(row, col)),
    isCellSelected: (row: number, col: number) => cellKey(row, col) === selectedCellKey
  };
}; 
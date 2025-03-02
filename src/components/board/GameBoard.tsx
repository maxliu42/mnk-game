import React, { useMemo, useCallback } from 'react';
import { CellPosition } from '../../types/game.types';
import BoardCell from './BoardCell';

// Cell size in pixels for different board size categories
const BASE_CELL_SIZES = {
  'small-board': 65, // 3x3 boards - increased from 60 for better emoji display
  'medium-board': 50, // 4x4 to 5x5 boards
  'large-board': 45, // 6x6 to 10x10 boards
  'xlarge-board': 35, // Larger than 10x10
};

interface GameBoardProps {
  board: (number | null)[][];
  onCellClick: (row: number, col: number) => void;
  winningCells: CellPosition[];
  selectedCell: CellPosition | null;
  playerSymbols: string[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  winningCells,
  selectedCell,
  playerSymbols,
}) => {
  // Get board dimensions
  const rowCount = board.length || 3;
  const colCount = board[0]?.length || 3;
  const maxDimension = Math.max(rowCount, colCount);
  
  // Classify board size based on its largest dimension
  const boardSizeClass = useMemo(() => {
    if (maxDimension <= 3) return 'small-board';
    if (maxDimension <= 5) return 'medium-board';
    if (maxDimension <= 10) return 'large-board';
    return 'xlarge-board';
  }, [maxDimension]);
  
  // Determine appropriate symbol size based on board dimensions
  const symbolSizeClass = useMemo(() => {
    if (maxDimension <= 3) return 'symbol-large';
    if (maxDimension <= 5) return 'symbol-medium';
    if (maxDimension <= 10) return 'symbol-small';
    return 'symbol-xsmall';
  }, [maxDimension]);

  const optimalCellSize = `${BASE_CELL_SIZES[boardSizeClass as keyof typeof BASE_CELL_SIZES]}px`;

  // Check if a cell is part of the winning line
  const isWinningCell = useCallback((row: number, col: number) => {
    return winningCells.some(
      ([winRow, winCol]) => winRow === row && winCol === col
    );
  }, [winningCells]);

  // Check if a cell is currently selected
  const isCellSelected = useCallback((row: number, col: number) => {
    return selectedCell ? selectedCell[0] === row && selectedCell[1] === col : false;
  }, [selectedCell]);

  // Determine grid wrapper classes and styles
  const gridClassName = useMemo(() => `game-board ${boardSizeClass} square-grid`, [boardSizeClass]);
  
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${colCount}, 1fr)`,
    gridTemplateRows: `repeat(${rowCount}, 1fr)`,
    gap: '0',
  }), [rowCount, colCount]);

  return (
    <div
      className={gridClassName}
      style={gridStyle}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <BoardCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            isWinning={isWinningCell(rowIndex, colIndex)}
            isSelected={isCellSelected(rowIndex, colIndex)}
            symbolSizeClass={symbolSizeClass}
            optimalCellSize={optimalCellSize}
            playerSymbols={playerSymbols}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}; 
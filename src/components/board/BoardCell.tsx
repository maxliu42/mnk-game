import React from 'react';
import { GridType } from '../../types/game.types';

interface BoardCellProps {
  cell: number | null;
  row: number;
  col: number;
  isWinning: boolean;
  isSelected: boolean;
  symbolSizeClass: string;
  optimalCellSize: string;
  gridType: GridType;
  playerSymbols: string[];
  onClick: () => void;
}

// Helper function to generate cell class names
const getCellClassNames = (
  cell: number | null,
  gridType: GridType,
  isWinning: boolean,
  isSelected: boolean
): string => {
  let cellClassName = 'cell';
  
  if (gridType === GridType.HEX) {
    cellClassName += ' hex-cell';
  }
  if (cell !== null) {
    cellClassName += ` player${cell + 1}`;
  }
  if (isWinning) {
    cellClassName += ' winning-line';
  }
  if (isSelected) {
    cellClassName += ' selected';
  }
  
  return cellClassName;
};

// Helper function to generate cell styles
const getCellStyles = (
  gridType: GridType,
  optimalCellSize: string
): React.CSSProperties => {
  return {
    aspectRatio: gridType === GridType.SQUARE ? '1 / 1' : 'auto',
    padding: 0,
    width: optimalCellSize,
    height: optimalCellSize,
    maxWidth: optimalCellSize,
    maxHeight: optimalCellSize,
    margin: '0',
    borderRadius: '0',
    overflow: 'hidden', // Ensure content doesn't overflow
  };
};

const BoardCell: React.FC<BoardCellProps> = ({
  cell,
  row,
  col,
  isWinning,
  isSelected,
  symbolSizeClass,
  optimalCellSize,
  gridType,
  playerSymbols,
  onClick
}) => {
  // Build class names for the cell using the helper function
  const cellClassName = getCellClassNames(cell, gridType, isWinning, isSelected);
  
  // Generate cell styles based on grid type
  const cellStyle = getCellStyles(gridType, optimalCellSize);
  
  return (
    <button
      className={cellClassName}
      onClick={onClick}
      aria-label={`Cell ${row},${col}`}
      data-row={row}
      data-col={col}
      style={cellStyle}
    >
      {cell !== null && (
        <div className={`symbol ${symbolSizeClass}`}>
          {playerSymbols[cell]}
        </div>
      )}
    </button>
  );
};

export default BoardCell; 
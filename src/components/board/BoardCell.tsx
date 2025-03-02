import React from 'react';
import { getCellClassNames, getCellStyles } from '../../utils';

interface BoardCellProps {
  cell: number | null;
  row: number;
  col: number;
  isWinning: boolean;
  isSelected: boolean;
  symbolSizeClass: string;
  optimalCellSize: string;
  playerSymbols: string[];
  onClick: () => void;
}

const BoardCell: React.FC<BoardCellProps> = ({
  cell,
  row,
  col,
  isWinning,
  isSelected,
  symbolSizeClass,
  optimalCellSize,
  playerSymbols,
  onClick
}) => {
  // Build class names for the cell using the utility function
  const cellClassName = getCellClassNames(cell, isWinning, isSelected);
  
  // Generate cell styles based on the cell size using the utility function
  const cellStyle = getCellStyles(optimalCellSize);
  
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

// Memoize the component to prevent unnecessary re-renders
export default React.memo(BoardCell); 
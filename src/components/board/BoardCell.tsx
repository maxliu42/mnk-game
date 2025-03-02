import React from 'react';

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

// Helper function to generate cell class names
const getCellClassNames = (
  cell: number | null,
  isWinning: boolean,
  isSelected: boolean
): string => {
  let cellClassName = 'cell';
  
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
  optimalCellSize: string
): React.CSSProperties => {
  return {
    aspectRatio: '1 / 1',
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
  playerSymbols,
  onClick
}) => {
  // Build class names for the cell using the helper function
  const cellClassName = getCellClassNames(cell, isWinning, isSelected);
  
  // Generate cell styles based on the cell size
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
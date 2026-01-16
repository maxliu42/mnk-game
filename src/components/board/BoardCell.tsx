import React from 'react';
import { CellPosition } from '../../types/game.types';
import { getCellClassNames, getCellStyles } from '../../utils';

interface BoardCellProps {
  cell: number | null;
  position: CellPosition;
  isWinning: boolean;
  isSelected: boolean;
  symbolSizeClass: string;
  optimalCellSize: string;
  playerSymbols: string[];
  onClick: () => void;
}

const BoardCell: React.FC<BoardCellProps> = ({
  cell,
  position: [row, col],
  isWinning,
  isSelected,
  symbolSizeClass,
  optimalCellSize,
  playerSymbols,
  onClick
}) => {
  return (
    <button
      className={getCellClassNames(cell, isWinning, isSelected)}
      onClick={onClick}
      aria-label={`Cell ${row},${col}`}
      style={getCellStyles(optimalCellSize)}
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
import React from 'react';

interface BoardCellProps {
  cell: number | null;
  isWinning: boolean;
  isSelected: boolean;
  symbolSizeClass: string;
  cellSize: string;
  playerSymbols: string[];
  ariaLabel: string;
  onClick: () => void;
}

const BoardCell: React.FC<BoardCellProps> = ({
  cell,
  isWinning,
  isSelected,
  symbolSizeClass,
  cellSize,
  playerSymbols,
  ariaLabel,
  onClick
}) => {
  const className = [
    'cell',
    cell !== null && `player${cell + 1}`,
    isWinning && 'winning-line',
    isSelected && 'selected',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ width: cellSize, aspectRatio: '1 / 1' }}
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
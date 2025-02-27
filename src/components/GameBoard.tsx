import React, { useMemo } from 'react';

// Cell size in pixels for different board size categories
const BASE_CELL_SIZES = {
  'small-board': 60, // 3x3 boards
  'medium-board': 50, // 4x4 to 5x5 boards
  'large-board': 45, // 6x6 to 10x10 boards
  'xlarge-board': 35, // Larger than 10x10
};

interface GameBoardProps {
  board: (number | null)[][];
  onCellClick: (row: number, col: number) => void;
  playerSymbols: string[];
  winningCells: [number, number][];
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  playerSymbols,
  winningCells,
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
  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(
      ([winRow, winCol]) => winRow === row && winCol === col
    );
  };

  // Render the cell content (X or O symbol)
  const renderCellContent = (cell: number | null) => {
    if (cell === null) return null;
    return <div className={`symbol ${symbolSizeClass}`}></div>;
  };

  return (
    <div
      className={`game-board ${boardSizeClass}`}
      style={{
        gridTemplateColumns: `repeat(${colCount}, 1fr)`,
        gridTemplateRows: `repeat(${rowCount}, 1fr)`,
        gap: '0'
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          let cellClassName = 'cell';
          if (cell !== null) {
            cellClassName += ` player${cell + 1}`;
          }
          if (isWinningCell(rowIndex, colIndex)) {
            cellClassName += ' winning-line';
          }
          
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={cellClassName}
              onClick={() => onCellClick(rowIndex, colIndex)}
              aria-label={`Cell ${rowIndex},${colIndex}`}
              style={{
                aspectRatio: '1 / 1',
                padding: 0,
                minWidth: optimalCellSize,
                minHeight: optimalCellSize,
                margin: '0',
                borderRadius: '0'
              }}
            >
              {renderCellContent(cell)}
            </button>
          );
        })
      )}
    </div>
  );
};

export default GameBoard; 
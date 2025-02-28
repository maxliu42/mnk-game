import React, { useMemo } from 'react';
import { CellPosition, GridType } from '../types/game.types';

// Cell size in pixels for different board size categories
const BASE_CELL_SIZES = {
  'small-board': 65, // 3x3 boards - increased from 60 for better emoji display
  'medium-board': 50, // 4x4 to 5x5 boards
  'large-board': 45, // 6x6 to 10x10 boards
  'xlarge-board': 35, // Larger than 10x10
};

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
  // Build class names for the cell
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

  // Generate cell styles based on grid type
  const cellStyle = {
    aspectRatio: gridType === GridType.SQUARE ? '1 / 1' : 'auto',
    padding: 0,
    width: optimalCellSize,
    height: optimalCellSize,
    maxWidth: optimalCellSize,
    maxHeight: optimalCellSize,
    margin: '0',
    borderRadius: '0',
    overflow: 'hidden', // Ensure content doesn't overflow
    // Add any extra styles for hex cells here
  };
  
  return (
    <button
      key={`${row}-${col}`}
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

interface GameBoardProps {
  board: (number | null)[][];
  onCellClick: (row: number, col: number) => void;
  winningCells: CellPosition[];
  selectedCell: CellPosition | null;
  gridType?: GridType;
  playerSymbols: string[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  winningCells,
  selectedCell,
  gridType = GridType.SQUARE,
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
  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(
      ([winRow, winCol]) => winRow === row && winCol === col
    );
  };

  // Check if a cell is currently selected
  const isCellSelected = (row: number, col: number) => {
    return selectedCell ? selectedCell[0] === row && selectedCell[1] === col : false;
  };

  // Determine grid wrapper classes and styles based on grid type
  const gridClassName = `game-board ${boardSizeClass} ${gridType === GridType.HEX ? 'hex-grid' : 'square-grid'}`;
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${colCount}, 1fr)`,
    gridTemplateRows: `repeat(${rowCount}, 1fr)`,
    gap: gridType === GridType.SQUARE ? '0' : '2px', // Adjust for hex grid
  };

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
            gridType={gridType}
            playerSymbols={playerSymbols}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}; 
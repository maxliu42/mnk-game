import React, { useMemo } from 'react';
import { CellPosition } from '../../types/game.types';
import BoardCell from './BoardCell';

const BOARD_SIZE_CONFIG = [
  { name: 'small', maxDimension: 3, cellSize: 65, symbolClass: 'symbol-large' },
  { name: 'medium', maxDimension: 5, cellSize: 50, symbolClass: 'symbol-medium' },
  { name: 'large', maxDimension: 10, cellSize: 45, symbolClass: 'symbol-small' },
  { name: 'xlarge', maxDimension: Infinity, cellSize: 35, symbolClass: 'symbol-xsmall' }
];

const cellKey = (row: number, col: number) => `${row},${col}`;

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
  const rowCount = board.length || 3;
  const colCount = board[0]?.length || 3;
  const maxDimension = Math.max(rowCount, colCount);
  
  const boardConfig = useMemo(() => 
    BOARD_SIZE_CONFIG.find(c => maxDimension <= c.maxDimension) || BOARD_SIZE_CONFIG[3],
  [maxDimension]);

  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${colCount}, 1fr)`,
    gridTemplateRows: `repeat(${rowCount}, 1fr)`,
    gap: '0',
  }), [rowCount, colCount]);

  const winningCellSet = useMemo(() => 
    new Set(winningCells.map(([r, c]) => cellKey(r, c))),
  [winningCells]);

  const selectedCellKey = selectedCell ? cellKey(selectedCell[0], selectedCell[1]) : null;
  const optimalCellSize = `${boardConfig.cellSize}px`;

  return (
    <div
      className={`game-board ${boardConfig.name}-board square-grid`}
      style={gridStyle}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <BoardCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            isWinning={winningCellSet.has(cellKey(rowIndex, colIndex))}
            isSelected={cellKey(rowIndex, colIndex) === selectedCellKey}
            symbolSizeClass={boardConfig.symbolClass}
            optimalCellSize={optimalCellSize}
            playerSymbols={playerSymbols}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}; 
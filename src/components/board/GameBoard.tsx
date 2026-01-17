import React, { useMemo } from 'react';
import { CellPosition } from '../../types/game.types';
import { BOARD_SIZE_CONFIG } from '../../constants';
import BoardCell from './BoardCell';

interface GameBoardProps {
  board: (number | null)[][];
  onCellClick: (row: number, col: number) => void;
  winningCells: CellPosition[];
  selectedCell: CellPosition | null;
  playerSymbols: string[];
  disabled?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  winningCells,
  selectedCell,
  playerSymbols,
  disabled = false,
}) => {
  const rowCount = board.length;
  const colCount = board[0].length;
  const maxDimension = Math.max(rowCount, colCount);
  
  const boardConfig = BOARD_SIZE_CONFIG.find(c => maxDimension <= c.maxDimension) ?? BOARD_SIZE_CONFIG.at(-1)!;

  const winningCellSet = useMemo(() => 
    new Set(winningCells.map(([r, c]) => `${r},${c}`)),
  [winningCells]);

  return (
    <div
      className={`game-board ${boardConfig.sizeClass} square-grid ${disabled ? 'board-disabled' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${colCount}, 1fr)`,
        gridTemplateRows: `repeat(${rowCount}, 1fr)`,
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const key = `${rowIndex},${colIndex}`;
          return (
            <BoardCell
              key={key}
              cell={cell}
              isWinning={winningCellSet.has(key)}
              isSelected={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex}
              symbolSizeClass={boardConfig.symbolClass}
              cellSize={`${boardConfig.cellSize}px`}
              playerSymbols={playerSymbols}
              ariaLabel={`Cell ${key}`}
              onClick={() => !disabled && onCellClick(rowIndex, colIndex)}
            />
          );
        })
      )}
    </div>
  );
}; 
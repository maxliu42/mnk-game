import React from 'react';
import { CellPosition } from '../../types/game.types';
import BoardCell from './BoardCell';
import { useBoardRendering } from '../../hooks';

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
  // Use the custom hook for all board rendering calculations
  const {
    symbolSizeClass,
    gridClassName,
    gridStyle,
    optimalCellSize,
    isWinningCell,
    isCellSelected
  } = useBoardRendering(board, winningCells, selectedCell);

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
/**
 * useBoardRendering hook
 * 
 * This hook handles the rendering calculations for the game board,
 * including optimal cell sizes, grid classes and styles based on board dimensions.
 */
import { useMemo } from 'react';
import { CellPosition } from '../types/game.types';

// Board size classifications with their thresholds and styling information
const BOARD_SIZE_CONFIG = [
  {
    name: 'small',
    maxDimension: 3,
    cellSize: 65,
    symbolClass: 'symbol-large'
  },
  {
    name: 'medium',
    maxDimension: 5,
    cellSize: 50,
    symbolClass: 'symbol-medium'
  },
  {
    name: 'large',
    maxDimension: 10,
    cellSize: 45,
    symbolClass: 'symbol-small'
  },
  {
    name: 'xlarge',
    maxDimension: Infinity,
    cellSize: 35,
    symbolClass: 'symbol-xsmall'
  }
];

/**
 * Interface for the return value of useBoardRendering
 */
interface BoardRenderingHook {
  /** CSS class for symbol size within cells */
  symbolSizeClass: string;
  /** CSS class for the grid container */
  gridClassName: string;
  /** CSS style object for the grid container */
  gridStyle: React.CSSProperties;
  /** Optimal cell size in pixels */
  optimalCellSize: string;
  /** Function to check if a cell is part of the winning line */
  isWinningCell: (row: number, col: number) => boolean;
  /** Function to check if a cell is currently selected */
  isCellSelected: (row: number, col: number) => boolean;
}

/**
 * Hook for board rendering calculations
 * 
 * @param board The current game board state
 * @param winningCells Array of positions that form the winning line
 * @param selectedCell Currently selected cell position (if any)
 * @returns Object with calculated rendering properties and helper functions
 */
const useBoardRendering = (
  board: (number | null)[][], 
  winningCells: CellPosition[],
  selectedCell: CellPosition | null
): BoardRenderingHook => {
  // Get board dimensions
  const rowCount = board.length || 3;
  const colCount = board[0]?.length || 3;
  const maxDimension = Math.max(rowCount, colCount);
  
  // Get the appropriate board size configuration based on dimensions
  const boardConfig = useMemo(() => {
    return BOARD_SIZE_CONFIG.find(config => maxDimension <= config.maxDimension) || BOARD_SIZE_CONFIG[BOARD_SIZE_CONFIG.length - 1];
  }, [maxDimension]);
  
  // Calculate derived values from the config
  const boardSizeClass = `${boardConfig.name}-board`;
  const symbolSizeClass = boardConfig.symbolClass;
  const optimalCellSize = `${boardConfig.cellSize}px`;

  // Determine grid wrapper classes and styles
  const gridClassName = useMemo(() => 
    `game-board ${boardSizeClass} square-grid`, 
  [boardSizeClass]);
  
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${colCount}, 1fr)`,
    gridTemplateRows: `repeat(${rowCount}, 1fr)`,
    gap: '0',
  }), [rowCount, colCount]);

  // Check if a cell is part of the winning line
  const isWinningCell = useMemo(() => 
    (row: number, col: number) => 
      winningCells.some(([winRow, winCol]) => winRow === row && winCol === col),
  [winningCells]);

  // Check if a cell is currently selected
  const isCellSelected = useMemo(() => 
    (row: number, col: number) => 
      selectedCell ? selectedCell[0] === row && selectedCell[1] === col : false,
  [selectedCell]);

  return {
    symbolSizeClass,
    gridClassName,
    gridStyle,
    optimalCellSize,
    isWinningCell,
    isCellSelected
  };
};

export default useBoardRendering; 
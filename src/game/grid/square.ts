/**
 * Square grid implementation
 * This module will provide functionality specific to square grids
 */
import { CellPosition, GridType } from '../../types/game.types';

/**
 * Square grid-specific functions will be added here
 * This is a placeholder for future implementation
 */
export const GRID_TYPE = GridType.SQUARE;

/**
 * Square grid direction vectors for win checking and neighbor detection
 */
export const DIRECTIONS = [
  [0, 1],   // horizontal
  [1, 0],   // vertical
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
]; 
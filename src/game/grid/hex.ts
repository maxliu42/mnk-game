/**
 * Hexagonal grid implementation
 * This module will provide functionality specific to hexagonal grids
 */
import { CellPosition, GridType } from '../../types/game.types';

/**
 * Hexagonal grid-specific functions will be added here
 * This is a placeholder for future implementation
 */
export const GRID_TYPE = GridType.HEX;

/**
 * Hexagonal grid direction vectors for win checking and neighbor detection
 * These represent the six directions from a hexagon cell
 */
export const DIRECTIONS = [
  [1, 0],     // right
  [0, 1],     // down-right
  [-1, 1],    // down-left
  [-1, 0],    // left
  [0, -1],    // up-left
  [1, -1]     // up-right
]; 
/**
 * Grid module exports
 * This module provides exports for different grid types used in the game
 */

export * from './square';
export * from './hex';

/**
 * Factory function to get the appropriate grid implementation based on grid type
 * This will be expanded in the future when grid-specific functionality is implemented
 */
import { GridType } from '../../types/game.types';
import * as SquareGrid from './square';
import * as HexGrid from './hex';

export const getGridImplementation = (gridType: GridType) => {
  switch (gridType) {
    case GridType.SQUARE:
      return SquareGrid;
    case GridType.HEX:
      return HexGrid;
    default:
      return SquareGrid; // Default to square grid
  }
}; 
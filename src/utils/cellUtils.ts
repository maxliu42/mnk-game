/**
 * Cell utility functions for styling and class name generation
 */
import React from 'react';

/**
 * Generates cell class names based on cell state
 * 
 * @param cell Cell value (player index or null)
 * @param isWinning Whether the cell is part of a winning line
 * @param isSelected Whether the cell is currently selected
 * @returns CSS class names string
 */
export const getCellClassNames = (
  cell: number | null,
  isWinning: boolean,
  isSelected: boolean
): string => {
  let cellClassName = 'cell';
  
  if (cell !== null) {
    cellClassName += ` player${cell + 1}`;
  }
  if (isWinning) {
    cellClassName += ' winning-line';
  }
  if (isSelected) {
    cellClassName += ' selected';
  }
  
  return cellClassName;
};

/**
 * Generates cell styles based on optimal cell size
 * 
 * @param optimalCellSize The optimal cell size in pixels
 * @returns React CSS properties object
 */
export const getCellStyles = (
  optimalCellSize: string
): React.CSSProperties => {
  return {
    aspectRatio: '1 / 1',
    padding: 0,
    width: optimalCellSize,
    height: optimalCellSize,
    maxWidth: optimalCellSize,
    maxHeight: optimalCellSize,
    margin: '0',
    borderRadius: '0',
    overflow: 'hidden', // Ensure content doesn't overflow
  };
}; 
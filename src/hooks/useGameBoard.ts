/**
 * useGameBoard hook - provides functionality for interacting with the game board
 */
import { useCallback } from 'react';
import { CellPosition } from '../types/game.types';
import { useGame } from '../context';

export const useGameBoard = () => {
  const { state, dispatch } = useGame();
  
  const handleCellClick = useCallback((position: CellPosition) => {
    dispatch({ type: 'CELL_CLICK', payload: position });
  }, [dispatch]);
  
  const cancelSelection = useCallback(() => {
    dispatch({ type: 'DESELECT' });
  }, [dispatch]);
  
  return {
    selectedCell: state.selectedCell,
    handleCellClick,
    cancelSelection
  };
}; 
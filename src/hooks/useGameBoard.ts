/**
 * useGameBoard hook
 * 
 * This hook provides functionality for interacting with the game board,
 * including handling cell clicks and selections.
 */
import { useCallback } from 'react';
import { CellPosition } from '../types/game.types';
import { useGame } from '../context';

/**
 * Interface for the return value of useGameBoard
 */
interface GameBoardHook {
  /** Currently selected cell position (for move mode) */
  selectedCell: CellPosition | null;
  /** Handler for when a cell is clicked */
  handleCellClick: (position: CellPosition) => void;
  /** Function to cancel the current selection */
  cancelSelection: () => void;
}

/**
 * Hook for managing game board interactions
 * 
 * @returns Object with selected cell state and interaction handlers
 */
export const useGameBoard = (): GameBoardHook => {
  const { state, dispatch } = useGame();
  
  /**
   * Handle cell click by dispatching the appropriate action
   */
  const handleCellClick = useCallback((position: CellPosition) => {
    dispatch({
      type: 'HANDLE_CELL_CLICK',
      payload: { position }
    });
  }, [dispatch]);
  
  /**
   * Cancel the current selection
   */
  const cancelSelection = useCallback(() => {
    dispatch({
      type: 'SELECT_CELL',
      payload: null
    });
  }, [dispatch]);
  
  return {
    selectedCell: state.selectedCell,
    handleCellClick,
    cancelSelection
  };
};

export default useGameBoard; 
/**
 * useGameBoard hook
 * 
 * This hook provides functionality for interacting with the game board,
 * including handling cell clicks, selections, and game piece movements.
 */
import { useCallback } from 'react';
import { CellPosition, MoveType } from '../types/game.types';
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
   * Handle cell click based on current game state
   * This is now simplified to delegate all game logic to the reducer
   */
  const handleCellClick = useCallback((position: CellPosition) => {
    const { board, selectedCell } = state;
    const [row, col] = position;
    
    // If cell is empty
    if (board[row][col] === null) {
      // If there's a selected cell, try to move from selected to this empty cell
      if (selectedCell) {
        dispatch({
          type: 'MAKE_MOVE',
          payload: { position, fromPosition: selectedCell }
        });
      } 
      // Otherwise make a normal placement move
      else {
        dispatch({
          type: 'MAKE_MOVE',
          payload: { position }
        });
      }
    } 
    // If cell has a piece, handle selection
    else {
      dispatch({
        type: 'SELECT_CELL',
        payload: position
      });
    }
  }, [state, dispatch]);
  
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
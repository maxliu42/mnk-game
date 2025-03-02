/**
 * useGameBoard hook
 * 
 * This hook provides functionality for interacting with the game board,
 * including handling cell clicks, selections, and game piece movements.
 */
import { useState, useCallback } from 'react';
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
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  
  /**
   * Handle cell click based on current game state and move type
   */
  const handleCellClick = useCallback((position: CellPosition) => {
    const { board, currentPlayer, winner, isDraw, gameStarted } = state;
    
    // Don't allow moves if the game is over or not started
    if (winner !== null || isDraw || !gameStarted) {
      return;
    }
    
    const [row, col] = position;
    
    // If a cell is already selected, we're in move mode
    if (selectedCell) {
      // If clicked on an empty cell, move the piece there
      if (board[row][col] === null) {
        dispatch({
          type: 'MAKE_MOVE',
          payload: { position, fromPosition: selectedCell }
        });
        setSelectedCell(null);
        // Reset back to placement mode after moving
        dispatch({ type: 'SET_MOVE_TYPE', payload: MoveType.PLACE });
      } 
      // If clicked on another opponent's piece, select that instead
      else if (board[row][col] !== null && board[row][col] !== currentPlayer) {
        setSelectedCell(position);
      } 
      // If clicked on own piece or same piece, deselect
      else {
        setSelectedCell(null);
        // Reset back to placement mode
        dispatch({ type: 'SET_MOVE_TYPE', payload: MoveType.PLACE });
      }
    }
    // No cell selected, default behavior
    else {
      // If clicked on an opponent's piece, select it for movement
      if (board[row][col] !== null && board[row][col] !== currentPlayer) {
        setSelectedCell(position);
        // Change to move mode
        dispatch({ type: 'SET_MOVE_TYPE', payload: MoveType.MOVE });
      }
      // If clicked on an empty cell, place a piece
      else if (board[row][col] === null) {
        dispatch({
          type: 'MAKE_MOVE',
          payload: { position }
        });
      }
    }
  }, [state, dispatch, selectedCell]);
  
  /**
   * Cancel the current selection
   */
  const cancelSelection = useCallback(() => {
    setSelectedCell(null);
    // Reset to placement mode
    dispatch({ type: 'SET_MOVE_TYPE', payload: MoveType.PLACE });
  }, [dispatch]);
  
  return {
    selectedCell,
    handleCellClick,
    cancelSelection
  };
};

export default useGameBoard; 
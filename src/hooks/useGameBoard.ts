/**
 * useGameBoard hook
 * This hook provides functionality for interacting with the game board
 */
import { useState, useCallback } from 'react';
import { CellPosition, MoveType } from '../types/game.types';
import { useGame } from '../context';

/**
 * Hook for managing game board interactions
 */
export const useGameBoard = () => {
  const { state, dispatch } = useGame();
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  
  /**
   * Handle cell click
   */
  const handleCellClick = useCallback((position: CellPosition) => {
    const { board, currentPlayer, moveType, winner, isDraw, gameStarted } = state;
    
    // Don't allow moves if the game is over or not started
    if (winner !== null || isDraw || !gameStarted) {
      return;
    }
    
    // Handle different move types
    if (moveType === MoveType.PLACE) {
      // For placement, just make the move
      dispatch({
        type: 'MAKE_MOVE',
        payload: { position }
      });
    } else if (moveType === MoveType.MOVE) {
      // For movement, we need to select a piece first, then a destination
      if (selectedCell === null) {
        // If no cell is selected, select this one if it has a piece
        const [row, col] = position;
        if (board[row][col] !== null) {
          setSelectedCell(position);
        }
      } else {
        // If a cell is already selected, try to move from the selected cell to this one
        dispatch({
          type: 'MAKE_MOVE',
          payload: { position, fromPosition: selectedCell }
        });
        setSelectedCell(null);
      }
    }
  }, [state, dispatch, selectedCell]);
  
  /**
   * Cancel the current selection
   */
  const cancelSelection = useCallback(() => {
    setSelectedCell(null);
  }, []);
  
  return {
    selectedCell,
    handleCellClick,
    cancelSelection,
    board: state.board,
    currentPlayer: state.currentPlayer,
    winner: state.winner,
    isDraw: state.isDraw,
    winningCells: state.winningCells,
    playerConfigs: state.playerConfigs,
    moveType: state.moveType
  };
};

export default useGameBoard; 
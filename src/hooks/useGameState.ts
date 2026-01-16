/**
 * useGameState hook - provides functionality for managing game state
 */
import { useCallback } from 'react';
import { useGame } from '../context';
import { GameConfig, PlayerConfig, CellPosition } from '../types/game.types';

interface GameStateHook {
  selectedCell: CellPosition | null;
  handleCellClick: (position: CellPosition) => void;
  cancelSelection: () => void;
  startGame: (config: GameConfig) => void;
  resetGame: (returnToMenu?: boolean) => void;
  setPlayerCount: (count: number) => void;
  updatePlayerConfig: (index: number, config: Partial<PlayerConfig>) => void;
}

export const useGameState = (): GameStateHook => {
  const { state, dispatch } = useGame();
  
  const handleCellClick = useCallback((position: CellPosition) => {
    dispatch({ type: 'CELL_CLICK', payload: position });
  }, [dispatch]);
  
  const cancelSelection = useCallback(() => {
    dispatch({ type: 'DESELECT' });
  }, [dispatch]);
  
  const startGame = useCallback((config: GameConfig) => {
    dispatch({
      type: 'START_GAME',
      payload: {
        boardSize: config.boardSize,
        winLength: config.winLength,
        gameStarted: true,
        allowMovingOpponentPieces: config.allowMovingOpponentPieces
      }
    });
  }, [dispatch]);
  
  const resetGame = useCallback((returnToMenu = true) => {
    dispatch(returnToMenu 
      ? { type: 'START_GAME', payload: { gameStarted: false } }
      : { type: 'RESET_GAME' }
    );
  }, [dispatch]);
  
  const setPlayerCount = useCallback((count: number) => {
    dispatch({ type: 'SET_PLAYER_COUNT', payload: count });
  }, [dispatch]);
  
  const updatePlayerConfig = useCallback((index: number, config: Partial<PlayerConfig>) => {
    dispatch({ type: 'UPDATE_PLAYER_CONFIG', payload: { index, config } });
  }, [dispatch]);
  
  return {
    selectedCell: state.selectedCell,
    handleCellClick,
    cancelSelection,
    startGame,
    resetGame,
    setPlayerCount,
    updatePlayerConfig
  };
}; 
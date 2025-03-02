/**
 * useGameState hook
 * 
 * This hook provides functionality for managing the game state,
 * including game initialization, player turns, win conditions, and reset.
 */
import { useCallback } from 'react';
import { useGame } from '../context';
import { GameConfig, PlayerConfig, BoardSize } from '../types/game.types';
import { DEFAULT_PLAYER_CONFIGS } from '../constants';

/**
 * Interface for the return value of useGameState
 */
interface GameStateHook {
  /** Start a new game with given configuration */
  startGame: (m: number, n: number, k: number, config?: GameConfig) => void;
  /** Reset the current game */
  resetGame: (returnToMenu?: boolean) => void;
  /** Check if the game is currently active */
  isGameActive: () => boolean;
  /** Get the current player's name */
  getCurrentPlayerName: () => string;
  /** Get the current player's symbol */
  getCurrentPlayerSymbol: () => string;
  /** Get the current player's color */
  getCurrentPlayerColor: () => string;
  /** Set the player configurations */
  setPlayerConfigs: (configs: PlayerConfig[]) => void;
  /** Get the current game status (active, win, draw) */
  getGameStatus: () => 'active' | 'win' | 'draw';
  /** Get the winner's configuration if there is a winner */
  getWinner: () => PlayerConfig | null;
}

/**
 * Hook for managing game state
 * 
 * @returns Object with game state management functions
 */
export const useGameState = (): GameStateHook => {
  const { state, dispatch } = useGame();
  
  /**
   * Start a new game with the specified dimensions and configuration
   */
  const startGame = useCallback((m: number, n: number, k: number, config?: GameConfig) => {
    dispatch({
      type: 'START_GAME',
      payload: {
        boardSize: config?.boardSize || { m, n },
        winLength: config?.winLength || k,
        playerConfigs: config?.playerConfigs || DEFAULT_PLAYER_CONFIGS.slice(0, config?.playerCount || 2),
        gameStarted: true
      }
    });
  }, [dispatch]);
  
  /**
   * Reset the current game, optionally returning to the menu
   */
  const resetGame = useCallback((returnToMenu = true) => {
    if (returnToMenu) {
      dispatch({
        type: 'START_GAME',
        payload: {
          gameStarted: false
        }
      });
    } else {
      dispatch({
        type: 'RESET_GAME'
      });
    }
  }, [dispatch]);
  
  /**
   * Check if the game is currently active
   */
  const isGameActive = useCallback(() => {
    const { gameStarted, winner, isDraw } = state;
    return gameStarted && winner === null && !isDraw;
  }, [state]);
  
  /**
   * Get the current player's name
   */
  const getCurrentPlayerName = useCallback(() => {
    return state.playerConfigs[state.currentPlayer]?.name || `Player ${state.currentPlayer + 1}`;
  }, [state.currentPlayer, state.playerConfigs]);
  
  /**
   * Get the current player's symbol
   */
  const getCurrentPlayerSymbol = useCallback(() => {
    return state.playerConfigs[state.currentPlayer]?.symbol || `P${state.currentPlayer + 1}`;
  }, [state.currentPlayer, state.playerConfigs]);
  
  /**
   * Get the current player's color
   */
  const getCurrentPlayerColor = useCallback(() => {
    return state.playerConfigs[state.currentPlayer]?.color || `#000000`;
  }, [state.currentPlayer, state.playerConfigs]);
  
  /**
   * Set the player configurations
   */
  const setPlayerConfigs = useCallback((configs: PlayerConfig[]) => {
    dispatch({
      type: 'SET_PLAYER_CONFIGS',
      payload: configs
    });
  }, [dispatch]);
  
  /**
   * Get the current game status
   */
  const getGameStatus = useCallback((): 'active' | 'win' | 'draw' => {
    if (state.winner !== null) return 'win';
    if (state.isDraw) return 'draw';
    return 'active';
  }, [state.winner, state.isDraw]);
  
  /**
   * Get the winner's configuration if there is a winner
   */
  const getWinner = useCallback((): PlayerConfig | null => {
    if (state.winner === null) return null;
    return state.playerConfigs[state.winner];
  }, [state.winner, state.playerConfigs]);
  
  return {
    startGame,
    resetGame,
    isGameActive,
    getCurrentPlayerName,
    getCurrentPlayerSymbol,
    getCurrentPlayerColor,
    setPlayerConfigs,
    getGameStatus,
    getWinner
  };
};

export default useGameState; 
/**
 * useGameState hook
 * 
 * This hook provides functionality for managing the game state,
 * including game initialization, player turns, win conditions, and reset.
 */
import { useCallback } from 'react';
import { useGame } from '../context';
import { GameConfig, PlayerConfig } from '../types/game.types';
import { DEFAULT_PLAYER_CONFIGS } from '../constants';

/**
 * Interface for the return value of useGameState
 */
interface GameStateHook {
  /** Start a new game with given configuration */
  startGame: (config: GameConfig) => void;
  /** Reset the current game */
  resetGame: (returnToMenu?: boolean) => void;
  /** Check if the game is currently active */
  isGameActive: () => boolean;
  /** Get the current player attribute (name, symbol, color) */
  getCurrentPlayerAttribute: <K extends keyof PlayerConfig>(attribute: K) => PlayerConfig[K];
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
   * Start a new game with the specified configuration
   */
  const startGame = useCallback((config: GameConfig) => {
    dispatch({
      type: 'START_GAME',
      payload: {
        boardSize: config.boardSize,
        winLength: config.winLength,
        playerConfigs: config.playerConfigs || DEFAULT_PLAYER_CONFIGS.slice(0, config.playerCount),
        gameStarted: true,
        allowMovingOpponentPieces: config.allowMovingOpponentPieces
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
   * Get the current game status
   */
  const getGameStatus = useCallback((): 'active' | 'win' | 'draw' => {
    if (state.winner !== null) return 'win';
    if (state.isDraw) return 'draw';
    return 'active';
  }, [state.winner, state.isDraw]);
  
  /**
   * Check if the game is currently active
   */
  const isGameActive = useCallback(() => {
    return getGameStatus() === 'active' && state.gameStarted;
  }, [getGameStatus, state.gameStarted]);
  
  /**
   * Get the specified attribute of the current player
   */
  const getCurrentPlayerAttribute = useCallback(<K extends keyof PlayerConfig>(attribute: K): PlayerConfig[K] => {
    const { currentPlayer, playerConfigs } = state;
    const playerConfig = playerConfigs[currentPlayer];
    
    if (!playerConfig) {
      // Fallback values based on attribute type
      const fallbacks: Record<keyof PlayerConfig, any> = {
        name: `Player ${currentPlayer + 1}`,
        symbol: `P${currentPlayer + 1}`,
        color: '#000000'
      };
      return fallbacks[attribute] as PlayerConfig[K];
    }
    
    return playerConfig[attribute];
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
    getCurrentPlayerAttribute,
    setPlayerConfigs,
    getGameStatus,
    getWinner
  };
}; 
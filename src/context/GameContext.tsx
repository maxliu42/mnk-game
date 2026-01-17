import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { PlayerConfig, CellPosition, GameState, GameConfig } from '../types/game.types';
import { GameMode, OnlineGameConfig } from '../types/online.types';
import { interpretCellClick, isGameOver } from '../game';
import { useOnlineGame, OnlineState } from '../hooks/useOnlineGame';
import { gameReducer, initialGameState } from './gameReducer';

interface GameContextType {
  state: GameState;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  onlineState: OnlineState;
  isMyTurn: boolean;
  isGameInProgress: boolean;
  makeMove: (position: CellPosition) => void;
  cancelSelection: () => void;
  requestRematch: () => Promise<void>;
  createOnlineGame: (config: OnlineGameConfig) => Promise<string | null>;
  joinOnlineGame: (gameId: string) => Promise<boolean>;
  leaveOnlineGame: () => void;
  getShareableLink: () => string;
  startGame: (config: GameConfig) => void;
  resetGame: (returnToMenu?: boolean) => void;
  setPlayerCount: (count: number) => void;
  updatePlayerConfig: (index: number, config: Partial<PlayerConfig>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
  initialGameId?: string | null;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, initialGameId }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  const onSyncState = useCallback((partialState: Partial<GameState>) => {
    dispatch({ type: 'SYNC_FROM_DATABASE', payload: partialState });
  }, []);

  const online = useOnlineGame({ initialGameId, onSyncState });

  const isMyTurn = online.gameMode === 'local' || state.currentPlayer === online.onlineState.playerIndex;
  const isGameInProgress = online.gameMode === 'local'
    ? state.gameStarted
    : (online.onlineState.status === 'playing' || online.onlineState.status === 'finished');

  const makeMove = useCallback((position: CellPosition) => {
    if (online.gameMode === 'online' && state.currentPlayer !== online.onlineState.playerIndex) return;
    if (isGameOver(state.winner, state.isDraw) || !state.gameStarted) return;

    const outcome = interpretCellClick({
      board: state.board,
      currentPlayer: state.currentPlayer,
      selectedCell: state.selectedCell,
      allowMovingOpponentPieces: state.allowMovingOpponentPieces,
      click: position,
    });

    switch (outcome.kind) {
      case 'move':
        if (online.gameMode === 'online') {
          online.makeOnlineMove(state, outcome.to, outcome.from);
          if (outcome.from) dispatch({ type: 'DESELECT' });
        } else {
          dispatch({ type: 'PROCESS_MOVE', payload: { to: outcome.to, from: outcome.from } });
        }
        break;
      case 'select':
        dispatch({ type: 'SELECT_CELL', payload: outcome.cell });
        break;
      case 'deselect':
        dispatch({ type: 'DESELECT' });
        break;
    }
  }, [online, state]);

  const requestRematch = useCallback(async () => {
    if (online.gameMode === 'online') {
      await online.requestRematch(state.rematchRequests, state.boardSize, state.playerConfigs.length);
    } else {
      dispatch({ type: 'RESET_GAME' });
    }
  }, [online, state.rematchRequests, state.boardSize, state.playerConfigs.length]);

  const cancelSelection = useCallback(() => dispatch({ type: 'DESELECT' }), []);
  const startGame = useCallback((config: GameConfig) => dispatch({
    type: 'START_GAME',
    payload: { boardSize: config.boardSize, winLength: config.winLength, allowMovingOpponentPieces: config.allowMovingOpponentPieces },
  }), []);
  const resetGame = useCallback((returnToMenu = true) => 
    dispatch(returnToMenu ? { type: 'RETURN_TO_MENU' } : { type: 'RESET_GAME' }), []);
  const setPlayerCount = useCallback((count: number) => 
    dispatch({ type: 'SET_PLAYER_COUNT', payload: count }), []);
  const updatePlayerConfig = useCallback((index: number, config: Partial<PlayerConfig>) => 
    dispatch({ type: 'UPDATE_PLAYER_CONFIG', payload: { index, config } }), []);

  const contextValue: GameContextType = {
    state,
    gameMode: online.gameMode,
    setGameMode: online.setGameMode,
    onlineState: online.onlineState,
    isMyTurn,
    isGameInProgress,
    makeMove,
    cancelSelection,
    requestRematch,
    createOnlineGame: online.createOnlineGame,
    joinOnlineGame: online.joinOnlineGame,
    leaveOnlineGame: online.leaveOnlineGame,
    getShareableLink: online.getShareableLink,
    startGame,
    resetGame,
    setPlayerCount,
    updatePlayerConfig,
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

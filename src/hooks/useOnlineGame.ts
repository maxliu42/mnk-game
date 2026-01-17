import { useState, useCallback, useRef, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CellPosition, GameState } from '../types/game.types';
import {
  OnlineGameConfig,
  OnlineGameRow,
  OnlineGameStatus,
  OnlineState,
  RematchState,
  GameMode,
} from '../types/online.types';
import { isSupabaseConfigured } from '../lib/supabase';
import { getOrCreatePlayerToken, mapGameRowToState, getStatusFromGameRow } from '../utils';
import { processMove } from '../game';
import * as gameService from '../services/gameService';

export type { OnlineState };

const initialOnlineState: OnlineState = {
  gameId: null,
  playerIndex: null,
  playerToken: null,
  status: 'creating',
  error: null,
  playersJoined: 0,
  playerCount: 0,
};

interface UseOnlineGameOptions {
  initialGameId?: string | null;
  onSyncState: (state: Partial<GameState>) => void;
}

interface UseOnlineGameReturn {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  onlineState: OnlineState;
  createOnlineGame: (config: OnlineGameConfig) => Promise<string | null>;
  joinOnlineGame: (gameId: string) => Promise<boolean>;
  makeOnlineMove: (state: GameState, position: CellPosition, fromPosition?: CellPosition) => Promise<void>;
  requestRematch: (rematchState: RematchState, boardSize: { m: number; n: number }, playerCount: number) => Promise<void>;
  leaveOnlineGame: () => void;
  getShareableLink: () => string;
}

export const useOnlineGame = ({ initialGameId, onSyncState }: UseOnlineGameOptions): UseOnlineGameReturn => {
  const [gameMode, setGameModeState] = useState<GameMode>(initialGameId ? 'online' : 'local');
  const [onlineState, setOnlineState] = useState<OnlineState>(initialOnlineState);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const joinedInitialGameRef = useRef(false);

  const setError = (error: string) => setOnlineState(prev => ({ ...prev, status: 'error' as const, error }));

  const handleGameUpdate = useCallback((newData: OnlineGameRow) => {
    onSyncState(mapGameRowToState(newData));
    setOnlineState(prev => ({ 
      ...prev, 
      status: getStatusFromGameRow(newData),
      playersJoined: newData.players_joined,
      playerCount: newData.player_count,
    }));
  }, [onSyncState]);

  const subscribeToGame = useCallback((gameId: string) => {
    if (channelRef.current) gameService.unsubscribeFromGame(channelRef.current);
    channelRef.current = gameService.subscribeToGame(gameId, handleGameUpdate);
  }, [handleGameUpdate]);

  const syncGameAndSubscribe = useCallback((
    game: OnlineGameRow,
    playerIndex: number,
    playerToken: string,
    status: OnlineGameStatus
  ) => {
    onSyncState(mapGameRowToState(game));
    setOnlineState({ 
      gameId: game.id, 
      playerIndex, 
      playerToken, 
      status, 
      error: null,
      playersJoined: game.players_joined,
      playerCount: game.player_count,
    });
    subscribeToGame(game.id);
  }, [onSyncState, subscribeToGame]);

  const createOnlineGame = useCallback(async (config: OnlineGameConfig): Promise<string | null> => {
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please add your credentials to .env.local');
      return null;
    }

    setOnlineState(prev => ({ ...prev, status: 'creating', error: null }));
    const playerToken = getOrCreatePlayerToken();

    const { data, error } = await gameService.createGame({
      boardSize: config.boardSize,
      winLength: config.winLength,
      playerConfigs: config.playerConfigs,
      playerToken,
      playerCount: config.playerConfigs.length,
      allowMovingOpponentPieces: config.allowMovingOpponentPieces,
    });

    if (error || !data) {
      setError(`Failed to create game: ${error ?? 'Unknown error'}`);
      return null;
    }

    syncGameAndSubscribe(data, 0, playerToken, 'waiting');
    return data.id;
  }, [syncGameAndSubscribe]);

  const joinOnlineGame = useCallback(async (gameId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please add your credentials to .env.local');
      return false;
    }

    setOnlineState(prev => ({ ...prev, status: 'joining', error: null }));

    const { data: game, error: fetchError } = await gameService.fetchGame(gameId);
    if (fetchError || !game) {
      setError('Game not found. The link may be invalid or the game has expired.');
      return false;
    }

    const playerToken = getOrCreatePlayerToken();

    // Reconnection
    const existingSlot = game.player_tokens.findIndex(token => token === playerToken);
    if (existingSlot !== -1) {
      syncGameAndSubscribe(game, existingSlot, playerToken, getStatusFromGameRow(game));
      return true;
    }

    const emptySlot = game.player_tokens.findIndex(token => token === null);
    if (game.players_joined >= game.player_count || emptySlot === -1) {
      setError('This game is already full.');
      return false;
    }

    const newPlayersJoined = game.players_joined + 1;
    const { error: joinError } = await gameService.joinGame(
      gameId, playerToken, emptySlot, game.player_tokens, newPlayersJoined
    );

    if (joinError) {
      setError(`Failed to join game: ${joinError}`);
      return false;
    }

    const updatedTokens = [...game.player_tokens];
    updatedTokens[emptySlot] = playerToken;
    const status = newPlayersJoined >= game.player_count ? 'playing' : 'waiting';

    syncGameAndSubscribe(
      { ...game, player_tokens: updatedTokens, players_joined: newPlayersJoined },
      emptySlot, playerToken, status
    );
    return true;
  }, [syncGameAndSubscribe]);

  const makeOnlineMove = useCallback(async (
    state: GameState,
    position: CellPosition,
    fromPosition?: CellPosition
  ): Promise<void> => {
    const { gameId, playerIndex } = onlineState;
    if (!gameId || playerIndex === null) return;

    const result = processMove(
      state.board,
      position,
      playerIndex,
      state.boardSize,
      state.winLength,
      state.playerConfigs.length,
      fromPosition
    );

    const { error } = await gameService.updateGameState(gameId, {
      board: result.newBoard,
      current_player: result.nextPlayer,
      winner: result.winner,
      is_draw: result.isDraw,
      winning_cells: result.winningCells,
    });

    if (error) {
      console.error('Failed to make move:', error);
    }
  }, [onlineState]);

  const requestRematch = useCallback(async (
    rematchState: RematchState,
    boardSize: { m: number; n: number },
    playerCount: number
  ): Promise<void> => {
    const { gameId, playerIndex } = onlineState;

    if (!gameId || playerIndex === null) return;

    const allOthersWantRematch = rematchState.every((requested, idx) => idx === playerIndex || requested);
    if (allOthersWantRematch) {
      const { error } = await gameService.resetGameForRematch(gameId, boardSize, playerCount);
      if (!error) setOnlineState(prev => ({ ...prev, status: 'playing' }));
    } else {
      await gameService.updateRematchFlag(gameId, playerIndex, true, rematchState);
    }
  }, [onlineState]);

  const leaveOnlineGame = useCallback(() => {
    if (channelRef.current) {
      gameService.unsubscribeFromGame(channelRef.current);
      channelRef.current = null;
    }
    setOnlineState(initialOnlineState);
  }, []);

  const getShareableLink = useCallback((): string => {
    if (!onlineState.gameId) return '';
    return `${window.location.origin}${window.location.pathname}?game=${onlineState.gameId}`;
  }, [onlineState.gameId]);

  const setGameMode = useCallback((mode: GameMode) => {
    if (mode === 'local' && gameMode === 'online') leaveOnlineGame();
    setGameModeState(mode);
  }, [gameMode, leaveOnlineGame]);

  // Auto-join on mount if URL has game ID
  useEffect(() => {
    if (!initialGameId) return;
    if (gameMode !== 'online') return;
    if (joinedInitialGameRef.current) return;
    joinedInitialGameRef.current = true;
    joinOnlineGame(initialGameId);
  }, [initialGameId, gameMode, joinOnlineGame]);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        gameService.unsubscribeFromGame(channelRef.current);
      }
    };
  }, []);

  return {
    gameMode,
    setGameMode,
    onlineState,
    createOnlineGame,
    joinOnlineGame,
    makeOnlineMove,
    requestRematch,
    leaveOnlineGame,
    getShareableLink,
  };
};

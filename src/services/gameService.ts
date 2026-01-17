import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { BoardSize, PlayerConfig, CellPosition } from '../types/game.types';
import { OnlineGameRow } from '../types/online.types';
import { createEmptyBoard } from '../game';

export interface CreateGameParams {
  boardSize: BoardSize;
  winLength: number;
  playerConfigs: PlayerConfig[];
  playerToken: string;
  playerCount: number;
  allowMovingOpponentPieces: boolean;
}

export interface GameStateUpdate {
  board: (number | null)[][];
  current_player: number;
  winner: number | null;
  is_draw: boolean;
  winning_cells: CellPosition[];
}

type ServiceResult<T = void> = { data: T; error: null } | { data: null; error: string };

const toResult = <T>(data: T | null, error: { message: string } | null, fallback = 'Unknown error'): ServiceResult<T> =>
  error || !data ? { data: null, error: error?.message || fallback } : { data, error: null };

const toErrorResult = (error: { message: string } | null): { error: string | null } =>
  ({ error: error?.message || null });

export const createGame = async (params: CreateGameParams): Promise<ServiceResult<OnlineGameRow>> => {
  const playerTokens: (string | null)[] = Array(params.playerCount).fill(null);
  playerTokens[0] = params.playerToken;

  const { data, error } = await supabase
    .from('games')
    .insert({
      board: createEmptyBoard(params.boardSize),
      current_player: 0,
      player_configs: params.playerConfigs,
      board_size: params.boardSize,
      win_length: params.winLength,
      winner: null,
      is_draw: false,
      winning_cells: [],
      game_started: true,
      player_count: params.playerCount,
      players_joined: 1,
      player_tokens: playerTokens,
      rematch_requests: Array(params.playerCount).fill(false),
      allow_moving_opponent_pieces: params.allowMovingOpponentPieces,
    })
    .select()
    .single();

  return toResult(data as OnlineGameRow | null, error);
};

export const fetchGame = async (gameId: string): Promise<ServiceResult<OnlineGameRow>> => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  return toResult(data as OnlineGameRow | null, error, 'Game not found');
};

export const joinGame = async (
  gameId: string,
  playerToken: string,
  playerSlot: number,
  currentTokens: (string | null)[],
  newPlayersJoined: number
): Promise<{ error: string | null }> => {
  const updatedTokens = [...currentTokens];
  updatedTokens[playerSlot] = playerToken;
  
  const { error } = await supabase
    .from('games')
    .update({ player_tokens: updatedTokens, players_joined: newPlayersJoined })
    .eq('id', gameId);

  return toErrorResult(error);
};

export const updateGameState = async (gameId: string, update: GameStateUpdate): Promise<{ error: string | null }> => {
  const { error } = await supabase.from('games').update(update).eq('id', gameId);
  return toErrorResult(error);
};

export const updateRematchFlag = async (
  gameId: string,
  playerIndex: number,
  value: boolean,
  currentRequests: boolean[]
): Promise<{ error: string | null }> => {
  const updatedRequests = [...currentRequests];
  updatedRequests[playerIndex] = value;
  
  const { error } = await supabase
    .from('games')
    .update({ rematch_requests: updatedRequests })
    .eq('id', gameId);

  return toErrorResult(error);
};

export const resetGameForRematch = async (
  gameId: string,
  boardSize: BoardSize,
  playerCount: number
): Promise<{ error: string | null }> => {
  const { error } = await supabase
    .from('games')
    .update({
      board: createEmptyBoard(boardSize),
      current_player: 0,
      winner: null,
      is_draw: false,
      winning_cells: [],
      rematch_requests: Array(playerCount).fill(false),
    })
    .eq('id', gameId);

  return toErrorResult(error);
};

export const subscribeToGame = (gameId: string, onUpdate: (game: OnlineGameRow) => void): RealtimeChannel =>
  supabase
    .channel(`game-${gameId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` },
      (payload) => onUpdate(payload.new as OnlineGameRow)
    )
    .subscribe();

export const unsubscribeFromGame = (channel: RealtimeChannel): void => {
  supabase.removeChannel(channel);
};

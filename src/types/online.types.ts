import { BoardSize, PlayerConfig, CellPosition } from './game.types';

export type GameMode = 'local' | 'online';

export type OnlineGameStatus = 'creating' | 'waiting' | 'playing' | 'finished' | 'joining' | 'error';

/** Supabase database row (snake_case) */
export interface OnlineGameRow {
  id: string;
  board: (number | null)[][];
  current_player: number;
  player_configs: PlayerConfig[];
  board_size: BoardSize;
  win_length: number;
  winner: number | null;
  is_draw: boolean;
  winning_cells: CellPosition[];
  game_started: boolean;
  player_count: number;
  players_joined: number;
  player_tokens: (string | null)[];
  rematch_requests: boolean[];
  allow_moving_opponent_pieces: boolean;
  created_at: string;
}

export type RematchState = boolean[];

export interface OnlineGameConfig {
  boardSize: BoardSize;
  winLength: number;
  playerConfigs: PlayerConfig[];
  allowMovingOpponentPieces: boolean;
}

export interface OnlineState {
  gameId: string | null;
  playerIndex: number | null;
  playerToken: string | null;
  status: OnlineGameStatus;
  error: string | null;
  playersJoined: number;
  playerCount: number;
}

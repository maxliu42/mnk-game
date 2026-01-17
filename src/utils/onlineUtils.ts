import { GameState } from '../types/game.types';
import { OnlineGameRow, OnlineGameStatus } from '../types/online.types';

const PLAYER_TOKEN_KEY = 'mnk_player_token';

export const getOrCreatePlayerToken = (): string => {
  let token = localStorage.getItem(PLAYER_TOKEN_KEY);
  if (!token) {
    token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(PLAYER_TOKEN_KEY, token);
  }
  return token;
};

export const getRematchInfo = (rematchState: boolean[], playerIndex: number | null) => {
  if (playerIndex === null || rematchState.length === 0) {
    return { hasRequested: false, othersCount: 0, totalOthers: 0 };
  }
  const hasRequested = rematchState[playerIndex] ?? false;
  const othersCount = rematchState.filter((requested, idx) => idx !== playerIndex && requested).length;
  const totalOthers = rematchState.length - 1;
  return { hasRequested, othersCount, totalOthers, allOthersWant: othersCount === totalOthers };
};

/** Maps database row (snake_case) to GameState (camelCase) */
export const mapGameRowToState = (row: OnlineGameRow): Partial<GameState> => ({
  board: row.board,
  currentPlayer: row.current_player,
  playerConfigs: row.player_configs,
  boardSize: row.board_size,
  winLength: row.win_length,
  winner: row.winner,
  isDraw: row.is_draw,
  winningCells: row.winning_cells,
  gameStarted: row.game_started,
  rematchRequests: row.rematch_requests,
  allowMovingOpponentPieces: row.allow_moving_opponent_pieces,
});

export const getStatusFromGameRow = (row: OnlineGameRow): OnlineGameStatus => {
  if (row.players_joined < row.player_count) return 'waiting';
  if (row.winner !== null || row.is_draw) return 'finished';
  return 'playing';
};

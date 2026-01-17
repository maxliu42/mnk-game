import { BoardSize, PlayerConfig, CellPosition, GameState } from '../types/game.types';
import { DEFAULT_BOARD_SIZE, DEFAULT_WIN_LENGTH, DEFAULT_PLAYER_CONFIGS, MIN_PLAYERS } from '../constants';
import { createEmptyBoard, processMove } from '../game';

export const initialGameState: GameState = {
  board: createEmptyBoard(DEFAULT_BOARD_SIZE),
  currentPlayer: 0,
  playerConfigs: DEFAULT_PLAYER_CONFIGS.slice(0, MIN_PLAYERS),
  boardSize: DEFAULT_BOARD_SIZE,
  winLength: DEFAULT_WIN_LENGTH,
  winner: null,
  isDraw: false,
  winningCells: [],
  gameStarted: false,
  allowMovingOpponentPieces: true,
  selectedCell: null,
  rematchRequests: [],
};

/** Common fields reset when starting/resetting a game */
const freshGameState = (boardSize: BoardSize): Partial<GameState> => ({
  board: createEmptyBoard(boardSize),
  currentPlayer: 0,
  winner: null,
  isDraw: false,
  winningCells: [],
  gameStarted: true,
  selectedCell: null,
});

interface StartGamePayload {
  boardSize?: BoardSize;
  winLength?: number;
  playerConfigs?: PlayerConfig[];
  allowMovingOpponentPieces?: boolean;
}

export type GameAction =
  | { type: 'START_GAME'; payload: StartGamePayload }
  | { type: 'RESET_GAME' }
  | { type: 'RETURN_TO_MENU' }
  | { type: 'SET_PLAYER_COUNT'; payload: number }
  | { type: 'UPDATE_PLAYER_CONFIG'; payload: { index: number; config: Partial<PlayerConfig> } }
  | { type: 'DESELECT' }
  | { type: 'SELECT_CELL'; payload: CellPosition }
  | { type: 'PROCESS_MOVE'; payload: { to: CellPosition; from?: CellPosition } }
  | { type: 'SYNC_FROM_DATABASE'; payload: Partial<GameState> };

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const { boardSize, winLength, playerConfigs, allowMovingOpponentPieces } = action.payload;
      const newBoardSize = boardSize ?? state.boardSize;
      return {
        ...state,
        ...freshGameState(newBoardSize),
        boardSize: newBoardSize,
        winLength: winLength ?? state.winLength,
        playerConfigs: playerConfigs ?? state.playerConfigs,
        allowMovingOpponentPieces: allowMovingOpponentPieces ?? state.allowMovingOpponentPieces,
      };
    }

    case 'RESET_GAME':
      return { ...state, ...freshGameState(state.boardSize) };

    case 'RETURN_TO_MENU':
      return { ...state, gameStarted: false, selectedCell: null };

    case 'SET_PLAYER_COUNT': {
      const newCount = action.payload;
      const currentCount = state.playerConfigs.length;
      if (newCount === currentCount) return state;
      const playerConfigs = newCount > currentCount
        ? [...state.playerConfigs, ...DEFAULT_PLAYER_CONFIGS.slice(currentCount, newCount)]
        : state.playerConfigs.slice(0, newCount);
      return { ...state, playerConfigs };
    }

    case 'UPDATE_PLAYER_CONFIG': {
      const { index, config } = action.payload;
      const newConfigs = [...state.playerConfigs];
      newConfigs[index] = { ...newConfigs[index], ...config };
      return { ...state, playerConfigs: newConfigs };
    }

    case 'DESELECT':
      return { ...state, selectedCell: null };

    case 'SELECT_CELL':
      return { ...state, selectedCell: action.payload };

    case 'PROCESS_MOVE': {
      const { to, from } = action.payload;
      const result = processMove(
        state.board,
        to,
        state.currentPlayer,
        state.boardSize,
        state.winLength,
        state.playerConfigs.length,
        from
      );
      return {
        ...state,
        board: result.newBoard,
        currentPlayer: result.nextPlayer,
        winner: result.winner,
        isDraw: result.isDraw,
        winningCells: result.winningCells,
        selectedCell: null,
      };
    }

    case 'SYNC_FROM_DATABASE':
      return { ...state, ...action.payload, selectedCell: null };

    default:
      return state;
  }
};

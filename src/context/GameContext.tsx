/**
 * Game Context
 * This module provides a React context for managing game state
 */
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  BoardSize, 
  GridType, 
  MoveType, 
  PlayerConfig, 
  CellPosition 
} from '../types/game.types';
import { 
  DEFAULT_BOARD_SIZE, 
  DEFAULT_GRID_TYPE, 
  DEFAULT_WIN_LENGTH,
  DEFAULT_PLAYER_SYMBOLS,
  DEFAULT_PLAYER_COLORS
} from '../constants';
import { createEmptyBoard } from '../game/gameUtils';
import { checkWin, checkDraw } from '../game/win-detection/winConditions';

// Define the game state interface
interface GameState {
  board: (number | null)[][];
  currentPlayer: number;
  playerConfigs: PlayerConfig[];
  boardSize: BoardSize;
  winLength: number;
  gridType: GridType;
  moveType: MoveType;
  winner: number | null;
  isDraw: boolean;
  winningCells: CellPosition[];
  gameStarted: boolean;
}

// Define the initial game state
const initialGameState: GameState = {
  board: createEmptyBoard(DEFAULT_BOARD_SIZE.m, DEFAULT_BOARD_SIZE.n),
  currentPlayer: 0,
  playerConfigs: [
    { name: 'Player 1', symbol: DEFAULT_PLAYER_SYMBOLS[0], color: DEFAULT_PLAYER_COLORS[0] },
    { name: 'Player 2', symbol: DEFAULT_PLAYER_SYMBOLS[1], color: DEFAULT_PLAYER_COLORS[1] }
  ],
  boardSize: DEFAULT_BOARD_SIZE,
  winLength: DEFAULT_WIN_LENGTH,
  gridType: DEFAULT_GRID_TYPE,
  moveType: MoveType.PLACE,
  winner: null,
  isDraw: false,
  winningCells: [],
  gameStarted: false
};

// Define action types
type GameAction =
  | { type: 'START_GAME'; payload: Partial<GameState> }
  | { type: 'MAKE_MOVE'; payload: { position: CellPosition; fromPosition?: CellPosition } }
  | { type: 'RESET_GAME' }
  | { type: 'SET_MOVE_TYPE'; payload: MoveType }
  | { type: 'SET_PLAYER_CONFIGS'; payload: PlayerConfig[] };

// Create the game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        ...action.payload,
        board: createEmptyBoard(
          action.payload.boardSize?.m || state.boardSize.m,
          action.payload.boardSize?.n || state.boardSize.n
        ),
        winner: null,
        isDraw: false,
        winningCells: [],
        gameStarted: true
      };
      
    case 'MAKE_MOVE':
      const { position, fromPosition } = action.payload;
      const [row, col] = position;
      const newBoard = state.board.map(r => [...r]);
      
      // Handle different move types
      if (state.moveType === MoveType.PLACE) {
        // For placement, just place the piece if the cell is empty
        if (newBoard[row][col] !== null) {
          return state; // Invalid move, cell is not empty
        }
        
        newBoard[row][col] = state.currentPlayer;
      } else if (state.moveType === MoveType.MOVE && fromPosition) {
        const [fromRow, fromCol] = fromPosition;
        
        // For movement, check if the move is valid
        if (
          newBoard[row][col] !== null || // Destination must be empty
          newBoard[fromRow][fromCol] === null || // Source must have a piece
          newBoard[fromRow][fromCol] === state.currentPlayer // Can't move own pieces
        ) {
          return state; // Invalid move
        }
        
        // Move the piece
        newBoard[row][col] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
      } else {
        return state; // Invalid move type or missing fromPosition
      }
      
      // Check for win
      const winResult = checkWin(
        newBoard,
        row,
        col,
        state.currentPlayer,
        state.boardSize,
        state.winLength,
        state.gridType
      );
      
      // Check for draw if no win
      const isDraw = !winResult.isWin && checkDraw(newBoard);
      
      // Move to next player if game continues
      const nextPlayer = winResult.isWin || isDraw
        ? state.currentPlayer // Keep current player if game is over
        : (state.currentPlayer + 1) % state.playerConfigs.length;
      
      return {
        ...state,
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: winResult.isWin ? state.currentPlayer : null,
        isDraw,
        winningCells: winResult.winningCells
      };
      
    case 'RESET_GAME':
      return {
        ...state,
        board: createEmptyBoard(state.boardSize.m, state.boardSize.n),
        currentPlayer: 0,
        winner: null,
        isDraw: false,
        winningCells: [],
        gameStarted: true
      };
      
    case 'SET_MOVE_TYPE':
      return {
        ...state,
        moveType: action.payload
      };
      
    case 'SET_PLAYER_CONFIGS':
      return {
        ...state,
        playerConfigs: action.payload
      };
      
    default:
      return state;
  }
};

// Create the context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Create a provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Create a custom hook for using the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext; 
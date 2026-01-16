/**
 * Game Context - provides React context for managing game state
 */
import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { 
  MoveType, 
  PlayerConfig, 
  CellPosition,
  GameState
} from '../types/game.types';
import { 
  DEFAULT_BOARD_SIZE, 
  DEFAULT_WIN_LENGTH,
  DEFAULT_PLAYER_CONFIGS
} from '../constants';
import { createEmptyBoard } from '../game/gameUtils';
import { checkWin, checkDraw } from '../game/win-detection/winConditions';
import { deepCopyBoard } from '../utils/cellUtils';

// Define the initial game state
const initialGameState: GameState = {
  board: createEmptyBoard(DEFAULT_BOARD_SIZE.m, DEFAULT_BOARD_SIZE.n),
  currentPlayer: 0,
  playerConfigs: DEFAULT_PLAYER_CONFIGS.slice(0, 2),
  boardSize: DEFAULT_BOARD_SIZE,
  winLength: DEFAULT_WIN_LENGTH,
  moveType: MoveType.PLACE,
  winner: null,
  isDraw: false,
  winningCells: [],
  gameStarted: false,
  allowMovingOpponentPieces: true, // Default to true for backward compatibility
  selectedCell: null
};

// Define action types
type GameAction =
  | { type: 'START_GAME'; payload: Partial<GameState> }
  | { type: 'RESET_GAME' }
  | { type: 'SET_PLAYER_CONFIGS'; payload: PlayerConfig[] }
  | { type: 'DESELECT' }
  | { type: 'CELL_CLICK'; payload: CellPosition };

/**
 * Check if the game is in an active state
 */
const isGameActive = (state: GameState): boolean => {
  return state.winner === null && !state.isDraw && state.gameStarted;
};

/**
 * Check if a cell contains an opponent's piece that can be selected/moved
 */
const canSelectOpponentPiece = (
  cellValue: number | null,
  currentPlayer: number,
  allowMovingOpponentPieces: boolean
): boolean => {
  return cellValue !== null && cellValue !== currentPlayer && allowMovingOpponentPieces;
};

/**
 * Game reducer that handles all game state transitions
 */
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const { boardSize, winLength, playerConfigs, gameStarted, allowMovingOpponentPieces } = action.payload;
      const isStartingNewGame = gameStarted !== undefined ? gameStarted : true;
      
      return {
        ...state,
        boardSize: boardSize || state.boardSize,
        winLength: winLength || state.winLength,
        playerConfigs: playerConfigs || state.playerConfigs,
        board: isStartingNewGame 
          ? createEmptyBoard(boardSize?.m || state.boardSize.m, boardSize?.n || state.boardSize.n) 
          : state.board,
        currentPlayer: 0,
        winner: null,
        isDraw: false,
        winningCells: [],
        gameStarted: isStartingNewGame,
        allowMovingOpponentPieces: allowMovingOpponentPieces ?? state.allowMovingOpponentPieces,
        selectedCell: null,
        moveType: MoveType.PLACE
      };
    }
      
    case 'RESET_GAME': {
      return {
        ...state,
        board: createEmptyBoard(state.boardSize.m, state.boardSize.n),
        currentPlayer: 0,
        winner: null,
        isDraw: false,
        winningCells: [],
        gameStarted: true,
        selectedCell: null,
        moveType: MoveType.PLACE
      };
    }
      
    case 'SET_PLAYER_CONFIGS': {
      return { ...state, playerConfigs: action.payload };
    }

    case 'DESELECT': {
      return { ...state, selectedCell: null, moveType: MoveType.PLACE };
    }
      
    case 'CELL_CLICK': {
      if (!isGameActive(state)) return state;
      
      const [row, col] = action.payload;
      const cellContent = state.board[row][col];
      const { selectedCell, currentPlayer, allowMovingOpponentPieces } = state;
      
      // Clicking on empty cell
      if (cellContent === null) {
        const newBoard = deepCopyBoard(state.board);
        let pieceOwner = currentPlayer;
        
        // Move a selected piece to this empty cell
        if (selectedCell) {
          const [fromRow, fromCol] = selectedCell;
          pieceOwner = newBoard[fromRow][fromCol]!;
          newBoard[row][col] = pieceOwner;
          newBoard[fromRow][fromCol] = null;
        } 
        // Place a new piece
        else {
          newBoard[row][col] = currentPlayer;
        }
        
        const winResult = checkWin(newBoard, row, col, pieceOwner, state.boardSize, state.winLength);
        const isDraw = !winResult.isWin && checkDraw(newBoard);
        const gameOver = winResult.isWin || isDraw;
        
        return {
          ...state,
          board: newBoard,
          currentPlayer: gameOver ? currentPlayer : (currentPlayer + 1) % state.playerConfigs.length,
          winner: winResult.isWin ? pieceOwner : null,
          isDraw,
          winningCells: winResult.winningCells,
          selectedCell: null,
          moveType: MoveType.PLACE
        };
      }
      
      // Clicking on occupied cell - handle selection
      const isSameCell = selectedCell && selectedCell[0] === row && selectedCell[1] === col;
      if (isSameCell) {
        return { ...state, selectedCell: null, moveType: MoveType.PLACE };
      }
      
      const canSelect = canSelectOpponentPiece(cellContent, currentPlayer, allowMovingOpponentPieces);
      if (canSelect) {
        return { ...state, selectedCell: action.payload, moveType: MoveType.MOVE };
      }
      
      // Invalid click - deselect if something was selected
      return selectedCell ? { ...state, selectedCell: null, moveType: MoveType.PLACE } : state;
    }
      
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
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    state,
    dispatch
  }), [state]);
  
  return (
    <GameContext.Provider value={contextValue}>
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
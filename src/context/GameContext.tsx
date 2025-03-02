/**
 * Game Context
 * This module provides a React context for managing game state
 */
import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { 
  BoardSize, 
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
  | { type: 'SET_MOVE_TYPE'; payload: MoveType }
  | { type: 'SET_PLAYER_CONFIGS'; payload: PlayerConfig[] }
  | { type: 'SELECT_CELL'; payload: CellPosition | null }
  | { type: 'HANDLE_CELL_CLICK'; payload: { position: CellPosition } };

/**
 * Creates an immutable copy of a 2D array
 */
const deepCopyBoard = (board: (number | null)[][]): (number | null)[][] => {
  return board.map(row => [...row]);
};

/**
 * Game reducer that handles all game state transitions
 */
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const { boardSize, winLength, playerConfigs, gameStarted, allowMovingOpponentPieces } = action.payload;
      
      // Determine if we're starting a new game or just updating settings
      const isStartingNewGame = gameStarted !== undefined ? gameStarted : true;
      
      // Create a new board if starting a game, otherwise keep current board
      const newBoard = isStartingNewGame 
        ? createEmptyBoard(
            boardSize?.m || state.boardSize.m, 
            boardSize?.n || state.boardSize.n
          ) 
        : state.board;

      return {
        ...state,
        boardSize: boardSize || state.boardSize,
        winLength: winLength || state.winLength,
        playerConfigs: playerConfigs || state.playerConfigs,
        board: newBoard,
        currentPlayer: 0,
        winner: null,
        isDraw: false,
        winningCells: [],
        gameStarted: isStartingNewGame,
        allowMovingOpponentPieces: allowMovingOpponentPieces !== undefined 
          ? allowMovingOpponentPieces 
          : state.allowMovingOpponentPieces
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
      
    case 'SET_MOVE_TYPE': {
      return {
        ...state,
        moveType: action.payload
      };
    }
      
    case 'SET_PLAYER_CONFIGS': {
      return {
        ...state,
        playerConfigs: action.payload
      };
    }
      
    case 'SELECT_CELL': {
      // If null is passed, clear the selection
      if (action.payload === null) {
        return {
          ...state,
          selectedCell: null,
          moveType: MoveType.PLACE
        };
      }
      
      const [row, col] = action.payload;
      const { board, currentPlayer, winner, isDraw, gameStarted, allowMovingOpponentPieces } = state;
      
      // Don't allow selection if game is over or not started
      if (winner !== null || isDraw || !gameStarted) {
        return state;
      }
      
      // If a cell is already selected
      if (state.selectedCell) {
        const [selectedRow, selectedCol] = state.selectedCell;
        
        // If clicking on the same cell, deselect it
        if (selectedRow === row && selectedCol === col) {
          return {
            ...state,
            selectedCell: null,
            moveType: MoveType.PLACE
          };
        }
        
        // If clicked on empty cell, we'll let HANDLE_CELL_CLICK handle the actual move
        if (board[row][col] === null) {
          return state;
        }
        
        // If clicked on opponent's piece and moving opponent pieces is allowed
        if (board[row][col] !== null && board[row][col] !== currentPlayer && allowMovingOpponentPieces) {
          return {
            ...state,
            selectedCell: action.payload,
            moveType: MoveType.MOVE
          };
        }
        
        // Clicked on own piece or other invalid selection, deselect
        return {
          ...state,
          selectedCell: null,
          moveType: MoveType.PLACE
        };
      }
      // No cell selected yet
      else {
        // If clicked on empty cell, we'll let HANDLE_CELL_CLICK handle placement
        if (board[row][col] === null) {
          return state;
        }
        
        // If clicked on opponent's piece and moving opponent pieces is allowed
        if (board[row][col] !== null && board[row][col] !== currentPlayer && allowMovingOpponentPieces) {
          return {
            ...state,
            selectedCell: action.payload,
            moveType: MoveType.MOVE
          };
        }
        
        // Clicked on own piece or other invalid selection
        return state;
      }
    }
      
    case 'HANDLE_CELL_CLICK': {
      const { position } = action.payload;
      const [row, col] = position;
      
      // Don't allow moves if game is over
      if (state.winner !== null || state.isDraw || !state.gameStarted) {
        return state;
      }
      
      // Check what's in the cell
      const cellContent = state.board[row][col];
      const { selectedCell } = state;
      
      // Case 1: Cell is empty
      if (cellContent === null) {
        // Create an immutable copy of the board
        const newBoard = deepCopyBoard(state.board);
        let pieceOwner = state.currentPlayer;
        
        // If there's a selected cell, try to move from selected to this empty cell
        if (selectedCell) {
          const [fromRow, fromCol] = selectedCell;
          
          // Validate that we're moving from a valid position
          if (
            newBoard[fromRow][fromCol] === null || // Source must have a piece
            newBoard[row][col] !== null // Destination must be empty
          ) {
            return state;
          }
          
          // Check if we're trying to move an opponent's piece
          const isOpponentPiece = newBoard[fromRow][fromCol] !== state.currentPlayer;
          
          // Don't allow moving opponent's pieces if the setting is disabled
          if (isOpponentPiece && !state.allowMovingOpponentPieces) {
            return state;
          }
          
          // Keep track of which player's piece is being moved
          pieceOwner = newBoard[fromRow][fromCol];
          
          // Move the piece
          newBoard[row][col] = pieceOwner;
          newBoard[fromRow][fromCol] = null;
        } 
        // Regular placement move
        else {
          newBoard[row][col] = state.currentPlayer;
        }
        
        // Check for win
        const winResult = checkWin(
          newBoard,
          row,
          col,
          pieceOwner,
          state.boardSize,
          state.winLength
        );
        
        // Check for draw if no win
        const isDraw = !winResult.isWin && checkDraw(newBoard);
        
        // Move to next player if game continues
        const nextPlayer = winResult.isWin || isDraw
          ? state.currentPlayer
          : (state.currentPlayer + 1) % state.playerConfigs.length;
        
        return {
          ...state,
          board: newBoard,
          currentPlayer: nextPlayer,
          winner: winResult.isWin ? pieceOwner : null,
          isDraw,
          winningCells: winResult.winningCells,
          selectedCell: null,
          moveType: MoveType.PLACE
        };
      } 
      // Case 2: Cell has a piece (handle selection)
      else {
        // If a cell is already selected
        if (selectedCell) {
          const [selectedRow, selectedCol] = selectedCell;
          
          // If clicking on the same cell, deselect it
          if (selectedRow === row && selectedCol === col) {
            return {
              ...state,
              selectedCell: null,
              moveType: MoveType.PLACE
            };
          }
          
          // If clicked on opponent's piece and moving opponent pieces is allowed
          if (cellContent !== state.currentPlayer && state.allowMovingOpponentPieces) {
            return {
              ...state,
              selectedCell: position,
              moveType: MoveType.MOVE
            };
          }
          
          // Otherwise deselect
          return {
            ...state,
            selectedCell: null,
            moveType: MoveType.PLACE
          };
        }
        // No cell selected yet, try to select this one
        else {
          // If clicked on opponent's piece and moving opponent pieces is allowed
          if (cellContent !== state.currentPlayer && state.allowMovingOpponentPieces) {
            return {
              ...state,
              selectedCell: position,
              moveType: MoveType.MOVE
            };
          }
          
          // If trying to select player's own piece (which we don't currently support)
          // Just return the current state (no change)
          return state;
        }
      }
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

export default GameContext; 
import React, { useState, useEffect, useRef } from "react";
import { GameBoard } from "./components/GameBoard.tsx";
import GameControls from "./components/GameControls.tsx";
import GameInfo from "./components/GameInfo.tsx";
import {
  checkWin,
  checkDraw,
  createEmptyBoard,
  isValidMove,
  isValidPosition,
} from "./utils/gameUtils.ts";
import {
  BoardSize,
  CellPosition,
  GameConfig,
  GridType,
  MoveType,
  GameMove,
  PlayerConfig,
} from "./types/game.types";

// Define default player configurations
const DEFAULT_PLAYER_CONFIGS: PlayerConfig[] = [
  { symbol: "🦊", color: "#EF4444", name: "Player 1" },
  { symbol: "🐼", color: "#3B82F6", name: "Player 2" },
  { symbol: "🦄", color: "#10B981", name: "Player 3" },
  { symbol: "🐯", color: "#F59E0B", name: "Player 4" },
  { symbol: "🐸", color: "#8B5CF6", name: "Player 5" },
  { symbol: "🦁", color: "#EC4899", name: "Player 6" },
  { symbol: "🐙", color: "#06B6D4", name: "Player 7" },
  { symbol: "🦉", color: "#D97706", name: "Player 8" },
];

// Default game configuration
const DEFAULT_CONFIG: GameConfig = {
  boardSize: { m: 3, n: 3 },
  winLength: 3,
  gridType: GridType.SQUARE,
  allowMovingOpponentPieces: true, // Enable moving opponent pieces by default
  playerCount: 2, // Default to 2 players
  playerConfigs: DEFAULT_PLAYER_CONFIGS.slice(0, 2), // Initialize with first 2 player configs
};

const App: React.FC = () => {
  // Game configuration state
  const [boardSize, setBoardSize] = useState<BoardSize>(
    DEFAULT_CONFIG.boardSize
  );
  const [winLength, setWinLength] = useState<number>(DEFAULT_CONFIG.winLength);
  const [gridType, setGridType] = useState<GridType>(DEFAULT_CONFIG.gridType);
  const [allowMovingOpponentPieces, setAllowMovingOpponentPieces] =
    useState<boolean>(DEFAULT_CONFIG.allowMovingOpponentPieces);
  const [playerCount, setPlayerCount] = useState<number>(
    DEFAULT_CONFIG.playerCount
  );
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(
    DEFAULT_CONFIG.playerConfigs || []
  );
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Game state
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0 for player 1, 1 for player 2
  const [winner, setWinner] = useState<number | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningCells, setWinningCells] = useState<CellPosition[]>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [moveHistory, setMoveHistory] = useState<GameMove[]>([]);

  // Create a ref for the board container
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Set CSS variables for player colors when player configs change
  useEffect(() => {
    const root = document.documentElement;
    playerConfigs.forEach((config, index) => {
      root.style.setProperty(`--player${index + 1}-color`, config.color);
    });
  }, [playerConfigs]);

  // Update player configs when player count changes
  useEffect(() => {
    // Only reset to default player configs if game hasn't started yet
    if (!isGameStarted) {
      // Update player configs when player count changes
      setPlayerConfigs(DEFAULT_PLAYER_CONFIGS.slice(0, playerCount));
    }
  }, [playerCount, isGameStarted]);

  // Initialize the board when game starts
  useEffect(() => {
    if (isGameStarted) {
      initializeBoard();
    }
  }, [isGameStarted, boardSize]);

  // Add click event listener to detect clicks outside of board
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedCell &&
        boardContainerRef.current &&
        !boardContainerRef.current.contains(event.target as Node)
      ) {
        setSelectedCell(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCell]);

  // Initialize the board with null values
  const initializeBoard = () => {
    const newBoard = createEmptyBoard(boardSize.m, boardSize.n);

    setBoard(newBoard);
    setCurrentPlayer(0);
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
    setSelectedCell(null);
    setMoveHistory([]);
  };

  // Handle cell click for placing stones or selecting/moving
  const handleCellClick = (row: number, col: number) => {
    // Ignore clicks if game is over
    if (winner !== null || isDraw) {
      return;
    }

    const clickedPosition: CellPosition = [row, col];

    // If a cell is already selected, try to move the piece there
    if (selectedCell) {
      handleMove(clickedPosition);
      return;
    }

    // If clicked on an empty cell and no cell is selected, place a stone
    if (board[row][col] === null) {
      handlePlacement(clickedPosition);
      return;
    }

    // If clicked on an opponent's stone, select it for moving
    if (
      allowMovingOpponentPieces &&
      board[row][col] !== null &&
      board[row][col] !== currentPlayer
    ) {
      setSelectedCell(clickedPosition);
      return;
    }
  };

  // Handle placing a new stone
  const handlePlacement = (position: CellPosition) => {
    const [row, col] = position;

    // Ignore if cell is already filled
    if (board[row][col] !== null) {
      return;
    }

    // Create a new board with the move
    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    // Record the move
    const move: GameMove = {
      type: MoveType.PLACE,
      player: currentPlayer,
      position,
    };
    setMoveHistory([...moveHistory, move]);

    // Check for game end conditions and switch player
    checkGameEndConditions(newBoard, row, col);
  };

  // Handle moving an opponent's stone
  const handleMove = (targetPosition: CellPosition) => {
    if (!selectedCell) return;

    const [targetRow, targetCol] = targetPosition;
    const [sourceRow, sourceCol] = selectedCell;

    // Can only move to an empty cell
    if (board[targetRow][targetCol] !== null) {
      // If clicked on another opponent piece, select that one instead
      if (board[targetRow][targetCol] !== currentPlayer) {
        setSelectedCell(targetPosition);
      } else {
        // If clicked on own piece, deselect
        setSelectedCell(null);
      }
      return;
    }

    // Get the player number of the piece being moved
    const movedPiecePlayer = board[sourceRow][sourceCol];

    // Safety check - this should never happen if the UI works correctly
    if (movedPiecePlayer === null) {
      console.error("Attempted to move a null piece");
      return;
    }

    // Create a new board with the move
    const newBoard = [...board];
    newBoard[targetRow][targetCol] = movedPiecePlayer;
    newBoard[sourceRow][sourceCol] = null;

    // Record the move
    const move: GameMove = {
      type: MoveType.MOVE,
      player: currentPlayer,
      position: targetPosition,
      fromPosition: selectedCell,
    };

    // Update state
    setBoard(newBoard);
    setMoveHistory([...moveHistory, move]);
    setSelectedCell(null);

    // Check for game end conditions using the moved piece's player number
    checkGameEndConditions(newBoard, targetRow, targetCol, movedPiecePlayer);
  };

  // Move to the next player in turn order
  const moveToNextPlayer = () => {
    setCurrentPlayer((currentPlayer + 1) % playerCount);
  };

  // Check for win or draw and switch player if game continues
  const checkGameEndConditions = (
    newBoard: (number | null)[][],
    row: number,
    col: number,
    piecePlayer?: number
  ) => {
    // Use the provided piece player if available, otherwise use current player
    const playerToCheck =
      piecePlayer !== undefined ? piecePlayer : currentPlayer;

    // Check for win
    const winResult = checkWin(
      newBoard,
      row,
      col,
      playerToCheck,
      boardSize,
      winLength,
      gridType
    );
    if (winResult.isWin) {
      setWinner(playerToCheck);
      setWinningCells(winResult.winningCells);
      return;
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setIsDraw(true);
      return;
    }

    // Switch to next player
    moveToNextPlayer();
  };

  // Cancel the current selection
  const cancelSelection = () => {
    setSelectedCell(null);
  };

  // Start a new game
  const startGame = (m: number, n: number, k: number, config?: GameConfig) => {
    if (config) {
      setBoardSize(config.boardSize);
      setWinLength(config.winLength);
      setGridType(config.gridType);
      setAllowMovingOpponentPieces(config.allowMovingOpponentPieces);
      setPlayerCount(config.playerCount);
      if (config.playerConfigs) {
        setPlayerConfigs(config.playerConfigs);
      } else {
        setPlayerConfigs(DEFAULT_PLAYER_CONFIGS.slice(0, config.playerCount));
      }
    } else {
      setBoardSize({ m, n });
      setWinLength(k);
    }
    setIsGameStarted(true);
  };

  // Reset the game
  const resetGame = (returnToMenu = true) => {
    if (returnToMenu) {
      setIsGameStarted(false);
      setBoard([]);
    } else {
      // Just reset the board and game state, keeping the same settings
      initializeBoard();
    }

    setCurrentPlayer(0);
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
    setSelectedCell(null);
    setMoveHistory([]);
  };

  // Get current move type based on selection state
  const getCurrentMoveType = () => {
    return selectedCell ? MoveType.MOVE : MoveType.PLACE;
  };

  // Get current player's configuration
  const getCurrentPlayerConfig = () => {
    return playerConfigs[currentPlayer];
  };

  // Extract player symbols for the board
  const getPlayerSymbols = () => {
    return playerConfigs.map((config) => config.symbol);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>m,n,k-game</h1>
        <p>Get {winLength} in a row to win!</p>
      </header>

      {!isGameStarted ? (
        <div className="game-container">
          <GameControls
            onStartGame={startGame}
            defaultPlayerConfigs={DEFAULT_PLAYER_CONFIGS}
          />
        </div>
      ) : (
        <>
          <div className="board-container" ref={boardContainerRef}>
            <GameBoard
              board={board}
              onCellClick={handleCellClick}
              winningCells={winningCells}
              selectedCell={selectedCell}
              gridType={gridType}
              playerSymbols={getPlayerSymbols()}
            />
          </div>

          <GameInfo
            currentPlayer={currentPlayer}
            winner={winner}
            isDraw={isDraw}
            playerConfigs={playerConfigs}
            onResetGame={resetGame}
            currentMoveType={getCurrentMoveType()}
          />

          <div className="return-menu-container">
            <button
              className="btn btn-secondary"
              onClick={() => resetGame(true)}
            >
              Return to Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

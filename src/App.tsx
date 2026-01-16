import React from "react";
import { GameBoard } from "./components/board";
import { GameControls } from "./components/controls";
import { GameInfo } from "./components/info";
import { GameProvider, useGame } from "./context";
import { useGameBoard, useGameState } from "./hooks";
import { DEFAULT_PLAYER_CONFIGS } from "./constants";

// GameContent component that uses the context
const GameContent: React.FC = () => {
  const { state } = useGame();
  const {
    board,
    winningCells,
    playerConfigs,
    gameStarted,
    winLength,
    moveType
  } = state;

  const {
    selectedCell,
    handleCellClick,
    cancelSelection,
  } = useGameBoard();

  const { resetGame } = useGameState();

  // Set CSS variables for player colors when player configs change
  React.useEffect(() => {
    const root = document.documentElement;
    playerConfigs.forEach((config, index) => {
      root.style.setProperty(`--player${index + 1}-color`, config.color);
    });
  }, [playerConfigs]);

  const boardContainerRef = React.useRef<HTMLDivElement>(null);

  // Add click event listener to detect clicks outside of board
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedCell &&
        boardContainerRef.current &&
        !boardContainerRef.current.contains(event.target as Node)
      ) {
        cancelSelection();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCell, cancelSelection]);

  // Custom click handler
  const handleBoardCellClick = (row: number, col: number) => {
    handleCellClick([row, col]);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>m,n,k-game</h1>
        <p>Get {winLength} in a row to win!</p>
      </header>

      {!gameStarted ? (
        <div className="game-container">
          <GameControls
            defaultPlayerConfigs={DEFAULT_PLAYER_CONFIGS}
          />
        </div>
      ) : (
        <>
          <div className="board-container" ref={boardContainerRef}>
            <GameBoard
              board={board}
              onCellClick={handleBoardCellClick}
              winningCells={winningCells}
              selectedCell={selectedCell}
              playerSymbols={playerConfigs.map(config => config.symbol)}
            />
          </div>

          <GameInfo
            currentMoveType={moveType}
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

// Wrap the app with the provider
const App: React.FC = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default App;

import React, { useRef, useEffect } from "react";
import { GameBoard } from "./components/board";
import { GameControls } from "./components/controls";
import { GameInfo } from "./components/info";
import { GameProvider, useGame } from "./context";
import { getGameIdFromUrl, clearGameIdFromUrl } from "./utils";

const GameContent: React.FC = () => {
  const {
    state,
    gameMode,
    onlineState,
    isMyTurn,
    isGameInProgress,
    makeMove,
    cancelSelection,
    leaveOnlineGame,
    resetGame,
  } = useGame();
  const { board, winningCells, playerConfigs, winLength, winner, isDraw, selectedCell } = state;
  const boardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playerConfigs.forEach((config, index) => {
      document.documentElement.style.setProperty(`--player${index + 1}-color`, config.color);
    });
  }, [playerConfigs]);

  // Cancel selection on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedCell && boardContainerRef.current && !boardContainerRef.current.contains(event.target as Node)) {
        cancelSelection();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCell, cancelSelection]);

  const handleReturnToMenu = () => {
    if (gameMode === 'online') {
      leaveOnlineGame();
      clearGameIdFromUrl();
    }
    resetGame(true);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>m,n,k-game</h1>
        <p>Get {winLength} in a row to win!</p>
      </header>

      {!isGameInProgress ? (
        <div className="game-container">
          <GameControls />
        </div>
      ) : (
        <>
          {gameMode === 'online' && (
            <div className="online-game-indicator">
              <span className="player-badge">
                You are Player {(onlineState.playerIndex ?? 0) + 1}
                {!isMyTurn && winner === null && !isDraw && (
                  <span className="waiting-turn"> - Waiting for opponent...</span>
                )}
              </span>
            </div>
          )}

          <div className="board-container" ref={boardContainerRef}>
            <GameBoard
              board={board}
              onCellClick={(row, col) => makeMove([row, col])}
              winningCells={winningCells}
              selectedCell={selectedCell}
              playerSymbols={playerConfigs.map(config => config.symbol)}
              disabled={gameMode === 'online' && !isMyTurn}
            />
          </div>

          <GameInfo />

          <div className="return-menu-container">
            <button className="btn btn-secondary" onClick={handleReturnToMenu}>
              {gameMode === 'online' ? 'Leave Game' : 'Return to Menu'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <GameProvider initialGameId={getGameIdFromUrl()}>
    <GameContent />
  </GameProvider>
);

export default App;

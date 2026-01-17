import React from 'react';
import { useGame } from '../../context';
import { isGameOver } from '../../game';
import { getRematchInfo } from '../../utils';

const GameInfo: React.FC = () => {
  const { state, gameMode, requestRematch, onlineState, resetGame } = useGame();
  const { winner, isDraw, currentPlayer, playerConfigs, selectedCell, rematchRequests } = state;

  const currentConfig = playerConfigs[currentPlayer];
  const winnerConfig = winner !== null ? playerConfigs[winner] : null;
  const gameOver = isGameOver(winner, isDraw);
  const rematch = getRematchInfo(rematchRequests, onlineState.playerIndex);

  const getStatusMessage = () => {
    if (winnerConfig) {
      return (
        <>
          <span className="player-symbol" style={{ color: winnerConfig.color }}>
            {winnerConfig.symbol}
          </span>
          <span>{winnerConfig.name} wins!</span>
        </>
      );
    }

    if (isDraw) {
      return 'Game ended in a draw!';
    }

    const moveTypeText = selectedCell === null
      ? 'placing a stone'
      : 'moving an opponent\'s stone';

    return (
      <>
        <span className="current-player-indicator">
          <span className="player-symbol" style={{ color: currentConfig.color }}>
            {currentConfig.symbol}
          </span>
        </span>
        <span>{currentConfig.name}'s turn - {moveTypeText}</span>
      </>
    );
  };

  return (
    <div className="game-info">
      <div className="status">{getStatusMessage()}</div>

      {gameOver && gameMode === 'local' && (
        <button
          className="btn btn-primary"
          onClick={() => resetGame(false)}
          aria-label="Play Again"
        >
          Play Again
        </button>
      )}

      {gameOver && gameMode === 'online' && (
        <div className="rematch-controls">
          {rematch.hasRequested ? (
            <div className="rematch-waiting">
              Waiting for others to accept rematch ({rematch.othersCount}/{rematch.totalOthers} ready)
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => requestRematch()}
              aria-label="Play Again"
            >
              {rematch.allOthersWant ? 'Accept Rematch' : 'Request Rematch'}
            </button>
          )}
          {rematch.othersCount > 0 && !rematch.hasRequested && (
            <div className="rematch-notification">
              {rematch.othersCount} player{rematch.othersCount !== 1 ? 's' : ''} want{rematch.othersCount === 1 ? 's' : ''} a rematch!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameInfo;

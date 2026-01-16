import React from 'react';
import { MoveType } from '../../types/game.types';
import { useGameState } from '../../hooks';
import { useGame } from '../../context';

interface GameInfoProps {
  currentMoveType?: MoveType;
}

/**
 * Displays game status information and controls
 */
const GameInfo: React.FC<GameInfoProps> = ({
  currentMoveType = MoveType.PLACE,
}) => {
  const { state } = useGame();
  const { winner, isDraw, currentPlayer, playerConfigs } = state;
  const { resetGame } = useGameState();
  
  const currentConfig = playerConfigs[currentPlayer];
  const winnerConfig = winner !== null ? playerConfigs[winner] : null;
  const isGameOver = winner !== null || isDraw;
  
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
    
    const moveTypeText = currentMoveType === MoveType.PLACE 
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
      
      {isGameOver && (
        <button 
          className="btn btn-primary" 
          onClick={() => resetGame(false)}
          aria-label="Play Again"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default GameInfo; 
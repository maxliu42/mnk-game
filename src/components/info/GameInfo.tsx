import React from 'react';
import { MoveType, PlayerConfig } from '../../types/game.types';
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
  const { winner, isDraw } = state;
  const { resetGame, getGameStatus, getWinner, getCurrentPlayerAttribute } = useGameState();
  
  // Generate the status message based on game state
  const getStatusMessage = () => {
    if (winner !== null) {
      const winnerConfig = getWinner()!;
      return (
        <>
          <span 
            className="player-symbol" 
            style={{ color: winnerConfig.color }}
          >
            {winnerConfig.symbol}
          </span>
          <span>{winnerConfig.name} wins!</span>
        </>
      );
    }
    
    if (isDraw) {
      return 'Game ended in a draw!';
    }
    
    const currentPlayerName = getCurrentPlayerAttribute('name');
    const currentPlayerSymbol = getCurrentPlayerAttribute('symbol');
    const currentPlayerColor = getCurrentPlayerAttribute('color');
    
    const moveTypeText = currentMoveType === MoveType.PLACE 
      ? 'placing a stone' 
      : 'moving an opponent\'s stone';
    
    return (
      <>
        <span className="current-player-indicator">
          <span 
            className="player-symbol" 
            style={{ color: currentPlayerColor }}
          >
            {currentPlayerSymbol}
          </span>
        </span>
        <span>
          {currentPlayerName}'s turn - {moveTypeText}
        </span>
      </>
    );
  };
  
  const isGameOver = winner !== null || isDraw;
  
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
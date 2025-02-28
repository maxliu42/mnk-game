import React from 'react';
import { MoveType } from '../types/game.types';

interface GameInfoProps {
  currentPlayer: number;
  winner: number | null;
  isDraw: boolean;
  playerSymbols: string[];
  onResetGame: (returnToMenu?: boolean) => void;
  currentMoveType?: MoveType;
}

/**
 * Displays game status information and controls
 */
const GameInfo: React.FC<GameInfoProps> = ({
  currentPlayer,
  winner,
  isDraw,
  playerSymbols,
  onResetGame,
  currentMoveType = MoveType.PLACE,
}) => {
  // Generate the status message based on game state
  const getStatusMessage = () => {
    if (winner !== null) {
      return `Player ${winner + 1} (${playerSymbols[winner]}) wins!`;
    }
    
    if (isDraw) {
      return 'Game ended in a draw!';
    }
    
    const moveTypeText = currentMoveType === MoveType.PLACE 
      ? 'placing a stone' 
      : 'moving an opponent\'s stone';
    
    return `Current player: Player ${currentPlayer + 1} (${playerSymbols[currentPlayer]}) - ${moveTypeText}`;
  };
  
  const isGameOver = winner !== null || isDraw;
  
  return (
    <div className="game-info">
      <div className="status">{getStatusMessage()}</div>
      
      {isGameOver && (
        <button 
          className="btn btn-primary" 
          onClick={() => onResetGame(false)}
          aria-label="Play Again"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default GameInfo; 
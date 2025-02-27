import React from 'react';

interface GameInfoProps {
  currentPlayer: number;
  winner: number | null;
  isDraw: boolean;
  playerSymbols: string[];
  onResetGame: (returnToMenu?: boolean) => void;
}

const GameInfo: React.FC<GameInfoProps> = ({
  currentPlayer,
  winner,
  isDraw,
  playerSymbols,
  onResetGame,
}) => {
  // Generate the status message based on game state
  const getStatusMessage = () => {
    if (winner !== null) {
      return `Player ${winner + 1} (${playerSymbols[winner]}) wins!`;
    }
    
    if (isDraw) {
      return 'Game ended in a draw!';
    }
    
    return `Current player: Player ${currentPlayer + 1} (${playerSymbols[currentPlayer]})`;
  };
  
  return (
    <div className="game-info">
      <div className="status">{getStatusMessage()}</div>
      
      {(winner !== null || isDraw) && (
        <button className="btn btn-primary" onClick={() => onResetGame(false)}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default GameInfo; 
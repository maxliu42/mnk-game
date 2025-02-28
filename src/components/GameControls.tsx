import React, { useState } from 'react';
import { GameConfig, GridType } from '../types/game.types';

interface GamePreset {
  name: string;
  m: number;
  n: number;
  k: number;
}

// Predefined game presets
const GAME_PRESETS: GamePreset[] = [
  { name: 'Tic-Tac-Toe', m: 3, n: 3, k: 3 },
  { name: 'Gomoku', m: 15, n: 15, k: 5 },
  { name: 'Connect Four', m: 6, n: 7, k: 4 }
];

interface GameControlsProps {
  onStartGame: (m: number, n: number, k: number, config?: GameConfig) => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onStartGame }) => {
  const [m, setM] = useState(3);
  const [n, setN] = useState(3);
  const [k, setK] = useState(3);
  const [playerCount, setPlayerCount] = useState(2);
  const [allowMovingOpponentPieces, setAllowMovingOpponentPieces] = useState(true);
  const [error, setError] = useState('');

  const handleStartGame = () => {
    // Validate inputs
    if (m < 3 || n < 3) {
      setError('Board dimensions must be at least 3x3');
      return;
    }

    if (k < 3) {
      setError('Win length must be at least 3');
      return;
    }

    if (k > Math.max(m, n)) {
      setError('Win length cannot be larger than the board dimensions');
      return;
    }

    // Clear any errors and start the game
    setError('');
    
    // Create a game config object
    const config: GameConfig = {
      boardSize: { m, n },
      winLength: k,
      gridType: GridType.SQUARE, // Default to square grid for now
      allowMovingOpponentPieces,
      playerCount
    };
    
    onStartGame(m, n, k, config);
  };

  // Handle input changes with validation
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string
  ) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setter(numValue);
    }
  };

  // Apply preset configuration
  const applyPreset = (preset: GamePreset) => {
    setM(preset.m);
    setN(preset.n);
    setK(preset.k);
  };

  return (
    <div className="game-setup">
      <h2>Game Setup</h2>

      <div className="game-controls">
        <div className="input-group">
          <label htmlFor="m-input">Rows <span>(m)</span></label>
          <input
            id="m-input"
            type="number"
            min="3"
            value={m}
            onChange={(e) => handleInputChange(setM, e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="n-input">Columns <span>(n)</span></label>
          <input
            id="n-input"
            type="number"
            min="3"
            value={n}
            onChange={(e) => handleInputChange(setN, e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="k-input">Win Length <span>(k)</span></label>
          <input
            id="k-input"
            type="number"
            min="3"
            max={Math.max(m, n)}
            value={k}
            onChange={(e) => handleInputChange(setK, e.target.value)}
          />
        </div>
      </div>
      
      <div className="number-input-group">
        <label htmlFor="player-count">Number of Players</label>
        <div className="player-count-input">
          <input
            id="player-count"
            type="range"
            min="2"
            max="6"
            value={playerCount}
            onChange={(e) => setPlayerCount(parseInt(e.target.value, 10))}
          />
          <span className="player-count-value">{playerCount}</span>
        </div>
      </div>
      
      <div className="checkbox-group">
        <label htmlFor="move-opponent-pieces">
          <input
            id="move-opponent-pieces"
            type="checkbox"
            checked={allowMovingOpponentPieces}
            onChange={(e) => setAllowMovingOpponentPieces(e.target.checked)}
          />
          Allow moving opponent's pieces
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="game-controls-buttons">
        <button className="btn btn-primary" onClick={handleStartGame}>
          Start Game
        </button>
      </div>

      <div className="game-presets">
        <h2>Quick Start Presets</h2>
        <div className="preset-buttons">
          {GAME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              className="btn btn-secondary"
              onClick={() => applyPreset(preset)}
            >
              {preset.name} ({preset.m},{preset.n},{preset.k})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameControls; 
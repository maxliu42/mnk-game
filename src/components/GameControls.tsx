import React, { useState } from 'react';

interface GameControlsProps {
  onStartGame: (m: number, n: number, k: number) => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onStartGame }) => {
  const [m, setM] = useState(3);
  const [n, setN] = useState(3);
  const [k, setK] = useState(3);
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
    onStartGame(m, n, k);
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

      {error && <p className="error-message">{error}</p>}

      <div className="game-controls-buttons">
        <button className="btn btn-primary" onClick={handleStartGame}>
          Start Game
        </button>
      </div>

      <div className="game-presets">
        <h2>Quick Start Presets</h2>
        <div className="preset-buttons">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setM(3);
              setN(3);
              setK(3);
            }}
          >
            Tic-Tac-Toe (3,3,3)
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setM(15);
              setN(15);
              setK(5);
            }}
          >
            Gomoku (15,15,5)
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setM(6);
              setN(7);
              setK(4);
            }}
          >
            Connect Four (6,7,4)
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls; 
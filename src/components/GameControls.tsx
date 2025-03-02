import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameConfig, PlayerConfig } from '../types/game.types';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

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
  defaultPlayerConfigs: PlayerConfig[];
}

const GameControls: React.FC<GameControlsProps> = ({ onStartGame, defaultPlayerConfigs }) => {
  const [m, setM] = useState(3);
  const [n, setN] = useState(3);
  const [k, setK] = useState(3);
  const [playerCount, setPlayerCount] = useState(2);
  const [allowMovingOpponentPieces, setAllowMovingOpponentPieces] = useState(true);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(() => defaultPlayerConfigs.slice(0, 2));
  const [error, setError] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const prevPlayerCountRef = useRef<number>(2);

  const handleClickOutside = useCallback((e: MouseEvent | React.MouseEvent) => {
    // Check if the click was on an emoji picker
    const target = e.target as HTMLElement;
    
    // Skip if clicking on the emoji picker or its container
    if (target.closest('.emoji-picker-react') || 
        target.closest('.emoji-picker-container') ||
        target.closest('.player-symbol') ||
        target.classList.contains('emoji-picker-overlay') ||
        target.closest('.emoji-picker-overlay')) {
      return;
    }
    
    setShowEmojiPicker(null);
  }, []);

  // Update player configs when player count changes
  useEffect(() => {
    const prevCount = prevPlayerCountRef.current;
    
    // Only run if player count actually changed
    if (prevCount !== playerCount) {
      if (prevCount < playerCount) {
        // Adding players - preserve existing and add new ones
        const newConfigs = [...playerConfigs];
        
        // Add missing players
        for (let i = prevCount; i < playerCount; i++) {
          newConfigs.push(defaultPlayerConfigs[i]);
        }
        
        setPlayerConfigs(newConfigs);
      } else {
        // Removing players - just trim the array
        setPlayerConfigs(prev => prev.slice(0, playerCount));
      }
      
      // Update the ref
      prevPlayerCountRef.current = playerCount;
    }
  }, [playerCount, defaultPlayerConfigs]);

  // Add event listener to close emoji picker when clicking outside
  useEffect(() => {
    if (showEmojiPicker !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker, handleClickOutside]);

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
      allowMovingOpponentPieces,
      playerCount,
      playerConfigs
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

  // Update player name
  const updatePlayerName = (index: number, name: string) => {
    const newConfigs = [...playerConfigs];
    newConfigs[index] = { ...newConfigs[index], name };
    setPlayerConfigs(newConfigs);
  };

  // Toggle player name editing
  const toggleEditingPlayer = (index: number) => {
    setEditingPlayerId(editingPlayerId === index ? null : index);
  };

  // Toggle emoji picker for a player
  const toggleEmojiPicker = (index: number) => {
    setShowEmojiPicker(showEmojiPicker === index ? null : index);
    // Close name editing if it's open
    if (editingPlayerId !== null) {
      setEditingPlayerId(null);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emojiData: EmojiClickData, index: number) => {
    const newConfigs = [...playerConfigs];
    newConfigs[index] = { ...newConfigs[index], symbol: emojiData.emoji };
    setPlayerConfigs(newConfigs);
    setShowEmojiPicker(null); // Close the picker after selection
  };

  const handleSymbolClick = (playerId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEmojiPicker(playerId);
  };

  return (
    <div className="game-setup">
      {showEmojiPicker !== null && (
        <div 
          className="emoji-picker-overlay" 
          onClick={(e) => {
            // Only close if clicking directly on the overlay background
            if (e.target === e.currentTarget) {
              setShowEmojiPicker(null);
            }
            e.stopPropagation();
          }}
        ></div>
      )}
      
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
            max="8"
            value={playerCount}
            onChange={(e) => setPlayerCount(parseInt(e.target.value, 10))}
          />
          <span className="player-count-value">{playerCount}</span>
        </div>
      </div>
      
      <div className="player-preview">
        <h3>Player Symbols</h3>
        <div className="player-config-grid">
          {playerConfigs.map((player, idx) => (
            <div key={idx} className="player-config-item">
              <div className="player-name-container">
                {editingPlayerId === idx ? (
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayerName(idx, e.target.value)}
                    onBlur={() => setEditingPlayerId(null)}
                    autoFocus
                    className="player-name-input"
                  />
                ) : (
                  <span 
                    className="player-name" 
                    onClick={() => toggleEditingPlayer(idx)}
                    title="Click to edit player name"
                  >
                    {player.name}
                  </span>
                )}
              </div>
              <div 
                className="player-symbol" 
                style={{ color: player.color }}
                onClick={(e) => handleSymbolClick(idx, e)}
              >
                {player.symbol}
              </div>
              {showEmojiPicker === idx && (
                <div 
                  className="emoji-picker-container" 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <EmojiPicker 
                    onEmojiClick={(emojiData) => handleEmojiSelect(emojiData, idx)} 
                    lazyLoadEmojis={true}
                    width={300}
                    height={400}
                  />
                </div>
              )}
            </div>
          ))}
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
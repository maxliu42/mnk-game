import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerConfig as PlayerConfigType } from '../../types/game.types';
import { EmojiClickData } from 'emoji-picker-react';
import PlayerConfig from './PlayerConfig';
import { GAME_PRESETS } from '../../constants';
import { useGameState } from '../../hooks';

interface GameControlsProps {
  defaultPlayerConfigs: PlayerConfigType[];
}

const GameControls: React.FC<GameControlsProps> = ({ defaultPlayerConfigs }) => {
  const [m, setM] = useState(3);
  const [n, setN] = useState(3);
  const [k, setK] = useState(3);
  const [playerCount, setPlayerCount] = useState(2);
  const [allowMovingOpponentPieces, setAllowMovingOpponentPieces] = useState(true);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfigType[]>(() => defaultPlayerConfigs.slice(0, 2));
  const [error, setError] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const prevPlayerCountRef = useRef<number>(2);
  
  const { startGame, setPlayerConfigs: updateGlobalPlayerConfigs } = useGameState();

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
    
    // Update global player configs
    updateGlobalPlayerConfigs(playerConfigs);
    
    startGame({
      boardSize: { m, n },
      winLength: k,
      allowMovingOpponentPieces,
      playerCount,
      playerConfigs
    });
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
  const applyPreset = (preset: typeof GAME_PRESETS[number]) => {
    setM(preset.boardSize.m);
    setN(preset.boardSize.n);
    setK(preset.winLength);
    setPlayerCount(preset.playerCount);
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

  // Close emoji picker
  const closeEmojiPicker = () => {
    setShowEmojiPicker(null);
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
            max="8"
            value={playerCount}
            onChange={(e) => setPlayerCount(parseInt(e.target.value, 10))}
          />
          <span className="player-count-value">{playerCount}</span>
        </div>
      </div>
      
      <PlayerConfig
        players={playerConfigs}
        editingPlayerId={editingPlayerId}
        showEmojiPicker={showEmojiPicker}
        onUpdatePlayerName={updatePlayerName}
        onToggleEditingPlayer={toggleEditingPlayer}
        onSymbolClick={handleSymbolClick}
        onEmojiSelect={handleEmojiSelect}
        onCloseEmojiPicker={closeEmojiPicker}
      />
      
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
              {preset.name} ({preset.boardSize.m},{preset.boardSize.n},{preset.winLength})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameControls; 
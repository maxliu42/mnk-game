import React, { useState, useEffect, useCallback } from 'react';
import { EmojiClickData } from 'emoji-picker-react';
import PlayerConfig from './PlayerConfig';
import { GAME_PRESETS } from '../../constants';
import { useGameState } from '../../hooks';
import { useGame } from '../../context';

const GameControls: React.FC = () => {
  const { state } = useGame();
  const { playerConfigs } = state;
  const { startGame, setPlayerCount, updatePlayerConfig } = useGameState();
  
  const [m, setM] = useState(3);
  const [n, setN] = useState(3);
  const [k, setK] = useState(3);
  const [allowMovingOpponentPieces, setAllowMovingOpponentPieces] = useState(true);
  const [error, setError] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.emoji-picker-react') || 
        target.closest('.emoji-picker-container') ||
        target.closest('.player-symbol') ||
        target.classList.contains('emoji-picker-overlay')) {
      return;
    }
    setShowEmojiPicker(null);
  }, []);

  useEffect(() => {
    if (showEmojiPicker !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker, handleClickOutside]);

  const handleStartGame = () => {
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
    setError('');
    startGame({
      boardSize: { m, n },
      winLength: k,
      allowMovingOpponentPieces,
      playerCount: playerConfigs.length
    });
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string
  ) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setter(numValue);
    }
  };

  const applyPreset = (preset: typeof GAME_PRESETS[number]) => {
    setM(preset.boardSize.m);
    setN(preset.boardSize.n);
    setK(preset.winLength);
    setPlayerCount(preset.playerCount);
  };

  const handleEmojiSelect = (emojiData: EmojiClickData, index: number) => {
    updatePlayerConfig(index, { symbol: emojiData.emoji });
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
            value={playerConfigs.length}
            onChange={(e) => setPlayerCount(parseInt(e.target.value, 10))}
          />
          <span className="player-count-value">{playerConfigs.length}</span>
        </div>
      </div>
      
      <PlayerConfig
        players={playerConfigs}
        editingPlayerId={editingPlayerId}
        showEmojiPicker={showEmojiPicker}
        onUpdatePlayerName={(index, name) => updatePlayerConfig(index, { name })}
        onToggleEditingPlayer={(index) => setEditingPlayerId(editingPlayerId === index ? null : index)}
        onSymbolClick={(playerId, e) => { e.stopPropagation(); setShowEmojiPicker(playerId); }}
        onEmojiSelect={handleEmojiSelect}
        onCloseEmojiPicker={() => setShowEmojiPicker(null)}
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
import React, { useState, useEffect, useCallback } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useGame } from '../../context';
import { useGameState } from '../../hooks';

/**
 * Player configuration component for editing player names and symbols
 */
const PlayerConfig: React.FC = () => {
  const { state } = useGame();
  const { playerConfigs } = state;
  const { updatePlayerConfig } = useGameState();
  
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

  const handleEmojiSelect = (emojiData: EmojiClickData, index: number) => {
    updatePlayerConfig(index, { symbol: emojiData.emoji });
    setShowEmojiPicker(null);
  };

  return (
    <div className="player-preview">
      {showEmojiPicker !== null && (
        <div 
          className="emoji-picker-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEmojiPicker(null);
            }
            e.stopPropagation();
          }}
        />
      )}
      
      <h3>Player Symbols</h3>
      <div className="player-config-grid">
        {playerConfigs.map((player, idx) => (
          <div key={idx} className="player-config-item">
            <div className="player-name-container">
              {editingPlayerId === idx ? (
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayerConfig(idx, { name: e.target.value })}
                  onBlur={() => setEditingPlayerId(null)}
                  autoFocus
                  className="player-name-input"
                />
              ) : (
                <span 
                  className="player-name" 
                  onClick={() => setEditingPlayerId(idx)}
                  title="Click to edit player name"
                >
                  {player.name}
                </span>
              )}
            </div>
            <div 
              className="player-symbol" 
              style={{ color: player.color }}
              onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(idx); }}
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
  );
};

export default PlayerConfig;

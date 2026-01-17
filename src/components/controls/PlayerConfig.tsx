import React, { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useGame } from '../../context';

const PlayerConfig: React.FC = () => {
  const { state, updatePlayerConfig } = useGame();
  const { playerConfigs } = state;

  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);

  const handleEmojiSelect = (emojiData: EmojiClickData, index: number) => {
    updatePlayerConfig(index, { symbol: emojiData.emoji });
    setShowEmojiPicker(null);
  };

  const closeEmojiPicker = () => setShowEmojiPicker(null);

  return (
    <div className="player-preview">
      {showEmojiPicker !== null && (
        <div className="emoji-picker-overlay" onClick={closeEmojiPicker} />
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
              onClick={() => setShowEmojiPicker(idx)}
            >
              {player.symbol}
            </div>
            {showEmojiPicker === idx && (
              <div className="emoji-picker-container" onClick={(e) => e.stopPropagation()}>
                <EmojiPicker
                  onEmojiClick={(emojiData) => handleEmojiSelect(emojiData, idx)}
                  lazyLoadEmojis
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

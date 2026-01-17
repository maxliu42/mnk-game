import React, { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useGame } from '../../context';

type ActiveEditor = { type: 'name' | 'emoji'; index: number } | null;

const PlayerConfig: React.FC = () => {
  const { state, updatePlayerConfig } = useGame();
  const { playerConfigs } = state;

  const [activeEditor, setActiveEditor] = useState<ActiveEditor>(null);

  const handleEmojiSelect = (emojiData: EmojiClickData, index: number) => {
    updatePlayerConfig(index, { symbol: emojiData.emoji });
    setActiveEditor(null);
  };

  return (
    <div className="player-preview">
      {activeEditor?.type === 'emoji' && (
        <div className="emoji-picker-overlay" onClick={() => setActiveEditor(null)} />
      )}

      <h3>Player Symbols</h3>
      <div className="player-config-grid">
        {playerConfigs.map((player, idx) => (
          <div key={idx} className="player-config-item">
            <div className="player-name-container">
              {activeEditor?.type === 'name' && activeEditor.index === idx ? (
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayerConfig(idx, { name: e.target.value })}
                  onBlur={() => setActiveEditor(null)}
                  autoFocus
                  className="player-name-input"
                />
              ) : (
                <span
                  className="player-name"
                  onClick={() => setActiveEditor({ type: 'name', index: idx })}
                  title="Click to edit player name"
                >
                  {player.name}
                </span>
              )}
            </div>
            <div
              className="player-symbol"
              style={{ color: player.color }}
              onClick={() => setActiveEditor({ type: 'emoji', index: idx })}
            >
              {player.symbol}
            </div>
            {activeEditor?.type === 'emoji' && activeEditor.index === idx && (
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

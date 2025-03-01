import React from 'react';
import { PlayerConfig as PlayerConfigType } from '../../types/game.types';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface PlayerConfigProps {
  players: PlayerConfigType[];
  editingPlayerId: number | null;
  showEmojiPicker: number | null;
  onUpdatePlayerName: (index: number, name: string) => void;
  onToggleEditingPlayer: (index: number) => void;
  onSymbolClick: (playerId: number, e: React.MouseEvent) => void;
  onEmojiSelect: (emojiData: EmojiClickData, index: number) => void;
  onCloseEmojiPicker: () => void;
}

const PlayerConfig: React.FC<PlayerConfigProps> = ({
  players,
  editingPlayerId,
  showEmojiPicker,
  onUpdatePlayerName,
  onToggleEditingPlayer,
  onSymbolClick,
  onEmojiSelect,
  onCloseEmojiPicker
}) => {
  return (
    <div className="player-preview">
      {showEmojiPicker !== null && (
        <div 
          className="emoji-picker-overlay" 
          onClick={(e) => {
            // Only close if clicking directly on the overlay background
            if (e.target === e.currentTarget) {
              onCloseEmojiPicker();
            }
            e.stopPropagation();
          }}
        ></div>
      )}
      
      <h3>Player Symbols</h3>
      <div className="player-config-grid">
        {players.map((player, idx) => (
          <div key={idx} className="player-config-item">
            <div className="player-name-container">
              {editingPlayerId === idx ? (
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => onUpdatePlayerName(idx, e.target.value)}
                  onBlur={() => onToggleEditingPlayer(idx)}
                  autoFocus
                  className="player-name-input"
                />
              ) : (
                <span 
                  className="player-name" 
                  onClick={() => onToggleEditingPlayer(idx)}
                  title="Click to edit player name"
                >
                  {player.name}
                </span>
              )}
            </div>
            <div 
              className="player-symbol" 
              style={{ color: player.color }}
              onClick={(e) => onSymbolClick(idx, e)}
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
                  onEmojiClick={(emojiData) => onEmojiSelect(emojiData, idx)} 
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
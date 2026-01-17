import React from 'react';
import { MAX_PLAYERS, MIN_PLAYERS } from '../../constants';

interface PlayerCountSettingsProps {
  playerCount: number;
  setPlayerCount: (count: number) => void;
}

const PlayerCountSettings: React.FC<PlayerCountSettingsProps> = ({
  playerCount,
  setPlayerCount,
}) => {
  return (
    <div className="number-input-group">
      <label htmlFor="player-count">Number of Players</label>
      <div className="player-count-input">
        <input
          id="player-count"
          type="range"
          min={MIN_PLAYERS}
          max={MAX_PLAYERS}
          value={playerCount}
          onChange={(e) => setPlayerCount(parseInt(e.target.value, 10))}
        />
        <span className="player-count-value">{playerCount}</span>
      </div>
    </div>
  );
};

export default PlayerCountSettings;

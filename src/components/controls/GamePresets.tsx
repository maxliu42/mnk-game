import React from 'react';
import { GAME_PRESETS } from '../../constants';

export type GamePreset = typeof GAME_PRESETS[number];

interface GamePresetsProps {
  onApplyPreset: (preset: GamePreset) => void;
}

const GamePresets: React.FC<GamePresetsProps> = ({ onApplyPreset }) => {
  return (
    <div className="game-presets">
      <h2>Quick Start Presets</h2>
      <div className="preset-buttons">
        {GAME_PRESETS.map((preset) => (
          <button
            key={preset.name}
            className="btn btn-secondary"
            onClick={() => onApplyPreset(preset)}
          >
            {preset.name} ({preset.boardSize.m},{preset.boardSize.n},{preset.winLength})
          </button>
        ))}
      </div>
    </div>
  );
};

export default GamePresets;

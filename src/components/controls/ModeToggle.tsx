import React from 'react';
import { GameMode } from '../../types/online.types';

interface ModeToggleProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  isConfigured: boolean;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ gameMode, setGameMode, isConfigured }) => {
  if (!isConfigured) return null;

  return (
    <div className="mode-toggle">
      <button
        className={`mode-btn ${gameMode === 'local' ? 'active' : ''}`}
        onClick={() => setGameMode('local')}
      >
        Local
      </button>
      <button
        className={`mode-btn ${gameMode === 'online' ? 'active' : ''}`}
        onClick={() => setGameMode('online')}
      >
        Online
      </button>
    </div>
  );
};

export default ModeToggle;

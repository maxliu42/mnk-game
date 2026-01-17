import React, { useState } from 'react';
import PlayerConfig from './PlayerConfig';
import OnlineControls from './OnlineControls';
import BoardSettings from './BoardSettings';
import PlayerCountSettings from './PlayerCountSettings';
import GamePresets, { GamePreset } from './GamePresets';
import ModeToggle from './ModeToggle';
import { MIN_BOARD_DIMENSION, MIN_WIN_LENGTH } from '../../constants';
import { useGame } from '../../context';
import { isSupabaseConfigured } from '../../lib/supabase';

interface DraftConfig {
  m: number;
  n: number;
  k: number;
  allowMovingOpponentPieces: boolean;
}

const initialDraft: DraftConfig = {
  m: MIN_BOARD_DIMENSION,
  n: MIN_BOARD_DIMENSION,
  k: MIN_WIN_LENGTH,
  allowMovingOpponentPieces: true,
};

const GameControls: React.FC = () => {
  const { state, gameMode, setGameMode, createOnlineGame, onlineState, startGame, setPlayerCount } = useGame();
  const { playerConfigs } = state;

  const [draft, setDraft] = useState<DraftConfig>(initialDraft);
  const [error, setError] = useState('');
  const [isCreatingOnline, setIsCreatingOnline] = useState(false);

  const updateDraft = (updates: Partial<DraftConfig>) => setDraft(prev => ({ ...prev, ...updates }));
  const handleBoardChange = (field: 'm' | 'n' | 'k', value: number) => updateDraft({ [field]: value });

  const validateGameConfig = (): boolean => {
    if (draft.m < MIN_BOARD_DIMENSION || draft.n < MIN_BOARD_DIMENSION) {
      setError(`Board dimensions must be at least ${MIN_BOARD_DIMENSION}x${MIN_BOARD_DIMENSION}`);
      return false;
    }
    if (draft.k < MIN_WIN_LENGTH) {
      setError(`Win length must be at least ${MIN_WIN_LENGTH}`);
      return false;
    }
    if (draft.k > Math.max(draft.m, draft.n)) {
      setError('Win length cannot be larger than the board dimensions');
      return false;
    }
    setError('');
    return true;
  };

  const handleStartGame = () => {
    if (!validateGameConfig()) return;
    startGame({
      boardSize: { m: draft.m, n: draft.n },
      winLength: draft.k,
      allowMovingOpponentPieces: draft.allowMovingOpponentPieces,
      playerCount: playerConfigs.length,
    });
  };

  const handleCreateOnlineGame = async () => {
    if (!validateGameConfig()) return;
    setIsCreatingOnline(true);
    await createOnlineGame({
      boardSize: { m: draft.m, n: draft.n },
      winLength: draft.k,
      playerConfigs,
      allowMovingOpponentPieces: draft.allowMovingOpponentPieces,
    });
    setIsCreatingOnline(false);
  };

  const handleApplyPreset = (preset: GamePreset) => {
    updateDraft({ m: preset.boardSize.m, n: preset.boardSize.n, k: preset.winLength });
    setPlayerCount(preset.playerCount);
  };

  if (gameMode === 'online' && ['waiting', 'joining', 'error'].includes(onlineState.status)) {
    return (
      <div className="game-setup">
        <h2>Online Game</h2>
        <OnlineControls isCreating={isCreatingOnline} />
      </div>
    );
  }

  return (
    <div className="game-setup">
      <h2>Game Setup</h2>

      <ModeToggle
        gameMode={gameMode}
        setGameMode={setGameMode}
        isConfigured={isSupabaseConfigured()}
      />

      <BoardSettings m={draft.m} n={draft.n} k={draft.k} onChange={handleBoardChange} />

      <PlayerCountSettings
        playerCount={playerConfigs.length}
        setPlayerCount={setPlayerCount}
      />

      <PlayerConfig />

      <div className="checkbox-group">
        <label htmlFor="move-opponent-pieces">
          <input
            id="move-opponent-pieces"
            type="checkbox"
            checked={draft.allowMovingOpponentPieces}
            onChange={(e) => updateDraft({ allowMovingOpponentPieces: e.target.checked })}
          />
          Allow moving opponent's pieces
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="game-controls-buttons">
        {gameMode === 'local' ? (
          <button className="btn btn-primary" onClick={handleStartGame}>
            Start Game
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleCreateOnlineGame}
            disabled={isCreatingOnline}
          >
            {isCreatingOnline ? 'Creating...' : 'Create Online Game'}
          </button>
        )}
      </div>

      <GamePresets onApplyPreset={handleApplyPreset} />
    </div>
  );
};

export default GameControls;

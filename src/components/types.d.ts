declare module './GameControls' {
  import { GameConfig, PlayerConfig } from '../types/game.types';
  
  interface GameControlsProps {
    onStartGame: (m: number, n: number, k: number, config?: GameConfig) => void;
    defaultPlayerConfigs: PlayerConfig[];
  }
  const GameControls: React.FC<GameControlsProps>;
  export default GameControls;
}

declare module './GameInfo' {
  import { MoveType, PlayerConfig } from '../types/game.types';
  
  interface GameInfoProps {
    currentPlayer: number;
    winner: number | null;
    isDraw: boolean;
    playerConfigs: PlayerConfig[];
    onResetGame: (returnToMenu?: boolean) => void;
    currentMoveType?: MoveType;
  }
  const GameInfo: React.FC<GameInfoProps>;
  export default GameInfo;
} 
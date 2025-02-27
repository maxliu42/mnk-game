declare module './GameControls' {
  interface GameControlsProps {
    onStartGame: (m: number, n: number, k: number) => void;
  }
  const GameControls: React.FC<GameControlsProps>;
  export default GameControls;
}

declare module './GameInfo' {
  interface GameInfoProps {
    currentPlayer: number;
    winner: number | null;
    isDraw: boolean;
    playerSymbols: string[];
    onResetGame: (returnToMenu?: boolean) => void;
  }
  const GameInfo: React.FC<GameInfoProps>;
  export default GameInfo;
} 
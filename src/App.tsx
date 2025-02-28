import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard.tsx';
import GameControls from './components/GameControls.tsx';
import GameInfo from './components/GameInfo.tsx';

// Define player symbols
const PLAYER_SYMBOLS = ['X', 'O'];

const App: React.FC = () => {
  // Game configuration state
  const [boardSize, setBoardSize] = useState({ m: 3, n: 3 });
  const [winLength, setWinLength] = useState(3);
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  // Game state
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0 for player 1, 1 for player 2
  const [winner, setWinner] = useState<number | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  
  // Initialize the board when game starts
  useEffect(() => {
    if (isGameStarted) {
      initializeBoard();
    }
  }, [isGameStarted, boardSize]);
  
  // Initialize the board with null values
  const initializeBoard = () => {
    const newBoard = Array(boardSize.m)
      .fill(null)
      .map(() => Array(boardSize.n).fill(null));
    
    setBoard(newBoard);
    setCurrentPlayer(0);
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
  };
  
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    // Ignore clicks if game is over or cell is already filled
    if (winner !== null || isDraw || board[row][col] !== null) {
      return;
    }
    
    // Create a new board with the move
    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    
    // Check for win
    const winResult = checkWin(newBoard, row, col, currentPlayer);
    if (winResult.isWin) {
      setWinner(currentPlayer);
      setWinningCells(winResult.winningCells);
      return;
    }
    
    // Check for draw
    if (checkDraw(newBoard)) {
      setIsDraw(true);
      return;
    }
    
    // Switch player
    setCurrentPlayer(currentPlayer === 0 ? 1 : 0);
  };
  
  // Check if the current move results in a win
  const checkWin = (
    board: (number | null)[][],
    row: number,
    col: number,
    player: number
  ): { isWin: boolean; winningCells: [number, number][] } => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
    ];
    
    for (const [dx, dy] of directions) {
      let count = 1; // Start with 1 for the current cell
      const winningCells: [number, number][] = [[row, col]];
      
      // Check in both directions
      for (let dir = -1; dir <= 1; dir += 2) {
        // Skip the center (already counted)
        if (dir === 0) continue;
        
        // Check consecutive cells in this direction
        for (let i = 1; i < Math.max(boardSize.m, boardSize.n); i++) {
          const newRow = row + dir * dx * i;
          const newCol = col + dir * dy * i;
          
          // Check if cell is within bounds and has the player's symbol
          if (
            newRow >= 0 &&
            newRow < boardSize.m &&
            newCol >= 0 &&
            newCol < boardSize.n &&
            board[newRow][newCol] === player
          ) {
            count++;
            winningCells.push([newRow, newCol]);
          } else {
            break;
          }
        }
      }
      
      // If we found enough cells in a row, it's a win
      if (count >= winLength) {
        return { isWin: true, winningCells };
      }
    }
    
    return { isWin: false, winningCells: [] };
  };
  
  // Check if the game is a draw
  const checkDraw = (board: (number | null)[][]) => {
    return board.every(row => row.every(cell => cell !== null));
  };
  
  // Start a new game
  const startGame = (m: number, n: number, k: number) => {
    setBoardSize({ m, n });
    setWinLength(k);
    setIsGameStarted(true);
  };
  
  // Reset the game
  const resetGame = (returnToMenu = true) => {
    if (returnToMenu) {
      setIsGameStarted(false);
      setBoard([]);
    } else {
      // Just reset the board and game state, keeping the same settings
      initializeBoard();
    }
    
    setCurrentPlayer(0);
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
  };
  
  return (
    <div className="container">
      <header className="header">
        <h1>m,n,k-game</h1>
        <p>Get {winLength} in a row to win!</p>
      </header>
      
      {!isGameStarted ? (
        <div className="game-container">
          <GameControls onStartGame={startGame} />
        </div>
      ) : (
        <>
          <div className="board-container">
            <GameBoard
              board={board}
              onCellClick={handleCellClick}
              winningCells={winningCells}
            />
          </div>
          
          <GameInfo
            currentPlayer={currentPlayer}
            winner={winner}
            isDraw={isDraw}
            playerSymbols={PLAYER_SYMBOLS}
            onResetGame={resetGame}
          />
          
          <div className="return-menu-container">
            <button className="btn btn-secondary" onClick={() => resetGame(true)}>
              Return to Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App; 
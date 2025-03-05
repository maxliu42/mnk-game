# [M,N,K Game](https://maxliu.me/mnk-game/)

A web-based implementation of the [m,n,k game](https://en.wikipedia.org/wiki/M,n,k-game), where two players take turns placing their markers on an m×n board, with the goal of getting k markers in a row (horizontally, vertically, or diagonally).

## What is an m,n,k game?

An m,n,k game is an abstract board game with the following parameters:
- **m**: Number of rows on the board
- **n**: Number of columns on the board
- **k**: Number of markers in a row needed to win

Some popular examples of m,n,k games include:
- Tic-tac-toe: 3,3,3 game (3×3 board, need 3 in a row to win)
- Gomoku: 15,15,5 game (15×15 board, need 5 in a row to win)
- Connect Four: 6,7,4 game (6×7 board, need 4 in a row to win)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/maxliu42/mnk-game.git
cd mnk-game
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## How to Play

1. Configure the game parameters (m, n, k) or select a preset
2. Click "Start Game" to begin
3. Players take turns clicking on the board to place their markers
4. The first player to get k markers in a row (horizontally, vertically, or diagonally) wins
5. If the board fills up without a winner, the game ends in a draw

## Built With

- [React](https://reactjs.org/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Frontend build tool

## License

This project is licensed under the MIT License.

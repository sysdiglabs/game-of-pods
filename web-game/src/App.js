import { Client } from 'boardgame.io/react';
import { SyGame } from './Game';
import { SyBoard } from './Board';

const App = Client({
  game: SyGame,
  board: SyBoard,
});

export default App;

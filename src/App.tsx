import React, { useState } from 'react';
import Players from './components/Players';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './components/Game';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [opponentsName, setOpponentsName] = useState([]);
  const [selectedOpponent, setSellectedOpponent] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Players
              playerName={playerName}
              setPlayerName={setPlayerName}
              opponentsName={opponentsName}
              setOpponentsName={setOpponentsName}
              selectedOpponent={selectedOpponent}
              setSellectedOpponent={setSellectedOpponent}
            />
          }
        />
        <Route
          path="/game"
          element={
            <Game
              playerName={playerName}
              selectedOpponent={selectedOpponent}
              setSellectedOpponent={setSellectedOpponent}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

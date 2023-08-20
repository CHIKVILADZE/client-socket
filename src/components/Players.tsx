import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://server-game.onrender.com');

function Players({
  playerName,
  setPlayerName,
  opponentsName,
  setOpponentsName,
  selectedOpponent,
  setSellectedOpponent,
}: any) {
  const [value, setValue] = useState('');

  useEffect(() => {
    socket.emit('fetchNames');
    socket.on('fetchedNames', (fetchedNames) => {
      setOpponentsName(fetchedNames);
    });

    return () => {
      socket.off('fetchedNames');
    };
  }, [setOpponentsName]);

  const handleSetName = () => {
    if (playerName.trim() === '' || selectedOpponent.trim() === '') {
      return;
    }

    socket.emit('players', { name: playerName });
    setPlayerName(playerName);

    const queryParams = new URLSearchParams({
      playerName,
      opponentName: selectedOpponent,
    });

    window.location.href = `/game?${queryParams.toString()}`;
  };

  return (
    <div className="h-full p-8 flex justify-center text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="flex w-[40%] flex-col">
        <h1 className="text-center text-5xl mb-4 font-display text-white">
          Tic Tac Toe
        </h1>

        <div className="flex flex-row align-center items-end">
          <input
            className="mt-8 ml-40 w-[40%] h-50 px-4 py-2 border rounded-md"
            type="text"
            id="setName"
            required
            placeholder="Enter Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>

        <div className="search-container">
          <div className="search-inner">
            <input
              type="text"
              className="input-search"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setSellectedOpponent(e.target.value); // Update selectedOpponent
              }}
              placeholder="Select an opponent"
            />
          </div>
          <div className="dropdown">
            {opponentsName
              .filter((opponent: any) =>
                opponent.name.toLowerCase().startsWith(value.toLowerCase())
              )
              .map((opponent: any, index: number) => (
                <div
                  className="dropdown-row"
                  onClick={() => {
                    setSellectedOpponent(opponent.name); // Update selectedOpponent
                    setValue(opponent.name);
                  }}
                  key={index}
                >
                  <span className="text">{opponent.name}</span>
                </div>
              ))}
          </div>
        </div>

        <button
          className="mt-4 w-[30%] h-[60%] ml-5 px-4 py-2 border rounded-md bg-green-600 text-white"
          onClick={handleSetName}
        >
          Play
        </button>
      </div>
    </div>
  );
}

export default Players;

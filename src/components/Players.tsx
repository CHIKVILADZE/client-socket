import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const handleChange = (e: any) => {
    setPlayerName(e.target.value);
  };
  const handleChangeOpponent = (e: any) => {
    setSellectedOpponent(e.target.value);
  };

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
      <div className="flex w-[40%]   flex-col  ">
        <h1 className="text-center text-5xl mb-4 font-display text-white">
          Tic Tac Toe
        </h1>

        <div className="flex flex-row align-center items-end ">
          <input
            className="mt-8 ml-40 w-[40%] h-50 px-4 py-2 border   rounded-md"
            type="text"
            id="setName"
            required
            placeholder="Enter Your Name"
            value={playerName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row align-center items-end mt-20  text-black">
          <select
            name=""
            id=""
            className="w-[40%] h-10 mt-10"
            onChange={handleChangeOpponent}
          >
            <option value="" disabled selected>
              Select an opponent
            </option>
            {opponentsName.map((opponent: any, index: number) => (
              <option key={index} value={opponent.name}>
                {opponent.name}
              </option>
            ))}
          </select>
          <Link
            to="/game"
            className="mt-4 w-[30%] h-[60%]  ml-5 px-4 py-2 border  rounded-md bg-green-600 text-white"
            onClick={handleSetName}
          >
            <button>Play</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Players;

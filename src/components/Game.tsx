import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Square from './Square';
import { useLocation, useParams } from 'react-router-dom';

type Scores = {
  [key: string]: number;
};

const socket = io('https://server-game.onrender.com');

const INITIAL_GAME_STATE = ['', '', '', '', '', '', '', '', ''];
const INITIAL_SCORES: Scores = { X: 0, O: 0 };
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Game({ opponentsName }: any) {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [names, setNames] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const playerName = searchParams.get('playerName');
  const selectedOpponent = searchParams.get('opponentName');

  socket.on('chat', (data) => {
    const { cellIndex, value } = data;
    const newGameState = [...gameState];
    newGameState[cellIndex] = value;
    setGameState(newGameState);
  });

  useEffect(() => {
    if (!playerName) {
      console.error('Player name not found in query parameters');
      return;
    }

    const gameSocket = io('https://server-game.onrender.com', {
      query: {
        playerName,
      },
    });

    return () => {
      gameSocket.disconnect();
    };
  }, [playerName]);

  useEffect(() => {
    const storedScores = localStorage.getItem('scores');
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  useEffect(() => {
    socket.emit('fetchNames');
    socket.on('fetchedNames', (fetchedNames) => {
      setNames(fetchedNames);
      console.log(fetchedNames);
    });

    return () => {
      socket.off('fetchedNames');
    };
  }, []);

  console.log('Nameeee', names);
  useEffect(() => {
    if (gameState === INITIAL_GAME_STATE) {
      return;
    }

    checkForWinner();
  }, [gameState]);

  console.log('Playyyerrrr', playerName);
  const resetBoard = () => setGameState(INITIAL_GAME_STATE);
  const handleWin = () => {
    const winner = currentPlayer === 'X' ? playerName : selectedOpponent;

    window.alert(`Congrats ${winner}! You are the winner!`);

    const newPlayerScore = scores[currentPlayer] + 1;
    const newScores = { ...scores };
    newScores[currentPlayer] = newPlayerScore;
    setScores(newScores);
    localStorage.setItem('scores', JSON.stringify(newScores));

    resetBoard();
  };

  const handleDraw = () => {
    window.alert('The game ended in a draw');

    resetBoard();
  };

  const checkForWinner = () => {
    let roundWon = false;

    for (let i = 0; i < WINNING_COMBOS.length; i++) {
      const winCombo = WINNING_COMBOS[i];

      let a = gameState[winCombo[0]];
      let b = gameState[winCombo[1]];
      let c = gameState[winCombo[2]];

      if ([a, b, c].includes('')) {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      setTimeout(() => handleWin(), 500);
      return;
    }

    if (!gameState.includes('')) {
      setTimeout(() => handleDraw(), 500);
      return;
    }

    changePlayer();
  };

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const handleCellClick = (event: any) => {
    const cellIndex = Number(event.target.getAttribute('data-cell-index'));

    const currentValue = gameState[cellIndex];

    if (currentValue) {
      return;
    }
    if (currentPlayer !== playerName) {
      return;
    }

    const newValues = [...gameState];
    newValues[cellIndex] = currentPlayer;
    setGameState(newValues);

    socket.emit('chat', { cellIndex, value: currentPlayer });
    console.log('CellIndexxx', { cellIndex, value: currentPlayer });
    console.log('newValues', newValues);
    console.log('CurrentPlayer', currentPlayer);
    console.log('PlayerName', playerName);
  };

  return (
    <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
      <h1 className="text-center text-5xl mb-4 font-display text-white">
        Tic Tac Toe
      </h1>
      <div>
        <div className="grid grid-cols-3 gap-3 mx-auto w-96">
          {gameState.map((player, index) => (
            <Square
              key={index}
              onClick={handleCellClick}
              {...{ index, player }}
            />
          ))}
        </div>

        <div className="mx-auto w-96 text-2xl text-serif">
          <p className="text-white mt-5">
            Next Player: <span>{currentPlayer}</span>
          </p>
          <p className="text-white mt-5">
            {playerName} X : <span>{scores['X']}</span>
          </p>
          <p className="text-white mt-5">
            {selectedOpponent} O :<span>{scores['O']}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Game;

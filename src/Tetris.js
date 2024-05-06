import React, { useState, useEffect } from "react";
import "./Tetris.css";

const ROWS = 20;
const COLS = 10;
const EMPTY_CELL = 0;

const Tetris = () => {
  const createBoard = () => {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY_CELL));
  };

  const generateTetromino = () => {
    const tetrominos = [
      { shape: [[1, 1, 1, 1]], color: "cyan" },
      {
        shape: [
          [1, 1],
          [1, 1],
        ],
        color: "yellow",
      },
      {
        shape: [
          [1, 1, 0],
          [0, 1, 1],
        ],
        color: "purple",
      },
      {
        shape: [
          [0, 1, 1],
          [1, 1, 0],
        ],
        color: "green",
      },
      {
        shape: [
          [1, 1, 1],
          [0, 1, 0],
        ],
        color: "red",
      },
      {
        shape: [
          [1, 1, 0],
          [1, 1, 0],
        ],
        color: "orange",
      },
      {
        shape: [
          [1, 1, 1],
          [1, 0, 0],
        ],
        color: "blue",
      },
    ];
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
    return tetrominos[randomIndex];
  };

  const [board, setBoard] = useState(createBoard());
  const [tetromino, setTetromino] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        if (!checkCollision(tetromino, pos.x, pos.y + 1)) {
          setPos((pos) => ({ ...pos, y: pos.y + 1 }));
        } else {
          mergeTetromino();
          setTetromino(generateTetromino());
          setPos({ x: 0, y: 0 });
        }
      }, 500);

      return () => clearInterval(timer);
    }
  }, [tetromino, pos, isPlaying]);

  const mergeTetromino = () => {
    const newBoard = board.map((row) => [...row]);
    tetromino.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== EMPTY_CELL) {
          newBoard[pos.y + rowIndex][pos.x + colIndex] = tetromino.color;
        }
      });
    });
    setBoard(newBoard);
    clearRows();
  };

  const clearRows = () => {
    let newBoard = board.filter(
      (row) => !row.every((cell) => cell !== EMPTY_CELL)
    );
    const numRowsCleared = ROWS - newBoard.length;
    if (numRowsCleared > 0) {
      const emptyRows = Array(numRowsCleared).fill(
        Array(COLS).fill(EMPTY_CELL)
      );
      newBoard = emptyRows.concat(newBoard);
      setScore((score) => score + numRowsCleared * 100);
    }
    setBoard(newBoard);
  };

  const moveLeft = () => {
    if (!checkCollision(tetromino, pos.x - 1, pos.y)) {
      setPos((pos) => ({ ...pos, x: pos.x - 1 }));
    }
  };

  const moveRight = () => {
    if (!checkCollision(tetromino, pos.x + 1, pos.y)) {
      setPos((pos) => ({ ...pos, x: pos.x + 1 }));
    }
  };

  const rotate = () => {
    const rotatedTetromino = rotateTetromino(tetromino);
    if (!checkCollision(rotatedTetromino, pos.x, pos.y)) {
      setTetromino(rotatedTetromino);
    }
  };

  const checkCollision = (tetromino, newX, newY) => {
    for (let row = 0; row < tetromino.shape.length; row++) {
      for (let col = 0; col < tetromino.shape[row].length; col++) {
        if (
          tetromino.shape[row][col] !== EMPTY_CELL &&
          (newY + row >= ROWS ||
            newX + col < 0 ||
            newX + col >= COLS ||
            board[newY + row][newX + col] !== EMPTY_CELL)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const rotateTetromino = (tetromino) => {
    return {
      ...tetromino,
      shape: tetromino.shape[0].map((_, colIndex) =>
        tetromino.shape.map((row) => row[colIndex]).reverse()
      ),
    };
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, colIndex) => (
          <div key={colIndex} className={`cell ${cell}`} />
        ))}
      </div>
    ));
  };

  const startGame = () => {
    setBoard(createBoard());
    setTetromino(generateTetromino());
    setPos({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  if (gameOver) {
    return <div>Game Over! Your score is {score}</div>;
  }

  return (
    <div>
      <h1>Tetris</h1>
      <div className="board">{renderBoard()}</div>
      <div className="score">Score: {score}</div>
      <div className="controls">
        <button onClick={moveLeft}>Left</button>
        <button onClick={moveRight}>Right</button>
        <button onClick={rotate}>Rotate</button>
        {!isPlaying && <button onClick={startGame}>Start</button>}
      </div>
    </div>
  );
};

export default Tetris;

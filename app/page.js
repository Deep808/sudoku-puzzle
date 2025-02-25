"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const isValid = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
};

const solveSudoku = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
};

const Sudoku = () => {
  const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleSolve = () => {
    let newBoard = JSON.parse(JSON.stringify(board));
    if (solveSudoku(newBoard)) {
      setBoard(newBoard);
    } else {
      alert("No solution exists");
    }
  };

  const handleInputChange = (row, col, value) => {
    if (gameOver || board[row][col] !== 0) return;

    let newBoard = JSON.parse(JSON.stringify(board));
    let num = parseInt(value, 10);

    if (num >= 1 && num <= 9) {
      if (isValid(newBoard, row, col, num)) {
        newBoard[row][col] = num;
        setBoard(newBoard);
      } else {
        setMistakes((prev) => {
          const newMistakes = prev + 1;
          if (newMistakes >= 3) {
            setGameOver(true);
          }
          return newMistakes;
        });
      }
    }
  };

  const restartGame = () => {
    setBoard(initialBoard);
    setMistakes(0);
    setGameOver(false);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sudoku Solver</h1>
      <p className="mb-4 text-red-500 text-lg">Mistakes: {mistakes} / 3</p>
      {gameOver && (
        <motion.div
          className="mb-4 text-red-600 font-bold text-xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          Game Over! Try Again.
        </motion.div>
      )}
      <motion.div
        className="grid grid-cols-9 gap-1 bg-black p-2 rounded-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        {board.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((num, colIndex) => (
              <motion.input
                key={colIndex}
                type="text"
                maxLength="1"
                className={`w-12 h-12 flex text-black items-center justify-center text-lg font-bold bg-white border border-gray-300 text-center 
                    ${
                      colIndex % 3 === 2 && colIndex !== 8
                        ? "border-r-2 border-black"
                        : ""
                    } 
                    ${
                      rowIndex % 3 === 2 && rowIndex !== 8
                        ? "border-b-2 border-black"
                        : ""
                    }`}
                value={num !== 0 ? num : ""}
                onChange={(e) =>
                  handleInputChange(rowIndex, colIndex, e.target.value)
                }
                disabled={num !== 0 || gameOver}
                whileFocus={{ scale: 1.1 }}
              />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
      <motion.button
        onClick={handleSolve}
        className="mt-6 px-6 py-2 text-white font-bold bg-green-500 rounded-lg hover:bg-green-600 transition duration-300"
        disabled={gameOver}
        whileHover={{ scale: 1.1 }}
      >
        Solve Sudoku
      </motion.button>
      <motion.button
        onClick={restartGame}
        className="mt-2 px-6 py-2 text-white font-bold bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
        whileHover={{ scale: 1.1 }}
      >
        Restart Game
      </motion.button>
    </motion.div>
  );
};

export default Sudoku;

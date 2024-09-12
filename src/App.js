import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [time, setTime] = useState(10); // Time limit in seconds
  const [digits1, setDigits1] = useState(1); // Digits for first number
  const [digits2, setDigits2] = useState(1); // Digits for second number
  const [operation, setOperation] = useState('add'); // Operation (add, subtract, multiply, divide)
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false); // Game running state
  const [remainingTime, setRemainingTime] = useState(time); // Remaining time
  const [correctAnswer, setCorrectAnswer] = useState(null); // Store the correct answer for checking

  const generateNumbers = () => {
    const min1 = Math.pow(10, digits1 - 1);
    const max1 = Math.pow(10, digits1) - 1;
    const min2 = Math.pow(10, digits2 - 1);
    const max2 = Math.pow(10, digits2) - 1;
    setNumber1(Math.floor(Math.random() * (max1 - min1 + 1)) + min1);
    setNumber2(Math.floor(Math.random() * (max2 - min2 + 1)) + min2);
  };

  const calculateAnswer = () => {
    let answer = 0;
    if (operation === 'add') answer = number1 + number2;
    else if (operation === 'subtract') answer = number1 - number2;
    else if (operation === 'multiply') answer = number1 * number2;
    else if (operation === 'divide') answer = parseFloat((number1 / number2).toFixed(2)); // Limit decimals
    setCorrectAnswer(answer);
  };

  useEffect(() => {
    if (isRunning) {
      generateNumbers();
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      calculateAnswer();
    }
  }, [number1, number2, operation]);

  const startGame = () => {
    setIsRunning(true);
    setRemainingTime(time);
    setResult(null);
    generateNumbers();
  };

  const stopGame = () => {
    setIsRunning(false);
    setResult(null); // Clear result when stopped
  };

  const checkAnswer = () => {
    if (parseFloat(userAnswer) === correctAnswer) {
      setResult('Correct!');
      setUserAnswer(''); // Clear the input field
      generateNumbers(); // Generate new numbers if the answer is correct
      setRemainingTime(time); // Reset time for the next round
    } else {
      setResult(`Incorrect. The correct answer is ${correctAnswer}`);
      setIsRunning(true); // Restart if the answer is incorrect
      setUserAnswer(''); // Clear the input field
      setRemainingTime(time); // Reset the timer
    }
  };

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Clean up the interval on component unmount or change
    } else if (remainingTime === 0) {
      setResult(`Time's up! The correct answer was ${correctAnswer}. Try again.`);
      generateNumbers(); // Restart the game after time runs out
      setRemainingTime(time); // Reset the timer
      setUserAnswer(''); // Clear the input field
    }
  }, [isRunning, remainingTime]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <div className="app">
      <h1>Math Calculation Speed Game</h1>

      <div className="input-group">
        <label>Time (seconds): </label>
        <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} />
      </div>

      <div className="input-group">
        <label>Digits for First Number: </label>
        <input type="number" value={digits1} onChange={(e) => setDigits1(Number(e.target.value))} />
      </div>

      <div className="input-group">
        <label>Digits for Second Number: </label>
        <input type="number" value={digits2} onChange={(e) => setDigits2(Number(e.target.value))} />
      </div>

      <div className="input-group">
        <label>Operation: </label>
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
          <option value="divide">Divide</option>
        </select>
      </div>

      <button onClick={startGame} disabled={isRunning} className="btn btn-start">Start</button>
      <button onClick={stopGame} disabled={!isRunning} className="btn btn-stop">Stop</button>

      {isRunning && (
        <div>
          <p className="question">
            {number1} {operation === 'add' ? '+' : operation === 'subtract' ? '-' : operation === 'multiply' ? '*' : '/'}{' '}
            {number2}
          </p>
          <p className="timer">Time Remaining: {remainingTime} seconds</p>

          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your answer"
            className="answer-input"
          />
          <button onClick={checkAnswer} className="btn btn-submit">Submit Answer</button>

          {result && <p className="result-message">{result}</p>}
        </div>
      )}
    </div>
  );
};

export default App;

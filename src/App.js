import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [time, setTime] = useState(10);
  const [digits1, setDigits1] = useState(1);
  const [digits2, setDigits2] = useState(1);
  const [operation, setOperation] = useState('add');
  const [operationSign, setOperationSign] = useState('add');
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(time);
  const [correctAnswer, setCorrectAnswer] = useState(null);

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
    if (operation === 'add') {
      answer = number1 + number2;
      setOperationSign('+');
    } else if (operation === 'subtract') {
      answer = number1 - number2;
      setOperationSign('-');
    } else if (operation === 'multiply') {
      answer = number1 * number2;
      setOperationSign('*');
    } else if (operation === 'divide') {
      answer = parseFloat((number1 / number2).toFixed(2));
      setOperationSign('/');
    }
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
    setResult(null);
  };

  const nextQu = () => {
    setResult(`Skipped. ${number1} ${operationSign} ${number2} = ${correctAnswer}`);
    setUserAnswer('');
    generateNumbers();
    setRemainingTime(time);
  };

  const checkAnswer = () => {
    if (parseFloat(userAnswer) === correctAnswer) {
      setResult('Correct!');
      setUserAnswer('');
      generateNumbers();
      setRemainingTime(time);
    } else {
      setResult(`Incorrect. The correct answer is ${correctAnswer}`);
      setIsRunning(true);
      setUserAnswer('');
      setRemainingTime(time);
    }
  };

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (remainingTime === 0) {
      setResult(`Time's up! The correct answer was ${correctAnswer}. Try again.`);
      generateNumbers();
      setRemainingTime(time);
      setUserAnswer('');
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
      <button onClick={nextQu} disabled={!isRunning} className="btn btn-stop">Next</button>

      {isRunning && (
        <div>
          <p className="question">
            {number1} {operationSign} {number2}
          </p>
          <p className="timer">Time Remaining: {remainingTime} seconds</p>

          {/* Use numeric input for mobile */}
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your answer"
            className="answer-input"
            pattern="[0-9]*"
            inputMode="numeric"
          />

          <button onClick={checkAnswer} className="btn btn-submit">Submit Answer</button>

          {result && <p className="result-message">{result}</p>}
        </div>
      )}
    </div>
  );
};

export default App;

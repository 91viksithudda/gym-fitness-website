import React, { useState, useEffect, useRef } from 'react';
import { playAlarmSound } from '../utils/alarm';
import { progressAPI } from '../services/api';

const Timer = ({ initialTime, exerciseName, onComplete, onEdit, exerciseId, userId }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      setIsRunning(false);
      setIsCompleted(true);
      playAlarm();
      if (onComplete) {
        onComplete();
      }
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  useEffect(() => {
    // Show "Workout Complete" button when 50% of time is completed
    const fiftyPercentTime = Math.floor(initialTime * 0.5);
    if ((initialTime - timeLeft) >= fiftyPercentTime && !isCompleted) {
      setShowCompleteButton(true);
    }
  }, [timeLeft, initialTime, isCompleted]);

  const playAlarm = () => {
    // Try to play the alarm sound
    const success = playAlarmSound();
    if (!success) {
      // Fallback to browser alert if sound fails
      alert('Exercise completed! Time is up.');
    }
  };

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    setIsCompleted(false);
    setShowCompleteButton(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit({
        id: exerciseId,
        name: exerciseName,
        time: initialTime
      });
    }
  };

  const handleWorkoutComplete = async () => {
    try {
      // Mark exercise as completed and earn coins
      const response = await progressAPI.complete({
        exerciseId: exerciseId,
        timeSpent: initialTime - timeLeft
      });
      
      alert(`Congratulations! You've earned ${response.data.coinsEarned} coin(s)! Total coins: ${response.data.totalCoins}`);
      
      // Hide the button and mark as completed
      setShowCompleteButton(false);
      setIsCompleted(true);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing workout:', error);
      alert('Failed to complete workout and earn coins. Please try again.');
    }
  };

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4 dark:text-white">Timer: {exerciseName}</h3>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-mono font-bold mb-4 dark:text-white">
          {formatTime()}
        </div>
        
        {isCompleted ? (
          <div className="text-green-500 font-bold text-xl mb-4">
            Exercise Completed! 🎉
          </div>
        ) : null}
        
        {showCompleteButton && !isCompleted && (
          <div className="mb-4">
            <button
              onClick={handleWorkoutComplete}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-bold"
            >
              Workout Complete! 🏆
            </button>
            <p className="text-sm text-gray-500 mt-2">Complete to earn coins!</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset
        </button>
        
        <button
          onClick={handleEdit}
          className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Edit Timer
        </button>
      </div>
    </div>
  );
};

export default Timer;
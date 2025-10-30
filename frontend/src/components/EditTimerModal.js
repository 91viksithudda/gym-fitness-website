import React, { useState, useEffect } from 'react';

const EditTimerModal = ({ isOpen, onClose, timer, onSave }) => {
  const [time, setTime] = useState(timer?.time || 60);
  const [timeUnit, setTimeUnit] = useState('seconds');

  useEffect(() => {
    if (timer) {
      // Convert seconds to minutes if time is >= 60 seconds and divisible by 60
      if (timer.time >= 60 && timer.time % 60 === 0) {
        setTime(timer.time / 60);
        setTimeUnit('minutes');
      } else {
        setTime(timer.time);
        setTimeUnit('seconds');
      }
    }
  }, [timer]);

  const handleSave = () => {
    const timeInSeconds = timeUnit === 'minutes' ? time * 60 : time;
    onSave({
      ...timer,
      time: timeInSeconds
    });
  };

  const handleTimeChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTime(value);
    } else {
      setTime(1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Edit Timer</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">{timer?.name}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Timer Duration</label>
              <div className="flex">
                <input
                  type="number"
                  min="1"
                  value={time}
                  onChange={handleTimeChange}
                  className="flex-1 p-2 border rounded-l dark:bg-gray-700 dark:text-white"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                  className="p-2 border border-l-0 rounded-r dark:bg-gray-700 dark:text-white"
                >
                  <option value="seconds">seconds</option>
                  <option value="minutes">minutes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTimerModal;
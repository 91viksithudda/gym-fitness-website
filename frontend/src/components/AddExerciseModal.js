import React, { useState } from 'react';

const AddExerciseModal = ({ isOpen, onClose, onAddExercise }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [time, setTime] = useState(60);
  const [timeUnit, setTimeUnit] = useState('seconds');
  
  // Body part filter options
  const bodyParts = ['All', 'Chest', 'Back', 'Arms', 'Shoulders', 'Legs', 'Core', 'Cardio', 'Full Body'];
  const [selectedBodyPart, setSelectedBodyPart] = useState('All');
  
  // Category filter options
  const categories = ['All', 'Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Cable', 'Kettlebell', 'Band', 'Medicine Ball', 'Stretching', 'Cardio'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Exercise library with emoji, category, and body part
  const exerciseLibrary = [
    { id: 1, name: 'Bench Press', emoji: '🏋️‍♂️', category: 'Barbell', bodyPart: 'Chest' },
    { id: 2, name: 'Incline Bench Press', emoji: '🏋️', category: 'Barbell', bodyPart: 'Chest' },
    { id: 3, name: 'Dumbbell Press', emoji: '💪', category: 'Dumbbell', bodyPart: 'Chest' },
    { id: 4, name: 'Push-ups', emoji: '🤸‍♂️', category: 'Bodyweight', bodyPart: 'Chest' },
    { id: 5, name: 'Cable Crossover', emoji: '🔗', category: 'Cable', bodyPart: 'Chest' },
    { id: 6, name: 'Chest Fly', emoji: '🕊️', category: 'Dumbbell', bodyPart: 'Chest' },
    { id: 7, name: 'Deadlift', emoji: '🧱', category: 'Barbell', bodyPart: 'Back' },
    { id: 8, name: 'Pull-ups', emoji: '🧗', category: 'Bodyweight', bodyPart: 'Back' },
    { id: 9, name: 'Lat Pulldown', emoji: '🪝', category: 'Machine', bodyPart: 'Back' },
    { id: 10, name: 'Barbell Row', emoji: '🏋️', category: 'Barbell', bodyPart: 'Back' },
    { id: 11, name: 'Dumbbell Row', emoji: '💪', category: 'Dumbbell', bodyPart: 'Back' },
    { id: 12, name: 'Seated Row', emoji: '🪑', category: 'Machine', bodyPart: 'Back' },
    { id: 13, name: 'Bicep Curl', emoji: '💪', category: 'Dumbbell', bodyPart: 'Arms' },
    { id: 14, name: 'Barbell Curl', emoji: '🏋️‍♂️', category: 'Barbell', bodyPart: 'Arms' },
    { id: 15, name: 'Hammer Curl', emoji: '🔨', category: 'Dumbbell', bodyPart: 'Arms' },
    { id: 16, name: 'Concentration Curl', emoji: '🎯', category: 'Dumbbell', bodyPart: 'Arms' },
    { id: 17, name: 'Tricep Dips', emoji: '🧗‍♂️', category: 'Bodyweight', bodyPart: 'Arms' },
    { id: 18, name: 'Tricep Pushdown', emoji: '🔗', category: 'Cable', bodyPart: 'Arms' },
    { id: 19, name: 'Overhead Tricep Extension', emoji: '🧍‍♂️', category: 'Dumbbell', bodyPart: 'Arms' },
    { id: 20, name: 'Shoulder Press', emoji: '🧍', category: 'Dumbbell', bodyPart: 'Shoulders' },
    { id: 21, name: 'Lateral Raise', emoji: '🕊️', category: 'Dumbbell', bodyPart: 'Shoulders' },
    { id: 22, name: 'Front Raise', emoji: '👋', category: 'Dumbbell', bodyPart: 'Shoulders' },
    { id: 23, name: 'Arnold Press', emoji: '🧠', category: 'Dumbbell', bodyPart: 'Shoulders' },
    { id: 24, name: 'Shrugs', emoji: '🤷', category: 'Dumbbell', bodyPart: 'Shoulders' },
    { id: 25, name: 'Squats', emoji: '🦵', category: 'Barbell', bodyPart: 'Legs' },
    { id: 26, name: 'Lunges', emoji: '🚶‍♂️', category: 'Bodyweight', bodyPart: 'Legs' },
    { id: 27, name: 'Leg Press', emoji: '🦶', category: 'Machine', bodyPart: 'Legs' },
    { id: 28, name: 'Leg Curl', emoji: '🔁', category: 'Machine', bodyPart: 'Legs' },
    { id: 29, name: 'Leg Extension', emoji: '🦵', category: 'Machine', bodyPart: 'Legs' },
    { id: 30, name: 'Calf Raise', emoji: '🐄', category: 'Machine', bodyPart: 'Legs' },
    { id: 31, name: 'Plank', emoji: '🧍', category: 'Bodyweight', bodyPart: 'Core' },
    { id: 32, name: 'Sit-ups', emoji: '🤸', category: 'Bodyweight', bodyPart: 'Core' },
    { id: 33, name: 'Crunches', emoji: '🍫', category: 'Bodyweight', bodyPart: 'Core' },
    { id: 34, name: 'Russian Twist', emoji: '🔄', category: 'Dumbbell', bodyPart: 'Core' },
    { id: 35, name: 'Hanging Leg Raise', emoji: '🧗', category: 'Bodyweight', bodyPart: 'Core' },
    { id: 36, name: 'Side Plank', emoji: '↔️', category: 'Bodyweight', bodyPart: 'Core' },
    { id: 37, name: 'Jump Rope', emoji: '🪢', category: 'Cardio', bodyPart: 'Cardio' },
    { id: 38, name: 'Treadmill Running', emoji: '🏃‍♂️', category: 'Machine', bodyPart: 'Cardio' },
    { id: 39, name: 'Cycling', emoji: '🚴‍♂️', category: 'Machine', bodyPart: 'Cardio' },
    { id: 40, name: 'Rowing', emoji: '🚣‍♂️', category: 'Machine', bodyPart: 'Cardio' },
    { id: 41, name: 'Elliptical', emoji: '🏃', category: 'Machine', bodyPart: 'Cardio' },
    { id: 42, name: 'Ball Slams', emoji: '🪂', category: 'Medicine Ball', bodyPart: 'Full Body' },
    { id: 43, name: 'Kettlebell Swing', emoji: '🏋️', category: 'Kettlebell', bodyPart: 'Full Body' },
    { id: 44, name: 'Mountain Climbers', emoji: '🏔️', category: 'Bodyweight', bodyPart: 'Full Body' },
    { id: 45, name: 'Burpees', emoji: '🤾', category: 'Bodyweight', bodyPart: 'Full Body' },
    { id: 46, name: 'Battle Ropes', emoji: '🪢', category: 'Band', bodyPart: 'Full Body' },
    { id: 47, name: 'Stretch', emoji: '🧘', category: 'Stretching', bodyPart: 'Full Body' }
  ];

  // Filter exercises based on selected filters
  const filteredExercises = exerciseLibrary.filter(exercise => {
    const bodyPartMatch = selectedBodyPart === 'All' || exercise.bodyPart === selectedBodyPart;
    const categoryMatch = selectedCategory === 'All' || exercise.category === selectedCategory;
    return bodyPartMatch && categoryMatch;
  });

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleAdd = () => {
    if (selectedExercise) {
      const exerciseData = {
        exerciseName: selectedExercise.name,
        emoji: selectedExercise.emoji,
        category: selectedExercise.category,
        bodyPart: selectedExercise.bodyPart,
        sets,
        reps,
        weight,
        weightUnit,
        time: timeUnit === 'minutes' ? time * 60 : time, // Convert to seconds
      };
      onAddExercise(exerciseData);
      
      // Reset form
      setSelectedExercise(null);
      setSets(3);
      setReps(10);
      setWeight(0);
      setWeightUnit('kg');
      setTime(60);
      setTimeUnit('seconds');
    }
  };

  const handleBack = () => {
    setSelectedExercise(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Add Exercise</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Body Part</label>
                <select
                  value={selectedBodyPart}
                  onChange={(e) => setSelectedBodyPart(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  {bodyParts.map(part => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Exercise Selection */}
          {!selectedExercise ? (
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Select an Exercise</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {filteredExercises.map(exercise => (
                  <button
                    key={exercise.id}
                    onClick={() => handleExerciseSelect(exercise)}
                    className="p-3 border rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition-colors"
                  >
                    <div className="text-2xl mb-1">{exercise.emoji}</div>
                    <div className="text-sm font-medium dark:text-white">{exercise.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{exercise.category}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl mr-4">{selectedExercise.emoji}</div>
                <div>
                  <h3 className="text-xl font-bold dark:text-white">{selectedExercise.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedExercise.category} • {selectedExercise.bodyPart}
                  </p>
                </div>
              </div>

              {/* Exercise Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Sets</label>
                  <input
                    type="number"
                    min="1"
                    value={sets}
                    onChange={(e) => setSets(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Reps</label>
                  <input
                    type="number"
                    min="1"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Weight</label>
                  <div className="flex">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="flex-1 p-2 border rounded-l dark:bg-gray-700 dark:text-white"
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value)}
                      className="p-2 border border-l-0 rounded-r dark:bg-gray-700 dark:text-white"
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Timer</label>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      value={time}
                      onChange={(e) => setTime(parseInt(e.target.value) || 0)}
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
                  onClick={handleBack}
                  className="px-4 py-2 border rounded dark:text-white"
                >
                  Back
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Exercise
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExerciseModal;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { exerciseAPI, workoutAPI } from '../services/api';
import AddExerciseModal from '../components/AddExerciseModal';
import EditTimerModal from '../components/EditTimerModal';
import Timer from '../components/Timer';

const Exercises = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTimers, setActiveTimers] = useState([]);
  const [editingTimer, setEditingTimer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await exerciseAPI.getAll();
        setExercises(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setError('Failed to fetch exercises');
        // Fallback to mock data
        const mockExercises = [
          {
            _id: '1',
            name: 'Push-ups',
            targetMuscle: 'Chest, Shoulders, Triceps',
            equipment: 'Bodyweight',
            category: 'Bodyweight',
            bodyPart: 'Chest',
            emoji: '🤸‍♂️',
            gifUrl: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
            description: 'A basic upper body exercise'
          },
          {
            _id: '2',
            name: 'Squats',
            targetMuscle: 'Quadriceps, Glutes, Hamstrings',
            equipment: 'Bodyweight',
            category: 'Bodyweight',
            bodyPart: 'Legs',
            emoji: '🦵',
            gifUrl: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
            description: 'A compound lower body exercise'
          },
          {
            _id: '3',
            name: 'Plank',
            targetMuscle: 'Core, Shoulders',
            equipment: 'Bodyweight',
            category: 'Bodyweight',
            bodyPart: 'Core',
            emoji: '🧍',
            gifUrl: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
            description: 'An isometric core strength exercise'
          }
        ];
        setExercises(mockExercises);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleAddExerciseClick = () => {
    if (!user) {
      alert('Please log in to add exercises');
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleAddExercise = async (exerciseData) => {
    try {
      // Save to backend
      const response = await workoutAPI.add(exerciseData);
      
      // Add the new exercise to the list
      const newExercise = {
        _id: response.data._id,
        name: response.data.exerciseName,
        emoji: response.data.emoji || '💪',
        category: response.data.category,
        bodyPart: response.data.bodyPart,
        sets: response.data.sets,
        reps: response.data.reps,
        weight: response.data.weight,
        weightUnit: response.data.weightUnit,
        time: response.data.time,
        date: response.data.date
      };
      
      setExercises(prev => [...prev, newExercise]);
      
      // Automatically start timer for this exercise
      setActiveTimers(prev => [...prev, {
        id: newExercise._id,
        name: newExercise.name,
        time: newExercise.time
      }]);
      
      // Close modal
      setIsModalOpen(false);
      
      // Show success message
      alert('Exercise added successfully! Timer started.');
    } catch (error) {
      console.error('Error adding exercise:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add exercise';
      setError(`Failed to add exercise: ${errorMessage}`);
      alert(`Failed to add exercise: ${errorMessage}`);
    }
  };

  const handleEditTimer = (timer) => {
    setEditingTimer(timer);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedTimer = async (updatedTimer) => {
    try {
      // Find the exercise in our list
      const timerIndex = activeTimers.findIndex(timer => timer.id === updatedTimer.id);
      if (timerIndex !== -1) {
        // Update the timer in the active timers list
        const updatedTimers = [...activeTimers];
        updatedTimers[timerIndex] = {
          ...updatedTimers[timerIndex],
          time: updatedTimer.time
        };
        setActiveTimers(updatedTimers);
      }
      
      // Also update the exercise in the exercises list
      const exerciseIndex = exercises.findIndex(ex => ex._id === updatedTimer.id);
      if (exerciseIndex !== -1) {
        // Create updated exercise data
        const updatedExerciseData = {
          exerciseName: exercises[exerciseIndex].name,
          category: exercises[exerciseIndex].category,
          bodyPart: exercises[exerciseIndex].bodyPart,
          sets: exercises[exerciseIndex].sets,
          reps: exercises[exerciseIndex].reps,
          weight: exercises[exerciseIndex].weight,
          weightUnit: exercises[exerciseIndex].weightUnit,
          time: updatedTimer.time
        };
        
        // Update in backend
        await workoutAPI.update(updatedTimer.id, updatedExerciseData);
        
        // Update in frontend
        const updatedExercises = [...exercises];
        updatedExercises[exerciseIndex] = { 
          ...updatedExercises[exerciseIndex], 
          time: updatedTimer.time 
        };
        setExercises(updatedExercises);
      }
      
      setIsEditModalOpen(false);
      setEditingTimer(null);
      alert('Timer updated successfully!');
    } catch (error) {
      console.error('Error updating timer:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update timer';
      setError(`Failed to update timer: ${errorMessage}`);
      alert(`Failed to update timer: ${errorMessage}`);
    }
  };

  const handleTimerComplete = (exerciseId) => {
    // Remove timer after completion
    setActiveTimers(prev => prev.filter(timer => timer.id !== exerciseId));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTimer(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg dark:text-white">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Exercises</h1>
        <button
          onClick={handleAddExerciseClick}
          className="btn-primary flex items-center"
        >
          <span className="mr-2">+</span> Add Exercise
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Active Timers */}
      {activeTimers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Active Timers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTimers.map(timer => (
              <Timer
                key={timer.id}
                initialTime={timer.time}
                exerciseName={timer.name}
                exerciseId={timer.id}
                userId={user?.id}
                onComplete={() => handleTimerComplete(timer.id)}
                onEdit={handleEditTimer}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Exercise List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div key={exercise._id} className="card">
            <div className="p-6">
              {exercise.emoji && (
                <div className="text-4xl mb-3">{exercise.emoji}</div>
              )}
              <h2 className="text-xl font-bold mb-2 dark:text-white">{exercise.name}</h2>
              {exercise.category && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{exercise.category} • {exercise.bodyPart}</p>
              )}
              <div className="mb-4">
                {exercise.sets && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Sets:</span> {exercise.sets}
                  </p>
                )}
                {exercise.reps && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Reps:</span> {exercise.reps}
                  </p>
                )}
                {exercise.weight && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Weight:</span> {exercise.weight} {exercise.weightUnit}
                  </p>
                )}
                {exercise.time && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Time:</span> {exercise.time} seconds
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Exercise Modal */}
      <AddExerciseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddExercise={handleAddExercise}
      />
      
      {/* Edit Timer Modal */}
      <EditTimerModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        timer={editingTimer}
        onSave={handleSaveEditedTimer}
      />
    </div>
  );
};

export default Exercises;
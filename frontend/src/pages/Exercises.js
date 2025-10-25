import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { exerciseAPI, progressAPI } from '../services/api';

const Exercises = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedExercises, setCompletedExercises] = useState(new Set());

  // Mock exercise data since we can't connect to backend
  const mockExercises = [
    {
      _id: '1',
      name: 'Push-ups',
      targetMuscle: 'Chest, Shoulders, Triceps',
      equipment: 'Bodyweight',
      gifUrl: 'https://via.placeholder.com/150x150.png?text=Push-ups',
      description: 'A basic upper body exercise'
    },
    {
      _id: '2',
      name: 'Squats',
      targetMuscle: 'Quadriceps, Glutes, Hamstrings',
      equipment: 'Bodyweight',
      gifUrl: 'https://via.placeholder.com/150x150.png?text=Squats',
      description: 'A compound lower body exercise'
    },
    {
      _id: '3',
      name: 'Plank',
      targetMuscle: 'Core, Shoulders',
      equipment: 'Bodyweight',
      gifUrl: 'https://via.placeholder.com/150x150.png?text=Plank',
      description: 'An isometric core strength exercise'
    },
    {
      _id: '4',
      name: 'Bicep Curls',
      targetMuscle: 'Biceps',
      equipment: 'Dumbbells',
      gifUrl: 'https://via.placeholder.com/150x150.png?text=Bicep+Curls',
      description: 'An isolation exercise for the biceps'
    },
    {
      _id: '5',
      name: 'Running',
      targetMuscle: 'Legs, Core, Cardiovascular System',
      equipment: 'Treadmill or outdoors',
      gifUrl: 'https://via.placeholder.com/150x150.png?text=Running',
      description: 'A great cardio exercise'
    }
  ];

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        // In a real app, you would fetch from the backend
        // const response = await exerciseAPI.getAll();
        // setExercises(response.data);
        
        // For now, we'll use mock data
        setTimeout(() => {
          setExercises(mockExercises);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleStartExercise = async (exerciseId) => {
    if (!user) {
      alert('Please log in to start exercises');
      return;
    }
    
    try {
      // Mark as completed
      setCompletedExercises(prev => new Set(prev).add(exerciseId));
      
      // Send request to backend to record completion
      const progressData = {
        userId: user.id,
        exerciseId: exerciseId,
        timeSpent: 5 // In a real app, this would be actual time spent
      };
      
      // In a real app, you would uncomment this line:
      // await progressAPI.complete(progressData);
      
      // Simulate API call
      setTimeout(() => {
        alert('Exercise completed! You earned 1 coin.');
      }, 500);
    } catch (error) {
      console.error('Error completing exercise:', error);
      alert('Error completing exercise. Please try again.');
      // Remove from completed exercises if there was an error
      setCompletedExercises(prev => {
        const newSet = new Set(prev);
        newSet.delete(exerciseId);
        return newSet;
      });
    }
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
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Exercise Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div key={exercise._id} className="card">
            <img 
              src={exercise.gifUrl} 
              alt={exercise.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 dark:text-white">{exercise.name}</h2>
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Target:</span> {exercise.targetMuscle}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Equipment:</span> {exercise.equipment}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{exercise.description}</p>
              
              <button
                onClick={() => handleStartExercise(exercise._id)}
                disabled={completedExercises.has(exercise._id)}
                className={`w-full ${
                  completedExercises.has(exercise._id) 
                    ? 'bg-green-500 cursor-default' 
                    : 'btn-success hover:bg-green-700'
                }`}
              >
                {completedExercises.has(exercise._id) ? 'Completed ✓' : 'Start Exercise'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
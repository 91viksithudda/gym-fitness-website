import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { workoutAPI } from '../services/api';

const WorkoutHistory = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        if (!user) return;
        
        const response = await workoutAPI.getAll();
        setWorkouts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch workout history');
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [user]);

  const handleDeleteWorkout = async (id) => {
    try {
      await workoutAPI.delete(id);
      setWorkouts(prev => prev.filter(workout => workout._id !== id));
    } catch (err) {
      setError('Failed to delete workout');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg dark:text-white">Loading workout history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Workout History</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg dark:text-white">No workout history yet.</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Start adding exercises to see your workout history here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div key={workout._id} className="card p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    {workout.emoji && (
                      <span className="text-2xl mr-2">{workout.emoji}</span>
                    )}
                    <h2 className="text-xl font-bold dark:text-white">{workout.exerciseName}</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {workout.category} • {workout.bodyPart}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(workout.date)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteWorkout(workout._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sets</p>
                  <p className="font-bold dark:text-white">{workout.sets}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reps</p>
                  <p className="font-bold dark:text-white">{workout.reps}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
                  <p className="font-bold dark:text-white">
                    {workout.weight} {workout.weightUnit}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                  <p className="font-bold dark:text-white">{formatTime(workout.time)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
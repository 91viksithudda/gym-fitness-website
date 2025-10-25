import React from 'react';
import { useExercises, useUserProgress } from '../hooks/useApi';

// Example component showing how to use custom hooks
const DashboardExample = ({ userId }) => {
  const { exercises, loading: exercisesLoading, error: exercisesError } = useExercises();
  const { progress, loading: progressLoading, error: progressError } = useUserProgress(userId);

  if (exercisesLoading || progressLoading) {
    return <div className="text-center p-8">Loading dashboard data...</div>;
  }

  if (exercisesError || progressError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading dashboard data. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exercises Section */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Available Exercises</h2>
            <div className="space-y-3">
              {exercises.slice(0, 5).map(exercise => (
                <div key={exercise._id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-bold dark:text-white">{exercise.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{exercise.targetMuscle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Progress</h2>
            {progress.length > 0 ? (
              <div className="space-y-3">
                {progress.slice(0, 3).map(item => (
                  <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-bold dark:text-white">
                        {item.exerciseId?.name || 'Exercise'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Completed on {new Date(item.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                      +1 coin
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No exercises completed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardExample;
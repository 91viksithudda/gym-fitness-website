import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressAPI, userAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalExercises: 0,
    coins: 0,
    streak: 0,
    level: 1
  });

  // Mock data since we can't connect to backend
  const mockCompletedExercises = [
    { id: 1, name: 'Push-ups', date: '2023-05-15' },
    { id: 2, name: 'Squats', date: '2023-05-16' },
    { id: 3, name: 'Plank', date: '2023-05-17' },
    { id: 4, name: 'Bicep Curls', date: '2023-05-18' }
  ];

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        try {
          // In a real app, you would fetch from the backend
          // const response = await progressAPI.getUserProgress(user.id);
          // const userResponse = await userAPI.getProfile();
          
          // Simulate fetching user stats
          setTimeout(() => {
            setStats({
              totalExercises: 12,
              coins: user.coins || 10,
              streak: user.streak || 3,
              level: Math.floor((user.coins || 10) / 5) + 1
            });
          }, 500);
        } catch (error) {
          console.error('Error fetching user stats:', error);
        }
      }
    };

    fetchUserStats();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">Profile</h1>
          <p className="text-lg dark:text-gray-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Your Profile</h1>
      
      {/* User Info Card */}
      <div className="card mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-4 mb-4 md:mb-0">
              <span className="text-2xl">👤</span>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
            <div className="ml-auto flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{stats.coins}</div>
                <div className="text-gray-600 dark:text-gray-300">Coins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.streak}</div>
                <div className="text-gray-600 dark:text-gray-300">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.level}</div>
                <div className="text-gray-600 dark:text-gray-300">Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Progress Stats</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-300">Workouts Completed</span>
                <span className="font-bold dark:text-white">{stats.totalExercises}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (stats.totalExercises / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-300">Coins Earned</span>
                <span className="font-bold dark:text-white">{stats.coins}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (stats.coins / 50) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-300">Current Streak</span>
                <span className="font-bold dark:text-white">{stats.streak} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (stats.streak / 30) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="card p-6 md:col-span-2">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Recent Activity</h3>
          <div className="space-y-4">
            {mockCompletedExercises.map((exercise) => (
              <div key={exercise.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="mr-4 text-2xl">💪</div>
                <div className="flex-1">
                  <h4 className="font-bold dark:text-white">{exercise.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Completed on {exercise.date}</p>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                  +1 coin
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
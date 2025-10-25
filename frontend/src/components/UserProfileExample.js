import React from 'react';
import { useAuth } from '../context/AuthContext';

// Example component showing how to use AuthContext
const UserProfileExample = () => {
  const { user, loading, error, login, register, logout } = useAuth();

  if (loading) {
    return <div className="text-center p-8">Loading user data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile Example</h1>
      
      {user ? (
        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.coins}</div>
                <div className="text-gray-600 dark:text-gray-300">Coins</div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{user.streak}</div>
                <div className="text-gray-600 dark:text-gray-300">Day Streak</div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Level 1</div>
                <div className="text-gray-600 dark:text-gray-300">Fitness Level</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Welcome to GymFitness</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please log in or register to access your personalized fitness dashboard.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => login({ email: 'user@example.com', password: 'password' })}
                className="btn-primary"
              >
                Demo Login
              </button>
              <button
                onClick={() => register({ name: 'New User', email: 'new@example.com', password: 'password' })}
                className="btn-secondary"
              >
                Demo Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileExample;
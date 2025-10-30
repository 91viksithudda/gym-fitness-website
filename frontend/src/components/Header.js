import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ darkMode, toggleDarkMode, backendStatus }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusIndicator = () => {
    switch (backendStatus) {
      case 'checking':
        return <span className="ml-2 w-3 h-3 rounded-full bg-yellow-500"></span>;
      case 'connected':
        return <span className="ml-2 w-3 h-3 rounded-full bg-green-500"></span>;
      case 'disconnected':
        return <span className="ml-2 w-3 h-3 rounded-full bg-red-500"></span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              GymFitness
            </Link>
            {backendStatus && (
              <div className="ml-2 flex items-center text-xs">
                {getStatusIndicator()}
                <span className="ml-1 dark:text-gray-300">
                  {backendStatus === 'checking' ? 'Connecting...' : 
                   backendStatus === 'connected' ? 'Online' : 'Offline'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="font-medium dark:text-white">{user.name}</span>
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {user.coins || 0} coins
                  </span>
                </div>
                <nav className="hidden md:flex space-x-4">
                  <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Home
                  </Link>
                  <Link to="/exercises" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Exercises
                  </Link>
                  <Link to="/workout-history" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    History
                  </Link>
                  <Link to="/subscription" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Subscription
                  </Link>
                  <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Profile
                  </Link>
                  <Link to="/leaderboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Leaderboard
                  </Link>
                  {/* In a real app, you would check if user is admin */}
                  <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Admin
                  </Link>
                </nav>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/subscription" className="btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
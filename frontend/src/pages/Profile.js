import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (user) {
          // In a real app, you would fetch from the backend
          // const response = await progressAPI.getUserProgress(user.id);
          // setProgress(response.data);
          
          // For now, we'll use mock data
          setTimeout(() => {
            setProgress([
              {
                _id: '1',
                exerciseId: { name: 'Push-ups' },
                completedAt: new Date(),
                timeSpent: 120
              },
              {
                _id: '2',
                exerciseId: { name: 'Squats' },
                completedAt: new Date(Date.now() - 86400000),
                timeSpent: 180
              }
            ]);
            setLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg dark:text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">User Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="lg:col-span-1 card">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Profile Information</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-500 mb-4">
                {user.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold dark:text-white">{user.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium dark:text-gray-300">Coins:</span>
                <span className="font-bold text-yellow-600 dark:text-yellow-400">{user.coins || 0}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium dark:text-gray-300">Current Streak:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{user.streak || 0} days</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium dark:text-gray-300">Subscription:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {user.subscription?.status === 'active' ? 'Premium' : 'Free'}
                </span>
              </div>
              
              {user.subscription?.status === 'active' && (
                <div className="flex justify-between">
                  <span className="font-medium dark:text-gray-300">Expires:</span>
                  <span className="font-bold dark:text-white">
                    {user.subscription.endDate ? formatDate(user.subscription.endDate) : 'N/A'}
                  </span>
                </div>
              )}
            </div>
            
            {user.subscription?.status !== 'active' && (
              <div className="mt-6">
                <a 
                  href="/subscription" 
                  className="btn-primary w-full text-center block"
                >
                  Upgrade to Premium
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress History Card */}
        <div className="lg:col-span-2 card">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Exercise History</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : progress.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No exercise history yet.</p>
                <a href="/exercises" className="btn-primary mt-4 inline-block">Start Exercising</a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exercise</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {progress.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                          {item.exerciseId?.name || 'Unknown Exercise'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(item.completedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(item.timeSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
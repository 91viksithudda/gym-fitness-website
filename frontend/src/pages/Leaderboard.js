import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data since we can't connect to backend
  const mockUsers = [
    { id: 1, name: 'Alex Johnson', coins: 125, streak: 15 },
    { id: 2, name: 'Maria Garcia', coins: 110, streak: 12 },
    { id: 3, name: 'James Wilson', coins: 95, streak: 8 },
    { id: 4, name: 'Sarah Miller', coins: 87, streak: 22 },
    { id: 5, name: 'Robert Davis', coins: 78, streak: 5 },
    { id: 6, name: 'Emily Thompson', coins: 65, streak: 18 },
    { id: 7, name: 'Michael Brown', coins: 52, streak: 3 },
    { id: 8, name: 'Jennifer Lee', coins: 45, streak: 7 },
    { id: 9, name: 'David Martinez', coins: 38, streak: 10 },
    { id: 10, name: 'Lisa Anderson', coins: 25, streak: 2 }
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // In a real app, you would fetch from the backend
        // const response = await leaderboardAPI.getTopUsers();
        // setUsers(response.data);
        
        // Simulate fetching leaderboard data
        setTimeout(() => {
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg dark:text-white">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Leaderboard</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold dark:text-white">Top Performers</h2>
              <p className="text-gray-600 dark:text-gray-300">See who's leading the fitness challenge</p>
            </div>
            
            <div className="space-y-4">
              {users.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`flex items-center p-4 rounded-lg ${
                    index === 0 
                      ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800' 
                      : index < 3 
                        ? 'bg-gray-50 dark:bg-gray-700' 
                        : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 font-bold ${
                    index === 0 
                      ? 'bg-yellow-500 text-white' 
                      : index === 1 
                        ? 'bg-gray-400 text-white' 
                        : index === 2 
                          ? 'bg-amber-800 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold dark:text-white">{user.name}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-bold dark:text-white">{user.coins}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">coins</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold dark:text-white">{user.streak}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">streak</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
          <p>Complete exercises to earn coins and climb the leaderboard!</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
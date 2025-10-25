import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <AuthProvider>
        <div className={darkMode ? 'dark' : ''}>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header 
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                  path="/exercises" 
                  element={
                    <ProtectedRoute>
                      <Exercises />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/leaderboard" 
                  element={
                    <ProtectedRoute>
                      <Leaderboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <PublicOnlyRoute>
                      <Login />
                    </PublicOnlyRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicOnlyRoute>
                      <Register />
                    </PublicOnlyRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
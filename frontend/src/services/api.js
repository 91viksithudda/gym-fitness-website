import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  register: (userData) => API.post('/users/register', userData),
  login: (userData) => API.post('/users/login', userData),
  getProfile: () => API.get('/users/profile')
};

// Exercise API
export const exerciseAPI = {
  getAll: () => API.get('/exercises'),
  getById: (id) => API.get(`/exercises/${id}`),
  seed: () => API.post('/exercises/seed')
};

// Progress API
export const progressAPI = {
  complete: (progressData) => API.post('/progress/complete', progressData),
  getUserProgress: (userId) => API.get(`/progress/${userId}`)
};

// Leaderboard API
export const leaderboardAPI = {
  getTopUsers: () => API.get('/leaderboard')
};

export default API;
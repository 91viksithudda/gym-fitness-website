import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
});

// Add a request interceptor to include auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints (userAPI)
export const userAPI = {
  register: (userData) => API.post('/users/register', userData),
  login: (userData) => API.post('/users/login', userData),
  getProfile: () => API.get('/users/profile')
};

// Exercise endpoints
export const exerciseAPI = {
  getAll: () => API.get('/exercises'),
  getById: (id) => API.get(`/exercises/${id}`)
};

// Progress endpoints
export const progressAPI = {
  complete: (progressData) => API.post('/progress/complete', progressData),
  getUserProgress: (userId) => API.get(`/progress/user/${userId}`)
};

// Leaderboard endpoints
export const leaderboardAPI = {
  get: () => API.get('/leaderboard')
};

// Workout endpoints
export const workoutAPI = {
  getAll: () => API.get('/workout'),
  add: (workoutData) => API.post('/workout', workoutData),
  update: (id, workoutData) => API.put(`/workout/${id}`, workoutData),
  delete: (id) => API.delete(`/workout/${id}`)
};

// Coupon endpoints
export const couponAPI = {
  validate: (code) => API.post('/coupons/validate', { code }),
  create: (couponData) => API.post('/coupons', couponData),
  getAll: () => API.get('/coupons'), // New endpoint to fetch all coupons
  // New endpoints for coupon usage tracking
  getUsage: (code) => API.get(`/coupons/usage/${code}`),
  getAllUsage: () => API.get('/coupons/usage')
};

// Payment endpoints
export const paymentAPI = {
  createPayment: (paymentData) => API.post('/payments/create', paymentData),
  processPayment: (paymentData) => API.post('/payments/process', paymentData),
  createSubscription: (subscriptionData) => API.post('/payments/create-subscription', subscriptionData),
  getUserProfile: () => API.get('/users/profile')
};

// Export the API instance
export default API;
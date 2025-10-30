const axios = require('axios');

// Test the same login request that the frontend would make
const testFrontendLogin = async () => {
  try {
    console.log('Testing frontend-style login...');
    
    // This mimics what the frontend API service does
    const API = axios.create({
      baseURL: 'http://localhost:5001/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const response = await API.post('/users/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Frontend-style login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Frontend-style login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

testFrontendLogin();
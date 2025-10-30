const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login for Viksit Hudda...');
    const response = await axios.post('http://localhost:5001/api/users/login', {
      email: 'viksithudda44@gmail.com',
      password: 'yourpassword'
    });
    
    console.log('Login successful:', response.data);
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}

testLogin();

// Test user registration
async function testRegistration() {
  try {
    console.log('Testing user registration...');
    const response = await axios.post('http://localhost:5001/api/users/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Registration successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
}

// Test user login
async function testLogin() {
  try {
    console.log('Testing user login...');
    const response = await axios.post('http://localhost:5001/api/users/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('Starting API tests...\n');
  
  // Try login first (should fail if user doesn't exist)
  await testLogin();
  
  console.log('\n---\n');
  
  // Try registration
  const token = await testRegistration();
  
  console.log('\n---\n');
  
  // Try login again (should succeed if registration worked)
  await testLogin();
}

runTests();
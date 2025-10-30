const axios = require('axios');

// Test login with the suggested credentials
const testLoginUser = async () => {
  try {
    const response = await axios.post('http://localhost:5001/api/users/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    return null;
  }
};

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
    return null;
  }
}

// Run tests
async function runTests() {
  console.log('Starting API tests...\n');
  
  // Try login first
  let token = await testLoginUser();
  
  if (!token) {
    console.log('\nLogin failed, trying registration...\n');
    // Try registration
    token = await testRegistration();
    
    if (token) {
      console.log('\n---\n');
      // Try login again after registration
      await testLoginUser();
    }
  }
}

runTests();
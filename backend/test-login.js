const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('http://localhost:5001/api/users/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

testLogin();
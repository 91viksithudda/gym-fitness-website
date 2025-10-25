// Simple script to test API connectivity
const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5001/api';

async function testAPI() {
  console.log('Testing API connectivity...');
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test main endpoint
    console.log('\n2. Testing main endpoint...');
    const mainResponse = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ Main endpoint passed:', mainResponse.data);
    
    // Test exercises endpoint
    console.log('\n3. Testing exercises endpoint...');
    const exercisesResponse = await axios.get(`${API_BASE_URL}/exercises`);
    console.log('✅ Exercises endpoint passed:', `${exercisesResponse.data.length} exercises found`);
    
    console.log('\n🎉 All API tests passed!');
  } catch (error) {
    console.error('❌ API test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('   No response received from server');
      console.error('   Please check if the server is running');
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

testAPI();
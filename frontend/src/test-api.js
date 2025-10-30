// Simple test to check if API is working
fetch('http://localhost:5001/api/health')
  .then(response => response.json())
  .then(data => console.log('Health check:', data))
  .catch(error => console.error('Health check error:', error));

// Test login
fetch('http://localhost:5001/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
  .then(response => response.json())
  .then(data => console.log('Login response:', data))
  .catch(error => console.error('Login error:', error));
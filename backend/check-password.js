require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Test the stored hash
const storedHash = '$2a$10$a6dySb5NbhcwdcShxv4hXeqGVeF5Isb9Tzwaz2yN/e2K0bPt63Kvy';
const testPassword = 'password123';

bcrypt.compare(testPassword, storedHash)
  .then(result => {
    console.log('Password comparison result:', result);
    if (result) {
      console.log('Password matches!');
    } else {
      console.log('Password does not match!');
    }
  })
  .catch(err => {
    console.error('Error comparing passwords:', err);
  });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB Atlas');
    
    // Find the test user
    const user = await User.findOne({ email: 'test@example.com' });
    if (user) {
      console.log('User found:');
      console.log('- Name:', user.name);
      console.log('- Email:', user.email);
      console.log('- Password hash:', user.password);
      console.log('- Coins:', user.coins);
      console.log('- Streak:', user.streak);
      
      // Test password
      const isMatch = await bcrypt.compare('password123', user.password);
      console.log('Password match:', isMatch);
    } else {
      console.log('User not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.log('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

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
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists:');
      console.log(`- ${existingUser.name} (${existingUser.email})`);
      process.exit(0);
    }
    
    // Create a test user with known credentials
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      coins: 0,
      streak: 0
    });
    
    await testUser.save();
    console.log('Test user created successfully!');
    console.log(`Email: test@example.com`);
    console.log(`Password: password123`);
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
};

connectDB();
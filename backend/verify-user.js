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
    
    // Check for the specific user
    const userEmail = 'viksithudda91@gmail.com';
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.log(`User with email ${userEmail} not found.`);
      console.log('Available users:');
      const allUsers = await User.find({}, 'name email');
      allUsers.forEach(u => {
        console.log(`- ${u.name} (${u.email})`);
      });
      process.exit(0);
    }
    
    console.log(`Found user: ${user.name} (${user.email})`);
    console.log('User ID:', user._id);
    console.log('Account created:', user.createdAt);
    
    // Reset password to ensure it works
    const newPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password has been reset for ${userEmail}`);
    console.log(`Use this password to login: ${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
};

connectDB();
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
    
    // Find the user with your email
    const userEmail = 'viksithudda91@gmail.com';
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.log(`User with email ${userEmail} not found.`);
      console.log('Please register through the website first.');
      process.exit(0);
    }
    
    // Reset the password
    const salt = await bcrypt.genSalt(10);
    const newPassword = 'password123'; // You can change this to whatever you prefer
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password reset successfully for ${userEmail}`);
    console.log(`New password: ${newPassword}`);
    console.log('You can now login with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
};

connectDB();
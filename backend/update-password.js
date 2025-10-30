require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const resetPassword = async (email, newPassword) => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      retryWrites: true,
      retryReads: true,
    });
    
    console.log('Connected to MongoDB Atlas');
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password successfully reset for ${email}`);
    console.log(`New password: ${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
};

// Usage
const email = process.argv[2];
const newPassword = process.argv[3] || 'password123';

if (!email) {
  console.log('Usage: node update-password.js <email> [newPassword]');
  console.log('Example: node update-password.js viksithudda91@gmail.com myNewPassword123');
  process.exit(1);
}

resetPassword(email, newPassword);
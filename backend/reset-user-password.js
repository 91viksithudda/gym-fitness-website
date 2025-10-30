require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Get email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('Usage: node reset-user-password.js <email>');
  console.log('Example: node reset-user-password.js viksithudda91@gmail.com');
  process.exit(1);
}

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
    
    // Find the user
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.log(`User with email ${userEmail} not found.`);
      process.exit(1);
    }
    
    console.log(`Found user: ${user.name} (${user.email})`);
    
    // Reset the password
    const newPassword = 'password123'; // Default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password reset successfully for ${userEmail}`);
    console.log(`New password: ${newPassword}`);
    console.log('User can now login with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
};

connectDB();
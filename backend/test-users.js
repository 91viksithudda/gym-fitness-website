require('dotenv').config();
const mongoose = require('mongoose');
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
    
    // List all users
    const users = await User.find({});
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Coins: ${user.coins}, Streak: ${user.streak}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.log('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();
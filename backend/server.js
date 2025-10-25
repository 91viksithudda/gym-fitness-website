const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with improved options
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
  } catch (error) {
    console.log('MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Gym Fitness API is running...');
});

// User routes
app.use('/api/users', require('./routes/userRoutes'));

// Exercise routes
app.use('/api/exercises', require('./routes/exerciseRoutes'));

// Progress routes
app.use('/api/progress', require('./routes/progressRoutes'));

// Leaderboard routes
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
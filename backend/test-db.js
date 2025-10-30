require('dotenv').config();
const mongoose = require('mongoose');

console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Test MongoDB Atlas connection
const testAtlasConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
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
      connectTimeoutMS: 30000,
    });
    console.log('Connected to MongoDB Atlas successfully!');
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log('MongoDB Atlas connection error:', error.message);
    console.log('Error details:', error);
    return false;
  }
};

// Test local MongoDB connection
const testLocalConnection = async () => {
  try {
    console.log('Attempting to connect to local MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/gymfitness', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to local MongoDB successfully!');
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log('Local MongoDB connection error:', error.message);
    return false;
  }
};

// Run tests
const runTests = async () => {
  console.log('Testing MongoDB connections...\n');
  
  // Test Atlas connection first
  const atlasSuccess = await testAtlasConnection();
  
  if (!atlasSuccess) {
    console.log('\nAtlas connection failed, trying local MongoDB...\n');
    const localSuccess = await testLocalConnection();
    
    if (!localSuccess) {
      console.log('\nBoth connections failed. Please check the MongoDB setup instructions.');
      process.exit(1);
    } else {
      console.log('\nUsing local MongoDB for development.');
      process.exit(0);
    }
  } else {
    console.log('\nUsing MongoDB Atlas for production.');
    process.exit(0);
  }
};

runTests();
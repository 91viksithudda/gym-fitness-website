require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

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
    
    // List all coupons
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    console.log('Coupons in database:');
    console.log('====================');
    
    if (coupons.length === 0) {
      console.log('No coupons found in the database.');
      console.log('You need to create a coupon first through the admin panel.');
    } else {
      coupons.forEach(coupon => {
        console.log(`Code: ${coupon.code}`);
        console.log(`Discount: ${coupon.discount}%`);
        console.log(`Expiration: ${coupon.expirationDate}`);
        console.log(`Max Uses: ${coupon.maxUses || 'Unlimited'}`);
        console.log(`Used: ${coupon.usedCount} times`);
        console.log(`Active: ${coupon.isActive ? 'Yes' : 'No'}`);
        console.log('---');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
};

connectDB();
require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const testCouponValidation = async () => {
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
    
    const couponCode = 'HUDDA3567';
    console.log(`Testing coupon: ${couponCode}`);
    
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase(),
      isActive: true,
      expirationDate: { $gte: new Date() }
    });
    
    if (!coupon) {
      console.log('Coupon not found or expired');
      // Let's check what's in the database for this coupon
      const dbCoupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (dbCoupon) {
        console.log('Coupon found in database:');
        console.log(`  Code: ${dbCoupon.code}`);
        console.log(`  Discount: ${dbCoupon.discount}%`);
        console.log(`  Expiration: ${dbCoupon.expirationDate}`);
        console.log(`  Current Date: ${new Date()}`);
        console.log(`  Expired: ${dbCoupon.expirationDate < new Date()}`);
        console.log(`  Active: ${dbCoupon.isActive}`);
        console.log(`  Max Uses: ${dbCoupon.maxUses || 'Unlimited'}`);
        console.log(`  Used Count: ${dbCoupon.usedCount}`);
        if (dbCoupon.maxUses) {
          console.log(`  Reached Max Uses: ${dbCoupon.usedCount >= dbCoupon.maxUses}`);
        }
      } else {
        console.log('Coupon does not exist in database');
      }
    } else {
      console.log('Coupon is valid:');
      console.log(`  Code: ${coupon.code}`);
      console.log(`  Discount: ${coupon.discount}%`);
      console.log(`  Expiration: ${coupon.expirationDate}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
};

testCouponValidation();
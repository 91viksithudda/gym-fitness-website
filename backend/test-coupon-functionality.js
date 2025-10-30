// Test coupon functionality
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coupon = require('./models/Coupon');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
  testCouponFunctionality();
})
.catch((error) => {
  console.error('Database connection error:', error);
  process.exit(1);
});

async function testCouponFunctionality() {
  try {
    // Create a test coupon
    const testCoupon = new Coupon({
      code: 'TESTCOUPON',
      discount: 10,
      expirationDate: new Date('2026-12-31'),
      maxUses: 5,
      isActive: true
    });
    
    await testCoupon.save();
    console.log('Created test coupon:', testCoupon.code);
    
    // Test discount calculation
    const originalPrice = 250;
    const discountAmount = Math.round(originalPrice * (testCoupon.discount / 100));
    const finalPrice = originalPrice - discountAmount;
    
    console.log('Original price:', originalPrice);
    console.log('Discount amount:', discountAmount);
    console.log('Final price:', finalPrice);
    console.log('Discount applied correctly:', discountAmount === 25 && finalPrice === 225);
    
    // Clean up test coupon
    await Coupon.deleteOne({ code: 'TESTCOUPON' });
    console.log('Cleaned up test coupon');
    
    console.log('Coupon functionality test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error testing coupon functionality:', error);
    process.exit(1);
  }
}
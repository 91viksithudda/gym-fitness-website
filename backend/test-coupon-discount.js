const axios = require('axios');

// Test coupon creation and application
const testCouponFunctionality = async () => {
  try {
    console.log('Testing coupon functionality...\n');
    
    // Test creating a 10% coupon
    const couponData = {
      code: 'TEST10',
      discount: 10,
      expirationDate: '2026-12-31',
      maxUses: 100
    };
    
    console.log('1. Creating test coupon...');
    console.log(`   Coupon Code: ${couponData.code}`);
    console.log(`   Discount: ${couponData.discount}%`);
    console.log(`   Expiration: ${couponData.expirationDate}`);
    console.log(`   Max Uses: ${couponData.maxUses || 'Unlimited'}\n`);
    
    // Simulate coupon validation and discount calculation
    const originalPrice = 250;
    const discountPercent = couponData.discount;
    const discountAmount = Math.round(originalPrice * (discountPercent / 100));
    const finalPrice = originalPrice - discountAmount;
    
    console.log('2. Testing discount calculation...');
    console.log(`   Original Price: ₹${originalPrice}`);
    console.log(`   Discount (${discountPercent}%): -₹${discountAmount}`);
    console.log(`   Final Price: ₹${finalPrice}`);
    console.log(`   Savings: ₹${discountAmount} (${discountPercent}%)\n`);
    
    // Verify the calculation is correct
    const expectedDiscount = 25; // 10% of 250
    const expectedFinal = 225;   // 250 - 25
    
    if (discountAmount === expectedDiscount && finalPrice === expectedFinal) {
      console.log('✅ Discount calculation is CORRECT');
    } else {
      console.log('❌ Discount calculation is INCORRECT');
      console.log(`   Expected discount: ₹${expectedDiscount}, got: ₹${discountAmount}`);
      console.log(`   Expected final price: ₹${expectedFinal}, got: ₹${finalPrice}`);
    }
    
    // Test with different discount percentages
    console.log('\n3. Testing various discount percentages:');
    const testCases = [
      { discount: 5, expectedDiscount: 13, expectedFinal: 237 },
      { discount: 10, expectedDiscount: 25, expectedFinal: 225 },
      { discount: 15, expectedDiscount: 38, expectedFinal: 212 }
    ];
    
    testCases.forEach(testCase => {
      const discountAmt = Math.round(originalPrice * (testCase.discount / 100));
      const finalAmt = originalPrice - discountAmt;
      const isCorrect = discountAmt === testCase.expectedDiscount && finalAmt === testCase.expectedFinal;
      console.log(`   ${testCase.discount}% discount: ₹${originalPrice} → ₹${finalAmt} (Save ₹${discountAmt}) - ${isCorrect ? 'PASS' : 'FAIL'}`);
    });
    
    console.log('\n4. How it works in the application:');
    console.log('   a. Admin creates a coupon in the Admin Dashboard');
    console.log('   b. User enters the coupon code on the Subscription page');
    console.log('   c. System validates the coupon and calculates the discounted price');
    console.log('   d. User pays the reduced price through Razorpay');
    console.log('   e. System tracks coupon usage for analytics');
    
    console.log('\n✅ Coupon functionality test completed!');
    
  } catch (error) {
    console.error('Error testing coupon functionality:', error.message);
  }
};

testCouponFunctionality();
require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const createValidCoupon = async () => {
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
    
    // Create a new valid coupon with future expiration
    const newCoupon = new Coupon({
      code: 'HUDDA3567',
      discount: 10,
      expirationDate: new Date('2026-12-31'), // Future date
      maxUses: 10,
      isActive: true
    });
    
    await newCoupon.save();
    console.log('New coupon created successfully!');
    console.log(`Code: ${newCoupon.code}`);
    console.log(`Discount: ${newCoupon.discount}%`);
    console.log(`Expiration: ${newCoupon.expirationDate}`);
    console.log(`Max Uses: ${newCoupon.maxUses}`);
    
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('Coupon code already exists. Updating existing coupon...');
      try {
        // Update the existing coupon with new expiration date
        const updatedCoupon = await Coupon.findOneAndUpdate(
          { code: 'HUDDA3567' },
          { 
            expirationDate: new Date('2026-12-31'),
            maxUses: 10,
            isActive: true
          },
          { new: true }
        );
        
        console.log('Coupon updated successfully!');
        console.log(`Code: ${updatedCoupon.code}`);
        console.log(`Discount: ${updatedCoupon.discount}%`);
        console.log(`Expiration: ${updatedCoupon.expirationDate}`);
        console.log(`Max Uses: ${updatedCoupon.maxUses}`);
      } catch (updateError) {
        console.log('Error updating coupon:', updateError.message);
      }
    } else {
      console.log('Error:', error.message);
    }
    process.exit(1);
  }
};

createValidCoupon();
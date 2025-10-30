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
    
    // Seed some coupons
    const coupons = [
      {
        code: 'WELCOME10',
        discount: 10,
        expirationDate: new Date('2026-12-31'),
        maxUses: 100
      },
      {
        code: 'FITNESS20',
        discount: 20,
        expirationDate: new Date('2026-12-31'),
        maxUses: 50
      },
      {
        code: 'NEWYEAR15',
        discount: 15,
        expirationDate: new Date('2026-02-28'),
        maxUses: null // Unlimited
      }
    ];
    
    for (const couponData of coupons) {
      const existingCoupon = await Coupon.findOne({ code: couponData.code });
      if (!existingCoupon) {
        const coupon = new Coupon(couponData);
        await coupon.save();
        console.log(`Coupon ${coupon.code} created successfully`);
      } else {
        console.log(`Coupon ${couponData.code} already exists`);
      }
    }
    
    console.log('Coupon seeding completed');
    process.exit(0);
  } catch (error) {
    console.log('Error:', error.message);
    process.exit(1);
  }
};

connectDB();
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
  seedCoupons();
})
.catch((error) => {
  console.error('Database connection error:', error);
  process.exit(1);
});

async function seedCoupons() {
  try {
    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');
    
    // Create sample coupons
    const coupons = [
      {
        code: 'VIKSIT55',
        discount: 55,
        expirationDate: new Date('2026-12-31'),
        maxUses: 100,
        isActive: true
      },
      {
        code: 'WELCOME10',
        discount: 10,
        expirationDate: new Date('2026-12-31'),
        maxUses: 100,
        isActive: true
      },
      {
        code: 'FITNESS20',
        discount: 20,
        expirationDate: new Date('2026-12-31'),
        maxUses: 50,
        isActive: true
      },
      {
        code: 'NEWYEAR15',
        discount: 15,
        expirationDate: new Date('2026-02-28'),
        maxUses: null, // Unlimited uses
        isActive: true
      }
    ];
    
    // Insert coupons
    for (const couponData of coupons) {
      const coupon = new Coupon(couponData);
      await coupon.save();
      console.log(`Created coupon: ${coupon.code}`);
    }
    
    console.log('Coupon seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
}
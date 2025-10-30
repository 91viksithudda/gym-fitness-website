const express = require('express');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new coupon (admin only)
router.post('/', auth, async (req, res) => {
  try {
    // In a real app, you would check if user is admin
    const { code, discount, expirationDate, maxUses } = req.body;
    
    // Limit discount to maximum 10%
    const limitedDiscount = Math.min(discount, 10);
    
    const coupon = new Coupon({
      code,
      discount: limitedDiscount,
      expirationDate: new Date(expirationDate),
      maxUses: maxUses ? parseInt(maxUses) : null
    });
    
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    console.error('Coupon creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all active coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find({ 
      isActive: true,
      expirationDate: { $gte: new Date() }
    });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Validate a coupon
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expirationDate: { $gte: new Date() }
    });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }
    
    // Check if coupon has reached max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: 'Coupon has reached maximum uses' });
    }
    
    res.json({
      code: coupon.code,
      discount: coupon.discount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get coupon usage statistics (admin only)
router.get('/usage/:code', auth, async (req, res) => {
  try {
    const { code } = req.params;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase()
    }).populate('usedBy.userId', 'name email');
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    // Return coupon details and usage statistics
    res.json({
      code: coupon.code,
      discount: coupon.discount,
      expirationDate: coupon.expirationDate,
      maxUses: coupon.maxUses,
      usedCount: coupon.usedCount,
      isActive: coupon.isActive,
      usedBy: coupon.usedBy.map(usage => ({
        userId: usage.userId ? usage.userId._id : null,
        name: usage.userId ? usage.userId.name : usage.name,
        email: usage.userId ? usage.userId.email : usage.email,
        usedAt: usage.usedAt
      }))
    });
  } catch (error) {
    console.error('Coupon usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all coupons with usage statistics (admin only)
router.get('/usage', auth, async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    
    const couponStats = coupons.map(coupon => ({
      code: coupon.code,
      discount: coupon.discount,
      expirationDate: coupon.expirationDate,
      maxUses: coupon.maxUses,
      usedCount: coupon.usedCount,
      isActive: coupon.isActive,
      usedByCount: coupon.usedBy.length
    }));
    
    res.json(couponStats);
  } catch (error) {
    console.error('Coupon usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
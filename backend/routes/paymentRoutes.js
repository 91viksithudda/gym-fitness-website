const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const router = express.Router();

// Create a payment intent with Razorpay
router.post('/create-payment', auth, async (req, res) => {
  try {
    const { amount, couponCode } = req.body;
    let finalAmount = amount;
    let discountAmount = 0;
    
    // Validate coupon if provided
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true,
        expirationDate: { $gte: new Date() }
      });
      
      if (!coupon) {
        return res.status(400).json({ message: 'Invalid or expired coupon' });
      }
      
      // Check if coupon has reached max uses
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ message: 'Coupon has reached maximum uses' });
      }
      
      // Apply discount
      discountAmount = Math.round(amount * (coupon.discount / 100));
      finalAmount = amount - discountAmount;
    }
    
    // Create Razorpay order
    const options = {
      amount: finalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: amount,
      discountAmount,
      finalAmount,
      currency: 'INR',
      couponCode: coupon ? coupon.code : null
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a subscription plan with Razorpay
router.post('/create-subscription', auth, async (req, res) => {
  try {
    const { planId, couponCode } = req.body;
    let finalAmount = 250; // Default monthly price
    let discountAmount = 0;
    
    // Validate coupon if provided
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true,
        expirationDate: { $gte: new Date() }
      });
      
      if (!coupon) {
        return res.status(400).json({ message: 'Invalid or expired coupon' });
      }
      
      // Check if coupon has reached max uses
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ message: 'Coupon has reached maximum uses' });
      }
      
      // Apply discount
      discountAmount = Math.round(finalAmount * (coupon.discount / 100));
      finalAmount = finalAmount - discountAmount;
    }
    
    // Create Razorpay subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId, // You'll get this from Razorpay Dashboard after creating a plan
      customer_notify: 1,
      quantity: 1,
      total_count: 12, // 12 months
      addons: [],
      notes: {
        user_id: req.userId
      }
    });
    
    res.json({
      subscriptionId: subscription.id,
      planId,
      amount: 250,
      discountAmount,
      finalAmount,
      currency: 'INR',
      couponCode: coupon ? coupon.code : null
    });
  } catch (error) {
    console.error('Razorpay Subscription Creation Error:', error);
    // Provide more detailed error message
    if (error.error && error.error.description) {
      return res.status(400).json({ message: error.error.description });
    }
    res.status(500).json({ message: 'Failed to create subscription. Please check the plan ID and try again.' });
  }
});

// Process payment after successful Razorpay payment
router.post('/process', auth, async (req, res) => {
  try {
    const { amount, finalAmount, transactionId, paymentMethod, couponCode, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    // Verify Razorpay signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');
    
    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    
    // Create payment record
    const payment = new Payment({
      userId: req.userId,
      amount,
      finalAmount,
      transactionId: razorpay_payment_id,
      paymentMethod: 'razorpay',
      couponCode,
      discountAmount: amount - finalAmount,
      status: 'completed'
    });
    
    await payment.save();
    
    // Update coupon usage if applicable
    if (couponCode) {
      // Get user details
      const user = await User.findById(req.userId);
      
      // Update coupon usage count and track which user used it
      await Coupon.updateOne(
        { code: couponCode.toUpperCase() },
        { 
          $inc: { usedCount: 1 },
          $push: {
            usedBy: {
              userId: req.userId,
              name: user.name,
              email: user.email
            }
          }
        }
      );
    }
    
    // Update user subscription
    const user = await User.findById(req.userId);
    const subscriptionEndDate = user.subscription.endDate || new Date();
    
    // If subscription is expired or inactive, set start date to now
    if (subscriptionEndDate < new Date()) {
      user.subscription.startDate = new Date();
    }
    
    // Add 30 days to the subscription
    const newEndDate = new Date(subscriptionEndDate);
    newEndDate.setDate(newEndDate.getDate() + 30);
    
    user.subscription.endDate = newEndDate;
    user.subscription.status = 'active';
    user.subscription.plan = 'premium';
    
    // Add coupon to user's used coupons
    if (couponCode) {
      user.usedCoupons.push({
        code: couponCode.toUpperCase(),
        discount: Math.round(((amount - finalAmount) / amount) * 100)
      });
    }
    
    await user.save();
    
    res.json({
      message: 'Payment successful',
      payment,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Payment Processing Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process subscription payment webhook
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['x-razorpay-signature'];
    const body = req.body.toString();
    
    // Verify webhook signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(body);
    const digest = shasum.digest('hex');
    
    if (digest !== sig) {
      return res.status(400).send('Webhook signature verification failed');
    }
    
    const event = JSON.parse(body);
    
    switch (event.event) {
      case 'subscription.charged':
        // Handle successful subscription payment
        const subscriptionId = event.payload.subscription.entity.id;
        const userId = event.payload.subscription.entity.notes.user_id;
        
        // Update user subscription
        const user = await User.findById(userId);
        if (user) {
          const newEndDate = new Date();
          newEndDate.setMonth(newEndDate.getMonth() + 1); // Add one month
          
          user.subscription.endDate = newEndDate;
          user.subscription.status = 'active';
          user.subscription.plan = 'premium';
          await user.save();
        }
        break;
        
      case 'subscription.cancelled':
        // Handle cancelled subscription
        // Update user subscription status
        break;
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
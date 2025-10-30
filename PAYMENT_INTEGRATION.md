# Payment Integration Guide

This document explains how to integrate a real payment gateway (like Razorpay) with the subscription system.

## Current Implementation

The current implementation includes:
- Subscription pricing at ₹250/month
- Coupon system with discount validation
- User subscription tracking
- Payment history tracking

## Razorpay Integration Steps

### 1. Sign up for Razorpay
1. Go to [https://razorpay.com](https://razorpay.com)
2. Create a merchant account
3. Get your API keys from the dashboard

### 2. Install Razorpay SDK
```bash
npm install razorpay
```

### 3. Update Backend Payment Routes

Update `backend/routes/paymentRoutes.js` to integrate with Razorpay:

```javascript
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a payment order
router.post('/create-order', auth, async (req, res) => {
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
      receipt: `receipt_${Date.now()}`,
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify payment
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, finalAmount, couponCode } = req.body;
    
    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
      
    if (expectedSignature !== razorpay_signature) {
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
      await Coupon.updateOne(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
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
    res.status(500).json({ message: 'Server error' });
  }
});
```

### 4. Update Frontend Payment Integration

Update `frontend/src/pages/Subscription.js` to integrate with Razorpay:

```javascript
// Add this to the imports
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const handlePayment = async () => {
  setLoading(true);
  setError('');
  setSuccess('');
  
  try {
    // Load Razorpay script
    const res = await loadRazorpayScript();
    
    if (!res) {
      setError('Failed to load payment gateway. Please try again.');
      setLoading(false);
      return;
    }
    
    // Create payment order
    const orderResponse = await paymentAPI.createOrder({
      amount: originalPrice,
      couponCode: discount > 0 ? couponCode : null
    });
    
    const { orderId, finalAmount } = orderResponse.data;
    
    // Initialize Razorpay payment
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: finalAmount * 100,
      currency: 'INR',
      name: 'GymFitness',
      description: 'Premium Subscription',
      order_id: orderId,
      handler: async function (response) {
        try {
          // Verify payment
          const verifyResponse = await paymentAPI.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: originalPrice,
            finalAmount: finalAmount,
            couponCode: discount > 0 ? couponCode : null
          });
          
          setSuccess('Subscription activated successfully!');
          
          // Reset form
          setCouponCode('');
          setDiscount(0);
          setFinalPrice(originalPrice);
          
          alert('Payment successful! Your subscription is now active.');
        } catch (error) {
          setError('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: user.name,
        email: user.email
      },
      theme: {
        color: '#3399cc'
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    setError('Payment initialization failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### 5. Environment Variables

Add these to your backend `.env` file:
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Add this to your frontend `.env` file:
```
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Testing

1. Use Razorpay's test mode for development
2. Test cards:
   - Visa: 4111 1111 1111 1111
   - Mastercard: 5555 5555 5555 4444
3. Any future expiry date
4. Any 3-digit CVV

## Security Considerations

1. Never expose secret keys in frontend code
2. Always verify payment signatures on the backend
3. Use HTTPS in production
4. Implement proper error handling
5. Log all payment activities for audit

## Alternative Payment Gateways

You can also integrate with:
- Stripe
- PayPal
- Paytm
- CCAvenue

The implementation pattern would be similar to Razorpay.
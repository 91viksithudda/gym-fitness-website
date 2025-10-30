import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { couponAPI, paymentAPI } from '../services/api';

const Subscription = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(250);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFreeOption, setShowFreeOption] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const originalPrice = 250;
  // Updated with actual plan ID from Razorpay Dashboard
  const RAZORPAY_PLAN_ID = 'plan_RYQhLBQa1Npk6N';

  // Load available coupons on component mount
  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      try {
        const response = await couponAPI.getAll();
        setAvailableCoupons(response.data);
      } catch (error) {
        console.error('Failed to fetch available coupons:', error);
      }
    };
    
    fetchAvailableCoupons();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }
    
    setValidating(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await couponAPI.validate(couponCode);
      const { discount: discountPercent } = response.data;
      
      const discountAmount = Math.round(originalPrice * (discountPercent / 100));
      setDiscount(discountAmount);
      setFinalPrice(originalPrice - discountAmount);
      setSuccess(`Coupon applied! You save ₹${discountAmount} (${discountPercent}% off). New price: ₹${originalPrice - discountAmount}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Invalid or expired coupon');
      } else if (error.response && error.response.status === 400) {
        setError('Coupon has reached maximum uses');
      } else {
        setError('Error validating coupon. Please try again.');
      }
      setDiscount(0);
      setFinalPrice(originalPrice);
    } finally {
      setValidating(false);
    }
  };

  const applyCouponFromList = (couponCode) => {
    setCouponCode(couponCode);
    // Auto-validate the coupon
    setTimeout(() => {
      validateCoupon();
    }, 100);
  };

  const handleFreeAccess = () => {
    setShowFreeOption(true);
    setSuccess('You can access our free features! Sign up to get started.');
  };

  const handleRecurringPayment = async () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create subscription with Razorpay
      const subscriptionResponse = await paymentAPI.createSubscription({
        planId: RAZORPAY_PLAN_ID,
        couponCode: discount > 0 ? couponCode : null
      });
      
      // Store subscription ID for verification
      setSubscriptionId(subscriptionResponse.data.subscriptionId);
      
      // Configure Razorpay subscription options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        subscription_id: subscriptionResponse.data.subscriptionId,
        name: 'Viksit Strong Tracker',
        description: 'Monthly Premium Subscription',
        handler: async function (response) {
          try {
            // For subscriptions, we'll rely on webhooks for confirmation
            setSuccess('Subscription created successfully! You will receive a confirmation shortly.');
            
            // Reset form
            setCouponCode('');
            setDiscount(0);
            setFinalPrice(originalPrice);
            
            // Refresh user data after a delay to allow webhook processing
            setTimeout(async () => {
              try {
                const userProfile = await paymentAPI.getUserProfile();
                updateUser(userProfile.data);
                alert('Subscription is now active!');
              } catch (error) {
                console.error('Failed to refresh user data:', error);
              }
            }, 3000);
          } catch (error) {
            setError('Subscription creation failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3399cc'
        }
      };
      
      // Open Razorpay subscription checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Subscription error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Failed to initiate subscription: ${error.response.data.message}`);
      } else {
        setError('Failed to initiate subscription. Please check the plan ID and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOneTimePayment = async () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create payment intent with Razorpay
      const paymentIntent = await paymentAPI.createPayment({
        amount: originalPrice,
        couponCode: discount > 0 ? couponCode : null
      });
      
      // Store order ID for verification
      setOrderId(paymentIntent.data.orderId);
      
      // Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Enter your Razorpay Key ID
        amount: paymentIntent.data.finalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Viksit Strong Tracker',
        description: 'Premium Subscription',
        order_id: paymentIntent.data.orderId,
        handler: async function (response) {
          // Payment successful, process with backend
          try {
            const paymentResult = await paymentAPI.processPayment({
              amount: originalPrice,
              finalAmount: paymentIntent.data.finalAmount,
              transactionId: response.razorpay_payment_id,
              paymentMethod: 'razorpay',
              couponCode: discount > 0 ? couponCode : null,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            
            setSuccess('Subscription activated successfully!');
            
            // Update user context with new subscription status
            if (paymentResult.data.user) {
              updateUser(paymentResult.data.user);
            }
            
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
          email: user.email,
        },
        theme: {
          color: '#3399cc'
        }
      };
      
      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Failed to initiate payment: ${error.response.data.message}`);
      } else {
        setError('Failed to initiate payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear coupon when component unmounts or when user changes
  useEffect(() => {
    return () => {
      setCouponCode('');
      setDiscount(0);
      setFinalPrice(originalPrice);
    };
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Choose Your Plan</h1>
        
        {!user && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <p className="text-center">
              Already have an account? <Link to="/login" className="font-bold underline">Login</Link> or <Link to="/register" className="font-bold underline">Register</Link> to access premium features.
            </p>
          </div>
        )}
        
        <div className="card mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Subscription Plans</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Free Plan */}
              <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 dark:text-white">Free Plan</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">₹0</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">per month</span>
                </div>
                <ul className="list-disc pl-5 space-y-2 mb-4 dark:text-gray-300">
                  <li>Basic exercise access</li>
                  <li>Limited workout tracking</li>
                  <li>Community support</li>
                </ul>
                <button
                  onClick={handleFreeAccess}
                  className="btn-secondary w-full py-2"
                >
                  Get Started Free
                </button>
              </div>
              
              {/* Premium Plan */}
              <div className="border-2 border-blue-500 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Premium Plan</h3>
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">POPULAR</span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">₹{finalPrice}</span>
                  <span className="ml-2 line-through text-gray-600 dark:text-gray-400">₹{originalPrice}</span>
                  {discount > 0 && (
                    <span className="ml-2 bg-yellow-400 text-yellow-900 text-sm font-bold px-2 py-1 rounded">
                      Save ₹{discount} ({Math.round((discount/originalPrice)*100)}%)
                    </span>
                  )}
                </div>
                <ul className="list-disc pl-5 space-y-2 mb-4 dark:text-gray-300">
                  <li>Unlimited access to all exercises</li>
                  <li>Advanced workout tracking</li>
                  <li>Personalized nutrition plans</li>
                  <li>Priority customer support</li>
                  <li>Exclusive premium content</li>
                  <li>Ad-free experience</li>
                </ul>
                <div className="space-y-2">
                  <button
                    onClick={handleRecurringPayment}
                    disabled={loading}
                    className="btn-success w-full py-2"
                  >
                    {loading ? 'Processing...' : `Subscribe Monthly ₹${finalPrice}`}
                  </button>
                  <button
                    onClick={handleOneTimePayment}
                    disabled={loading}
                    className="btn-primary w-full py-2 text-sm"
                  >
                    {loading ? 'Processing...' : `One-time Payment ₹${finalPrice}`}
                  </button>
                </div>
              </div>
            </div>
            
            {showFreeOption && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p className="text-center">
                  Great! You can start with our free plan. <Link to="/register" className="font-bold underline">Register</Link> to create an account and begin your fitness journey.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {user && (
          <>
            <div className="card mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Apply Coupon</h2>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={validating}
                  />
                  <button
                    onClick={validateCoupon}
                    disabled={validating}
                    className="btn-primary px-6 py-2 whitespace-nowrap"
                  >
                    {validating ? 'Validating...' : 'Apply'}
                  </button>
                </div>
                
                {/* Available Coupons Section */}
                {availableCoupons.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-3 dark:text-white">Available Coupons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {availableCoupons.map((coupon) => (
                        <div 
                          key={coupon.code}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => applyCouponFromList(coupon.code)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-blue-600 dark:text-blue-400">{coupon.code}</span>
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                              {coupon.discount}% off
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {coupon.maxUses ? `Max ${coupon.maxUses} uses` : 'Unlimited'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Try: WELCOME10 (10% off), FITNESS20 (20% off), NEWYEAR15 (15% off)
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Payment Details</h2>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="dark:text-gray-300">Original Price:</span>
                    <span className="dark:text-white">₹{originalPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="dark:text-gray-300">Discount ({Math.round((discount/originalPrice)*100)}%):</span>
                      <span className="text-green-600 dark:text-green-400">-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold dark:text-white">Total:</span>
                    <span className="font-bold text-lg dark:text-white">₹{finalPrice}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={handleRecurringPayment}
                    disabled={loading}
                    className="btn-success w-full py-3 text-lg"
                  >
                    {loading ? 'Processing Subscription...' : `Subscribe Monthly ₹${finalPrice}`}
                  </button>
                  <button
                    onClick={handleOneTimePayment}
                    disabled={loading}
                    className="btn-primary w-full py-3 text-lg"
                  >
                    {loading ? 'Processing Payment...' : `One-time Payment ₹${finalPrice}`}
                  </button>
                </div>
                
                <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Subscription;
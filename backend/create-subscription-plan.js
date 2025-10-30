const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay instance with your test credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RYPMW0aSSR77BV',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '1WFnlfsioOk475xzf7Qk4uZ5'
});

// Create a subscription plan
async function createPlan() {
  try {
    const plan = await razorpay.plans.create({
      period: 'monthly',
      interval: 1,
      item: {
        name: 'Monthly Premium Subscription',
        amount: 25000, // Amount in paise (250 INR)
        currency: 'INR',
        description: 'Viksit Strong Tracker Premium Access'
      },
      notes: {
        project: 'Viksit Strong Tracker'
      }
    });
    
    console.log('Plan created successfully:');
    console.log('Plan ID:', plan.id);
    console.log('Plan Details:', plan);
    
    // Save this plan ID to your subscription component
    console.log('\nUpdate your Subscription.js file with this Plan ID:');
    console.log(`const RAZORPAY_PLAN_ID = '${plan.id}';`);
    
    return plan.id;
  } catch (error) {
    console.error('Error creating plan:', error);
    if (error.statusCode) {
      console.error('Status Code:', error.statusCode);
    }
    if (error.error) {
      console.error('Error Details:', error.error);
    }
  }
}

// Run the function
createPlan();
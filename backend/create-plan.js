const Razorpay = require('razorpay');

// Initialize Razorpay instance with your test credentials
const razorpay = new Razorpay({
  key_id: 'rzp_test_RYPMW0aSSR77BV',
  key_secret: '1WFnlfsioOk475xzf7Qk4uZ5'
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
    
    return plan.id;
  } catch (error) {
    console.error('Error creating plan:', error);
  }
}

// Run the function
createPlan();
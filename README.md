# Gym Fitness Website

A full-stack MERN application for tracking gym workouts with timer functionality, user authentication, and progress tracking.

## Features
- User authentication (register/login)
- Exercise library with filtering by body part and category
- Workout timer with alarm sound
- Progress tracking and leaderboard
- Subscription management with coupon codes
- Responsive design with dark mode support

## Project Structure

```
gym-fitness-website/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Exercise.js
│   │   ├── Progress.js
│   │   ├── Coupon.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── exerciseRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── couponRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Header.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── hooks/
    │   │   └── useApi.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Exercises.js
    │   │   ├── Profile.js
    │   │   ├── Leaderboard.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Subscription.js
    │   │   └── Admin.js
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── alarm.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── .gitignore
├── README.md
├── DEPLOYMENT.md
├── TROUBLESHOOTING.md
├── PAYMENT_INTEGRATION.md
└── .gitignore
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### User Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

### Exercises
- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/:id` - Get exercise by ID
- `POST /api/exercises/seed` - Seed exercises (demo)

### Progress
- `POST /api/progress/complete` - Mark exercise as completed
- `GET /api/progress/:userId` - Get user progress

### Leaderboard
- `GET /api/leaderboard` - Get top users

### Coupons
- `POST /api/coupons` - Create a new coupon (admin)
- `GET /api/coupons` - Get all active coupons
- `POST /api/coupons/validate` - Validate a coupon

### Payments
- `POST /api/payments/create-order` - Create a payment order
- `POST /api/payments/verify-payment` - Verify payment
- `GET /api/payments/history` - Get user's payment history

## Subscription System

The application now includes a subscription system with the following features:

1. **Pricing**: ₹250 per month for premium access
2. **Coupon System**: Users can apply coupons for discounts
3. **Payment Integration**: Ready for integration with Razorpay or other payment gateways
4. **Subscription Management**: Track user subscriptions and expiration dates

### Coupon Functionality
- Users can apply coupon codes to get discounts
- Default coupons included:
  - WELCOME10: 10% off
  - FITNESS20: 20% off
  - NEWYEAR15: 15% off
- Admins can create new coupons through the admin panel

### Payment Integration
The system is ready for integration with payment gateways like:
- Razorpay
- Stripe
- PayPal
- Paytm

See [PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md) for detailed integration instructions.

## Connecting Frontend to Backend

The frontend uses Axios to communicate with the backend API. Configure the API base URL in your frontend code:

```javascript
// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api'
});

export default API;
```

## Deployment

### Backend (Render.com)
1. Create an account at [Render](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the following environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   PORT=5001
   ```
5. Set build command: `npm install`
6. Set start command: `npm start`

### Frontend (Vercel)
1. Create an account at [Vercel](https://vercel.com/)
2. Create a new project
3. Connect your GitHub repository
4. Set the root directory to `frontend`
5. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
6. Deploy!

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
NODE_ENV=production
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Troubleshooting

### Common Issues

1. **Bad Gateway (502) Error**:
   - Check that your MongoDB connection string is correct
   - Ensure all environment variables are set properly
   - Verify that your backend is running and accessible
   - Check Render logs for specific error messages

2. **CORS Errors**:
   - Make sure the frontend URL is added to the CORS configuration in server.js
   - Check that the REACT_APP_API_URL matches your backend deployment URL

3. **Authentication Issues**:
   - Verify that JWT_SECRET is the same in both frontend and backend
   - Check that tokens are being properly sent with requests

## Future Enhancements
- Admin panel to add new exercises
- Daily streak rewards
- Social features (friends, challenges)
- Mobile app version
- Advanced analytics and reporting
- Integration with wearable devices
- Personalized workout recommendations

## License
This project is licensed under the MIT License.
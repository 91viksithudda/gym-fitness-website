# Free Worldwide Deployment Guide

This guide will help you deploy your Gym Fitness website worldwide using free hosting services.

## Prerequisites

1. GitHub account (already set up)
2. MongoDB Atlas account (free tier)
3. Render account (free tier)
4. Vercel account (free tier)

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 Sandbox cluster
3. In the cluster settings:
   - Add your IP address to the whitelist (or allow access from anywhere 0.0.0.0/0)
   - Create a database user with a strong password
4. Get your connection string:
   - Click "Connect" > "Connect your application"
   - Copy the connection string and replace placeholders

## Step 2: Backend Deployment on Render

1. Go to [Render](https://render.com/) and sign up
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Select your gym-fitness-website repository
5. Configure settings:
   - Name: gym-fitness-backend
   - Region: Choose closest to your users
   - Branch: main
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm run dev`
   - Plan Type: Free

6. Add environment variables:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=gymfitnesssecretkey
   RAZORPAY_KEY_ID=rzp_test_RYPMW0aSSR77BV
   RAZORPAY_KEY_SECRET=1WFnlfsioOk475xzf7Qk4uZ5
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
   ```

7. Deploy and note the URL (e.g., https://gym-fitness-backend-abc123.onrender.com)

## Step 3: Frontend Configuration

Update your frontend [.env](file:///c%3A/Users/viksi/OneDrive/Documents/ai%20produt/gym-fitness-website/frontend/.env) file with the Render backend URL:

```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_RYPMW0aSSR77BV
```

## Step 4: Frontend Deployment on Vercel

1. Go to [Vercel](https://vercel.com/) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Select your gym-fitness-website repository
5. Configure project:
   - Project Name: gym-fitness-frontend
   - Framework: Create React App
   - Root Directory: frontend
6. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
   REACT_APP_RAZORPAY_KEY_ID=rzp_test_RYPMW0aSSR77BV
   ```

## Step 5: Final Steps

1. After deployment completes, visit your Vercel frontend URL
2. Test all functionality:
   - User registration and login
   - Exercise viewing
   - Progress tracking
   - Coupon system
   - Payment/subscription system

## Important Notes

1. Render free tier has limitations:
   - Web services spin down after 15 minutes of inactivity
   - First request after spin-down may be slow

2. MongoDB Atlas free tier:
   - Limited to 512MB storage
   - Shared cluster resources

3. Vercel free tier:
   - Automatic HTTPS
   - Global CDN
   - Serverless functions have execution time limits

## Troubleshooting

1. If you see "Application Error" on Render:
   - Check logs in Render dashboard
   - Verify MongoDB connection string
   - Ensure all environment variables are set

2. If frontend can't connect to backend:
   - Double-check REACT_APP_API_URL in Vercel environment variables
   - Ensure CORS is properly configured in backend

3. If payment features don't work:
   - Verify Razorpay test keys are correct
   - Check webhook configuration in Razorpay dashboard
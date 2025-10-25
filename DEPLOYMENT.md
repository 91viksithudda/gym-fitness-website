# Deployment Guide

## Backend Deployment (Render.com)

### 1. Prepare Your Application

Before deploying, make sure you have:
1. A MongoDB Atlas account with a cluster set up
2. Whitelisted IP addresses in MongoDB Atlas (0.0.0.0/0 for testing)
3. A JWT secret key

### 2. Environment Variables

Set these environment variables in your Render dashboard:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 3. Render Configuration

Render will automatically use these settings:
- Build command: `npm install`
- Start command: `npm start`
- Runtime: Node.js

### 4. Troubleshooting

If you see a "Bad Gateway" error:

1. Check the logs in Render dashboard
2. Verify all environment variables are set correctly
3. Ensure your MongoDB connection string is correct
4. Check that your MongoDB Atlas cluster is running
5. Make sure your IP is whitelisted in MongoDB Atlas

## Frontend Deployment (Vercel)

### 1. Environment Variables

Set this environment variable in your Vercel dashboard:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

### 2. Build Settings

Vercel will automatically detect and use:
- Build command: `npm run build`
- Output directory: `build`
- Development command: `npm start`

### 3. Troubleshooting

If the frontend doesn't connect to the backend:

1. Verify REACT_APP_API_URL matches your Render backend URL
2. Check that CORS is properly configured in your backend
3. Ensure both applications are deployed successfully

## Common Issues and Solutions

### Bad Gateway (502) Error

This typically means the backend is not responding. Check:

1. **MongoDB Connection**: 
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas cluster status
   - Confirm IP whitelisting

2. **Environment Variables**:
   - Ensure all required variables are set
   - Check for typos in variable names

3. **Application Startup**:
   - Check Render logs for startup errors
   - Verify PORT is set correctly (5001)

4. **Code Issues**:
   - Ensure all dependencies are in package.json
   - Check for syntax errors in server.js

### CORS Errors

If you see CORS errors in the browser:

1. Verify FRONTEND_URL environment variable matches your Vercel domain
2. Check that the CORS configuration in server.js includes your frontend URL
3. Restart your Render service after making changes

### Authentication Issues

If login/registration isn't working:

1. Ensure JWT_SECRET is the same in both frontend and backend
2. Check that the token is being properly sent with requests
3. Verify the authentication middleware is working correctly

## Testing Your Deployment

After deployment:

1. Visit your backend health check: `https://your-backend-url.onrender.com/health`
2. Test API endpoints using Postman or curl
3. Visit your frontend and try to register/login
4. Check that data is being saved to MongoDB

## Updating Your Application

To deploy updates:

1. Push changes to your GitHub repository
2. Render and Vercel will automatically detect changes and redeploy
3. Monitor the build logs for any errors
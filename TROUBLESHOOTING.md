# Troubleshooting Guide

## Bad Gateway (502) Error

The Bad Gateway error typically indicates that the backend service is not responding properly. Here's how to troubleshoot:

### 1. Check Render Logs

1. Go to your Render dashboard
2. Navigate to your web service
3. Click on "Logs" tab
4. Look for error messages during startup

Common log errors and solutions:

#### MongoDB Connection Errors
```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster
```
**Solutions:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas cluster status
- Ensure IP is whitelisted (0.0.0.0/0 for testing)
- Check that MongoDB user credentials are correct

#### Missing Environment Variables
```
Error: Missing environment variable JWT_SECRET
```
**Solutions:**
- Add all required environment variables in Render dashboard
- Check for typos in variable names

#### Port Issues
```
Error: listen EADDRINUSE: address already in use :::5001
```
**Solutions:**
- Ensure PORT is set to 5001 in environment variables
- Check that no other service is using the port

### 2. Verify Environment Variables

In your Render dashboard:
1. Go to your web service
2. Click "Environment" tab
3. Verify these variables are set:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   PORT=5001
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

### 3. Test Locally

Before redeploying, test locally:

1. Set environment variables in backend/.env:
   ```
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

2. Run backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Test API endpoints:
   ```bash
   curl http://localhost:5001/health
   curl http://localhost:5001/
   ```

### 4. Check MongoDB Atlas

1. Log into MongoDB Atlas
2. Check cluster status (should be "Idle")
3. Verify database user credentials
4. Check IP whitelist settings
5. Test connection string with MongoDB Compass

### 5. CORS Issues

If you see CORS errors in browser console:

1. Verify FRONTEND_URL environment variable matches your Vercel domain
2. Check server.js CORS configuration:
   ```javascript
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? [process.env.FRONTEND_URL]  
       : ['http://localhost:3000', 'http://localhost:3001'],
     credentials: true
   }));
   ```

## Frontend Issues

### 1. API Connection Failures

Check browser console for errors:
- Verify REACT_APP_API_URL in frontend/.env matches your Render backend URL
- Ensure backend is running and accessible
- Check that CORS is properly configured

### 2. Build Errors

If Vercel build fails:

1. Check build logs for specific errors
2. Ensure all dependencies are in package.json
3. Verify react-scripts is in dependencies (not devDependencies)

## Database Issues

### 1. Data Not Saving

1. Check MongoDB Atlas connection logs
2. Verify MONGODB_URI includes correct database name
3. Check that database user has read/write permissions

### 2. Authentication Issues

1. Ensure JWT_SECRET is identical in both frontend and backend
2. Check that tokens are being properly sent with requests
3. Verify user registration is working correctly

## Deployment Checklist

Before redeploying:

### Backend (Render)
- [ ] All environment variables set correctly
- [ ] MongoDB Atlas cluster is running
- [ ] IP addresses whitelisted in MongoDB Atlas
- [ ] PORT set to 5001
- [ ] No syntax errors in server.js
- [ ] All dependencies in package.json

### Frontend (Vercel)
- [ ] REACT_APP_API_URL points to correct backend URL
- [ ] react-scripts in dependencies (not devDependencies)
- [ ] No build errors in local development

## Testing Your Fix

After making changes:

1. Test backend health endpoint:
   ```
   curl https://your-backend-url.onrender.com/health
   ```

2. Test API endpoints:
   ```
   curl https://your-backend-url.onrender.com/api/exercises
   ```

3. Deploy frontend and test registration/login

4. Check that data is being saved to MongoDB

## Common Solutions

### Solution 1: Redeploy with Correct Environment Variables

1. In Render dashboard, go to your service
2. Click "Manual Deploy" → "Clear build cache & deploy"
3. Verify all environment variables are set correctly

### Solution 2: Fix MongoDB Connection

1. Update MONGODB_URI with correct connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```
2. Ensure IP whitelist includes 0.0.0.0/0 (for testing)

### Solution 3: Check Port Configuration

1. Ensure PORT environment variable is set to 5001
2. Verify server.js uses process.env.PORT:
   ```javascript
   const PORT = process.env.PORT || 5001;
   ```

## Getting Help

If issues persist:

1. Check Render status page for service outages
2. Review MongoDB Atlas status
3. Check application logs for specific error messages
4. Verify all deployment steps were followed correctly
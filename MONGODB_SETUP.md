# MongoDB Setup Instructions

## Option 1: Fix MongoDB Atlas Connection (Recommended for production)

### Add Your IP to MongoDB Atlas Whitelist

1. Go to [MongoDB Atlas Console](https://cloud.mongodb.com/)
2. Log in with your credentials
3. Select your cluster
4. Go to the "Network Access" section in the left sidebar
5. Click "Add IP Address"
6. Either:
   - Click "Add Current IP Address" to automatically add your current IP
   - Or enter your IP address manually: `117.210.216.234`
   - Or for development only, enter `0.0.0.0/0` to allow access from anywhere (NOT recommended for production)
7. Click "Confirm"

### Update Connection String (if needed)

Make sure your `.env` file has the correct connection string:

```
MONGODB_URI=mongodb+srv://viksithooda91_db_user:Mongodb7.77@cluster0.tkpodlz.mongodb.net/gymfitness?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=true&tlsAllowInvalidHostnames=true&connectTimeoutMS=30000&socketTimeoutMS=30000&serverSelectionTimeoutMS=30000
```

## Option 2: Install MongoDB Locally (For Development)

### Download and Install MongoDB

1. Visit [MongoDB Community Server Download](https://www.mongodb.com/try/download/community)
2. Select:
   - Version: Latest stable release
   - Platform: Windows x64
   - Package: msi
3. Download and run the installer
4. Choose "Complete" setup type
5. Select "Run service as Network Service user" (recommended)
6. Complete the installation

### Start MongoDB Service

1. Open Command Prompt as Administrator
2. Run: `net start MongoDB`
3. To stop the service later: `net stop MongoDB`

### Update Your .env File for Local MongoDB

Change your MONGODB_URI in the `.env` file to:

```
MONGODB_URI=mongodb://localhost:27017/gymfitness
```

### Test Local MongoDB Connection

You can test if MongoDB is running locally by:

1. Opening a new Command Prompt
2. Running: `mongo`
3. If it connects, you should see a MongoDB shell prompt

## Troubleshooting

### If You Still Get SSL Errors

1. Make sure your connection string includes these options:
   ```
   ssl=true&tlsAllowInvalidCertificates=true&tlsAllowInvalidHostnames=true
   ```

2. Check your firewall settings to ensure port 27017 is not blocked

3. Try adding these additional options to your connection string:
   ```
   connectTimeoutMS=30000&socketTimeoutMS=30000&serverSelectionTimeoutMS=30000
   ```

### If You Get "IP Not Whitelisted" Errors

1. Double-check that you've added your current IP address to the MongoDB Atlas whitelist
2. Your IP address may change if you're on a dynamic IP network
3. Consider using a static IP or temporarily allowing access from anywhere (0.0.0.0/0) for development

### If You Get Authentication Errors

1. Verify your username and password are correct
2. Make sure the user has appropriate permissions for the database
3. Check that the database name in the connection string is correct

## Testing the Connection

After making changes, test your connection by running:

```bash
cd gym-fitness-website/backend
node test-db.js
```

You should see "Connected to MongoDB Atlas successfully!" or "Connected to MongoDB successfully!" depending on your setup.
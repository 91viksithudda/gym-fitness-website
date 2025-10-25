# Gym Fitness Website - MERN Stack

A full-stack fitness application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to track workouts, earn rewards, and compete on leaderboards.

## Features

### Frontend (React + Tailwind CSS)
- Home Page with attractive hero section
- Exercise Dashboard showing exercises with details
- Task system with coin rewards for completed exercises
- User Profile Page with stats and progress tracking
- Leaderboard showing top users
- Responsive design for mobile and desktop
- Dark/Light mode toggle

### Backend (Node.js + Express + MongoDB)
- User Authentication (Registration, Login, JWT)
- Exercise Management API
- Progress Tracking API
- Leaderboard API

## Project Structure

```
gym-fitness-website/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Exercise.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── exerciseRoutes.js
│   │   ├── progressRoutes.js
│   │   └── leaderboardRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Header.js
    │   │   ├── DashboardExample.js
    │   │   ├── UserProfileExample.js
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
    │   │   └── Register.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── .gitignore
├── README.md
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
   PORT=5000
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

## Connecting Frontend to Backend

The frontend uses Axios to communicate with the backend API. Configure the API base URL in your frontend code:

```javascript
// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export default API;
```

### Custom Hooks

The application also provides custom React hooks for easier API integration:

- `useExercises` - Fetch all exercises
- `useUserProgress` - Fetch user progress data
- `useLeaderboard` - Fetch leaderboard data
- `useUserProfile` - Fetch user profile data

Example usage:

```javascript
import { useExercises } from '../hooks/useApi';

const MyComponent = () => {
  const { exercises, loading, error } = useExercises();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {exercises.map(exercise => (
        <div key={exercise._id}>{exercise.name}</div>
      ))}
    </div>
  );
};
```

### Example Components

We've also included example components that demonstrate best practices:

- `DashboardExample.js` - Shows how to use custom hooks in a real component
- `UserProfileExample.js` - Demonstrates authentication context usage
- `ProtectedRoute.js` - Shows how to implement route protection
- API service integration in all page components

### Authentication Context

The application includes a complete authentication system using React Context:

- `AuthContext.js` - Provides global state management for user authentication
- Login, registration, and logout functionality
- Token persistence in localStorage
- Protected routes pattern

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

### Environment Variables

#### Backend (.env)
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
NODE_ENV=production
```

#### Frontend (.env)
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

## License
This project is licensed under the MIT License.
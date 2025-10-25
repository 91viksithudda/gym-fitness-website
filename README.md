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

### Backend
Deploy on platforms like:
- Heroku
- AWS EC2
- DigitalOcean App Platform

### Frontend
Deploy on platforms like:
- Netlify
- Vercel
- GitHub Pages

## Future Enhancements
- Admin panel to add new exercises
- Daily streak rewards
- Social features (friends, challenges)
- Mobile app version
- Advanced analytics and reporting

## License
This project is licensed under the MIT License.
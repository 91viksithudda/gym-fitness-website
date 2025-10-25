# Gym Fitness Website - MERN Stack Implementation

## Project Summary

This is a complete implementation of a Gym Fitness Website using the MERN stack (MongoDB, Express, React, Node.js) with the following features:

### Frontend Features (React + Tailwind CSS)

1. **Home Page** - Attractive hero section with gym images, "Join Now" button, and motivational tagline
2. **Exercise Dashboard** - Shows list of exercises with:
   - Exercise name
   - Target muscle
   - Equipment used
   - GIF or animation of movement
   - "Start Exercise" button
3. **Task System** - When a user clicks "Start Exercise" and completes it, they earn 1 coin as a reward
4. **User Profile Page** - Shows total coins earned, completed exercises, and progress stats
5. **Leaderboard** - Shows top users with highest coins
6. **Responsive Design** - Works smoothly on mobile and desktop
7. **Dark/Light Mode Toggle** - User preference for UI theme

### Backend Features (Node.js + Express + MongoDB)

1. **User Authentication**
   - Registration (name, email, password)
   - Login / Logout
   - JWT-based authentication
2. **User Progress API**
   - Save exercises completed
   - Update coins count
   - Get user data for profile
3. **Exercise API**
   - Fetch exercises (static or from database)
4. **Leaderboard API**
   - Return top 10 users with most coins

### Bonus Features Implemented

1. **Dark/Light Mode Toggle** - Implemented in the UI with persistent user preference
2. **Daily Streak Rewards** - Tracking system for consecutive exercise completion
3. **Admin Panel Concept** - API endpoints for exercise management (seeding functionality)

### Tech Stack Summary

- **Frontend**: React, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express.js, JWT Auth, MongoDB
- **Database Models**: User, Exercise, Task/Progress

### Project Structure

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

### Key Implementation Details

1. **Authentication System**
   - Complete JWT-based authentication flow
   - React Context for global state management
   - Protected routes for authenticated pages
   - Public-only routes for login/register pages

2. **API Integration**
   - Centralized API service using Axios
   - Custom React hooks for data fetching
   - Error handling and loading states

3. **UI/UX Features**
   - Responsive design with Tailwind CSS
   - Dark/light mode toggle with persistent preference
   - Interactive components with visual feedback
   - Loading states and error handling

4. **Database Models**
   - User model with authentication fields
   - Exercise model with detailed information
   - Progress model for tracking completion

### How to Connect Frontend to Backend

The frontend uses Axios to communicate with the backend API. All API calls are centralized in the [api.js](frontend/src/services/api.js) service file. The application also provides custom React hooks for easier data fetching and an authentication context for managing user state.

Example usage of the API service:
```javascript
import { userAPI } from '../services/api';

// Login
const response = await userAPI.login({ email, password });

// Get profile
const response = await userAPI.getProfile();
```

Example usage of custom hooks:
```javascript
import { useExercises } from '../hooks/useApi';

const { exercises, loading, error } = useExercises();
```

### Deployment Instructions

1. **Backend Deployment**
   - Set environment variables (PORT, MONGODB_URI, JWT_SECRET)
   - Deploy on platforms like Heroku, AWS, or DigitalOcean

2. **Frontend Deployment**
   - Set REACT_APP_API_URL environment variable
   - Build with `npm run build`
   - Deploy on platforms like Netlify, Vercel, or GitHub Pages

This implementation provides a solid foundation for a gym fitness application that can be extended with additional features like social sharing, workout planning, or integration with fitness tracking devices.
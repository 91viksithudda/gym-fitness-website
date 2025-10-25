import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userAPI } from '../services/api';

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTION_TYPES = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  SET_USER: 'SET_USER'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTION_TYPES.LOGIN_START:
    case AUTH_ACTION_TYPES.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
    case AUTH_ACTION_TYPES.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null
      };
    case AUTH_ACTION_TYPES.LOGIN_FAILURE:
    case AUTH_ACTION_TYPES.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case AUTH_ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      };
    case AUTH_ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await userAPI.getProfile();
          dispatch({ type: AUTH_ACTION_TYPES.SET_USER, payload: response.data });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: AUTH_ACTION_TYPES.SET_USER, payload: null });
        }
      } else {
        dispatch({ type: AUTH_ACTION_TYPES.SET_USER, payload: null });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTION_TYPES.LOGIN_START });
      
      const response = await userAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      dispatch({ type: AUTH_ACTION_TYPES.LOGIN_SUCCESS, payload: response.data });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: AUTH_ACTION_TYPES.LOGIN_FAILURE, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTION_TYPES.REGISTER_START });
      
      const response = await userAPI.register(userData);
      localStorage.setItem('token', response.data.token);
      dispatch({ type: AUTH_ACTION_TYPES.REGISTER_SUCCESS, payload: response.data });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: AUTH_ACTION_TYPES.REGISTER_FAILURE, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
  };

  // Value for context provider
  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
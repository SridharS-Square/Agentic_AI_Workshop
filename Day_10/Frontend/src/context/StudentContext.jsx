// src/context/StudentContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const StudentContext = createContext();

// Initial state
const initialState = {
  profile: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  preferences: {
    location: '',
    job_type: '',
    company_size: '',
    salary_range: '',
  },
  matchedJobs: [],
  applications: [],
};

// Reducer
function studentReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PROFILE':
      return { 
        ...state, 
        profile: action.payload, 
        isAuthenticated: true, 
        loading: false,
        error: null 
      };
    
    case 'UPDATE_PREFERENCES':
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload } 
      };
    
    case 'SET_MATCHED_JOBS':
      return { ...state, matchedJobs: action.payload };
    
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    
    case 'ADD_APPLICATION':
      return { 
        ...state, 
        applications: [action.payload, ...state.applications] 
      };
    
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id ? { ...app, ...action.payload } : app
        ),
      };
    
    case 'LOGOUT':
      return { ...initialState };
    
    default:
      return state;
  }
}

// Provider component
export function StudentProvider({ children }) {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  // Load saved data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile');
    const savedPreferences = localStorage.getItem('studentPreferences');
    
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        dispatch({ type: 'SET_PROFILE', payload: profile });
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
    
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      } catch (error) {
        console.error('Error loading saved preferences:', error);
      }
    }
  }, []);

  // Save to localStorage when profile or preferences change
  useEffect(() => {
    if (state.profile) {
      localStorage.setItem('studentProfile', JSON.stringify(state.profile));
    }
  }, [state.profile]);

  useEffect(() => {
    localStorage.setItem('studentPreferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  const value = {
    state,
    dispatch,
    // Helper functions
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setProfile: (profile) => dispatch({ type: 'SET_PROFILE', payload: profile }),
    updatePreferences: (preferences) => dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences }),
    setMatchedJobs: (jobs) => dispatch({ type: 'SET_MATCHED_JOBS', payload: jobs }),
    setApplications: (applications) => dispatch({ type: 'SET_APPLICATIONS', payload: applications }),
    addApplication: (application) => dispatch({ type: 'ADD_APPLICATION', payload: application }),
    updateApplication: (application) => dispatch({ type: 'UPDATE_APPLICATION', payload: application }),
    logout: () => {
      localStorage.removeItem('studentProfile');
      localStorage.removeItem('studentPreferences');
      dispatch({ type: 'LOGOUT' });
    },
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

// Hook to use the context
export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}

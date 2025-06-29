import React, { createContext, useContext, useReducer } from 'react';

const StudentContext = createContext();

// Define the initial state of our application
const initialState = {
  profile: null,
  loading: false,
  error: null,
  matchedJobs: [],
  applications: [], // Placeholder for future use
};

// A reducer function to handle state updates in a predictable way
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
        loading: false,
        error: null 
      };
    
    case 'SET_MATCHED_JOBS':
      return { ...state, matchedJobs: action.payload, loading: false };
    
    case 'CLEAR_STATE':
        return { ...initialState };

    default:
      return state;
  }
}

// The provider component that will wrap our application
export function StudentProvider({ children }) {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  // Helper functions to dispatch actions, making it easier to use in components
  const value = {
    state,
    dispatch,
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setProfile: (profile) => dispatch({ type: 'SET_PROFILE', payload: profile }),
    setMatchedJobs: (jobs) => dispatch({ type: 'SET_MATCHED_JOBS', payload: jobs }),
    clearState: () => dispatch({ type: 'CLEAR_STATE' })
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

// A custom hook to easily access the context from any component
export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}

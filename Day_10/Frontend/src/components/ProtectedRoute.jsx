import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // If the authentication status is still being determined, show a loading message.
  if (loading) {
    return (
      <div className="text-center p-20">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  // If the user is authenticated, render the requested page.
  // Otherwise, redirect them to the login page.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
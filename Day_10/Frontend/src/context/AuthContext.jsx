import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // The axios instance
// import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [matchedJobs, setMatchedJobs] = useState([]); // ADDED: Global state for jobs

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userResponse = await api.get('/users/me'); 
          setUser(userResponse.data);
          const profileResponse = await api.get('/profile/');
          setProfile(profileResponse.data);
        } catch (error) {
          console.error("Session expired or invalid token", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const response = await api.post('/auth/jwt/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const { access_token } = response.data;
    localStorage.setItem('authToken', access_token);
    setToken(access_token);
  };

  const signup = async (email, password) => {
    await api.post('/auth/register', { email, password });
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setProfile(null);
    setToken(null);
    setMatchedJobs([]); // Clear jobs on logout
  };
  
  const refetchProfile = async () => {
      try {
          const profileResponse = await api.get('/profile/');
          setProfile(profileResponse.data);
      } catch (error) {
          console.error("Could not refetch profile", error);
      }
  }

  const value = {
    user,
    profile,
    refetchProfile,
    isAuthenticated: !!token,
    loading,
    login,
    signup,
    logout,
    matchedJobs, // EXPOSED
    setMatchedJobs, // EXPOSED
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
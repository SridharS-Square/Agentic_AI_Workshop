import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import JobsPage from './pages/JobsPage';
import ApplicationsPage from './pages/ApplicationPage';
import MatchExplainerPage from './pages/MatchExplainerPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';

// Context
import { StudentProvider } from './context/StudentContext';

function App() {
  return (
    <StudentProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfileSetup />} />
              <Route path="/jobs" element={<JobsPage />} />
              {/* <Route path="/jobs/:jobId" element={<JobDetailsPage />} /> */}
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/match-explainer/:jobId" element={<MatchExplainerPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </StudentProvider>
  );
}

export default App;
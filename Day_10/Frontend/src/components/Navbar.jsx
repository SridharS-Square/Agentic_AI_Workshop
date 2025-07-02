import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, UserCircle, LogOut, Wrench } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to landing page after logout
  };

  const navItems = [
    { path: '/profile', label: 'My Profile' },
    { path: '/jobs', label: 'Find Jobs' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/applications', label: 'My Tracked Jobs'},
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AI Job Agent</span>
          </Link>

          {/* Centered Navigation Links for Authenticated Users */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                   <UserCircle className="h-6 w-6 text-gray-500" />
                   <span className="text-sm font-medium text-gray-700 hidden sm:block">
                     {user?.email}
                   </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
               <div className="flex items-center gap-4">
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

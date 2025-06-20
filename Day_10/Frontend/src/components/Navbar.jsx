import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { 
  BriefcaseIcon, 
  UserCircleIcon, 
  ChartBarIcon,
  CogIcon,
  LogOutIcon,
  BellIcon,
  BriefcaseMedical
} from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useStudent();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/jobs', label: 'Jobs', icon: BriefcaseIcon },
    { path: '/applications', label: 'Applications', icon: BriefcaseMedical },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
    { path: '/settings', label: 'Settings', icon: CogIcon },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BriefcaseIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Smart Job Alert</span>
          </Link>

          {/* Navigation Links */}
          {state.isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {state.isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                  <BellIcon className="h-6 w-6" />
                  {/* Notification badge */}
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={state.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(state.profile?.name || 'User')}&background=3b82f6&color=fff`}
                    alt="Profile"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {state.profile?.name || 'User'}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/profile"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {state.isAuthenticated && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
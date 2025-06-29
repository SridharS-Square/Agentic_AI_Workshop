import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, UserCircle, Search } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, matchedJobs } = useAuth();
  console.log('user: ', user);

  if (!profile) {
    return (
      <div className="text-center p-20">
        <p className="text-lg font-semibold text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {profile.name}!
        </h1>
        <p className="text-lg text-gray-600">This is your command center for your AI-powered job search.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Briefcase className="w-7 h-7 text-blue-600" />
            </div>
            <div>
                <div className="text-gray-500 text-sm">Active Matches</div>
                <div className="text-2xl font-bold text-gray-900">{matchedJobs.length}</div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
                <UserCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
                <div className="text-gray-500 text-sm">Profile Status</div>
                <div className="text-2xl font-bold text-gray-900">{profile.resume_text ? "Complete" : "Incomplete"}</div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <Search className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
                <div className="text-gray-500 text-sm">Last Searched</div>
                <div className="text-2xl font-bold text-gray-900">N/A</div>
            </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-6">What would you like to do next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/profile" className="p-6 text-left border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all">
                  <div className="font-semibold text-lg text-gray-800">Update My Profile</div>
                  <p className="text-sm text-gray-600 mt-1">Keep your skills and resume fresh to improve match accuracy.</p>
              </Link>
              <Link to="/jobs" className="p-6 text-left border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all">
                  <div className="font-semibold text-lg text-gray-800">Find Jobs</div>
                  <p className="text-sm text-gray-600 mt-1">Start a new real-time search for jobs that match your profile.</p>
              </Link>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;

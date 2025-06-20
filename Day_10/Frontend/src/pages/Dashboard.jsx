// src/pages/Dashboard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useStudent } from '../context/StudentContext'; // Import the hook
import { BarChart, Briefcase, FileText } from 'lucide-react';

const Dashboard = () => {
  // Get live data from the global context
  const { state } = useStudent();
  const { profile, matchedJobs, applications } = state;

  // Derive stats dynamically from the state
  const stats = [
    { label: 'Top Job Matches', value: matchedJobs.length, icon: <Briefcase className="w-6 h-6 text-blue-600" />, color: 'bg-blue-100' },
    { label: 'Applications Sent', value: applications.length, icon: <FileText className="w-6 h-6 text-green-600" />, color: 'bg-green-100' },
    { label: 'Profile Score', value: '85%', icon: <BarChart className="w-6 h-6 text-yellow-600" />, color: 'bg-yellow-100' } // Placeholder score
  ];

  // Get the first 3 matched jobs to display as recent
  const recentJobs = matchedJobs.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.name || 'Student'}!
        </h1>
        <p className="text-gray-600">Here's your job search overview. Let's find your next opportunity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className={`p-3 rounded-full mr-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Matches Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Top AI-Powered Matches</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All Matches →
            </Link>
          </div>
          <div className="space-y-4">
            {recentJobs.length > 0 ? (
              recentJobs.map(job => (
                <div key={job.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">{job.match}</div>
                    <Link 
                      to={`/match-explainer/${job.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Why am I a match?
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Your job matches will appear here once you've completed your profile.</p>
                <Link to="/profile" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Complete Your Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Column */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/profile" className="block w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Update Profile</div>
              <div className="text-sm text-gray-600">Improve your match accuracy</div>
            </Link>
            <Link to="/jobs" className="block w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Browse All Matches</div>
              <div className="text-sm text-gray-600">See every opportunity</div>
            </Link>
            <Link to="/applications" className="block w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Track Applications</div>
              <div className="text-sm text-gray-600">Check your application statuses</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
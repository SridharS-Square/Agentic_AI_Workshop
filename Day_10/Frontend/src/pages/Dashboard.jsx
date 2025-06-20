import React from 'react';
import { Link } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const Dashboard = () => {
  const { student } = useStudent();
  
  const stats = [
    { label: 'Job Matches', value: '12', color: 'bg-blue-100 text-blue-800' },
    { label: 'Applications', value: '5', color: 'bg-green-100 text-green-800' },
    { label: 'Interviews', value: '2', color: 'bg-purple-100 text-purple-800' },
    { label: 'Profile Score', value: '85%', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const recentJobs = [
    { id: 1, title: 'Frontend Developer Intern', company: 'TechCorp', match: '95%' },
    { id: 2, title: 'UI/UX Designer', company: 'StartupXYZ', match: '88%' },
    { id: 3, title: 'Full Stack Developer', company: 'WebSolutions', match: '82%' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {student?.name || 'Student'}!
        </h1>
        <p className="text-gray-600">Here's your job search overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${stat.color} mb-2`}>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Matches */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Job Matches</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentJobs.map(job => (
              <div key={job.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-medium">{job.match}</div>
                  <Link 
                    to={`/jobs/${job.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              to="/profile" 
              className="block w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Complete Profile</div>
              <div className="text-sm text-gray-600">Improve your match accuracy</div>
            </Link>
            <Link 
              to="/jobs" 
              className="block w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Browse Jobs</div>
              <div className="text-sm text-gray-600">Find new opportunities</div>
            </Link>
            <Link 
              to="/applications" 
              className="block w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Track Applications</div>
              <div className="text-sm text-gray-600">Check application status</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
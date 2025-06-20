// pages/ApplicationsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ApplicationsPage = () => {
  const [filter, setFilter] = useState('all');
  
  const applications = [
    {
      id: 1,
      jobTitle: 'Frontend Developer Intern',
      company: 'TechCorp',
      appliedDate: '2024-06-15',
      status: 'Interview Scheduled',
      statusColor: 'bg-blue-100 text-blue-800',
      salary: '$25/hour',
      location: 'San Francisco, CA',
      nextStep: 'Technical Interview on June 25th',
      notes: 'Completed first round successfully'
    },
    {
      id: 2,
      jobTitle: 'UI/UX Designer',
      company: 'StartupXYZ',
      appliedDate: '2024-06-12',
      status: 'Under Review',
      statusColor: 'bg-yellow-100 text-yellow-800',
      salary: '$60,000 - $80,000',
      location: 'Remote',
      nextStep: 'Waiting for response',
      notes: 'Portfolio submitted'
    },
    {
      id: 3,
      jobTitle: 'Full Stack Developer',
      company: 'WebSolutions',
      appliedDate: '2024-06-10',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-800',
      salary: '$50/hour',
      location: 'New York, NY',
      nextStep: 'Application closed',
      notes: 'Good experience for future applications'
    },
    {
      id: 4,
      jobTitle: 'React Developer',
      company: 'InnovateTech',
      appliedDate: '2024-06-18',
      status: 'Applied',
      statusColor: 'bg-gray-100 text-gray-800',
      salary: '$70,000',
      location: 'Austin, TX',
      nextStep: 'Waiting for initial response',
      notes: 'Perfect skill match'
    },
    {
      id: 5,
      jobTitle: 'Software Engineer Intern',
      company: 'MegaCorp',
      appliedDate: '2024-06-05',
      status: 'Offer Received',
      statusColor: 'bg-green-100 text-green-800',
      salary: '$30/hour',
      location: 'Seattle, WA',
      nextStep: 'Decision deadline: June 30th',
      notes: 'Great opportunity with mentorship program'
    }
  ];

  const statusFilters = [
    { key: 'all', label: 'All Applications', count: applications.length },
    { key: 'applied', label: 'Applied', count: applications.filter(app => app.status === 'Applied').length },
    { key: 'review', label: 'Under Review', count: applications.filter(app => app.status === 'Under Review').length },
    { key: 'interview', label: 'Interview', count: applications.filter(app => app.status === 'Interview Scheduled').length },
    { key: 'offer', label: 'Offers', count: applications.filter(app => app.status === 'Offer Received').length }
  ];

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => {
        switch(filter) {
          case 'applied': return app.status === 'Applied';
          case 'review': return app.status === 'Under Review';
          case 'interview': return app.status === 'Interview Scheduled';
          case 'offer': return app.status === 'Offer Received';
          default: return true;
        }
      });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Applied': return '📋';
      case 'Under Review': return '👀';
      case 'Interview Scheduled': return '🎯';
      case 'Offer Received': return '🎉';
      case 'Rejected': return '❌';
      default: return '📋';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track your job applications and their progress</p>
      </div>

      {/* Status Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-wrap gap-3">
          {statusFilters.map(statusFilter => (
            <button
              key={statusFilter.key}
              onClick={() => setFilter(statusFilter.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === statusFilter.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {statusFilter.label} ({statusFilter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Applications Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'Interview Scheduled').length}
              </p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offers</p>
              <p className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'Offer Received').length}
              </p>
            </div>
            <div className="text-2xl">🎉</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((applications.filter(app => app.status !== 'Applied').length / applications.length) * 100)}%
              </p>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map(application => (
          <div key={application.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{application.jobTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${application.statusColor}`}>
                    {getStatusIcon(application.status)} {application.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <span className="font-medium">{application.company}</span>
                  <span>•</span>
                  <span>{application.location}</span>
                  <span>•</span>
                  <span className="font-medium text-green-600">{application.salary}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Applied Date:</span>
                    <p className="font-medium">{new Date(application.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Next Step:</span>
                    <p className="font-medium">{application.nextStep}</p>
                  </div>
                </div>
                {application.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-500">Notes:</span>
                    <p className="text-sm text-gray-700 mt-1">{application.notes}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 ml-6">
                <Link
                  to={`/jobs/${application.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                >
                  View Job
                </Link>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Add Notes
                </button>
                {application.status === 'Offer Received' && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Accept Offer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't applied to any jobs yet. Start browsing to find your perfect match!"
              : `No applications with status: ${statusFilters.find(f => f.key === filter)?.label}`
            }
          </p>
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
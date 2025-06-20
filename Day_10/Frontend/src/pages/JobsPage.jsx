import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JobsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    company: ''
  });

  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Internship',
      salary: '$25/hour',
      match: '95%',
      description: 'Join our frontend team to build amazing user experiences...',
      requirements: ['React', 'JavaScript', 'HTML/CSS'],
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$60,000 - $80,000',
      match: '88%',
      description: 'Create beautiful and intuitive designs for our products...',
      requirements: ['Figma', 'Sketch', 'Design Systems'],
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'WebSolutions',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$50/hour',
      match: '82%',
      description: 'Work on both frontend and backend development...',
      requirements: ['React', 'Node.js', 'MongoDB'],
      posted: '3 days ago'
    }
  ];

  const filteredJobs = jobs.filter(job => {
    return (
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
        <p className="text-gray-600">Discover jobs matched to your profile</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="sf">San Francisco</option>
              <option value="ny">New York</option>
            </select>
          </div>
          <div>
            <select
              value={filters.jobType}
              onChange={(e) => setFilters({...filters, jobType: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="fulltime">Full-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {job.match} Match
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <span className="font-medium">{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                  <span>•</span>
                  <span className="font-medium text-green-600">{job.salary}</span>
                </div>
                <p className="text-gray-700 mb-3">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.requirements.map((req, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {req}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">Posted {job.posted}</p>
              </div>
              <div className="flex flex-col gap-2 ml-6">
                <Link
                  to={`/jobs/${job.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  View Details
                </Link>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Save Job
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
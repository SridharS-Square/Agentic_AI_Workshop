import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const JobsPage = () => {
  const { state } = useStudent();
  const { matchedJobs, loading } = state;

  const [filters, setFilters] = useState({ search: '' });

  const filteredJobs = (matchedJobs || []).filter(job => {
    return (
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Top Job Matches</h1>
        <p className="text-gray-600">These jobs have been matched to your profile by our AI.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <input
              type="text"
              placeholder="Search in your matched jobs..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12">
            <p className="text-xl font-semibold animate-pulse">Finding your job matches...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="space-y-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      {job.match} Match
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-gray-600 mb-3">
                    <span className="font-medium">{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    {job.salary && <><span>•</span><span className="font-medium text-green-600">{job.salary}</span></>}
                  </div>
                  <p className="text-gray-700 mb-3 text-sm">{job.description}</p>
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
                    to={`/match-explainer/${job.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Explain Match
                  </Link>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <div className="text-5xl mb-4">🤷</div>
            <h3 className="text-xl font-semibold text-gray-900">No Jobs Found</h3>
            <p className="text-gray-600 mt-2">We couldn't find any jobs matching your profile yet. Try updating your skills!</p>
            <Link to="/profile" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Update Profile
            </Link>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
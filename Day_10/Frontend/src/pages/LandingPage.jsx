import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find Your Perfect Job Match
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-powered job matching platform that connects students with opportunities 
          based on skills, preferences, and career goals.
        </p>
        <div className="space-x-4">
          <Link 
            to="/dashboard" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            to="/jobs" 
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
          <p className="text-gray-600">AI analyzes your profile to find the best job matches</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Easy Applications</h3>
          <p className="text-gray-600">Apply to multiple jobs with one click</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
          <p className="text-gray-600">Monitor your applications in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
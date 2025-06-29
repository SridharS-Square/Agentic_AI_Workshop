import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Zap, Compass } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <div className="py-20">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Stop Searching, Start Matching.
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Let our AI Job Agent read your profile, understand your goals, and find the perfect job opportunities for you.
        </p>
        <Link 
          to="/profile" 
          className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 text-lg font-semibold shadow-lg"
        >
          Create Your Profile & Get Matches
        </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-10 mt-16 text-left">
        <div className="p-8 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Compass className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">AI-Powered Guidance</h3>
          <p className="text-gray-600">Our agent doesn't just match keywords; it understands your entire professional story from your resume to find roles that truly fit.</p>
        </div>
        <div className="p-8 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Zap className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Instant, Real-Time Matches</h3>
          <p className="text-gray-600">Connects to live job markets to find opportunities posted moments ago, ensuring you're always ahead of the curve.</p>
        </div>
        <div className="p-8 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
            <Briefcase className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Transparent Explanations</h3>
          <p className="text-gray-600">Understand exactly why a job is a match with detailed AI-generated explanations and gap analysis for every recommendation.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

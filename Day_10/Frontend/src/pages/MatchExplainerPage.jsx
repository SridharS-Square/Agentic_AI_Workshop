import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { jobsAPI } from '../services/api'; // Adjust path if needed
import ReactMarkdown from 'react-markdown';

const MatchExplainerPage = () => {
  const { jobId } = useParams();
  const { state } = useStudent();
  const { profile } = state;

  const [explanation, setExplanation] = useState('');
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExplanation = async () => {
      if (!profile) {
        setError('Your profile could not be loaded. Please go to the profile page and save it first.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Efficiently fetch both job details and the AI explanation at the same time
        const jobDetailPromise = jobsAPI.getJobDetails(jobId);
        const explanationPromise = jobsAPI.explainMatch(jobId, profile);
        
        const [details, explanationData] = await Promise.all([jobDetailPromise, explanationPromise]);

        setJobDetails(details);
        setExplanation(explanationData.explanation);

      } catch (err) {
        console.error("Failed to fetch match explanation:", err);
        setError('Could not load the AI match explanation. The server might be busy. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [jobId, profile]);

  if (loading) {
    return (
        <div className="text-center p-12">
            <div className="text-2xl mb-4">🤖</div>
            <div className="text-xl font-semibold animate-pulse">Our AI Agents are analyzing your match...</div>
            <p className="text-gray-500 mt-2">This may take a few moments.</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center p-12 bg-red-50 text-red-700 rounded-lg max-w-2xl mx-auto">
            <p className="font-bold text-lg">An Error Occurred</p>
            <p className="mt-2">{error}</p>
            <Link to="/jobs" className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                Back to Jobs
            </Link>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">AI Match Explanation</h1>
        {jobDetails && <p className="text-xl text-gray-600">{jobDetails.title} at {jobDetails.company}</p>}
      </div>

      {/* The 'prose' class from tailwind-typography is great for styling markdown */}
      <div className="bg-white p-8 rounded-lg shadow-md prose lg:prose-lg max-w-none">
        <ReactMarkdown >
          {explanation}
        </ReactMarkdown>
      </div>

      <div className="mt-8 text-center">
        <Link to="/jobs" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
            ← Back to Job Matches
        </Link>
      </div>
    </div>
  );
};

export default MatchExplainerPage;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { jobsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, ArrowLeft } from 'lucide-react';

const MatchExplainerPage = () => {
  const { jobId } = useParams();
  const { state } = useStudent();
  const { profile, matchedJobs } = state;

  const [job, setJob] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the job from the context's matchedJobs list
    const currentJob = matchedJobs.find(j => j.id.toString() === jobId);

    if (currentJob) {
      setJob(currentJob);
      fetchExplanation(currentJob);
    } else {
      // In a real app, you might fetch job details by ID if not found in context
      toast.error('Job details not found.');
      setLoading(false);
    }
  }, [jobId, matchedJobs]);

  const fetchExplanation = async (currentJob) => {
    setLoading(true);
    try {
      const response = await jobsAPI.explainMatch(currentJob.id, profile);
      setExplanation(response.explanation);
    } catch (error) {
      toast.error('Failed to get AI explanation.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-20">
        <Sparkles className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Our AI Agent is analyzing your match...
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-semibold">Job Not Found</h2>
        <Link to="/jobs" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Job Matches
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/jobs" className="flex items-center text-sm text-blue-600 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to All Matches
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg border">
        <div className="border-b pb-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <span className={`text-lg font-bold px-4 py-2 rounded-full ${job.match_score > 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {job.match_score}% Match
            </span>
          </div>
          <p className="text-gray-600 mt-2">{job.company} • {job.location}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Sparkles className="text-blue-500" />
            AI-Powered Match Analysis
          </h2>
          {explanation ? (
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }}
            />
          ) : (
            <p className="text-gray-500">Could not load the AI explanation for this job match.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchExplainerPage;

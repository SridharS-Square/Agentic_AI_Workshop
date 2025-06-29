import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowRight, Sparkles, Search } from 'lucide-react';
import { marked } from 'marked';

const JobsPage = () => {
    const { profile, matchedJobs, setMatchedJobs } = useAuth();
    console.log('matchedJobs: ', matchedJobs);
    const [loading, setLoading] = useState(false);
    // Default search query based on user's profile, if available
    const [searchQuery, setSearchQuery] = useState({ 
        job_query: profile?.skills?.[0] || 'Software Developer', 
        location: 'India' 
    });
    const [explanation, setExplanation] = useState({});
    const [explainingJobId, setExplainingJobId] = useState(null);

    const fetchJobs = async (query) => {
        if (!query.job_query || !query.location) {
            toast.error("Please enter both a job title and location.");
            return;
        }
        setLoading(true);
        setMatchedJobs([]); // Clear previous results
        setExplanation({}); // Clear previous explanations
        try {
            const response = await api.post('/jobs/match', query);
            setMatchedJobs(response.data);
            if (response.data.length === 0) {
                toast.success("Search complete. No matches found for this query.");
            }
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
            toast.error(error.response?.data?.detail || "Could not fetch jobs.");
            setMatchedJobs([]);
        } finally {
            setLoading(false);
        }
    };

    // Automatically fetch jobs when the page loads for the first time
    useEffect(() => {
        if (matchedJobs?.length === 0) {
            fetchJobs(searchQuery);
        }
    }, []);

    const handleExplainMatch = async (job) => {
        if (explanation[job.id]) {
            setExplanation(prev => ({ ...prev, [job.id]: null }));
            return;
        }
        setExplainingJobId(job.id);
        const toastId = toast.loading('AI agent is analyzing the match...');
        try {
            const response = await api.post('/jobs/explain-match', { job_details: job });
            // Use marked to parse the markdown response into HTML
            const htmlExplanation = marked.parse(response.data.explanation);
            setExplanation(prev => ({ ...prev, [job.id]: htmlExplanation }));
            toast.success('Explanation generated!', { id: toastId });
        } catch(error) {
          console.log('error: ', error);
            toast.error("Could not generate explanation.", { id: toastId });
        } finally {
            setExplainingJobId(null);
        }
    }
    
    const handleSearch = (e) => { e.preventDefault(); fetchJobs(searchQuery); };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
                <p className="text-gray-600">Enter a job title and location to get real-time, AI-powered matches based on your profile.</p>
            </div>
            <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center border">
                <input type="text" placeholder="Job title (e.g., 'React Developer')" value={searchQuery.job_query} onChange={(e) => setSearchQuery({...searchQuery, job_query: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
                <input type="text" placeholder="Location (e.g., 'New York')" value={searchQuery.location} onChange={(e) => setSearchQuery({...searchQuery, location: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
                <button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2">
                    <Search size={18} />
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            {loading ? (
                <div className="text-center p-12"><p className="text-xl font-semibold animate-pulse text-blue-600">AI is searching for your job matches...</p></div>
            ) : matchedJobs?.length > 0 ? (
                <div className="space-y-6">
                {matchedJobs.map(job => (
                    <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-gray-600 my-2"><span>{job.company}</span><span>•</span><span>{job.location}</span><span>•</span><span>{job.type}</span></div>
                            </div>
                            <div className="flex items-center gap-4 ml-6 flex-shrink-0">
                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${job.match_score > 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{job.match_score}% Match</span>
                                <button onClick={() => handleExplainMatch(job)} disabled={explainingJobId === job.id} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 text-sm disabled:opacity-50 flex items-center gap-2">
                                    <Sparkles size={16} />
                                    {explainingJobId === job.id ? 'Analyzing...' : (explanation[job.id] ? 'Hide' : 'Explain')}
                                </button>
                                {job.apply_link && <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">Apply<ArrowRight size={16}/></a>}
                            </div>
                        </div>
                        {explanation[job.id] && (
                           <div className="mt-4 pt-4 border-t prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: explanation[job.id] }} />
                        )}
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
                    <h3 className="text-xl font-semibold text-gray-900">Start Your Search</h3>
                    <p className="text-gray-600 mt-2">No jobs found for the last search. Enter a new query to find jobs that match your profile.</p>
                </div>
            )}
        </div>
    );
};

export default JobsPage;

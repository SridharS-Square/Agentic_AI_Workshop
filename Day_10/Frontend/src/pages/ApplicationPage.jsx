import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, Target, Award, XCircle, MoreHorizontal, BriefcaseIcon, Bookmark } from 'lucide-react';

const ApplicationsPage = () => {
  const { matchedJobs } = useAuth();
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [combinedJobs, setCombinedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [openMenuId, setOpenMenuId] = useState(null); 

  const statusOptions = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

  const statusConfig = {
    "Saved": { icon: FileText, color: "text-gray-600", bgColor: "bg-gray-100" },
    "Applied": { icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    "Interviewing": { icon: Target, color: "text-blue-600", bgColor: "bg-blue-100" },
    "Offer": { icon: Award, color: "text-green-600", bgColor: "bg-green-100" },
    "Rejected": { icon: XCircle, color: "text-red-600", bgColor: "bg-red-100" },
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown menu
      const isClickInsideMenu = event.target.closest('.dropdown-menu-container');
      if (!isClickInsideMenu && openMenuId) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Fetch tracked jobs from the API when the component mounts
  useEffect(() => {
    const fetchTrackedJobs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/jobs/track');
        setTrackedJobs(response.data);
      } catch (error) {
        toast.error("Could not fetch tracked jobs.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrackedJobs();
  }, []);

  // Combine tracked jobs and new matches into a single list for display
  useEffect(() => {
    const trackedJobsMap = new Map(trackedJobs.map(job => [`${job.title}-${job.company}`, job]));

    const combined = [...trackedJobs];

    matchedJobs.forEach(match => {
      if (!trackedJobsMap.has(`${match.title}-${match.company}`)) {
        combined.push({ ...match, status: 'Not Tracked' }); // Add new matches with a "Not Tracked" status
      }
    });

    setCombinedJobs(combined);
  }, [matchedJobs, trackedJobs]);

  const handleMenuToggle = (jobKey) => {
    setOpenMenuId(openMenuId === jobKey ? null : jobKey);
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    const originalJobs = [...trackedJobs];
    // Optimistically update the UI
    setTrackedJobs(prev => prev.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
    // Close the menu after selection
    setOpenMenuId(null);
    
    try {
      await api.put(`/jobs/track/${jobId}`, { status: newStatus });
      toast.success("Status updated!");
    } catch (error) {
      toast.error("Failed to update status.");
      // Revert UI on error
      setTrackedJobs(originalJobs);
      console.error(error);
    }
  };
  
  const handleTrackJob = async (jobToTrack) => {
    try {
        const response = await api.post('/jobs/track', { job: jobToTrack });
        toast.success(`Started tracking "${jobToTrack.title}"`);
        // Add the newly tracked job to our local state
        setTrackedJobs(prev => [...prev, response.data]);
    } catch (error) {
        toast.error(error.response?.data?.detail || "Could not track job.");
    }
  };

  const filteredApplications = filter === 'All'
    ? combinedJobs
    : combinedJobs.filter(app => app.status === filter);

  if (loading) {
    return <div className="text-center p-12"><p className="text-xl font-semibold animate-pulse">Loading jobs...</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
        <p className="text-gray-600">View your AI-matched jobs and manually track their status.</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-8 border">
        <div className="flex flex-wrap gap-2">
          {['All', ...statusOptions].map(statusFilter => (
            <button
              key={statusFilter}
              onClick={() => setFilter(statusFilter)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === statusFilter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {statusFilter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((job, index) => {
            const isTracked = job.status !== 'Not Tracked';
            const { icon: Icon, color, bgColor } = isTracked ? (statusConfig[job.status] || statusConfig["Saved"]) : {};
            const jobKey = `${job.title}-${job.company}-${index}`; // Use index to ensure uniqueness
            
            return (
              <div key={jobKey} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                    {job.match_score && !isTracked && 
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-2 inline-block">
                            {job.match_score}% Match
                        </span>
                    }
                  </div>
                  <div className="flex items-center gap-4">
                    {isTracked ? (
                        <>
                            <div className={`flex items-center gap-2 font-semibold text-sm px-3 py-1.5 rounded-full ${bgColor} ${color}`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                                <span>{job.status}</span>
                            </div>
                            <div className="relative dropdown-menu-container">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMenuToggle(jobKey);
                                    }}
                                    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <MoreHorizontal size={20} />
                                </button>
                                {openMenuId === jobKey && (
                                    <div 
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {statusOptions.map(option => (
                                            <button 
                                                key={option} 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusUpdate(job._id, option);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                                            >
                                                Mark as {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button onClick={() => handleTrackJob(job)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm flex items-center gap-2 justify-center">
                            <Bookmark size={16} /> Track
                        </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-12 bg-white rounded-lg shadow-sm border">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Jobs Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'All' ? "No new matched jobs or tracked jobs found." : `No jobs with status: "${filter}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
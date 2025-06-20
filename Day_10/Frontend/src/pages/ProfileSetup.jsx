// src/pages/ProfileSetup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { studentAPI, jobsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react'; // For a nice icon

const ProfileSetup = () => {
  const { state, setProfile, setMatchedJobs, setLoading } = useStudent();
  const navigate = useNavigate();

  // CHANGED: Added linkedin_url to the form state
  const [formData, setFormData] = useState({
    name: state.profile?.name || '',
    email: state.profile?.email || '',
    linkedin_url: state.profile?.linkedin_url || '',
    phone: state.profile?.phone || '',
    university: state.profile?.university || '',
    major: state.profile?.major || '',
    graduationYear: state.profile?.graduationYear || '',
    skills: state.profile?.skills || [],
    experience: state.profile?.experience || '',
    location: state.profile?.location || '',
    jobTypes: state.profile?.jobTypes || [],
  });

  // NEW: State to hold the resume file object
  const [resumeFile, setResumeFile] = useState(null);

  const skillsList = [
    'JavaScript', 'Python', 'React', 'Node.js', 'HTML/CSS', 'Java', 'C++', 
    'SQL', 'Git', 'AWS', 'Docker', 'MongoDB', 'TypeScript', 'Vue.js', 'Figma'
  ];

  const jobTypesList = [
    'Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Freelance'
  ];

  // CHANGED: The submission logic is now a multi-step process
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Saving your profile...');

    try {
      // Step 1: Save the text-based profile data first.
      // The backend will create or update the student and return the profile with an ID.
      const savedProfile = await studentAPI.createProfile(formData);
      setProfile(savedProfile); // Update profile in global context

      // Step 2: If a resume file was selected, upload it.
      // We use the 'savedProfile.id' returned from the previous step.
      if (resumeFile) {
        toast.loading('Uploading your resume...', { id: toastId });
        await studentAPI.uploadResume(resumeFile, savedProfile.id);
      }

      // Step 3: Now that the profile is complete, find job matches.
      // The backend will use the new Profile Understanding Agent.
      toast.loading('AI Agents are finding your job matches...', { id: toastId });
      const matchedJobsData = await jobsAPI.matchJobs(savedProfile);
      setMatchedJobs(matchedJobsData);

      toast.success('Profile saved! Found your top job matches.', { id: toastId });
      
      // Step 4: Navigate to the jobs page to show the results.
      navigate('/jobs');

    } catch (error) {
      console.error("Failed to save profile or match jobs:", error);
      const errorMessage = error.response?.data?.detail || 'Something went wrong. Please try again.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill] }));
  };

  const handleJobTypeToggle = (type) => {
    setFormData(prev => ({ ...prev, jobTypes: prev.jobTypes.includes(type) ? prev.jobTypes.filter(t => t !== type) : [...prev.jobTypes, type] }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Profile</h1>
        <p className="text-gray-600">Provide your details to power the AI Job Matching Agent.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-8">

        {/* --- Basic Information Section --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" required />
            </div>
          </div>
        </div>
        
        {/* NEW: Agent Inputs Section for Resume and LinkedIn */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">AI Agent Inputs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile URL</label>
              <input type="url" value={formData.linkedin_url} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF or DOCX)</label>
              <label htmlFor="resume-upload" className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <UploadCloud className="w-6 h-6 text-gray-500 mr-2" />
                  <span className="text-gray-600">{resumeFile ? resumeFile.name : 'Click to select file'}</span>
              </label>
              <input id="resume-upload" type="file" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} accept=".pdf,.docx" />
            </div>
          </div>
        </div>
        
        {/* --- Skills & Preferences Sections --- */}
        {/* These sections remain the same */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Skills & Preferences</h2>
          <div className="space-y-6">
            <div>
                <h3 className="text-md font-medium text-gray-700 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-3">
                    {skillsList.map(skill => (
                    <button type="button" key={skill} onClick={() => handleSkillToggle(skill)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.skills.includes(skill) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{skill}</button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-md font-medium text-gray-700 mb-3">Job Preferences</h3>
                <div className="flex flex-wrap gap-3">
                    {jobTypesList.map(type => (
                    <button type="button" key={type} onClick={() => handleJobTypeToggle(type)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.jobTypes.includes(type) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{type}</button>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* --- Experience Section --- */}
        <div>
          <label className="block text-xl font-semibold mb-4 border-b pb-2">Experience & Projects</label>
          <textarea value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} rows={5} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Describe your relevant experience, projects, or achievements... The more detail, the better the AI matching!"></textarea>
        </div>

        <button type="submit" disabled={state.loading} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed">
          {state.loading ? 'Analyzing Profile...' : 'Save and Find My Jobs'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
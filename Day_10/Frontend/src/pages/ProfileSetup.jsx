import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { studentAPI, jobsAPI } from '../services/api'; // Adjust path if needed
import toast from 'react-hot-toast';

const ProfileSetup = () => {
  const { state, setProfile, setMatchedJobs, setLoading } = useStudent();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: state.profile?.name || '',
    email: state.profile?.email || '',
    phone: state.profile?.phone || '',
    university: state.profile?.university || '',
    major: state.profile?.major || '',
    graduationYear: state.profile?.graduationYear || '',
    skills: state.profile?.skills || [],
    experience: state.profile?.experience || '',
    location: state.profile?.location || '',
    jobTypes: state.profile?.jobTypes || [],
  });

  const skillsList = [
    'JavaScript', 'Python', 'React', 'Node.js', 'HTML/CSS', 'Java', 'C++', 
    'SQL', 'Git', 'AWS', 'Docker', 'MongoDB', 'TypeScript', 'Vue.js', 'Figma'
  ];

  const jobTypesList = [
    'Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Freelance'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Saving profile and finding job matches...');

    try {
      // 1. Save the student profile to the backend
      const savedProfile = await studentAPI.createProfile(formData);
      setProfile(savedProfile); // Update profile in global context

      // 2. Use the newly saved profile to get job matches
      const matchedJobs = await jobsAPI.matchJobs(savedProfile);
      setMatchedJobs(matchedJobs); // Save matched jobs to global context

      toast.success('Profile saved! Found your top job matches.', { id: toastId });
      
      // 3. Navigate to the jobs page to show the results
      navigate('/jobs');

    } catch (error) {
      console.error("Failed to save profile or match jobs:", error);
      toast.error('Something went wrong. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleJobTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(type)
        ? prev.jobTypes.filter(t => t !== type)
        : [...prev.jobTypes, type]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-600">Complete your profile to get the best AI-powered job matches.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="City, State" />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
              <input type="text" value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
              <input type="text" value={formData.major} onChange={(e) => setFormData({...formData, major: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
              <select value={formData.graduationYear} onChange={(e) => setFormData({...formData, graduationYear: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="">Select Year</option>
                {[2024, 2025, 2026, 2027, 2028].map(year => (<option key={year} value={year}>{year}</option>))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {skillsList.map(skill => (
              <button type="button" key={skill} onClick={() => handleSkillToggle(skill)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.skills.includes(skill) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Job Preferences */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Job Preferences</h2>
          <div className="flex flex-wrap gap-3">
            {jobTypesList.map(type => (
              <button type="button" key={type} onClick={() => handleJobTypeToggle(type)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.jobTypes.includes(type) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience & Projects</label>
          <textarea value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} rows={5} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Describe your relevant experience, projects, or achievements... The more detail, the better the AI matching!"></textarea>
        </div>

        <button type="submit" disabled={state.loading} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300">
          {state.loading ? 'Analyzing...' : 'Save and Find My Jobs'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
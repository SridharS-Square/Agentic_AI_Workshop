import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { UploadCloud, Save, FileText, X } from 'lucide-react';

const ProfileSetup = () => {
  const { profile, refetchProfile, loading: authLoading,user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    major: '',
    skills: [],
    experience: '',
    jobTypes: [],
    linkedin_url: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  // When the component loads, pre-fill the form with data from the user's profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        major: profile.major || '',
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        email:user.email|| '',  
        experience: profile.experience || '',
        jobTypes: Array.isArray(profile.jobTypes) ? profile.jobTypes : [],
        linkedin_url: profile.linkedin_url || '',
      });
    }
  }, [profile]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Updating your profile...');
    try {
      await api.put('/profile/', formData);
      if (resumeFile) {
        toast.loading('Uploading resume...', { id: toastId });
        const resumeFormData = new FormData();
        resumeFormData.append('file', resumeFile);
        await api.post('/profile/upload-resume', resumeFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      await refetchProfile();
      toast.success('Profile updated successfully!', { id: toastId });
      navigate('/jobs'); 
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage = error.response?.data?.detail || 'Update failed.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleJobTypeToggle = (type) => {
    setFormData(prev => ({ ...prev, jobTypes: prev.jobTypes.includes(type) ? prev.jobTypes.filter(t => t !== type) : [...prev.jobTypes, type] }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const jobTypesList = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

  if (authLoading) return <p className="text-center p-12">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Keep your details up to date to ensure the best job matches from our AI agent.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-8 border">

        {/* --- Basic Information Section --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-3 text-gray-800">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        </div>
        
        {/* --- Agent Inputs Section for Resume and LinkedIn --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-3 text-gray-800">AI Agent Inputs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile URL</label>
              <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF or DOCX)</label>
              <label htmlFor="resume-upload" className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <UploadCloud className="w-6 h-6 text-gray-500 mr-3" />
                  <span className="text-gray-600 truncate">{resumeFile ? resumeFile.name : 'Click to select file'}</span>
              </label>
              <input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
            </div>
          </div>
        </div>

        {profile?.resume_text && (
            <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-3 text-gray-800 flex items-center gap-2">
                    <FileText className="text-green-600" />
                    Parsed Resume Text
                </h2>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {profile.resume_text}
                    </pre>
                </div>
                <p className="text-xs text-gray-500 mt-2">This is the text our AI agent sees. If it looks incorrect, please try re-uploading your resume.</p>
            </div>
        )}
        
        {/* --- Skills & Preferences Sections --- */}
       <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-3 text-gray-800">Skills & Job Preferences</h2>
          <div className="space-y-6">
            <div>
                <h3 className="text-md font-medium text-gray-700 mb-3">Your Top Skills</h3>
                <div className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 rounded-lg">
                    {formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            <span>{skill}</span>
                            <button type="button" onClick={() => removeSkill(skill)} className="text-blue-600 hover:text-blue-800">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        className="flex-grow p-1 bg-transparent focus:outline-none"
                        placeholder={formData.skills.length === 0 ? "Type a skill and press Enter..." : "Add another skill..."}
                    />
                </div>
            </div>
            <div>
                <h3 className="text-md font-medium text-gray-700 mb-3">Preferred Job Types</h3>
                <div className="flex flex-wrap gap-3">
                    {jobTypesList.map(type => (
                      <button type="button" key={type} onClick={() => handleJobTypeToggle(type)} className={`px-4 py-2 text-sm rounded-full font-medium transition-all ${formData.jobTypes.includes(type) ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{type}</button>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* --- Experience Section --- */}
        <div>
          <label className="block text-xl font-semibold mb-4 border-b pb-3 text-gray-800">Experience & Projects</label>
          <textarea name="experience" value={formData.experience} onChange={handleInputChange} rows={6} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Describe your relevant experience, key projects, or achievements... The more detail, the better the AI matching!"></textarea>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Save size={18} />
            {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
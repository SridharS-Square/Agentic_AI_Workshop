import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';

const ProfileSetup = () => {
  const { student, updateStudent } = useStudent();
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    university: student?.university || '',
    major: student?.major || '',
    graduationYear: student?.graduationYear || '',
    skills: student?.skills || [],
    experience: student?.experience || '',
    location: student?.location || '',
    jobTypes: student?.jobTypes || []
  });

  const skillsList = [
    'JavaScript', 'Python', 'React', 'Node.js', 'HTML/CSS', 'Java', 'C++', 
    'SQL', 'Git', 'AWS', 'Docker', 'MongoDB', 'TypeScript', 'Vue.js'
  ];

  const jobTypesList = [
    'Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Freelance'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStudent(formData);
    alert('Profile updated successfully!');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Setup</h1>
        <p className="text-gray-600">Complete your profile to get better job matches</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Major
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({...formData, major: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Year
              </label>
              <select
                value={formData.graduationYear}
                onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Year</option>
                {[2024, 2025, 2026, 2027, 2028].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {skillsList.map(skill => (
              <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Preferences */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Job Preferences</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {jobTypesList.map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.jobTypes.includes(type)}
                  onChange={() => handleJobTypeToggle(type)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience & Projects
          </label>
          <textarea
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your relevant experience, projects, or achievements..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
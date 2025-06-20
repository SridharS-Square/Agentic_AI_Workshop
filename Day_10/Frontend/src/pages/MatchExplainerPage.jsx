// pages/MatchExplainerPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const MatchExplainerPage = () => {
  const { jobId } = useParams();
  
  // Mock data - in real app, this would be fetched based on jobId and user profile
  const matchData = {
    jobTitle: 'Frontend Developer Intern',
    company: 'TechCorp',
    overallMatch: 95,
    matchFactors: [
      {
        category: 'Skills Match',
        score: 92,
        weight: 40,
        details: [
          { skill: 'React', userLevel: 'Advanced', required: 'Intermediate', match: 100 },
          { skill: 'JavaScript', userLevel: 'Advanced', required: 'Advanced', match: 100 },
          { skill: 'HTML/CSS', userLevel: 'Expert', required: 'Intermediate', match: 100 },
          { skill: 'Node.js', userLevel: 'Beginner', required: 'Nice to have', match: 75 },
          { skill: 'TypeScript', userLevel: 'None', required: 'Nice to have', match: 0 }
        ]
      },
      {
        category: 'Experience Level',
        score: 88,
        weight: 25,
        details: [
          { aspect: 'Years of Experience', userLevel: '1-2 years', required: '0-2 years', match: 90 },
          { aspect: 'Project Experience', userLevel: '5+ projects', required: '2+ projects', match: 100 },
          { aspect: 'Industry Experience', userLevel: 'Web Development', required: 'Web Development', match: 100 }
        ]
      },
      {
        category: 'Education',
        score: 100,
        weight: 15,
        details: [
          { aspect: 'Degree Level', userLevel: 'Bachelor\'s in CS', required: 'Bachelor\'s preferred', match: 100 },
          { aspect: 'Graduation Year', userLevel: '2025', required: '2024-2026', match: 100 },
          { aspect: 'Relevant Coursework', userLevel: 'Web Dev, Algorithms', required: 'CS Fundamentals', match: 95 }
        ]
      },
      {
        category: 'Location & Preferences',
        score: 98,
        weight: 10,
        details: [
          { aspect: 'Location', userLevel: 'San Francisco Bay Area', required: 'San Francisco, CA', match: 100 },
          { aspect: 'Job Type', userLevel: 'Internship, Full-time', required: 'Internship', match: 100 },
          { aspect: 'Remote Work', userLevel: 'Hybrid preferred', required: 'Hybrid available', match: 95 }
        ]
      },
      {
        category: 'Company Culture Fit',
        score: 94,
        weight: 10,
        details: [
          { aspect: 'Company Size', userLevel: 'Medium-Large', required: 'Large (500-1000)', match: 90 },
          { aspect: 'Industry', userLevel: 'Technology', required: 'Technology', match: 100 },
          { aspect: 'Growth Stage', userLevel: 'Established', required: 'Established', match: 100 }
        ]
      }
    ],
    recommendations: [
      {
        type: 'strength',
        title: 'Strong Technical Skills',
        description: 'Your React and JavaScript expertise perfectly aligns with this role\'s requirements.'
      },
      {
        type: 'opportunity',
        title: 'Learn TypeScript',
        description: 'Adding TypeScript to your skillset could boost your match score and make you even more competitive.'
      },
      {
        type: 'perfect',
        title: 'Perfect Location Match',
        description: 'Your San Francisco location is ideal for this position with no relocation needed.'
      },
      {
        type: 'strength',
        title: 'Education Alignment',
        description: 'Your Computer Science degree and graduation timeline perfectly match their requirements.'
      }
    ]
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRecommendationIcon = (type) => {
    switch(type) {
      case 'strength': return '💪';
      case 'opportunity': return '🎯';
      case 'perfect': return '✨';
      default: return '💡';
    }
  };

  const getRecommendationColor = (type) => {
    switch(type) {
      case 'strength': return 'border-green-200 bg-green-50';
      case 'opportunity': return 'border-blue-200 bg-blue-50';
      case 'perfect': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Match Analysis</h1>
            <div className="flex items-center gap-3">
              <h2 className="text-xl text-gray-700">{matchData.jobTitle}</h2>
              <span className="text-gray-500">at</span>
              <span className="text-xl font-medium text-gray-900">{matchData.company}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600 mb-1">{matchData.overallMatch}%</div>
            <div className="text-sm text-gray-600">Overall Match</div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link
            to={`/jobs/${jobId}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Job Details
          </Link>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Apply Now
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Match Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Match Breakdown</h3>
            
            {matchData.matchFactors.map((factor, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">{factor.category}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Weight: {factor.weight}%</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(factor.score)}`}>
                      {factor.score}%
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${factor.score}%` }}
                  ></div>
                </div>
                
                {/* Details */}
                <div className="space-y-3">
                  {factor.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {detail.skill || detail.aspect}
                        </div>
                        <div className="text-sm text-gray-600">
                          Your Level: <span className="font-medium">{detail.userLevel}</span>
                          {detail.required && (
                            <>
                              {' • '}Required: <span className="font-medium">{detail.required}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(detail.match)}`}>
                        {detail.match}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="space-y-4">
              {matchData.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getRecommendationColor(rec.type)}`}>
                  <div className="flex items-start gap-3">
                    <div className="text-xl">{getRecommendationIcon(rec.type)}</div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-700">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Improve Your Match</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-sm text-gray-900">Add TypeScript Skill</div>
                <div className="text-xs text-gray-600">Potential +3% match increase</div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-sm text-gray-900">Complete Profile</div>
                <div className="text-xs text-gray-600">Add portfolio projects</div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-sm text-gray-900">Update Experience</div>
                <div className="text-xs text-gray-600">Add recent projects</div>
              </div>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Similar High Matches</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-sm">React Developer</div>
                <div className="text-xs text-gray-600">StartupABC • 93% Match</div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-sm">Web Developer Intern</div>
                <div className="text-xs text-gray-600">DevCorp • 91% Match</div>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium text-sm">Frontend Engineer</div>
                <div className="text-xs text-gray-600">TechStart • 89% Match</div>
              </div>
            </div>
            <Link
              to="/jobs"
              className="block w-full text-center mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All Matches
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchExplainerPage;
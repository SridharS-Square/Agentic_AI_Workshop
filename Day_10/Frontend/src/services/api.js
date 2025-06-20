import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8000';

// CHANGED: Added the secret API key. Make sure this value
// EXACTLY matches the API_KEY in your backend's .env file.
const API_KEY = 'your-super-secret-hackathon-key';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // CHANGED: Increased timeout for slow AI requests
  timeout: 60000,
});

// CHANGED: Modified the request interceptor to add the API Key.
// This function will now run before every request and attach the key.
api.interceptors.request.use(
  (config) => {
    // Add the API Key to the request headers
    config.headers['X-API-Key'] = API_KEY;

    // Keep the existing logic for auth tokens if you need it later
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    // Optional: Add a toast notification for authorization errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error("Authorization failed. Please check your API keys and CORS setup.");
    }
    return Promise.reject(error);
  }
);

// ==================== STUDENT PROFILE API ====================

export const studentAPI = {
  // Create or update student profile
  createProfile: async (profileData) => {
    const response = await api.post('/students/profile', profileData);
    return response.data;
  },

  // Upload resume
  uploadResume: async (file, studentId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (studentId) {
      formData.append('student_id', studentId);
    }

    const response = await api.post('/students/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get student profile
  getProfile: async (studentId) => {
    const response = await api.get(`/students/${studentId}/profile`);
    return response.data;
  },
};

// ==================== JOBS API ====================

export const jobsAPI = {
  // Get jobs with filters
  getJobs: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    const response = await api.get(`/jobs?${queryParams.toString()}`);
    return response.data;
  },

  // Get trending jobs
  getTrendingJobs: async () => {
    const response = await api.get('/jobs/trending');
    return response.data;
  },

  // Get job details
  getJobDetails: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Search jobs
  searchJobs: async (query, filters = {}) => {
    const params = { query, ...filters };
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    const response = await api.get(`/jobs/search?${queryParams.toString()}`);
    return response.data;
  },

  // Match jobs for student
  matchJobs: async (studentProfile) => {
    // The original code passed a 'preferences' object which our backend doesn't use for this endpoint.
    // We will just pass the student profile as the body.
    const response = await api.post('/jobs/match', studentProfile);
    return response.data;
  },

  // Explain job match
  explainMatch: async (jobId, studentData) => {
    const response = await api.post(`/jobs/${jobId}/explain-match`, studentData);
    return response.data;
  },

  // Initialize mock data
  initializeMockData: async () => {
    const response = await api.post('/jobs/initialize-mock-data');
    return response.data;
  },
};

// ==================== APPLICATIONS API ====================

export const applicationsAPI = {
  // Create application
  createApplication: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  // Get student applications
  getStudentApplications: async (studentId) => {
    const response = await api.get(`/applications/student/${studentId}`);
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (applicationId, statusData) => {
    const response = await api.put(`/applications/${applicationId}/status`, statusData);
    return response.data;
  },
};

// ==================== ANALYTICS API ====================

export const analyticsAPI = {
  // Get dashboard data
  getDashboard: async (studentId) => {
    const response = await api.get(`/analytics/dashboard/${studentId}`);
    return response.data;
  },
};

// ==================== HEALTH CHECK API ====================

export const healthAPI = {
  // Check API health
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Check database status
  checkDatabase: async () => {
    const response = await api.get('/db-status');
    return response.data;
  },
};

// Export default api instance for custom requests
export default api;

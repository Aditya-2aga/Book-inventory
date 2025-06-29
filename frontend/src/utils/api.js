import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for AI operations
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 413) {
      console.error('File too large');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running');
    }
    
    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
  checkSetup: () => api.get('/auth/check-setup'),
};

// API endpoints
export const bookAPI = {
  getAll: (params = {}) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  getStats: () => api.get('/books/stats/overview'),
};

export const configAPI = {
  get: (key) => api.get(`/config/${key}`),
  set: (key, data) => api.post(`/config/${key}`, data),
  testApiKey: (apiKey) => api.post('/config/test-api-key', { apiKey }),
  delete: (key) => api.delete(`/config/${key}`),
};

export const aiAPI = {
  extractBookInfo: (formData) => api.post('/ai/extract-book-info', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 60 seconds for AI processing
  }),
  test: () => api.post('/ai/test'),
  getStatus: () => api.get('/ai/status'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
export { api };
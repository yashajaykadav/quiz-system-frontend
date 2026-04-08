import axios from 'axios';

// Ensure the base URL is captured correctly
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
// Remove trailing slash if user accidentally added one in Vercel settings
const cleanBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL: cleanBaseUrl ? `${cleanBaseUrl}/api` : '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiry
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Use replace to prevent back-button loops
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
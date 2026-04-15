import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
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
    // FIX: Ensure you are using the correct key name from localStorage
    const token = localStorage.getItem('accessToken');

    // SAFETY CHECK: Only add header if token exists and isn't "undefined"
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Expired Access Token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevents infinite loops

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        // Call your new refresh endpoint
        const response = await axios.post(`${cleanBaseUrl}/api/auth/refresh`, {
          token: refreshToken
        });

        const { accessToken } = response.data;

        // Save new token and retry the original request
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, then logout
        localStorage.clear();
        window.location.replace('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
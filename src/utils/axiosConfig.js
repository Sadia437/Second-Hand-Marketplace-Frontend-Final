import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // keep dev backend
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
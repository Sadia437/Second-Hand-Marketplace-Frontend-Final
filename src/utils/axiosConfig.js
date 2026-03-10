import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
   
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
        
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
         
          console.error('Access denied:', data.message);
          break;
        case 404:
          
          console.error('Resource not found:', data.message);
          break;
        case 500:
          
          console.error('Server error:', data.message);
          break;
        default:
          console.error('API error:', data.message);
      }
    } else if (error.request) {
      
      console.error('Network error: Server not responding');
    } else {
      
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common API calls
export const apiHelper = {
  // GET request
  get: (url, config = {}) => API.get(url, config),
  
  // POST request
  post: (url, data, config = {}) => API.post(url, data, config),
  
  // PUT request
  put: (url, data, config = {}) => API.put(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => API.delete(url, config),
  
  // PATCH request
  patch: (url, data, config = {}) => API.patch(url, data, config),
};

export default API;
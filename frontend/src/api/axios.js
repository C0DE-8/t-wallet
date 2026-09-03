// api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.truxhubline.space/',
  // These headers help prevent CORS issues and ensure JSON is sent
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Timeout to prevent hanging requests
  timeout: 10000, 
})

// Request Interceptor (Optional: Add auth tokens here if you have them)
api.interceptors.request.use(
  (config) => {
    // If you have a token in localStorage, add it here:
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor - CRITICAL for debugging the 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('🔴 API Error Status:', error.response.status)
      console.error('🔴 API Error Data:', error.response.data)
      
      if (error.response.status === 403) {
        console.error('🚫 403 Forbidden received. Check backend CORS, Auth, or Batch approval.')
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('🟠 No response received from server. Check network/CORS.')
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('🟡 Error setting up request:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api
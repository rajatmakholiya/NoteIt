import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers['x-auth-token'] = localStorage.getItem('token');
  }
  return req;
});

// Authentication Endpoints
export const sendOtp = (email: string) => API.post('/auth/send-otp', { email });
export const verifyOtp = (email: string, otp: string) => API.post('/auth/verify-otp', { email, otp });
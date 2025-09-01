import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers['x-auth-token'] = localStorage.getItem('token');
  }
  return req;
});

// SIGNUP
export const sendSignupOtp = (email: string, name: string, dateOfBirth: string) => API.post('/auth/send-signup-otp', { email, name, dateOfBirth });

// LOGIN
export const sendLoginOtp = (email: string) => API.post('/auth/send-login-otp', { email });

// Shared for both flows
export const verifyOtp = (email: string, otp: string, rememberMe?: boolean) => API.post('/auth/verify-otp', { email, otp, rememberMe });

// Notes API
export const getNotes = () => API.get('/notes');
export const createNote = (note: { title: string, content: string }) => API.post('/notes', note);
export const deleteNote = (id: string) => API.delete(`/notes/${id}`);
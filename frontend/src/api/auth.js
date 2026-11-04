import api from './index';

// Auth APIs
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Profile Update API (NEW)
export const updateProfile = (data) => api.put('/auth/update', data);
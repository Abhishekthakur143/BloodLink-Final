import api from './index';

export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = () => api.get('/admin/users');
export const getBloodStats = () => api.get('/admin/blood-stats'); // NEW ADDITION
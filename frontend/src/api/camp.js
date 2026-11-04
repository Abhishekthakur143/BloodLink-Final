import api from './index';
 
export const createCamp = (data) => api.post('/camps/create', data);
export const getCamps = () => api.get('/camps/all');
export const registerForCamp = (campId) => api.post(`/camps/${campId}/register`);
export const getAllCampsAdmin = () => api.get('/camps/admin/all');
export const autoMarkEnded = () => {
  return api.post('/camps/auto-mark-ended');
};
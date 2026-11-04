import api from './index';

export const createBloodRequest = (data) => api.post('/blood-requests/create', data);
export const getBloodRequests = () => api.get('/blood-requests/all');
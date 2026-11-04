import api from './index';

export const getBloodMatch = (params) => api.get('/ai/blood-match', { params });
export const chatWithAi = (data) => api.post('/ai/chatbot', data);
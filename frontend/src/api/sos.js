import api from './index';

export const triggerSOS = (data) => api.post('/sos/trigger', data);
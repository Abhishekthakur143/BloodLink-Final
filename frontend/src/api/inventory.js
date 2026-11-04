import api from './index';

export const addStock = (data) => api.post('/inventory/add', data);
export const getInventory = () => api.get('/inventory/available');
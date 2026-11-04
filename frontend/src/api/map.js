import api from './index';

export const getNearbyDonors = () => api.get('/maps/donors');
export const getNearbyHospitals = () => api.get('/maps/hospitals');
export const getNearbyCamps = () => api.get('/maps/camps');
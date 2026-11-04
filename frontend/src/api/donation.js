
import api from './index';
 
export const donateBlood = (requestId) => api.post(`/donations/donate/${requestId}`);
export const getDonationHistory = () => api.get('/donations/history');
export const checkEligibility = () => api.get('/donations/eligibility');
export const getMyDonations = () => api.get('/donations/my-donations');
 
// ✅ NEW: Certificate data fetch
export const getCertificateData = () => api.get('/donations/certificate');
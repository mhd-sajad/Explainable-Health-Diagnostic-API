import axios from 'axios';

// In Docker:   nginx proxies /diagnostics/* → backend container
// In dev:      Vite proxy forwards /diagnostics/* → localhost:8000
// Both use the same origin, so no CORS issues.
const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const createAssessment = (vitals) => api.post('/diagnostics/', vitals);
export const getAllAssessments = () => api.get('/diagnostics/');
export const getAssessment = (id) => api.get(`/diagnostics/${id}`);
export const updateOutcome = (id, clinical_outcome) =>
  api.put(`/diagnostics/${id}`, { clinical_outcome });
export const deleteAssessment = (id) => api.delete(`/diagnostics/${id}`);
export const healthCheck = () => api.get('/health');

export default api;

import axios from 'axios';

const configuredApiBaseUrl = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8002/api'
).replace(/\/+$/, '');
const API_BASE_URL = configuredApiBaseUrl.endsWith('/api')
  ? configuredApiBaseUrl
  : `${configuredApiBaseUrl}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('legalease-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

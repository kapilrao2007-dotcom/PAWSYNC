import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pawsync_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pawsync_token');
      localStorage.removeItem('pawsync_user');
    }
    return Promise.reject(err);
  }
);

export default api;

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';

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

/**
 * Turns an axios error into a message a non-technical user can act on.
 * Axios reports a bare "Network Error" whenever the request never got a
 * response at all - almost always because the backend isn't running, the
 * database isn't connected (server.js exits on a failed Mongo connection),
 * or the frontend wasn't started with `npm run dev` (so the Vite proxy to
 * :5000 never kicked in). We surface that distinction instead of the raw
 * axios message so it's obvious what to check.
 */
export const getErrorMessage = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
    return "Can't reach the PAWSYNC server. Make sure the backend is running (npm run dev in /backend) and that it connected to MongoDB successfully.";
  }
  if (err?.code === 'ECONNABORTED') {
    return 'The request timed out. Please check your connection and try again.';
  }
  return err?.message || 'Something went wrong. Please try again.';
};

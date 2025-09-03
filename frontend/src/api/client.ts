import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) config.headers = {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  console.debug('[api] request', config.method, config.url, config.params ?? config.data);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.debug('[api] response', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    if (error?.response) {
      console.error('[api] response error', error.response.status, error.config?.url, error.response.data);
      if (error.response.status === 401) {
        // clear invalid token and force redirect to login
        localStorage.removeItem('token');
        // small timeout so other handlers finish
        setTimeout(() => (window.location.href = '/auth'), 10);
      }
    } else {
      console.error('[api] network/error', error.message ?? error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
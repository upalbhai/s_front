import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    const siteId = document.documentElement.dataset.site;
    if (siteId) {
      config.headers['x-site-id'] = siteId;
    }
  }
  return config;
});

export default api;

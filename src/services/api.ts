import axios from 'axios';

function getBaseURL() {
  if (typeof window === 'undefined') {
    if (process.env.INTERNAL_API_URL) return process.env.INTERNAL_API_URL;
    const pub = process.env.NEXT_PUBLIC_API_URL;
    if (pub && pub.startsWith('http')) return pub;
    return 'http://localhost:4000/api/v1';
  }
  return process.env.NEXT_PUBLIC_API_URL || '/api/v1';
}

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  config.headers['x-api-secret'] = process.env.NEXT_PUBLIC_API_SECRET || 'sb-api-secret-key';
  const appMode = process.env.NEXT_PUBLIC_APP_MODE || 'public';

  if (appMode === 'admin') {
    config.headers['x-admin'] = '1';
  } else {
    const siteId = typeof window !== 'undefined'
      ? document.documentElement.dataset.site
      : process.env.NEXT_PUBLIC_SITE_ID;
    if (siteId) {
      config.headers['x-site-id'] = siteId;
    }
  }

  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

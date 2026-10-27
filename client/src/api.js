// API client helper using the browser's native Fetch API
// Handles production Vercel deployment with Render backend as well as local Vite development.

const PRODUCTION_BACKEND_URL = 'https://mini-ecommerce-714d.onrender.com';

/**
 * Normalizes the API base URL:
 * - Uses import.meta.env.VITE_API_URL if defined (e.g. from Vercel environment variables).
 * - Falls back to PRODUCTION_BACKEND_URL when running in production (import.meta.env.PROD).
 * - In local dev (import.meta.env.DEV), defaults to empty string '' to leverage Vite dev proxy (/api -> local server).
 * - Strips any trailing slashes and avoids duplicate '/api' prefixing.
 */
function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  const rawUrl = envUrl || (import.meta.env.PROD ? PRODUCTION_BACKEND_URL : '');

  if (!rawUrl || typeof rawUrl !== 'string') {
    return '';
  }

  let clean = rawUrl.trim().replace(/\/+$/, '');
  // If the configured URL ends with /api, strip it so subsequent `/api/...` endpoints don't duplicate
  if (clean.endsWith('/api')) {
    clean = clean.slice(0, -4);
  }
  return clean;
}

const API_BASE = resolveApiBaseUrl();

/**
 * Builds a clean, fully-qualified URL for API requests without duplicate slashes or segments.
 */
function buildEndpointUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE ? `${API_BASE}${cleanEndpoint}` : cleanEndpoint;
}

/**
 * Universal fetch wrapper with automatic JSON parsing and robust error handling
 */
async function request(endpoint, options = {}) {
  const url = buildEndpointUrl(endpoint);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('shopnova_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // Helpful network / sleep diagnostic for Render free tier & connection drops
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      throw new Error(
        'Unable to connect to the backend server. If using Render free-tier, it may take 30-50 seconds to spin up from sleep.'
      );
    }
    throw error;
  }
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString();
    return request(`/api/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: (id) => request(`/api/products/${id}`),

  // Orders
  createOrder: (orderData) =>
    request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getOrders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.email) query.append('email', params.email);
    if (params.userId) query.append('userId', params.userId);
    const queryString = query.toString();
    return request(`/api/orders${queryString ? `?${queryString}` : ''}`);
  },

  // Auth
  register: (userData) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => request('/api/auth/me'),
};

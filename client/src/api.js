// API client helper using the browser's native Fetch API
// In Vite dev mode, '/api' is proxied to 'http://127.0.0.1:5050'
// We also support direct server fallback if needed.

const API_BASE = window.location.port === '3000' || window.location.port === '5173'
  ? '' 
  : 'http://127.0.0.1:5050';

/**
 * Universal fetch wrapper with automatic JSON parsing and error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
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
    // If proxy failed or server isn't reachable, provide helpful message
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Make sure the server is running on port 5000.');
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


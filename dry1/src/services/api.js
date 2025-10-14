import config from '../config/environment.js';
import { URLs } from '../utils/urls.js';
import { mobileDebugger } from '../utils/mobileDebugger.js';

// Get API_BASE_URL dynamically to ensure it uses the correct network URL
const getApiBaseUrl = () => config.API_BASE_URL;

// Auth token management
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Admin token management
const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

const setAdminToken = (token) => {
  localStorage.setItem('adminToken', token);
};

const removeAdminToken = () => {
  localStorage.removeItem('adminToken');
};

// HTTP request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const token = getAuthToken();
  
  const requestConfig = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Add timeout for requests - longer timeout for mobile
  const timeout = mobileDebugger.isMobile() ? (config.REQUEST_TIMEOUT || 15000) : (config.REQUEST_TIMEOUT || 10000);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  requestConfig.signal = controller.signal;

  try {
    if (config.IS_DEVELOPMENT && config.ENABLE_DEBUG) {
      console.log(`🌐 API Request: ${requestConfig.method || 'GET'} ${url}`);
      console.log(`🔧 API_BASE_URL: ${getApiBaseUrl()}`);
      console.log(`📱 Is Mobile: ${mobileDebugger.isMobile()}`);
    }

    // Use mobile-optimized fetch for mobile devices
    const response = mobileDebugger.isMobile() 
      ? await mobileDebugger.mobileFetch(url, requestConfig)
      : await fetch(url, requestConfig);
    clearTimeout(timeoutId);

    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.message || data || `HTTP ${response.status}: ${response.statusText}`;
      
      if (config.IS_DEVELOPMENT) {
        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          url,
          data
        });
      }
      
      throw new Error(errorMessage);
    }

    if (config.IS_DEVELOPMENT && config.ENABLE_DEBUG) {
      console.log(`✅ API Response: ${requestConfig.method || 'GET'} ${url}`, data);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    
    if (config.IS_DEVELOPMENT) {
      console.error('❌ API Request Error:', {
        url,
        error: error.message,
        stack: error.stack
      });
    }
    
    // For mobile devices, try to retry the request once
    if (mobileDebugger.isMobile() && !options._retried) {
      console.log('📱 Mobile retry attempt for:', url);
      try {
        return await apiRequest(endpoint, { ...options, _retried: true });
      } catch (retryError) {
        console.error('📱 Mobile retry failed:', retryError.message);
        throw retryError;
      }
    }
    
    throw error;
  }
};

// Admin HTTP request helper
const adminApiRequest = async (endpoint, options = {}) => {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const adminToken = getAdminToken();
  
  const requestConfig = {
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      ...options.headers,
    },
    ...options,
  };

  // Add timeout for requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT || 10000);
  requestConfig.signal = controller.signal;

  try {
    if (config.IS_DEVELOPMENT && config.ENABLE_DEBUG) {
      console.log(`🌐 Admin API Request: ${requestConfig.method || 'GET'} ${url}`);
      console.log(`🔧 API_BASE_URL: ${getApiBaseUrl()}`);
    }

    const response = await fetch(url, requestConfig);
    clearTimeout(timeoutId);

    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(data.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      error.url = url;
      error.data = data;
      throw error;
    }

    if (config.IS_DEVELOPMENT && config.ENABLE_DEBUG) {
      console.log(`✅ Admin API Response: ${requestConfig.method || 'GET'} ${url}`, data);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timeout');
      timeoutError.status = 408;
      timeoutError.statusText = 'Request Timeout';
      timeoutError.url = url;
      throw timeoutError;
    }

    if (config.IS_DEVELOPMENT && config.ENABLE_DEBUG) {
      console.error(`❌ Admin API Error:`, {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        data: error.data
      });
    }
    
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout: () => {
    removeAuthToken();
  },

  getProfile: () => apiRequest('/auth/profile'),

  updateProfile: (profileData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  changePassword: (passwordData) => apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  }),

  verifyToken: () => apiRequest('/auth/verify-token', {
    method: 'POST',
  }),

  // Forgot password
  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Verify OTP
  verifyOTP: (email, otp) => apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  }),

  // Reset password with token
  resetPassword: (token, newPassword) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  }),

  // Admin login
  adminLogin: async (credentials) => {
    const data = await apiRequest('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setAdminToken(data.token);
    }
    return data;
  },

  // Admin profile
  getAdminProfile: () => adminApiRequest('/auth/admin-profile'),

  // Admin logout
  adminLogout: () => {
    removeAdminToken();
  },
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const headers = {};
    
    // Add cache-busting headers if timestamp is provided
    if (params._t) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }
    
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`, {
      headers
    });
  },

  getById: (id) => apiRequest(`/products/${id}`),

  getFeatured: () => apiRequest('/products/featured'),

  getCategories: () => apiRequest('/products/categories'),

  search: (query, limit = 10) => apiRequest(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`),

  create: (productData) => adminApiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

  update: (id, productData) => adminApiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),

  delete: (id) => adminApiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),

  toggleWishlist: (id) => apiRequest(`/products/${id}/wishlist`, {
    method: 'POST',
  }),
};

// Reviews API
export const reviewsAPI = {
  getByProduct: (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reviews/product/${productId}${queryString ? `?${queryString}` : ''}`);
  },

  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reviews${queryString ? `?${queryString}` : ''}`);
  },

  create: (reviewData) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  updateStatus: (id, statusData) => apiRequest(`/reviews/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),

  update: (id, reviewData) => apiRequest(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  }),

  delete: (id) => apiRequest(`/reviews/${id}`, {
    method: 'DELETE',
  }),

  getStats: () => apiRequest('/reviews/stats'),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return adminApiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => adminApiRequest(`/orders/${id}`),

  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  createDraft: (orderData) => apiRequest('/orders/draft', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  updateStatus: (id, statusData) => adminApiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),

  cancel: (id, reason) => adminApiRequest(`/orders/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  getStats: () => adminApiRequest('/orders/stats/summary'),

  // Track orders by mobile number (public endpoint)
  trackByMobile: (mobileNumber, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders/track/${mobileNumber}${queryString ? `?${queryString}` : ''}`);
  },
};

// Admin API
export const adminAPI = {
  getDashboard: () => adminApiRequest('/admin/dashboard'),

  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return adminApiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  updateUserStatus: (id, statusData) => adminApiRequest(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),

  getAnalytics: (period = '30') => adminApiRequest(`/admin/analytics?period=${period}`),

  getInventory: () => adminApiRequest('/admin/inventory'),

  bulkUpdateProducts: (updateData) => adminApiRequest('/admin/bulk-update-products', {
    method: 'POST',
    body: JSON.stringify(updateData),
  }),
};

// Manager API
export const managerAPI = {
  getCategories: () => apiRequest('/manager/categories'),
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/manager/products${queryString ? `?${queryString}` : ''}`);
  },
  getProduct: (id) => apiRequest(`/manager/products/${id}`),
  createProduct: (productData) => apiRequest('/manager/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  updateProduct: (id, productData) => apiRequest(`/manager/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),
  deleteProduct: (id) => apiRequest(`/manager/products/${id}`, {
    method: 'DELETE'
  }),
  getProfile: () => apiRequest('/manager/profile')
};

// Cart API (localStorage-based for now, can be moved to backend later)
export const cartAPI = {
  getCart: () => {
    try {
      const cart = localStorage.getItem('cart');
      if (!cart) {
        return [];
      }
      const parsedCart = JSON.parse(cart);
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      // Clear invalid cart data
      localStorage.removeItem('cart');
      return [];
    }
  },

  addToCart: (item) => {
    const cart = cartAPI.getCart();
    
    // Ensure price is a number
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    
    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.productId === item.productId && cartItem.size === item.size
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: Date.now().toString(),
        productId: item.productId,
        name: item.name,
        size: item.size,
        price: price,
        quantity: quantity,
        image: item.image,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    cartAPI.notifyCartUpdate();
    return cart;
  },

  updateQuantity: (itemId, quantity) => {
    const cart = cartAPI.getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    cartAPI.notifyCartUpdate();
    return cart;
  },

  removeFromCart: (itemId) => {
    const cart = cartAPI.getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    cartAPI.notifyCartUpdate();
    return updatedCart;
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    cartAPI.notifyCartUpdate();
    return [];
  },

  getCartTotal: () => {
    const cart = cartAPI.getCart();
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  },

  getCartCount: () => {
    const cart = cartAPI.getCart();
    if (!Array.isArray(cart)) {
      return 0;
    }
    return cart.reduce((count, item) => {
      const quantity = parseInt(item.quantity) || 0;
      return count + quantity;
    }, 0);
  },

  notifyCartUpdate: () => {
    // Dispatch custom event to notify components of cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },
};

// Error handler helper
export const handleApiError = (error) => {
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    removeAuthToken();
    window.location.href = '/login';
  }
  return error.message;
};

// Categories API
const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  getById: (id) => apiRequest(`/categories/${id}`),
  getByParent: (parentCategory) => apiRequest(`/categories?parentCategory=${parentCategory}`),
};

const uploadAPI = {
  uploadImage: (formData, isLogo = false) => {
    console.log('📁 Upload type:', isLogo ? 'Logo' : 'Product');
    
    const headers = {};
    
    // Add header to indicate upload type
    if (isLogo) {
      headers['x-upload-type'] = 'logo';
    }
    
    console.log('🌐 Upload API - Sending request to:', URLs.UPLOAD.IMAGE);
    console.log('📋 Upload API - Headers:', headers);
    
    return fetch(URLs.UPLOAD.IMAGE, {
      method: 'POST',
      headers: headers,
      body: formData
    }).then(async response => {
      console.log('📥 Upload API - Response status:', response.status);
      const data = await response.json();
      console.log('📥 Upload API - Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || `Upload failed: ${response.status}`);
      }
      
      return data;
    });
  },
  uploadImages: (formData) => {
    return fetch(URLs.UPLOAD.IMAGES, {
      method: 'POST',
      body: formData
    }).then(response => response.json());
  },
  deleteImage: (filename) => apiRequest(`/upload/image/${filename}`, { method: 'DELETE' })
};

// Named exports
export { uploadAPI, categoriesAPI, paymentSettingsAPI };

// Contact API
const contactAPI = {
  // Submit contact form
  submitContact: (contactData) => apiRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),

  // Get all contacts (Admin only)
  getContacts: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/contacts${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  },

  // Get contact by ID (Admin only)
  getContact: (id) => apiRequest(`/contacts/${id}`, {
    method: 'GET',
  }),

  // Update contact status (Admin only)
  updateContactStatus: (id, statusData) => apiRequest(`/contacts/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),

  // Delete contact (Admin only)
  deleteContact: (id) => apiRequest(`/contacts/${id}`, {
    method: 'DELETE',
  }),

  // Get contact statistics (Admin only)
  getContactStats: () => apiRequest('/contacts/stats/summary', {
    method: 'GET',
  }),
};

// Payment Settings API
const paymentSettingsAPI = {
  // Fetch payment settings (admin only)
  getPaymentSettings: () => adminApiRequest('/payment-settings', {
    method: 'GET',
  }),

  // Save payment settings (admin only)
  savePaymentSettings: (settingsData) => adminApiRequest('/payment-settings', {
    method: 'POST',
    body: JSON.stringify(settingsData),
  }),
};

export default {
  authAPI,
  productsAPI,
  categoriesAPI,
  reviewsAPI,
  ordersAPI,
  paymentSettingsAPI,
  adminAPI,
  managerAPI,
  cartAPI,
  uploadAPI,
  contactAPI,
  handleApiError,
};

import config from '../config/environment.js';

/**
 * URL Utility Functions
 * Centralized URL management for the entire application
 */

// Core URLs from configuration
export const URLs = {
  // Backend URLs
  API_BASE: config.API_BASE_URL,
  BACKEND: config.BACKEND_URL,
  API: config.API_URL,
  
  // Frontend URLs
  FRONTEND: config.FRONTEND_URL,
  WEBSITE: config.WEBSITE_URL,
  ADMIN: config.ADMIN_URL,
  
  // API Endpoints
  AUTH: {
    LOGIN: `${config.API_BASE_URL}/auth/login`,
    REGISTER: `${config.API_BASE_URL}/auth/register`,
    LOGOUT: `${config.API_BASE_URL}/auth/logout`,
    ADMIN_LOGIN: `${config.API_BASE_URL}/auth/admin-login`,
    MANAGER_LOGIN: `${config.API_BASE_URL}/auth/manager-login`,
    REFRESH: `${config.API_BASE_URL}/auth/refresh`,
    PROFILE: `${config.API_BASE_URL}/auth/profile`,
  },
  
  PRODUCTS: {
    BASE: `${config.API_BASE_URL}/products`,
    FEATURED: `${config.API_BASE_URL}/products/featured`,
    BEST_SELLERS: `${config.API_BASE_URL}/products/best-sellers`,
    CATEGORIES: `${config.API_BASE_URL}/products/categories`,
    SEARCH: `${config.API_BASE_URL}/products/search`,
    BY_ID: (id) => `${config.API_BASE_URL}/products/${id}`,
    BY_CATEGORY: (category) => `${config.API_BASE_URL}/products?category=${category}`,
  },
  
  UPLOAD: {
    IMAGE: `${config.API_BASE_URL}/upload/image`,
    IMAGES: `${config.API_BASE_URL}/upload/images`,
    DELETE_IMAGE: (publicId) => `${config.API_BASE_URL}/upload/image/${publicId}`,
  },
  
  ORDERS: {
    BASE: `${config.API_BASE_URL}/orders`,
    BY_ID: (id) => `${config.API_BASE_URL}/orders/${id}`,
    STATUS: (id) => `${config.API_BASE_URL}/orders/${id}/status`,
  },
  
  CATEGORIES: {
    BASE: `${config.API_BASE_URL}/categories`,
    BY_ID: (id) => `${config.API_BASE_URL}/categories/${id}`,
    BY_PARENT: (parent) => `${config.API_BASE_URL}/categories?parentCategory=${parent}`,
  },
  
  REVIEWS: {
    BASE: `${config.API_BASE_URL}/reviews`,
    BY_PRODUCT: (productId) => `${config.API_BASE_URL}/reviews?product=${productId}`,
  },
  
  ADMIN: {
    BASE: `${config.API_BASE_URL}/admin`,
    PRODUCTS: `${config.API_BASE_URL}/admin/products`,
    ORDERS: `${config.API_BASE_URL}/admin/orders`,
    USERS: `${config.API_BASE_URL}/admin/users`,
    ANALYTICS: `${config.API_BASE_URL}/admin/analytics`,
  },
  
  MANAGER: {
    BASE: `${config.API_BASE_URL}/manager`,
    PRODUCTS: `${config.API_BASE_URL}/manager/products`,
    PROFILE: `${config.API_BASE_URL}/manager/profile`,
  },
  
  CONFIG: `${config.API_BASE_URL}/config`,
};

// Frontend Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/admin-login',
  MANAGER_LOGIN: '/manager-login',
  ADMIN: '/admin',
  MANAGER: '/manager-dashboard',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  
  // Product Routes
  PRODUCT: (id) => `/product/${id}`,
  PRODUCTS: '/products',
  CATEGORY: (slug) => `/${slug}`,
  
  // Static Product Pages
  ALMONDS: '/almonds',
  CASHEWS: '/cashews',
  PISTACHIOS: '/pistachios',
  WALNUTS: '/walnuts',
  BRAZIL_NUTS: '/brazil-nuts',
  PEANUTS: '/peanuts',
  RAISINS: '/raisins',
  ANJEER: '/anjeer',
  APRICOTS: '/apricots',
  PRUNES: '/prunes',
  KIWI: '/kiwi',
  MANGO: '/mango',
  BLUEBERRIES: '/blueberries',
  CRANBERRIES: '/cranberries',
  STRAWBERRIES: '/strawberries',
  OMANI: '/omani',
  QUEEN_KALMI: '/queen-kalmi',
  ARABIAN: '/arabian',
  AJWA: '/ajwa',
  CHIA_SEEDS: '/chia-seeds',
  FLAX_SEEDS: '/flax-seeds',
  PUMPKIN_SEEDS: '/pumpkin-seeds',
  SUNFLOWER_SEEDS: '/sunflower-seeds',
  
  // Special Pages
  COMBOS: '/combos',
};

// Image URL Helper
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/dev1.png';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) {
    // Handle special characters in filenames by encoding the URL
    const encodedUrl = encodeURI(`${config.BACKEND_URL}${imageUrl}`);
    return encodedUrl;
  }
  // Handle old image paths that were moved to public folder
  if (imageUrl.includes('/src/Components/Homepages/')) {
    const filename = imageUrl.split('/').pop();
    return `/${filename}`;
  }
  return imageUrl;
};

// External URLs
export const EXTERNAL_URLS = {
  FACEBOOK: 'https://facebook.com/happilo',
  INSTAGRAM: 'https://instagram.com/happilo',
  TWITTER: 'https://twitter.com/happilo',
  LINKEDIN: 'https://linkedin.com/company/happilo',
  YOUTUBE: 'https://youtube.com/happilo',
  WHATSAPP: 'https://wa.me/919876543210',
  EMAIL: 'mailto:info@happilo.com',
  PHONE: 'tel:+919876543210',
};

// Utility Functions
export const urlUtils = {
  // Build query string from object
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },
  
  // Build full URL with query parameters
  buildUrl: (baseUrl, params = {}) => {
    const queryString = urlUtils.buildQueryString(params);
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },
  
  // Get current domain
  getCurrentDomain: () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return config.FRONTEND_URL;
  },
  
  // Check if URL is external
  isExternalUrl: (url) => {
    return url.startsWith('http://') || url.startsWith('https://');
  },
  
  // Get relative path from full URL
  getRelativePath: (url) => {
    if (urlUtils.isExternalUrl(url)) {
      return url;
    }
    return url.startsWith('/') ? url : `/${url}`;
  },
};

export default URLs;

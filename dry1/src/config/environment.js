// Environment configuration
// Detect if running on mobile/network access
const isNetworkAccess = window.location.hostname === '192.168.1.8' || 
                       window.location.hostname.includes('192.168.') ||
                       window.location.hostname === '0.0.0.0';
const isProduction = window.location.hostname === 'mufindryfruit.com';
const baseHost = isNetworkAccess ? '192.168.1.8' : 'localhost';

console.log('🔍 Network Detection:', { isNetworkAccess, baseHost, hostname: window.location.hostname });

let config = {
  // Default fallback configuration
  // If on network access (mobile), always use the network host, ignore env vars
  API_BASE_URL: isNetworkAccess ? `http://${baseHost}:5001/api` : (isProduction ? 'https://mufindryfruit.com/api' : (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5001/api' : `http://${baseHost}:5001/api`))),
  BACKEND_URL: isNetworkAccess ? `http://${baseHost}:5001` : (import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? '' : `http://${baseHost}:5001`)),
  FRONTEND_URL: isNetworkAccess ? `http://${baseHost}:5173` : (import.meta.env.VITE_FRONTEND_URL || `http://${baseHost}:5173`),
  WEBSITE_URL: isNetworkAccess ? `http://${baseHost}:5173` : (import.meta.env.VITE_WEBSITE_URL || `http://${baseHost}:5173`),
  ADMIN_URL: isNetworkAccess ? `http://${baseHost}:5173/admin` : (import.meta.env.VITE_ADMIN_URL || `http://${baseHost}:5173/admin`),
  API_URL: isNetworkAccess ? `http://${baseHost}:5001/api` : (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : `http://${baseHost}:5001/api`)),
  
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Mufindryfruit',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5000000,
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 12,
  MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 100,
  CACHE_DURATION: parseInt(import.meta.env.VITE_CACHE_DURATION) || 300000,
  REQUEST_TIMEOUT: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000,
};

console.log('🔍 Initial Config Created:', {
  API_BASE_URL: config.API_BASE_URL,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  baseHost,
  isNetworkAccess
});

// Function to fetch configuration from backend
const fetchConfigFromBackend = async () => {
  try {
    const configUrl = `${config.API_BASE_URL}/config`;
    console.log('🔧 Attempting to fetch config from:', configUrl);
    
    const response = await fetch(configUrl);
    console.log('🔧 Config fetch response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.config) {
        // Save current URL config if on network
        const preserveUrls = isNetworkAccess ? {
          API_BASE_URL: config.API_BASE_URL,
          BACKEND_URL: config.BACKEND_URL,
          FRONTEND_URL: config.FRONTEND_URL,
          WEBSITE_URL: config.WEBSITE_URL,
          ADMIN_URL: config.ADMIN_URL,
          API_URL: config.API_URL
        } : {};
        
        // Merge backend config with frontend config
        config = { ...config, ...data.config, ...preserveUrls };
        console.log('🔧 Configuration loaded from backend:', config);
        return true;
      }
    } else {
      console.warn('⚠️ Config fetch failed with status:', response.status);
    }
  } catch (error) {
    console.warn('⚠️ Failed to load configuration from backend, using fallback:', error.message);
    console.warn('⚠️ Full error:', error);
  }
  return false;
};

// Initialize configuration
let configInitialized = false;
const initializeConfig = async () => {
  if (!configInitialized) {
    configInitialized = true;
    await fetchConfigFromBackend();
  }
  return config;
};

// Function to refresh configuration (for admin panel)
const refreshConfig = async () => {
  const success = await fetchConfigFromBackend();
  if (success) {
    validateConfig();
    return config;
  }
  throw new Error('Failed to refresh configuration from backend');
};

// Validation
const validateConfig = () => {
  const requiredVars = ['API_BASE_URL'];
  const missing = requiredVars.filter(key => !config[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('Please check your .env file');
  }

  if (config.IS_DEVELOPMENT) {
    console.log('🔧 Development Configuration:', {
      API_BASE_URL: config.API_BASE_URL,
      BACKEND_URL: config.BACKEND_URL,
      FRONTEND_URL: config.FRONTEND_URL,
      isNetworkAccess: isNetworkAccess,
      hostname: window.location.hostname,
      APP_NAME: config.APP_NAME,
      APP_VERSION: config.APP_VERSION
    });
  }
};

// Run validation
validateConfig();

// Export both the config object and the initialization functions
export { initializeConfig, refreshConfig };
export default config;

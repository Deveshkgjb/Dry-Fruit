const express = require('express');
const router = express.Router();

// Configuration endpoint - serves environment variables to frontend
router.get('/config', (req, res) => {
  try {
    // Detect if request is from network (mobile device)
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const isNetworkRequest = clientIP.includes('192.168') || req.get('host')?.includes('192.168.1.8');
    
    // Use network IP for mobile access, localhost for desktop
    const baseHost = isNetworkRequest ? '192.168.1.8' : 'localhost';
    const frontendPort = isNetworkRequest ? '5173' : '5173';
    const backendPort = process.env.PORT || 5001;
    
    const config = {
      // App Configuration
      APP_NAME: process.env.APP_NAME || 'Happilo',
      APP_VERSION: process.env.APP_VERSION || '1.0.0',
      APP_DESCRIPTION: process.env.APP_DESCRIPTION || 'Premium Dry Fruits & Nuts E-commerce Platform',
      
      // Core URLs Configuration
      API_BASE_URL: process.env.API_BASE_URL || `http://${baseHost}:${backendPort}/api`,
      FRONTEND_URL: process.env.FRONTEND_URL || `http://${baseHost}:${frontendPort}`,
      BACKEND_URL: process.env.BACKEND_URL || `http://${baseHost}:${backendPort}`,
      WEBSITE_URL: process.env.WEBSITE_URL || `http://${baseHost}:${frontendPort}`,
      ADMIN_URL: process.env.ADMIN_URL || `http://${baseHost}:${frontendPort}/admin`,
      API_URL: process.env.API_URL || `http://${baseHost}:${backendPort}/api`,
      
      // File Upload Configuration
      MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5000000, // 5MB
      UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
      
      // Cache Configuration
      CACHE_DURATION: parseInt(process.env.CACHE_DURATION) || 300000, // 5 minutes
      
      // Request Configuration
      REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT) || 10000, // 10 seconds
      
      // Pagination Configuration
      DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE) || 12,
      MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE) || 100,
      
      // Feature Flags
      ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
      ENABLE_DEBUG: process.env.ENABLE_DEBUG === 'true' || process.env.NODE_ENV === 'development',
      ENABLE_CORS: process.env.ENABLE_CORS !== 'false',
      
      // External Services (only public keys)
      GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || '',
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
      
      // Environment
      NODE_ENV: process.env.NODE_ENV || 'development',
      IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
      IS_PRODUCTION: process.env.NODE_ENV === 'production',
      
      // Additional Configuration
      SERVER_PORT: process.env.PORT || 5001,
      SERVER_HOST: process.env.HOST || 'localhost',
      UPLOAD_MAX_FILES: parseInt(process.env.UPLOAD_MAX_FILES) || 10,
      SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT) || 3600000, // 1 hour
      
      // Business Configuration
      CURRENCY: process.env.CURRENCY || 'INR',
      CURRENCY_SYMBOL: process.env.CURRENCY_SYMBOL || '₹',
      TAX_RATE: parseFloat(process.env.TAX_RATE) || 0.18, // 18% GST
      SHIPPING_FREE_THRESHOLD: parseFloat(process.env.SHIPPING_FREE_THRESHOLD) || 500,
      SHIPPING_COST: parseFloat(process.env.SHIPPING_COST) || 50
    };

    res.json({
      success: true,
      config: config
    });
  } catch (error) {
    console.error('Error serving config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load configuration'
    });
  }
});

module.exports = router;

// Mobile Debugger Utility
// Helps diagnose mobile connectivity and API issues

export const mobileDebugger = {
  // Check if running on mobile device
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768 ||
           ('ontouchstart' in window);
  },

  // Check network connectivity
  checkConnectivity: async () => {
    try {
      const response = await fetch('https://httpbin.org/get', { 
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true;
    } catch (error) {
      console.warn('Network connectivity check failed:', error);
      return false;
    }
  },

  // Test API endpoint connectivity
  testApiConnectivity: async (baseUrl) => {
    const tests = [
      { name: 'API Health Check', url: `${baseUrl}/` },
      { name: 'Config Endpoint', url: `${baseUrl}/config` },
      { name: 'Products Endpoint', url: `${baseUrl}/products` }
    ];

    const results = [];
    
    for (const test of tests) {
      try {
        const startTime = Date.now();
        const response = await fetch(test.url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        const endTime = Date.now();
        
        results.push({
          name: test.name,
          url: test.url,
          status: response.status,
          ok: response.ok,
          responseTime: endTime - startTime,
          success: response.ok
        });
      } catch (error) {
        results.push({
          name: test.name,
          url: test.url,
          status: 'ERROR',
          ok: false,
          error: error.message,
          success: false
        });
      }
    }
    
    return results;
  },

  // Get device information
  getDeviceInfo: () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port
    };
  },

  // Log comprehensive debug information
  logDebugInfo: async (baseUrl) => {
    const deviceInfo = mobileDebugger.getDeviceInfo();
    const connectivity = await mobileDebugger.checkConnectivity();
    const apiTests = await mobileDebugger.testApiConnectivity(baseUrl);
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      isMobile: mobileDebugger.isMobile(),
      deviceInfo,
      connectivity,
      apiTests,
      localStorage: {
        hasAuthToken: !!localStorage.getItem('authToken'),
        hasAdminToken: !!localStorage.getItem('adminToken'),
        cartItems: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).length : 0
      }
    };
    
    console.group('🔍 Mobile Debug Information');
    console.log('Device Info:', deviceInfo);
    console.log('Network Connectivity:', connectivity);
    console.log('API Tests:', apiTests);
    console.log('Local Storage:', debugInfo.localStorage);
    console.groupEnd();
    
    return debugInfo;
  },

  // Retry failed requests with exponential backoff
  retryRequest: async (requestFn, maxRetries = 3, baseDelay = 1000) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        console.warn(`Request attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  },

  // Enhanced fetch with mobile-specific optimizations
  mobileFetch: async (url, options = {}) => {
    const defaultOptions = {
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, mergedOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      console.error('Mobile fetch error:', {
        url,
        error: error.message,
        options: mergedOptions
      });
      throw error;
    }
  }
};

// Auto-log debug info on mobile devices
if (typeof window !== 'undefined' && mobileDebugger.isMobile()) {
  // Wait for page to load, then log debug info
  window.addEventListener('load', () => {
    setTimeout(async () => {
      try {
        const config = await import('../config/environment.js');
        const baseUrl = config.default.API_BASE_URL;
        await mobileDebugger.logDebugInfo(baseUrl);
      } catch (error) {
        console.error('Failed to log mobile debug info:', error);
      }
    }, 2000);
  });
}

export default mobileDebugger;

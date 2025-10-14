import { useState, useEffect } from 'react';
import { mobileDebugger } from '../../utils/mobileDebugger.js';
import config from '../../config/environment.js';

const MobileConnectivityChecker = ({ showAlways = false }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiConnectivity, setApiConnectivity] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check API connectivity
    const checkApiConnectivity = async () => {
      if (mobileDebugger.isMobile()) {
        try {
          const results = await mobileDebugger.testApiConnectivity(config.API_BASE_URL);
          setApiConnectivity(results);
        } catch (error) {
          console.error('API connectivity check failed:', error);
        }
      }
    };

    checkApiConnectivity();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Only show on mobile devices or if explicitly requested
  if (!mobileDebugger.isMobile() && !showAlways) {
    return null;
  }

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (apiConnectivity && apiConnectivity.every(test => test.success)) return 'bg-green-500';
    if (apiConnectivity && apiConnectivity.some(test => test.success)) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (apiConnectivity && apiConnectivity.every(test => test.success)) return 'Connected';
    if (apiConnectivity && apiConnectivity.some(test => test.success)) return 'Partial Connection';
    return 'API Error';
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-3 max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {getStatusText()}
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700 text-xs"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Network:</span>
              <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {apiConnectivity && (
              <>
                <div className="border-t pt-2">
                  <div className="font-medium mb-1">API Status:</div>
                  {apiConnectivity.map((test, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="truncate mr-2">{test.name}:</span>
                      <span className={test.success ? 'text-green-600' : 'text-red-600'}>
                        {test.success ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="border-t pt-2">
              <div className="font-medium mb-1">Device Info:</div>
              <div>Mobile: {mobileDebugger.isMobile() ? 'Yes' : 'No'}</div>
              <div>API URL: {config.API_BASE_URL}</div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileConnectivityChecker;

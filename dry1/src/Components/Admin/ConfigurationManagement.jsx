import React, { useState, useEffect } from 'react';
import { refreshConfig } from '../../config/environment.js';
import config from '../../config/environment.js';

const ConfigurationManagement = () => {
  const [currentConfig, setCurrentConfig] = useState(config);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load configuration on component mount
  useEffect(() => {
    refreshConfiguration();
  }, []);

  const refreshConfiguration = async () => {
    setLoading(true);
    setMessage('');
    try {
      const newConfig = await refreshConfig();
      setCurrentConfig(newConfig);
      setMessage('Configuration refreshed successfully!');
    } catch (error) {
      setMessage('Failed to refresh configuration: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const configCategories = {
    'App Configuration': [
      'APP_NAME', 'APP_VERSION', 'APP_DESCRIPTION', 'NODE_ENV'
    ],
    'API Configuration': [
      'API_BASE_URL', 'FRONTEND_URL', 'SERVER_PORT', 'SERVER_HOST'
    ],
    'File Upload': [
      'MAX_FILE_SIZE', 'UPLOAD_PATH', 'UPLOAD_MAX_FILES'
    ],
    'Cache & Performance': [
      'CACHE_DURATION', 'REQUEST_TIMEOUT', 'SESSION_TIMEOUT'
    ],
    'Pagination': [
      'DEFAULT_PAGE_SIZE', 'MAX_PAGE_SIZE'
    ],
    'Feature Flags': [
      'ENABLE_ANALYTICS', 'ENABLE_DEBUG', 'ENABLE_CORS'
    ],
    'Business Configuration': [
      'CURRENCY', 'CURRENCY_SYMBOL', 'TAX_RATE', 
      'SHIPPING_FREE_THRESHOLD', 'SHIPPING_COST'
    ],
    'External Services': [
      'GOOGLE_ANALYTICS_ID', 'STRIPE_PUBLISHABLE_KEY'
    ]
  };

  const getValueType = (key, value) => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    return 'string';
  };

  const formatValue = (key, value) => {
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return value.toString();
    return value || '';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration Management</h2>
        <p className="text-gray-600">
          View and manage application configuration loaded from backend environment variables.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={refreshConfiguration}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Configuration'}
        </button>
        {message && (
          <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>

      <div className="grid gap-6">
        {Object.entries(configCategories).map(([category, keys]) => (
          <div key={category} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keys.map(key => (
                <div key={key} className="border rounded p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key}
                  </label>
                  <div className="text-sm text-gray-600">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {formatValue(key, currentConfig[key])}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({getValueType(key, currentConfig[key])})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">How to Update Configuration</h4>
        <p className="text-blue-800 text-sm">
          Configuration values are loaded from backend environment variables. To update them:
        </p>
        <ol className="list-decimal list-inside text-blue-800 text-sm mt-2 space-y-1">
          <li>Update the <code className="bg-blue-100 px-1 rounded">.env</code> file in the backend directory</li>
          <li>Restart the backend server</li>
          <li>Click "Refresh Configuration" to reload the values</li>
        </ol>
      </div>
    </div>
  );
};

export default ConfigurationManagement;

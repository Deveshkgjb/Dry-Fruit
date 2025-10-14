import React, { useState, useEffect } from 'react';
import { useNotification } from '../Common/NotificationProvider.jsx';
import { paymentSettingsAPI } from '../../services/api.js';

const PaymentSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    upiId: '',
    accountHolderName: ''
  });
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch from backend API using the service
      const data = await paymentSettingsAPI.getPaymentSettings();
      
      if (data.success && data.settings) {
        setFormData({
          upiId: data.settings.upiId || '',
          accountHolderName: data.settings.accountHolderName || ''
        });
        console.log('💳 Payment settings loaded from backend:', data.settings);
      } else {
        console.log('💳 No payment settings found, using defaults');
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      showError('Failed to load payment settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Validate UPI ID format
      if (formData.upiId && !isValidUPI(formData.upiId)) {
        showError('Please enter a valid UPI ID (e.g., yourname@paytm)');
        return;
      }

      // Save to backend API using the service
      const data = await paymentSettingsAPI.savePaymentSettings(formData);
      
      if (data.success) {
        showSuccess('Payment settings saved successfully!');
        console.log('💳 Payment Settings Saved to Backend:', data.settings);
      } else {
        showError(data.message || 'Failed to save payment settings');
      }
      
    } catch (error) {
      console.error('Error saving payment settings:', error);
      showError('Failed to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  const isValidUPI = (upiId) => {
    // Basic UPI ID validation
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  };

  const generateUPISuggestions = () => {
    const suggestions = [
      'admin@paytm',
      'admin@phonepe',
      'admin@googlepay',
      'admin@ybl',
      'admin@okaxis'
    ];
    return suggestions;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">UPI Payment Settings</h1>
        <p className="text-gray-600">Configure your UPI ID to receive payments from customers</p>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* UPI Settings Section */}
          <div className="pb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </span>
              UPI Payment Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UPI ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="yourname@paytm"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 Enter your UPI ID where customers will send payments
                </p>
                
                {/* UPI Suggestions */}
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {generateUPISuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleInputChange('upiId', suggestion)}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Your Full Name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">UPI Settings Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">UPI ID:</span>
                <span className="ml-2 text-blue-600">{formData.upiId || 'Not set'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Account Holder:</span>
                <span className="ml-2 text-gray-600">{formData.accountHolderName || 'Not set'}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Payment Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Information Card */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Important Information</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• UPI ID is the primary method customers will use to send payments</li>
          <li>• Make sure your UPI ID is active and verified with your bank</li>
          <li>• Customers will see your UPI ID during checkout</li>
          <li>• Changes will be reflected immediately on your website</li>
          <li>• Keep your UPI ID updated for seamless payment processing</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentSettings;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';
import { useNotification } from '../../Common/NotificationProvider.jsx';
import { cartAPI } from '../../../services/api.js';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiData, setUpiData] = useState({
    upiId: '',
    selectedApp: ''
  });
  const [errors, setErrors] = useState({});
  const [cartTotal, setCartTotal] = useState(0);

  // Your UPI ID for receiving payments
  const MERCHANT_UPI_ID = '9958815201@ybl';
  const MERCHANT_NAME = 'Happilo';

  useEffect(() => {
    // Get cart total when component mounts
    const total = cartAPI.getCartTotal();
    setCartTotal(total);
  }, []);

  const handleUpiInputChange = (e) => {
    const { name, value } = e.target;
    setUpiData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validateUpiForm = () => {
    const newErrors = {};
    
    // If no UPI app is selected and no manual UPI ID is entered
    if (!upiData.selectedApp && !upiData.upiId.trim()) {
      newErrors.upiId = 'Please select a UPI app or enter UPI ID manually';
    } else if (upiData.upiId.trim() && !upiData.upiId.includes('@')) {
      newErrors.upiId = 'UPI ID must contain @';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isValid = validateUpiForm();
    
    if (isValid) {
      // Save payment method to localStorage
      const paymentData = {
        method: 'upi',
        data: upiData,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('paymentMethod', JSON.stringify(paymentData));
      
      // If UPI app was selected, show different message
      if (upiData.selectedApp) {
        const selectedApp = upiApps.find(app => app.id === upiData.selectedApp);
        showSuccess(`Payment initiated with ${selectedApp?.name}. Please complete the payment in the app.`);
      } else {
        showSuccess('Payment method saved successfully!');
      }
      
      navigate('/order-review');
    } else {
      showError('Please select a UPI app or enter UPI ID manually');
    }
  };


  const upiApps = [
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: '📱',
      color: 'bg-purple-600',
      deepLink: 'phonepe://pay'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: '💳',
      color: 'bg-blue-600',
      deepLink: 'gpay://pay'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: '💰',
      color: 'bg-yellow-600',
      deepLink: 'paytmmp://pay'
    },
    {
      id: 'bhim',
      name: 'BHIM Pay',
      icon: '🏦',
      color: 'bg-green-600',
      deepLink: 'bhim://pay'
    },
    {
      id: 'amazonpay',
      name: 'Amazon Pay',
      icon: '🛒',
      color: 'bg-orange-600',
      deepLink: 'amazonpay://pay'
    },
    {
      id: 'mobikwik',
      name: 'MobiKwik',
      icon: '💸',
      color: 'bg-red-600',
      deepLink: 'mobikwik://pay'
    }
  ];

  const handleUpiAppClick = (app) => {
    setUpiData(prev => ({
      ...prev,
      selectedApp: app.id
    }));
    
    // Check if cart has items
    if (cartTotal <= 0) {
      showError('Cart is empty! Please add items to your cart first.');
      return;
    }
    
    // Check minimum amount
    if (cartTotal < 1) {
      showError('Minimum order amount is ₹1. Please add items to your cart.');
      return;
    }
    
    // Generate order ID (you can customize this)
    const orderId = `ORD${Date.now()}`;
    
    // Create UPI payment URL with pre-filled data
    // Format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR&tn=<NOTE>
    const upiUrl = `upi://pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}`;
    
    // Try to open the UPI app
    try {
      // Create a temporary link element to trigger the deep link
      const link = document.createElement('a');
      link.href = upiUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess(`Opening ${app.name} for payment of ₹${cartTotal.toFixed(2)}...`);
      
      // Save payment details to localStorage
      const paymentData = {
        method: 'upi',
        app: app.name,
        upiId: MERCHANT_UPI_ID,
        amount: cartTotal,
        orderId: orderId,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('paymentMethod', JSON.stringify(paymentData));
      
    } catch (error) {
      console.error('Error opening UPI app:', error);
      showError(`Failed to open ${app.name}. Please install the app or try another payment method.`);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <Header />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Address</span>
            </div>
            <div className="w-16 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Review</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Method</h1>
          
          {/* Payment Amount Display */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Total Amount to Pay</div>
                <div className="text-2xl font-bold text-gray-900">₹{cartTotal.toFixed(2)}</div>
                {cartTotal < 10 && (
                  <div className="text-xs text-red-600 mt-1">
                    ⚠️ Minimum order amount is ₹10
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Payment to</div>
                <div className="text-sm font-semibold text-gray-900">{MERCHANT_UPI_ID}</div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <div className="flex items-center p-4 border-2 border-green-500 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">📱</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">UPI Payment</div>
                    <div className="text-sm text-gray-500">Google Pay, PhonePe, Paytm, BHIM Pay, Amazon Pay & more</div>
                  </div>
                </div>
              </div>
            </div>


            {/* UPI Payment Form */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Choose UPI App</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">📱 Quick Payment:</span> Click on your UPI app below. It will automatically open with the amount (₹{cartTotal.toFixed(2)}) and payment details pre-filled. Just enter your UPI PIN to complete the payment!
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-4">Select your preferred UPI app to complete the payment</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {upiApps.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleUpiAppClick(app)}
                      className={`p-4 border-2 rounded-lg text-center hover:shadow-md transition-all duration-200 ${
                        upiData.selectedApp === app.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 ${app.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <span className="text-white text-xl">{app.icon}</span>
                      </div>
                      <div className="font-medium text-gray-900">{app.name}</div>
                    </button>
                  ))}
                </div>

                {/* Alternative: Manual UPI ID Input */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-gray-600">Or enter UPI ID manually:</span>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="upiId"
                      value={upiData.upiId}
                      onChange={handleUpiInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.upiId ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="yourname@paytm or yourname@okaxis"
                    />
                    {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
                  </div>
                </div>
              </div>
            )}


            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate('/address')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Address
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Continue to Review
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;

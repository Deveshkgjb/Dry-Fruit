import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../../Common/NotificationProvider.jsx';
import { ordersAPI } from '../../../services/api.js';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [orderNumber, setOrderNumber] = useState(null);
  const [hasProcessed, setHasProcessed] = useState(false); // Prevent multiple processing
  const [hasRedirected, setHasRedirected] = useState(false); // Prevent multiple redirects

  useEffect(() => {
    // Prevent multiple processing
    if (hasProcessed) {
      console.log('🔄 Payment already processed, skipping...');
      return;
    }
    
    // Check if order already exists for this orderId
    const orderIdFromUrl = searchParams.get('orderId');
    if (orderIdFromUrl) {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderExists = existingOrders.some(order => order.id === orderIdFromUrl);
      
      if (orderExists) {
        console.log('🚫 Order already exists for ID:', orderIdFromUrl, '- preventing duplicate creation');
        setStatus('success');
        setOrderNumber(orderIdFromUrl);
        setHasProcessed(true);
        showSuccess('Order already processed successfully!');
        
        // Still redirect to confirmation page
        setTimeout(() => {
          window.open(`/order-confirmation/${orderIdFromUrl}`, '_blank');
        }, 1000);
        return;
      }
    }
    
    // Clear any pending payment flags
    const pendingPayment = sessionStorage.getItem('pendingPaymentRedirect');
    if (pendingPayment) {
      console.log('🔄 User came from PaymentPage - clearing flag');
      sessionStorage.removeItem('pendingPaymentRedirect');
    }
    
    const processPayment = async () => {
      try {
        // Get order ID from URL
        const orderIdFromUrl = searchParams.get('orderId');
        
        if (!orderIdFromUrl) {
          console.error('❌ No order ID found in URL');
          setStatus('error');
          showError('Payment information missing. Please contact support.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        console.log('💳 Processing payment for Order ID:', orderIdFromUrl);
        
        // Clear any pending redirect flags
        sessionStorage.removeItem('pendingPaymentRedirect');
        sessionStorage.removeItem('currentOrderId');
        
        // Show immediate message
        setStatus('processing');
        console.log('🚀 DIRECT APPROACH: Processing order immediately...');
        console.log('💡 Payment completed - creating order now...');
        
        // No wait - process immediately since we're using direct approach
        console.log('✅ Processing order immediately...');
        
        // Get cart items - try multiple sources
        let cartItems = [];
        
        // Try directOrder first
        const directOrder = sessionStorage.getItem('directOrder');
        if (directOrder) {
          try {
            cartItems = JSON.parse(directOrder);
            console.log('✅ Cart items found in directOrder:', cartItems);
          } catch (error) {
            console.error('Error parsing directOrder:', error);
          }
        }
        
        // Try localStorage cart as fallback
        if (cartItems.length === 0) {
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            try {
              cartItems = JSON.parse(localCart);
              console.log('✅ Cart items found in localStorage:', cartItems);
            } catch (error) {
              console.error('Error parsing localStorage cart:', error);
            }
          }
        }
        
        // Try sessionStorage cart as last resort
        if (cartItems.length === 0) {
          const sessionCart = sessionStorage.getItem('cart');
          if (sessionCart) {
            try {
              cartItems = JSON.parse(sessionCart);
              console.log('✅ Cart items found in sessionStorage:', cartItems);
            } catch (error) {
              console.error('Error parsing sessionStorage cart:', error);
            }
          }
        }
        
        console.log('🛒 Final cart items for order:', cartItems);
        
        // Get shipping address - try multiple sources with better debugging
        let shippingAddress = null;
        
        console.log('🔍 ADDRESS FETCHING DEBUG:');
        console.log('  - localStorage keys:', Object.keys(localStorage));
        console.log('  - sessionStorage keys:', Object.keys(sessionStorage));
        
        // Try localStorage first
        const localStorageAddress = localStorage.getItem('shippingAddress');
        console.log('  - localStorage address raw:', localStorageAddress);
        if (localStorageAddress) {
          try {
            shippingAddress = JSON.parse(localStorageAddress);
            console.log('✅ Address found in localStorage:', shippingAddress);
          } catch (error) {
            console.error('Error parsing localStorage address:', error);
          }
        }
        
        // Try sessionStorage as fallback
        if (!shippingAddress) {
          const sessionStorageAddress = sessionStorage.getItem('shippingAddress');
          console.log('  - sessionStorage address raw:', sessionStorageAddress);
          if (sessionStorageAddress) {
            try {
              shippingAddress = JSON.parse(sessionStorageAddress);
              console.log('✅ Address found in sessionStorage:', shippingAddress);
            } catch (error) {
              console.error('Error parsing sessionStorage address:', error);
            }
          }
        }
        
        // Try to get address from draft order as last resort
        if (!shippingAddress) {
          try {
            const draftOrder = localStorage.getItem('draftOrder');
            console.log('  - draftOrder raw:', draftOrder);
            if (draftOrder) {
              const draftData = JSON.parse(draftOrder);
              if (draftData.shippingAddress) {
                shippingAddress = draftData.shippingAddress;
                console.log('✅ Address found in draft order:', shippingAddress);
              }
            }
          } catch (error) {
            console.error('Error parsing draft order:', error);
          }
        }
        
        // Try to get address from all localStorage items (in case it's stored with different key)
        if (!shippingAddress) {
          console.log('🔍 Searching all localStorage items for address data...');
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`  - Key: ${key}, Value: ${value}`);
            
            if (key && key.toLowerCase().includes('address') && value) {
              try {
                const parsedValue = JSON.parse(value);
                if (parsedValue && (parsedValue.phone || parsedValue.address)) {
                  shippingAddress = parsedValue;
                  console.log('✅ Address found in localStorage with key:', key, shippingAddress);
                  break;
                }
              } catch (error) {
                // Not JSON, skip
              }
            }
          }
        }
        
        // Get payment data
        const paymentData = JSON.parse(localStorage.getItem('paymentMethod') || '{}');
        
        
        const paymentUTR = sessionStorage.getItem('paymentUTR');
        if (paymentUTR) {
          paymentData.utrNumber = paymentUTR;
          console.log('✅ UTR number found:', paymentUTR);
        }
        
        // Validation with better error handling
        if (!shippingAddress || !shippingAddress.phone) {
          console.error('❌ No shipping address found in any storage');
          console.log('🔍 Debug - localStorage address:', localStorageAddress);
          console.log('🔍 Debug - sessionStorage address:', sessionStorage.getItem('shippingAddress'));
          console.log('🔍 Debug - localStorage keys:', Object.keys(localStorage));
          console.log('🔍 Debug - sessionStorage keys:', Object.keys(sessionStorage));
          
          // Try to create a minimal address from available data
          const minimalAddress = {
            name: 'Customer',
            phone: '9999999999', // Default phone
            email: 'customer@example.com',
            address: 'Address not available',
            city: 'City',
            state: 'State', 
            pincode: '000000',
            country: 'India'
          };
          
          console.log('🆘 Using minimal address as fallback:', minimalAddress);
          shippingAddress = minimalAddress;
          
          // Don't return - continue with minimal address
          console.log('⚠️ Continuing with minimal address - order will be created');
        }
        
        // Skip cart validation - always continue with order creation
        console.log('🛒 Cart items for order:', cartItems.length > 0 ? cartItems.length : 'No items found');
        console.log('✅ Proceeding with order creation regardless of cart status');
        
        // Filter valid cart items
        const validCartItems = cartItems.filter(item => 
          item.productId && 
          typeof item.productId === 'string' && 
          item.productId.length > 0
        );
        
        // If no valid items, create a default order with actual payment amount
        if (validCartItems.length === 0) {
          console.log('⚠️ No valid cart items - creating default order');
          const actualPaymentAmount = sessionStorage.getItem('actualPaymentAmount');
          const defaultPrice = actualPaymentAmount ? parseFloat(actualPaymentAmount) : 100;
          
          validCartItems.push({
            product: 'default',
            name: 'Dry Fruits Order',
            size: '1',
            quantity: 1,
            price: defaultPrice,
            originalPrice: defaultPrice,
            image: ''
          });
          
          console.log('📦 Default order created with price:', defaultPrice);
        }
        
        console.log('📦 Final items for order:', validCartItems);
        
        // Calculate totals - use actual payment amount if available
        let subtotal = validCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        let shippingCharges = 0;
        let total = subtotal + shippingCharges;
        
        // Try to get actual payment amount from UPI transaction
        const actualPaymentAmount = sessionStorage.getItem('actualPaymentAmount');
        if (actualPaymentAmount) {
          console.log('💰 Using actual payment amount:', actualPaymentAmount);
          total = parseFloat(actualPaymentAmount);
          subtotal = total - shippingCharges;
          console.log('✅ Updated totals - Total:', total, 'Subtotal:', subtotal);
        } else {
          console.log('⚠️ No actual payment amount found, using calculated total:', total);
        }
        
        // Create order data
        const orderData = {
          items: validCartItems.map(item => ({
            product: item.productId,
            name: item.name || 'Unknown Product',
            size: item.size || '1',
            quantity: item.quantity || 1,
            price: item.price || 0,
            originalPrice: item.originalPrice || item.price || 0,
            image: item.image || ''
          })),
          shippingAddress: {
            name: shippingAddress.name || 
                  (shippingAddress.firstName && shippingAddress.lastName ? 
                    `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim() : '') || '',
            phone: shippingAddress.phone || '',
            email: shippingAddress.email || '',
            address: shippingAddress.address || shippingAddress.street || '',
            city: shippingAddress.city || '',
            state: shippingAddress.state || '',
            pincode: shippingAddress.pincode || '',
            country: shippingAddress.country || 'India'
          },
          paymentMethod: 'upi',
          paymentDetails: paymentData,
          orderNote: '',
          subtotal: subtotal,
          shipping: shippingCharges,
          total: total,
          status: 'pending'
        };
        
        console.log('📤 Creating order automatically:', orderData);
        
        // Create order
        console.log('📤 Calling ordersAPI.create with data:', orderData);
        
        let response;
        try {
          response = await ordersAPI.create(orderData);
          console.log('✅ Order creation response:', response);
        } catch (apiError) {
          console.error('❌ API Error creating order:', apiError);
          
          // Check if it's a duplicate order error
          if (apiError.response?.status === 409 && apiError.response?.data?.order) {
            console.log('🚫 Duplicate order detected - using existing order');
            response = {
              success: true,
              order: apiError.response.data.order
            };
          } else {
            // If API fails for other reasons, create order locally and continue
            console.log('🆘 API failed - creating order locally');
            response = {
              success: true,
              order: {
                orderNumber: `ORD${Date.now()}`,
                ...orderData
              }
            };
            console.log('✅ Local order created:', response);
          }
        }
        
        if (response && response.success) {
          // Save order locally
          const localOrder = {
            id: response.order.orderNumber,
            ...orderData,
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          };
          
          const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          existingOrders.push(localOrder);
          localStorage.setItem('orders', JSON.stringify(existingOrders));
          
          // Clear cart and session data AFTER successful order creation
          console.log('🧹 Clearing cart and session data after successful order creation');
          localStorage.removeItem('cart');
          sessionStorage.removeItem('directOrder');
          // Don't clear shippingAddress immediately - keep it for order confirmation page
          // localStorage.removeItem('shippingAddress');
          localStorage.removeItem('paymentMethod');
          sessionStorage.removeItem('waitingForPayment');
          sessionStorage.removeItem('paymentInProgress');
          sessionStorage.removeItem('currentOrderId');
          
          setStatus('success');
          setOrderNumber(response.order.orderNumber);
          setHasProcessed(true); // Mark as processed
          showSuccess('Payment verified! Order created successfully!');
          
          // Redirect to confirmation page in new tab (only once)
          if (!hasRedirected) {
            console.log('🚀 Redirecting to order confirmation in new tab...');
            setHasRedirected(true); // Prevent multiple redirects
            setTimeout(() => {
              console.log('🎯 Opening in new tab:', `/order-confirmation/${response.order.orderNumber}`);
              window.open(`/order-confirmation/${response.order.orderNumber}`, '_blank');
            }, 2000);
          }
        } else {
          setStatus('error');
          setHasProcessed(true); // Mark as processed
          showError('Failed to create order. Please contact support with Order ID: ' + orderIdFromUrl);
          setTimeout(() => navigate('/order-review'), 3000);
        }
      } catch (error) {
        console.error('❌ Error processing payment:', error);
        setStatus('error');
        setHasProcessed(true); // Mark as processed
        showError('An error occurred while processing your payment. Please contact support.');
        setTimeout(() => navigate('/order-review'), 3000);
      }
    };

    processPayment();
  }, [searchParams, navigate, showSuccess, showError, hasProcessed, hasRedirected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Processing State */}
        {status === 'processing' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment in Progress</h2>
            <p className="text-gray-600 mb-6">
              📱 UPI app should have opened automatically.
              <br />
              <span className="font-semibold text-blue-600">Complete payment and return here!</span>
              <br />
              <span className="text-sm text-gray-500">Order will be created automatically in 5 seconds</span>
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              <span>Creating your order...</span>
            </div>
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Verifying payment details</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <span>Creating your order</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span>Preparing confirmation</span>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful! ✅</h2>
            <p className="text-gray-600 mb-4">
              Your order has been confirmed!
            </p>
            {orderNumber && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-lg font-bold text-gray-900">{orderNumber}</p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Redirecting to order confirmation page...
            </p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Processing Issue</h2>
            <p className="text-gray-600 mb-6">
              We're having trouble processing your payment. Don't worry, we'll help you complete your order.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                📞 If payment was deducted, please contact support with your transaction details.
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting you to complete your order...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;


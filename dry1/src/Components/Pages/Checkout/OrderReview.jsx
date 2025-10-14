import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';
import { useNotification } from '../../Common/NotificationProvider.jsx';
import { ordersAPI } from '../../../services/api.js';
import config from '../../../config/environment.js';

const OrderReview = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderNote, setOrderNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load cart items - check for direct order first, then regular cart
    const directOrder = sessionStorage.getItem('directOrder');
    if (directOrder) {
      try {
        const orderItems = JSON.parse(directOrder);
        setCartItems(orderItems);
        console.log('🛒 Loaded direct order items for review:', orderItems);
      } catch (error) {
        console.error('Error parsing direct order:', error);
        // Fallback to regular cart
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    } else {
      // Load regular cart items from localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
        console.log('🛒 Loaded cart items for review:', JSON.parse(savedCart));
      }
    }

    // Load shipping address
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      const addressData = JSON.parse(savedAddress);
      console.log('Loaded shipping address:', addressData);
      
      // If the address data doesn't have a name field, try to create one from firstName/lastName
      if (!addressData.name && (addressData.firstName || addressData.lastName)) {
        addressData.name = `${addressData.firstName || ''} ${addressData.lastName || ''}`.trim();
        console.log('Created name from firstName/lastName:', addressData.name);
      }
      
      setShippingAddress(addressData);
    }

    // Load payment method
    const savedPayment = localStorage.getItem('paymentMethod');
    if (savedPayment) {
      const paymentData = JSON.parse(savedPayment);
      console.log('Loaded payment method:', paymentData);
      setPaymentMethod(paymentData);
    }
  }, []);

  // Auto-save draft order when user has basic info but hasn't completed payment
  useEffect(() => {
    if (shippingAddress && shippingAddress.phone && cartItems.length > 0) {
      // Debounce the draft save to avoid too many API calls
      const timeoutId = setTimeout(() => {
        saveDraftOrder();
      }, 5000); // Save draft after 5 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [shippingAddress?.phone, cartItems.length, paymentMethod?.method]); // Only depend on essential fields

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 0; // No shipping charges
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  // Save draft order when user has basic info but hasn't completed payment
  const saveDraftOrder = async () => {
    if (!shippingAddress || !shippingAddress.phone) {
      return; // Don't save if no basic info
    }

    try {
      // Filter out items with invalid product IDs
      const validCartItems = cartItems.filter(item => 
        item.productId && 
        typeof item.productId === 'string' && 
        item.productId.length > 0
      );

      if (validCartItems.length === 0) {
        console.log('No valid cart items to save as draft');
        return;
      }

      const draftOrderData = {
        items: validCartItems.map(item => ({
          product: item.productId,
          name: item.name || 'Unknown Product',
          size: item.size || '1', // Ensure size is not empty
          quantity: item.quantity || 1,
          price: item.price || 0,
          originalPrice: item.originalPrice || item.price || 0,
          image: item.image || ''
        })),
        shippingAddress: {
          name: shippingAddress.name || '',
          phone: shippingAddress.phone,
          email: shippingAddress.email || '',
          address: shippingAddress.address || shippingAddress.street || '',
          city: shippingAddress.city || '',
          state: shippingAddress.state || '',
          pincode: shippingAddress.pincode || '',
          country: shippingAddress.country || 'India'
        },
        paymentMethod: paymentMethod?.method || 'pending',
        paymentDetails: paymentMethod?.data || {},
        orderNote: orderNote,
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        total: calculateTotal()
      };

      // Save draft order to backend
      console.log('Saving draft order with data:', draftOrderData);
      await ordersAPI.createDraft(draftOrderData);
      console.log('✅ Draft order saved successfully');
    } catch (error) {
      console.error('❌ Error saving draft order:', error);
      // Don't show error to user for draft saves as they're automatic
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentMethod) {
      showError('Please complete address and payment details first');
      return;
    }

    setLoading(true);
    showSuccess('Processing your order...');

    try {
      // Debug: Log cart items
      console.log('🔍 Cart items debug:', {
        totalCartItems: cartItems.length,
        cartItems: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          size: item.size
        }))
      });

      // Filter out items with invalid product IDs
      const validCartItems = cartItems.filter(item => 
        item.productId && 
        typeof item.productId === 'string' && 
        item.productId.length > 0
      );

      console.log('🔍 Valid cart items:', validCartItems.length, validCartItems);

      if (validCartItems.length === 0) {
        showError('No valid items in cart. Please add products to cart first.');
        setLoading(false);
        return;
      }

      // Create order object for backend
      const orderData = {
        items: validCartItems.map(item => ({
          product: item.productId,
          name: item.name || 'Unknown Product',
          size: item.size || '1', // Ensure size is not empty
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
        paymentMethod: paymentMethod.method,
        paymentDetails: paymentMethod.data,
        orderNote: orderNote,
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        total: calculateTotal(),
        status: 'pending'
      };

      // Debug: Log the shipping address data
      console.log('🔍 Shipping address debug:', {
        originalShippingAddress: shippingAddress,
        orderDataShippingAddress: orderData.shippingAddress,
        nameField: orderData.shippingAddress.name,
        nameFieldType: typeof orderData.shippingAddress.name,
        nameFieldLength: orderData.shippingAddress.name?.length
      });

      // Validate required fields before sending
      const validationErrors = [];
      
      if (!orderData.shippingAddress.name?.trim()) {
        validationErrors.push('Shipping name is required');
      }
      if (!orderData.shippingAddress.address?.trim()) {
        validationErrors.push('Shipping address is required');
      }
      if (!orderData.shippingAddress.city?.trim()) {
        validationErrors.push('Shipping city is required');
      }
      if (!orderData.shippingAddress.state?.trim()) {
        validationErrors.push('Shipping state is required');
      }
      if (!orderData.shippingAddress.pincode?.trim()) {
        validationErrors.push('Shipping pincode is required');
      }
      if (!orderData.paymentMethod) {
        validationErrors.push('Payment method is required');
      }
      
      if (validationErrors.length > 0) {
        console.log('❌ Validation errors:', validationErrors);
        console.log('🔍 Full order data being sent:', orderData);
        
        // For debugging - let's try to send anyway if name is missing but we have firstName/lastName
        if (validationErrors.includes('Shipping name is required') && (shippingAddress.firstName || shippingAddress.lastName)) {
          console.log('🔄 Attempting to fix name field automatically...');
          orderData.shippingAddress.name = `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim();
          validationErrors.splice(validationErrors.indexOf('Shipping name is required'), 1);
        }
        
        if (validationErrors.length > 0) {
          showError(`Please complete: ${validationErrors.join(', ')}`);
          setLoading(false);
          return;
        }
      }

      // Create order in backend
      console.log('Creating order with data:', orderData);
      console.log('🔍 Sending request to:', `${config.API_BASE_URL}/orders`);
      
      const response = await ordersAPI.create(orderData);
      console.log('🔍 API Response:', response);
      
      if (response && response.success) {
        // Also save to localStorage for offline access
        const localOrder = {
          id: response.order.orderNumber,
          ...orderData,
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(localOrder);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        // Clear cart and direct order
        localStorage.removeItem('cart');
        sessionStorage.removeItem('directOrder');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');

        showSuccess('Order placed successfully!');
        
        // Navigate to order confirmation
        navigate(`/order-confirmation/${response.order.orderNumber}`);
      } else {
        showError(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      
      // Try to get more detailed error information
      if (error.message && error.message.includes('Validation failed')) {
        showError('Validation failed. Please check all required fields and try again.');
      } else if (error.response && error.response.data && error.response.data.errors) {
        // Handle express-validator errors
        const validationErrors = error.response.data.errors;
        const errorMessages = validationErrors.map(err => err.msg).join(', ');
        showError(`Validation failed: ${errorMessages}`);
        console.error('Detailed validation errors:', validationErrors);
      } else {
        showError(error.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  const formatPaymentMethod = (method) => {
    if (method.method === 'card') {
      const cardNumber = method.data.cardNumber.replace(/\s/g, '');
      return `**** **** **** ${cardNumber.slice(-4)}`;
    } else if (method.method === 'upi') {
      return method.data.upiId;
    } else if (method.method === 'netbanking') {
      return method.data.bank;
    }
    return 'Unknown';
  };

  if (!shippingAddress || !paymentMethod) {
    return (
      <div className="w-full min-h-screen">
        <Header />
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Missing Information</h1>
            <p className="text-gray-600 mb-6">Please complete your address and payment details first.</p>
            <button
              onClick={() => navigate('/address')}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Complete Checkout
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <Header />
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
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
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image || '/dev1.png'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.size}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-700">
                <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                <p>{shippingAddress.country}</p>
                <p className="mt-2">Phone: {shippingAddress.phone}</p>
                <p>Email: {shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="text-gray-700">
                <p className="font-medium capitalize">{paymentMethod.method.replace('netbanking', 'Net Banking')}</p>
                <p>{formatPaymentMethod(paymentMethod)}</p>
              </div>
            </div>

            {/* Order Note */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Note</h2>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Add any special instructions for your order..."
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{calculateSubtotal()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-green-600">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
                
                <button
                  onClick={() => navigate('/payment')}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Payment
                </button>
              </div>

              <div className="mt-6 text-xs text-gray-500">
                <p>By placing this order, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderReview;

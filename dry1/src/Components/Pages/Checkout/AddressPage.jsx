import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';
import { useNotification } from '../../Common/NotificationProvider.jsx';
import { ordersAPI } from '../../../services/api.js';

const AddressPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    addressType: 'home',
    saveAddress: false
  });

  const [errors, setErrors] = useState({});
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Scroll to top when component mounts - multiple attempts to ensure it works
    window.scrollTo(0, 0);
    
    // Additional scroll to top after a short delay to handle any async rendering
    const scrollToTopTimer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    // Force scroll to top when page is fully loaded
    const handleLoad = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('load', handleLoad);
    
    return () => {
      clearTimeout(scrollToTopTimer);
      window.removeEventListener('load', handleLoad);
    };
    
    // Load cart items - check for direct order first, then regular cart
    const directOrder = sessionStorage.getItem('directOrder');
    
    if (directOrder) {
      try {
        const orderItems = JSON.parse(directOrder);
        setCartItems(orderItems);
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
      }
    }
  }, []);

  // Auto-save draft order when user has phone number and cart items
  useEffect(() => {
    if (formData.phone && cartItems.length > 0) {
      // Debounce the draft save to avoid too many API calls
      const timeoutId = setTimeout(() => {
        saveDraftOrder();
      }, 5000); // Save draft after 5 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [formData.phone, cartItems.length]); // Only depend on phone and cart length, not the entire cartItems array

  // Save draft order when user has phone number and cart items
  const saveDraftOrder = async () => {
    if (!formData.phone || cartItems.length === 0) {
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
          name: `${formData.firstName} ${formData.lastName}`.trim() || '',
          phone: formData.phone,
          email: formData.email || '',
          address: formData.address || '',
          city: formData.city || '',
          state: formData.state || '',
          pincode: formData.pincode || '',
          country: formData.country || 'India'
        },
        paymentMethod: 'pending',
        paymentDetails: {},
        orderNote: '',
        subtotal: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
        shipping: 50,
        total: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) + 50
      };

      // Save draft order to backend
      console.log('Saving draft order with data:', draftOrderData);
      await ordersAPI.createDraft(draftOrderData);
      console.log('✅ Draft order saved from address page');
    } catch (error) {
      console.error('❌ Error saving draft order:', error);
      // Don't show error to user for draft saves as they're automatic
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save address to localStorage
      const addressData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(), // Combine first and last name
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('shippingAddress', JSON.stringify(addressData));
      // showSuccess('Address saved successfully!');
      navigate('/payment');
    } else {
      showError('Please fill all required fields correctly');
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
                1
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Address</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Payment</span>
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
          <h1 className="text-gray-900 mb-3 font-bold whitespace-nowrap" style={{fontSize: '20px'}}>Delivery Address</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Address Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter complete address with house number, street, area"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter state"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 6-digit pincode"
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="India">India</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Address Type
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="addressType"
                    value="home"
                    checked={formData.addressType === 'home'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Home</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="addressType"
                    value="office"
                    checked={formData.addressType === 'office'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Office</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="addressType"
                    value="other"
                    checked={formData.addressType === 'other'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Other</span>
                </label>
              </div>
            </div>

            {/* Save Address Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Save this address for future orders</span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mr-  pt-6">
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="px-6 py-2 rounded-md transition-colors"
                style={{ backgroundColor: '#2563eb', color: 'white' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="px-8 py-2 ml-5 rounded-md transition-colors font-medium"
                style={{ backgroundColor: '#2563eb', color: 'white' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddressPage;

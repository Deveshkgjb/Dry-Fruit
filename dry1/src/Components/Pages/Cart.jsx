import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';
import { cartAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [deliveryCheck, setDeliveryCheck] = useState('');
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const items = cartAPI.getCart();
    setCartItems(items);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const updatedCart = cartAPI.updateQuantity(itemId, newQuantity);
    setCartItems(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartAPI.removeFromCart(itemId);
    setCartItems(updatedCart);
    showSuccess('Item removed from cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (parseInt(item.quantity) || 0), 0);
  };


  const handleCheckDelivery = () => {
    if (!deliveryCheck) {
      showError('Please enter your ZIP/Postal Code');
      return;
    }
    showSuccess('Delivery check completed');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showError('Your cart is empty');
      return;
    }
    
    // Save cart items to localStorage for checkout process
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Navigate to address page
    navigate('/address');
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-screen">
        <Header />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              to="/"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </Link>
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
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Main Cart Content */}
          <div className="lg:col-span-2">
            {/* Cart Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Cart</h1>
              <div className="w-full h-px bg-green-500 mb-3 sm:mb-4"></div>
              <p className="text-green-600 font-medium text-sm sm:text-base">You are eligible for free shipping.</p>
            </div>

            {/* Cart Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Product</th>
                      <th className="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold text-gray-700">Quantity</th>
                      <th className="px-3 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image || '/dev1.png'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/dev1.png';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                ₹{parseFloat(item.price) || 0} • {item.size}
                              </p>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 text-sm hover:text-red-800 mt-2"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                              min="1"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{(parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Tax included. Shipping calculated at checkout.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order note</label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-20 resize-none"
                  placeholder="Add a note to your order..."
                />
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold mb-6"
              >
                Checkout
              </button>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Check if we ship/deliver to your address.</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={deliveryCheck}
                    onChange={(e) => setDeliveryCheck(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Your ZIP/Postal Code"
                  />
                  <button
                    onClick={handleCheckDelivery}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;

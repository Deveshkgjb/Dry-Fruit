import React, { useState, useEffect } from 'react';
import { cartAPI } from '../../services/api.js';
import config from '../../config/environment.js';

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'COD'
  });

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }
  }, [isOpen]);

  const loadCartItems = () => {
    const items = cartAPI.getCart();
    setCartItems(items);
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cartAPI.updateQuantity(itemId, newQuantity);
    setCartItems(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartAPI.removeFromCart(itemId);
    setCartItems(updatedCart);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      const requiredFields = ['name', 'phone', 'street', 'city', 'state', 'zipCode'];
      const missingFields = requiredFields.filter(field => !checkoutForm[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Create order
      const orderData = {
        items: cartItems.map(item => ({
          product: item.productId,
          size: item.size,
          quantity: item.quantity
        })),
        shippingAddress: {
          name: checkoutForm.name,
          phone: checkoutForm.phone,
          email: checkoutForm.email,
          street: checkoutForm.street,
          city: checkoutForm.city,
          state: checkoutForm.state,
          zipCode: checkoutForm.zipCode,
          country: 'India'
        },
        payment: {
          method: checkoutForm.paymentMethod
        }
      };

      // Here you would call the actual API
      console.log('Order data:', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success
      cartAPI.clearCart();
      setCartItems([]);
      setShowCheckout(false);
      onClose();
      
      alert('Order placed successfully! Order ID: #' + Date.now());
      
    } catch (error) {
      if (config.IS_DEVELOPMENT) {
        console.error('Checkout error:', error);
      }
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            Shopping Cart ({getCartCount()})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {!showCheckout ? (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">🛒</div>
                  <p className="text-gray-600">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add some products to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <img
                        src={item.image || '/dev1.png'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/dev1.png';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.size}</p>
                        <p className="text-sm font-semibold text-green-600">₹{parseFloat(item.price) || 0}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-green-600">₹{getCartTotal()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        ) : (
          /* Checkout Form */
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <button
                onClick={() => setShowCheckout(false)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Back to Cart
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-4">Checkout</h3>
            
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              {/* Personal Information */}
              <div>
                <h4 className="font-medium mb-3">Personal Information</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={checkoutForm.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={checkoutForm.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={checkoutForm.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h4 className="font-medium mb-3">Delivery Address</h4>
                <div className="space-y-3">
                  <textarea
                    name="street"
                    placeholder="Street Address *"
                    value={checkoutForm.street}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      value={checkoutForm.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State *"
                      value={checkoutForm.state}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code *"
                    value={checkoutForm.zipCode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="font-medium mb-3">Payment Method</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={checkoutForm.paymentMethod === 'COD'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Cash on Delivery (COD)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={checkoutForm.paymentMethod === 'UPI'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    UPI Payment
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={checkoutForm.paymentMethod === 'Credit Card'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Credit Card
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{(parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;

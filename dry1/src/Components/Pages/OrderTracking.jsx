import React, { useState } from 'react';
import { 
  FaSearch, 
  FaTruck, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  
  FaMobile,
  FaSpinner
} from 'react-icons/fa';
import { useNotification } from '../Common/NotificationProvider.jsx';
import { ordersAPI } from '../../services/api.js';

const OrderTracking = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!mobileNumber.trim()) {
      showError('Please enter your mobile number');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Call the real API endpoint
      const response = await ordersAPI.trackByMobile(mobileNumber);
      
      if (response.success && response.orders) {
        setOrders(response.orders);
        
        if (response.orders.length === 0) {
          showError('No orders found for this mobile number');
        } else {
          showSuccess(`Found ${response.orders.length} order(s) for mobile number ${mobileNumber}`);
        }
      } else {
        showError('No orders found for this mobile number');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to fetch orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'shipped':
      case 'out_for_delivery':
        return <FaTruck className="text-blue-500" />;
      case 'processing':
      case 'confirmed':
        return <FaClock className="text-yellow-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your mobile number to track your orders</p>
        </div>

        {/* Premium Search Form */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaMobile className="w-4 h-4 text-green-600" />
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your 10-digit mobile number"
                  className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
                  maxLength="10"
                  pattern="[0-9]{10}"
                />
                <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Track Orders
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-600">No orders found for mobile number {mobileNumber}</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <img
                              src={item.product?.images?.[0]?.url || item.image || "/dry.png"}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                            </div>
                            <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Shipping Address</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.shippingAddress.name}</p>
                            <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <FaPhone className="w-3 h-3 text-gray-400" />
                                <span className="text-sm text-gray-600">{order.shippingAddress.phone}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FaEnvelope className="w-3 h-3 text-gray-400" />
                                <span className="text-sm text-gray-600">{order.shippingAddress.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Status Information */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Order Status</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {order.status.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Last updated: {formatDate(order.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-900">Total Amount</span>
                        <span className="text-lg font-bold text-gray-900">₹{order.pricing.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();

  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    // Show mock data first to demonstrate the UI
    const mockOrders = [
      {
        _id: "68d84491145ca7f056b42e46",
        orderNumber: "HP7937590003",
        user: null,
        items: [
          {
            product: {
              _id: "68d824fd1ec07a43e1a27ca0",
              name: "Premium California Almonds",
              images: [{ url: "/dry.png", alt: "Premium California Almonds" }]
            },
            name: "Premium California Almonds",
            size: "250g",
            quantity: 1,
            price: 299,
            originalPrice: 399,
            image: "/dry.png"
          }
        ],
        shippingAddress: {
          name: "John Doe",
          phone: "+91 9876543210",
          email: "john@example.com",
          street: "456 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India"
        },
        payment: {
          method: "upi",
          status: "completed"
        },
        pricing: {
          subtotal: 299,
          shippingCharges: 50,
          tax: 15,
          total: 364
        },
        status: "pending",
        createdAt: "2025-09-27T20:09:53.775Z",
        updatedAt: "2025-09-27T20:09:53.775Z"
      },
      {
        _id: "68d84491145ca7f056b42e48",
        orderNumber: "HP7937590004",
        user: null,
        items: [
          {
            product: {
              _id: "68d824fd1ec07a43e1a27ca1",
              name: "Premium Cashews",
              images: [{ url: "/dry.png", alt: "Premium Cashews" }]
            },
            name: "Premium Cashews",
            size: "500g",
            quantity: 2,
            price: 549,
            originalPrice: 699,
            image: "/dry.png"
          }
        ],
        shippingAddress: {
          name: "Jane Smith",
          phone: "+91 9876543211",
          email: "jane@example.com",
          street: "789 Oak Avenue",
          city: "Delhi",
          state: "Delhi",
          zipCode: "110001",
          country: "India"
        },
        payment: {
          method: "upi",
          status: "completed"
        },
        pricing: {
          subtotal: 1098,
          shippingCharges: 0,
          tax: 55,
          total: 1153
        },
        status: "processing",
        createdAt: "2025-09-27T19:30:00.000Z",
        updatedAt: "2025-09-27T19:30:00.000Z"
      }
    ];
    
    try {
      // Check if admin token exists
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin authentication token found. Please log in again.');
      }

      // Try to fetch real orders first
      const response = await ordersAPI.getAll();
      console.log('🔍 Orders API Response:', response);
      
      if (response && response.orders) {
        if (response.orders.length > 0) {
          setOrders(response.orders);
          showSuccess(`Loaded ${response.orders.length} orders successfully!`);
        } else {
          setOrders([]);
          showSuccess('No orders found in database');
        }
      } else {
        // Fallback to mock data if response structure is unexpected
        console.warn('Unexpected response structure, using mock data:', response);
        setOrders(mockOrders);
        showSuccess('Showing sample orders (Unexpected response format)');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // Check if it's an authentication error
      if (error.message.includes('Invalid token') || error.message.includes('No admin authentication token') || error.message.includes('Authentication failed')) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        showError('Authentication expired. Redirecting to login...');
        setTimeout(() => {
          navigate('/admin-login');
        }, 2000);
      } else {
        showError('Failed to load orders. Please check your connection.');
      }
      
      // Show mock data as fallback
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await ordersAPI.updateStatus(orderId, { status: newStatus });
      if (response.success) {
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
        showSuccess('Order status updated successfully!');
      } else {
        showError('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showError('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'All' || order.status === filterStatus
  );

  const orderStats = {
    total: orders.length,
    draft: orders.filter(o => o.status === 'draft').length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled' && o.status !== 'draft').reduce((sum, o) => sum + (o.pricing?.total || 0), 0)
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="ml-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Orders</div>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes('login as admin') ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">You need to be logged in as an admin to view orders.</p>
              <button
                onClick={() => window.location.href = '/admin-login'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Admin Login
              </button>
            </div>
          ) : (
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Refresh Orders
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{orderStats.total}</div>
          <div className="text-sm text-gray-800">Total Orders</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{orderStats.draft}</div>
          <div className="text-sm text-yellow-800">Draft Orders</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{orderStats.pending}</div>
          <div className="text-sm text-gray-800">Pending</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{orderStats.processing}</div>
          <div className="text-sm text-blue-800">Processing</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{orderStats.shipped}</div>
          <div className="text-sm text-yellow-800">Shipped</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
          <div className="text-sm text-green-800">Delivered</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{orderStats.cancelled}</div>
          <div className="text-sm text-red-800">Cancelled</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">₹{orderStats.totalRevenue}</div>
          <div className="text-sm text-purple-800">Total Revenue</div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Status</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Products</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">#{order.orderNumber}</td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">{order.shippingAddress.name}</div>
                  <div className="text-sm text-gray-500">{order.shippingAddress.email}</div>
                  <div className="text-sm text-gray-500">{order.shippingAddress.phone}</div>
                </td>
                <td className="px-4 py-4">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-900">
                      {item.name} (x{item.quantity})
                    </div>
                  ))}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">₹{order.pricing.total}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleStatusChange(order._id, 'shipped')}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Ship
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusChange(order._id, 'delivered')}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Deliver
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Order Details - #{selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.shippingAddress?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedOrder.shippingAddress?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress?.street || selectedOrder.shippingAddress?.address || 'N/A'}</p>
                <p><strong>City:</strong> {selectedOrder.shippingAddress?.city || 'N/A'}</p>
                <p><strong>State:</strong> {selectedOrder.shippingAddress?.state || 'N/A'}</p>
                <p><strong>Pincode:</strong> {selectedOrder.shippingAddress?.zipCode || selectedOrder.shippingAddress?.pincode || 'N/A'}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Order Information</h4>
                <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod || selectedOrder.payment?.method || 'N/A'}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name} ({item.size}) x{item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  )) || <p>No items found</p>}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.pricing?.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{selectedOrder.pricing?.shippingCharges?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.pricing?.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder.pricing?.total?.toFixed(2) || selectedOrder.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                {selectedOrder.status === 'processing' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder._id, 'shipped');
                      setSelectedOrder(null);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Mark as Shipped
                  </button>
                )}
                {selectedOrder.status === 'shipped' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder._id, 'delivered');
                      setSelectedOrder(null);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Mark as Delivered
                  </button>
                )}
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder._id, 'cancelled');
                      setSelectedOrder(null);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No orders found matching the selected filter.
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

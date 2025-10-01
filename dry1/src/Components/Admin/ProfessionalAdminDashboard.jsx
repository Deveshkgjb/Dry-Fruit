import React, { useState } from 'react';
import { 
  FaBox, 
  FaClipboardList, 
  FaStar, 
  FaHome,
  FaSignOutAlt,
  FaCog,
  FaUser,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaBars,
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa';
import ProductManagement from './ProductManagement.jsx';
import ReviewManagement from './ReviewManagement.jsx';
import OrderManagement from './OrderManagement.jsx';
import PageManagement from './PageManagement.jsx';

const ProfessionalAdminDashboard = ({ adminUser, logout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, color: 'blue' },
    { id: 'products', label: 'Product Management', icon: FaBox, color: 'purple' },
    { id: 'orders', label: 'Order Management', icon: FaClipboardList, color: 'orange' },
    { id: 'reviews', label: 'Review Management', icon: FaStar, color: 'yellow' },
    { id: 'page-management', label: 'Page Management', icon: FaCog, color: 'gray' },
  ];

  const stats = [
    { label: 'Total Products', value: '1,234', icon: FaBox, color: 'bg-blue-500', change: '+12%' },
    { label: 'Active Orders', value: '89', icon: FaClipboardList, color: 'bg-orange-500', change: '+5%' },
    { label: 'Reviews', value: '456', icon: FaStar, color: 'bg-yellow-500', change: '+8%' },
    { label: 'Revenue', value: '₹2,45,678', icon: FaChartBar, color: 'bg-green-500', change: '+15%' }
  ];

  const recentOrders = [
    { id: '#1234', customer: 'John Doe', amount: '₹1,250', status: 'Processing', time: '2 hours ago' },
    { id: '#1235', customer: 'Jane Smith', amount: '₹890', status: 'Shipped', time: '4 hours ago' },
    { id: '#1236', customer: 'Mike Johnson', amount: '₹2,100', status: 'Delivered', time: '6 hours ago' },
    { id: '#1237', customer: 'Sarah Wilson', amount: '₹750', status: 'Pending', time: '8 hours ago' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <FaClock className="w-4 h-4 text-blue-500" />;
      case 'Shipped': return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'Delivered': return <FaCheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending': return <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-green-100 text-green-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'page-management':
        return <PageManagement />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaChartBar className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chart visualization would appear here</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{order.amount}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('products')}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  <FaPlus className="w-5 h-5" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  <FaEye className="w-5 h-5" />
                  <span>View Orders</span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <FaShieldAlt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Happilo Admin Pro</h1>
                  <p className="text-sm text-gray-600">Professional Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{adminUser?.name || 'Admin User'}</div>
                  <div className="text-gray-500">{adminUser?.email || 'admin@happilo.com'}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white/80 backdrop-blur-sm min-h-screen transition-all duration-300 border-r border-gray-200`}>
          <div className="p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
    </div>
  );
};

export default ProfessionalAdminDashboard;
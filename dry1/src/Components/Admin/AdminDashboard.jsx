import React, { useState } from 'react';
import { 
  FaBox, 
  FaStar, 
  FaClipboardList, 
  FaSignOutAlt, 
  FaBell, 
  FaUser,
  FaEnvelope,
  FaCog,
  FaCreditCard
} from 'react-icons/fa';
import ProductManagement from './ProductManagement.jsx';
import ReviewManagement from './ReviewManagement.jsx';
import OrderManagement from './OrderManagement.jsx';
import ContactManagement from './ContactManagement.jsx';
import PaymentSettings from './PaymentSettings.jsx';

const AdminDashboard = ({ adminUser, logout }) => {
  const [activeTab, setActiveTab] = useState('products');

  const handleLogout = () => {
    logout();
  };


  const sections = [
    { 
      id: 'products', 
      name: 'Product Management', 
      icon: FaBox,
      description: 'Manage your product catalog',
      color: 'blue'
    },
    { 
      id: 'orders', 
      name: 'Order Management', 
      icon: FaClipboardList,
      description: 'Track and manage orders',
      color: 'green'
    },
    { 
      id: 'contacts', 
      name: 'Contact Management', 
      icon: FaEnvelope,
      description: 'Manage customer inquiries and support requests',
      color: 'purple'
    },
    { 
      id: 'payments', 
      name: 'Payment Settings', 
      icon: FaCreditCard,
      description: 'Configure UPI ID and payment methods',
      color: 'indigo'
    }
    // ,
    // { 
    //   id: 'reviews', 
    //   name: 'Review Management', 
    //   icon: FaStar,
    //   description: 'Monitor customer reviews',
    //   color: 'yellow'
    // }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-xl">
                <FaCog className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Happilo Store Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <FaBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
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
                className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Navigation</h2>
              <p className="text-sm text-gray-500">Choose a section to manage</p>
            </div>
            <nav className="space-y-3">
              {sections.map((section) => {
                const IconComponent = section.icon;
                const isActive = activeTab === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? `bg-gradient-to-r from-${section.color}-500 to-${section.color}-600 text-white shadow-lg transform scale-105`
                        : 'text-gray-600 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isActive 
                          ? 'bg-white bg-opacity-20' 
                          : `bg-${section.color}-100 text-${section.color}-600`
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{section.name}</div>
                        <div className={`text-xs ${
                          isActive ? 'text-white text-opacity-80' : 'text-gray-500'
                        }`}>
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
            
            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-medium text-gray-900">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Orders</span>
                  <span className="font-medium text-green-600">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Reviews</span>
                  <span className="font-medium text-yellow-600">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {activeTab === 'products' && <ProductManagement />}
              {activeTab === 'orders' && <OrderManagement />}
              {activeTab === 'contacts' && <ContactManagement />}
              {activeTab === 'payments' && <PaymentSettings />}
              {activeTab === 'reviews' && <ReviewManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

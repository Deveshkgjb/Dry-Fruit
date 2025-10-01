import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, 
  FaUsers, 
  FaShoppingCart, 
  FaDollarSign,
  FaStar,
  FaEye,
  FaEyeSlash,
  FaCog,
  FaDownload,
  FaRefresh
} from 'react-icons/fa';
import { useNotification } from '../Common/NotificationProvider.jsx';

const SimpleAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [enabledFeatures, setEnabledFeatures] = useState({
    revenueTracking: true,
    orderAnalytics: true,
    customerInsights: true,
    productPerformance: true,
    categoryAnalytics: true,
    realTimeData: true,
    exportData: true
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const { showSuccess, showError } = useNotification();

  // Sample data
  const analyticsData = {
    totalRevenue: 1250000,
    totalOrders: 342,
    avgOrderValue: 3654,
    totalCustomers: 156,
    monthlyGrowth: 15.2,
    customerRetention: 78.5,
    topProducts: [
      { name: 'Premium California Almonds', sales: 89, revenue: 267000 },
      { name: 'Organic Cashew Nuts', sales: 67, revenue: 201000 },
      { name: 'Premium Pistachio Nuts', sales: 54, revenue: 162000 }
    ],
    categoryData: [
      { category: 'Nuts', percentage: 45, color: 'bg-blue-500' },
      { category: 'Dried Fruits', percentage: 30, color: 'bg-green-500' },
      { category: 'Berries', percentage: 15, color: 'bg-purple-500' },
      { category: 'Seeds', percentage: 10, color: 'bg-yellow-500' }
    ]
  };

  const toggleFeature = (feature) => {
    setEnabledFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    showSuccess(`${feature.replace(/([A-Z])/g, ' $1').toLowerCase()} ${!enabledFeatures[feature] ? 'enabled' : 'disabled'}`);
  };

  const exportAnalytics = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Revenue', `₹${analyticsData.totalRevenue}`],
      ['Total Orders', analyticsData.totalOrders],
      ['Average Order Value', `₹${analyticsData.avgOrderValue}`],
      ['Total Customers', analyticsData.totalCustomers]
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showSuccess('Analytics data exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaChartBar className="mr-3 text-blue-600" />
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 mt-1">Track your store performance and insights</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            
            <button
              onClick={() => setLoading(!loading)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <FaRefresh className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            
            {enabledFeatures.exportData && (
              <button
                onClick={exportAnalytics}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <FaDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <FaCog className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
        
        {/* Analytics Settings Panel */}
        {showSettings && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(enabledFeatures).map(([feature, enabled]) => (
                <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleFeature(feature)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {enabledFeatures.revenueTracking && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <FaDollarSign className="w-6 h-6 text-blue-600" />
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Revenue</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">₹{(analyticsData.totalRevenue / 100000).toFixed(1)}L</div>
            <div className="text-sm text-blue-800">Total Revenue</div>
            <div className="text-xs text-green-600 mt-1">+{analyticsData.monthlyGrowth}% this month</div>
          </div>
        )}
        
        {enabledFeatures.orderAnalytics && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <FaShoppingCart className="w-6 h-6 text-green-600" />
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Orders</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{analyticsData.totalOrders}</div>
            <div className="text-sm text-green-800">Total Orders</div>
            <div className="text-xs text-green-600 mt-1">+12% this month</div>
          </div>
        )}
        
        {enabledFeatures.customerInsights && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="w-6 h-6 text-purple-600" />
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Customers</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{analyticsData.totalCustomers}</div>
            <div className="text-sm text-purple-800">Total Customers</div>
            <div className="text-xs text-green-600 mt-1">+22% this month</div>
          </div>
        )}
        
        {enabledFeatures.productPerformance && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <FaStar className="w-6 h-6 text-red-600" />
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Rating</span>
            </div>
            <div className="text-2xl font-bold text-red-600">4.2⭐</div>
            <div className="text-sm text-red-800">Avg Rating</div>
            <div className="text-xs text-green-600 mt-1">+0.3 this month</div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enabledFeatures.productPerformance && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaStar className="mr-2 text-yellow-600" />
              Top Selling Products
            </h3>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.sales} units sold</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">₹{(product.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {enabledFeatures.categoryAnalytics && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaChartBar className="mr-2 text-green-600" />
              Sales by Category
            </h3>
            <div className="space-y-4">
              {analyticsData.categoryData.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-gray-600">{category.percentage}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${category.color} h-2 rounded-full`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAnalytics;

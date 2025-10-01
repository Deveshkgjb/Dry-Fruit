import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaEye, FaFilter, FaSearch } from 'react-icons/fa';
import apiService from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import config from '../../config/environment.js';

const ManagerDashboard = ({ managerUser, logout }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    images: [{ url: '', alt: '', uploadType: 'file' }],
    sizes: [{ size: '', price: '', originalPrice: '', stock: '' }],
    features: [''],
    badges: [{ text: '', color: 'red' }],
    brand: 'Happilo',
    countryOfOrigin: 'India',
    shelfLife: '12 months',
    tags: [''],
    isBestSeller: false,
    isPopular: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiService.managerAPI.getProducts(),
        apiService.managerAPI.getCategories()
      ]);
      
      setProducts(productsResponse.products || []);
      setCategories(categoriesResponse.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setShowAddForm(true);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category?.name || product.category || '',
      images: product.images && product.images.length > 0 ? product.images.map(img => ({ ...img, uploadType: img.uploadType || 'file' })) : [{ url: '', alt: '', uploadType: 'file' }],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [{ size: '', price: '', originalPrice: '', stock: '' }],
      features: product.features && product.features.length > 0 ? product.features : [''],
      badges: product.badges && product.badges.length > 0 ? product.badges : [{ text: '', color: 'red' }],
      brand: product.brand || 'Happilo',
      countryOfOrigin: product.countryOfOrigin || 'India',
      shelfLife: product.shelfLife || '12 months',
      tags: product.tags && product.tags.length > 0 ? product.tags : [''],
      isBestSeller: product.isBestSeller || false,
      isPopular: product.isPopular || false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        sizes: formData.sizes.map(size => ({
          ...size,
          price: parseFloat(size.price) || 0,
          originalPrice: parseFloat(size.originalPrice) || 0,
          stock: parseInt(size.stock) || 0
        })),
        images: formData.images.filter(img => img && img.url && typeof img.url === 'string' && img.url.trim() !== ''),
        features: formData.features.filter(feature => 
          feature && typeof feature === 'string' && feature.trim() !== ''
        ),
        badges: formData.badges.filter(badge => badge && badge.text && typeof badge.text === 'string' && badge.text.trim() !== ''),
        tags: formData.tags.filter(tag => tag && typeof tag === 'string' && tag.trim() !== '')
      };

      if (editingProduct) {
        await apiService.managerAPI.updateProduct(editingProduct, productData);
        showSuccess('Product updated successfully!');
      } else {
        await apiService.managerAPI.createProduct(productData);
        showSuccess('Product created successfully!');
      }
      
      await fetchData();
      setShowAddForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      showError('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.managerAPI.deleteProduct(id);
        showSuccess('Product deleted successfully!');
        await fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product');
      }
    }
  };

  const handleInputChange = (field, value, index = null) => {
    if (index !== null) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addArrayItem = (field, newItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === 'all' || 
      (product.category?.name || product.category) === filterCategory;
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome, {managerUser?.name} - Managing {categories.length} categories
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products ({filteredProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Categories ({categories.length})
            </button>
          </nav>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    Category: {product.category?.name || product.category}
                  </div>
                  
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="text-sm text-gray-500 mb-2">
                      Price: ₹{product.sizes[0].price}
                      {product.sizes[0].originalPrice && (
                        <span className="line-through ml-2">₹{product.sizes[0].originalPrice}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.isBestSeller ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isBestSeller ? 'Best Seller' : 'Regular'}
                    </span>
                    <span className="text-gray-500">
                      Stock: {product.sizes?.[0]?.stock || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <div className="text-xs text-gray-500">
                  Slug: {category.slug}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    rows="3"
                    required
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Sizes</label>
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Size (e.g., 250g)"
                        value={size.size}
                        onChange={(e) => handleInputChange('sizes', { ...size, size: e.target.value }, index)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={size.price}
                        onChange={(e) => handleInputChange('sizes', { ...size, price: e.target.value }, index)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                      <input
                        type="number"
                        placeholder="Original Price"
                        value={size.originalPrice}
                        onChange={(e) => handleInputChange('sizes', { ...size, originalPrice: e.target.value }, index)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={size.stock}
                        onChange={(e) => handleInputChange('sizes', { ...size, stock: e.target.value }, index)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('sizes', { size: '', price: '', originalPrice: '', stock: '' })}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    + Add Size
                  </button>
                </div>

                {/* Badges */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badges</label>
                  {formData.badges.map((badge, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Badge text"
                        value={badge.text}
                        onChange={(e) => handleInputChange('badges', { ...badge, text: e.target.value }, index)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                      <select
                        value={badge.color}
                        onChange={(e) => handleInputChange('badges', { ...badge, color: e.target.value }, index)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="yellow">Yellow</option>
                        <option value="purple">Purple</option>
                      </select>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('badges', { text: '', color: 'red' })}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    + Add Badge
                  </button>
                </div>

                {/* Flags */}
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => handleInputChange('isBestSeller', e.target.checked)}
                      className="mr-2"
                    />
                    Best Seller
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                      className="mr-2"
                    />
                    Popular
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;

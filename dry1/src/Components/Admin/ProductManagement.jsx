import React, { useState, useEffect } from 'react';
import apiService from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import config from '../../config/environment.js';
import { getImageUrl } from '../../utils/urls.js';

const { productsAPI, categoriesAPI, uploadAPI } = apiService;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDisplayType, setFilterDisplayType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useNotification();


  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    categorySlug: '',
    subcategory: '',
    images: [{ url: '', alt: '', uploadType: 'file' }],
    sizes: [{ size: '', price: '', originalPrice: '', stock: '' }],
    features: [''],
    badges: [{ text: '', color: 'red' }],
    status: 'Active',
    brand: 'TriThread',
    countryOfOrigin: 'India',
    shelfLife: '12 months',
    tags: [''],
    isBestSeller: false,
    isPopular: false,
    isValueCombo: false,
    isYouMayLike: false,
    displaySections: {
      ourBestSellers: false,
      valueCombos: false,
      youMayAlsoLike: false
    },
    reviews: [{
      id: '',
      customerName: '',
      customerEmail: '',
      rating: 5,
      title: '',
      comment: '',
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpful: 0
    }],
    // Quick rating settings
    quickRating: 0,
    quickReviewCount: '',
    // Popularity and urgency settings
    popularitySettings: {
      orderCount: '',
      offerCountdown: {
        enabled: true,
        duration: 15,
        startTime: new Date()
      },
    }
  });

  const [uploadingMultiple, setUploadingMultiple] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [notification, setNotification] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    checkAdminLogin();
  }, []);

  // Check if admin is logged in
  const checkAdminLogin = () => {
    const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
    setIsAdminLoggedIn(!!adminToken);
    
    if (!adminToken) {
      setNotification({
        type: 'error',
        message: '⚠️ Please login as admin to manage product status'
      });
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({ limit: 100 });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Failed to load categories');
    }
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      categorySlug: '',
      subcategory: '',
      images: [{ url: '', alt: '', uploadType: 'file' }],
      sizes: [{ size: '', price: '', originalPrice: '', stock: '' }],
      features: [''],
      badges: [{ text: '', color: 'red' }],
      status: 'Active',
      brand: 'TriThread',
      countryOfOrigin: 'India',
      shelfLife: '12 months',
      tags: [''],
      isBestSeller: false,
      isPopular: false,
      isValueCombo: false,
      isYouMayLike: false,
      displaySections: {
        ourBestSellers: false,
        valueCombos: false,
        youMayAlsoLike: false
      },
      reviews: [{
        id: '',
        customerName: '',
        customerEmail: '',
        rating: 5,
        title: '',
        comment: '',
        date: new Date().toISOString().split('T')[0],
        verified: true,
        helpful: 0
      }, {
        id: '',
        customerName: '',
        customerEmail: '',
        rating: 5,
        title: '',
        comment: '',
        date: new Date().toISOString().split('T')[0],
        verified: true,
        helpful: 0
      }],
      // Quick rating settings
      quickRating: 0,
      quickReviewCount: '',
      // Popularity and urgency settings
      popularitySettings: {
        orderCount: '',
        offerCountdown: {
          enabled: true,
          duration: 15,
          startTime: new Date()
        },
      }
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setShowAddForm(true);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category?.name || product.category || '',
      categorySlug: product.categorySlug || generateSlug(product.category?.name || product.category || ''),
      subcategory: product.subcategory || '',
      images: product.images && product.images.length > 0 ? product.images.map(img => ({ ...img, uploadType: img.uploadType || 'file' })) : [{ url: '', alt: '', uploadType: 'file' }],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [{ size: '', price: '', originalPrice: '', stock: '' }],
      features: product.features && product.features.length > 0 ? product.features : [''],
      badges: product.badges && product.badges.length > 0 ? product.badges : [{ text: '', color: 'red' }],
      status: product.status || 'Active',
      brand: product.brand || 'Happilo',
      countryOfOrigin: product.countryOfOrigin || 'India',
      shelfLife: product.shelfLife || '12 months',
      tags: product.tags && product.tags.length > 0 ? product.tags : [''],
      isBestSeller: product.isBestSeller || false,
      isPopular: product.isPopular || false,
      isValueCombo: product.isValueCombo || false,
      isYouMayLike: product.isYouMayLike || false,
      displaySections: product.displaySections || {
        ourBestSellers: product.isBestSeller || false,
        valueCombos: product.isValueCombo || false,
        youMayAlsoLike: product.isYouMayLike || false
      },
      reviews: product.reviews && product.reviews.length > 0 ? product.reviews : [{
        id: '',
        customerName: '',
        customerEmail: '',
        rating: 5,
        title: '',
        comment: '',
        date: new Date().toISOString().split('T')[0],
        verified: true,
        helpful: 0
      }],
      // Quick rating settings
      quickRating: product.rating?.average || 0,
      quickReviewCount: product.rating?.count || 0,
      // Popularity and urgency settings
      popularitySettings: product.popularitySettings || {
        orderCount: '',
        offerCountdown: {
          enabled: true,
          duration: 15,
          startTime: new Date()
        },
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare form data
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
        tags: formData.tags.filter(tag => tag && typeof tag === 'string' && tag.trim() !== ''),
        // Include reviews and quick rating settings
        reviews: formData.reviews.filter(review => 
          review && review.customerName && review.customerName.trim() !== '' && 
          review.comment && review.comment.trim() !== '' && 
          review.rating && review.rating > 0
        ),
        quickRating: formData.quickRating,
        quickReviewCount: formData.quickReviewCount
      };

      // Debug: Log what's being sent to backend
      console.log('🚀 Sending product data to backend:', {
        name: productData.name,
        reviewsCount: productData.reviews ? productData.reviews.length : 0,
        quickRating: productData.quickRating,
        quickReviewCount: productData.quickReviewCount,
        reviews: productData.reviews
      });

      if (editingProduct) {
        // Update existing product
        await productsAPI.update(editingProduct, productData);
        showSuccess('Product updated successfully!');
      } else {
        // Add new product
        await productsAPI.create(productData);
        showSuccess('Product created successfully! All display sections will be updated automatically.');
        
        // Dispatch event to refresh category pages
        window.dispatchEvent(new CustomEvent('productCreated', {
          detail: { category: productData.category, categorySlug: productData.categorySlug }
        }));
        
        // Dispatch event to refresh home page sections
        window.dispatchEvent(new CustomEvent('refreshHomeSections'));
      }
      
      // Refresh products list
      await fetchProducts();
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
        await productsAPI.delete(id);
        showSuccess('Product deleted successfully!');
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product');
      }
    }
  };

  // Helper function to generate slug from category name
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleInputChange = (field, value, index = null, subField = null) => {
    console.log('🔍 handleInputChange called:', { field, value, index, subField });
    
    if (index !== null) {
      // Handle array fields
      if (field === 'features' || field === 'tags') {
        // For simple string arrays, replace the value directly
        console.log('🔍 Updating features/tags:', { field, value, index });
        setFormData(prev => ({
          ...prev,
          [field]: prev[field].map((item, i) => 
            i === index ? value : item
          )
        }));
      } else if (field === 'sizes') {
        // For sizes array, handle object properties
        console.log('🔍 Updating sizes:', { field, value, index });
        setFormData(prev => ({
          ...prev,
          sizes: prev.sizes.map((item, i) => 
            i === index ? { ...item, ...value } : item
          )
        }));
      } else if (field === 'badges') {
        // For badges array, handle object properties
        setFormData(prev => ({
          ...prev,
          badges: prev.badges.map((item, i) => 
            i === index ? { ...item, ...value } : item
          )
        }));
      } else if (field === 'images') {
        // For images array, handle object properties
        setFormData(prev => ({
          ...prev,
          images: prev.images.map((item, i) => 
            i === index ? { ...item, ...value } : item
          )
        }));
      } else {
        // For other object arrays (like reviews), spread the value
        setFormData(prev => ({
          ...prev,
          [field]: prev[field].map((item, i) => 
            i === index ? { ...item, ...value } : item
          )
        }));
      }
    } else {
      // Handle simple fields
      if (field === 'category') {
        // When category changes, find the matching category and use its slug
        const selectedCategory = categories.find(cat => cat.name === value);
        const categorySlug = selectedCategory ? selectedCategory.slug : generateSlug(value);
        
        setFormData(prev => ({
          ...prev,
          [field]: value,
          categorySlug: categorySlug
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      }
    }
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'sizes' ? { size: '', price: '', originalPrice: '', stock: '' } : 
                              field === 'images' ? { url: '', alt: '', uploadType: 'file' } :
                              field === 'badges' ? { text: '', color: 'red' } :
                              field === 'features' ? '' :
                              field === 'tags' ? '' :
                              field === 'reviews' ? {
                                id: '',
                                customerName: '',
                                customerEmail: '',
                                rating: 5,
                                title: '',
                                comment: '',
                                date: new Date().toISOString().split('T')[0],
                                verified: true,
                                helpful: 0
                              } : '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (event, imageIndex) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }

      // Check image dimensions for mobile optimization
      const img = new Image();
      img.onload = async () => {
        const { width, height } = img;
        
        // Check if image is too small
        if (width < 400 || height < 400) {
          showError(`Image too small: ${width}x${height}px. Minimum recommended: 400x400px`);
          return;
        }
        
        // Check if image is too large
        if (width > 1200 || height > 1200) {
          showError(`Image too large: ${width}x${height}px. Maximum recommended: 1200x1200px`);
          return;
        }
        
        // Check aspect ratio (warn if not square)
        const aspectRatio = width / height;
        if (aspectRatio < 0.8 || aspectRatio > 1.2) {
          showError(`Image aspect ratio ${aspectRatio.toFixed(2)}:1 may cause mobile display issues. Recommended: 1:1 (square)`);
          return;
        }
        
        // Continue with upload if validation passes
        await proceedWithUpload(file, imageIndex);
      };
      
      img.onerror = () => {
        showError('Invalid image file. Please select a valid image.');
        return;
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  const proceedWithUpload = async (file, imageIndex) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload to backend using API service
      const result = await uploadAPI.uploadImage(formData);

      if (result.success) {
        // Update the image URL with the uploaded file path
        handleInputChange('images', { url: result.imageUrl }, imageIndex);
        showSuccess('Image uploaded successfully! ✅ Mobile-optimized');
      } else {
        showError(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showError('Failed to upload image. Please try again.');
    }
  };

  const handleMultipleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        showError(`File ${file.name} is not a valid image file`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError(`File ${file.name} size should be less than 5MB`);
        return;
      }
    }

    setUploadingMultiple(true);

    try {
      // Create FormData for multiple file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      // Upload to backend using API service
      const result = await uploadAPI.uploadImages(formData);

      if (result.success && result.images && result.images.length > 0) {
        // Add all uploaded images to the form
        const newImages = result.images.map(img => ({
          url: img.url,
          alt: img.alt || '',
          uploadType: 'file'
        }));

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));

        showSuccess(`${result.images.length} images uploaded successfully!`);
      } else {
        showError(result.message || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showError('Failed to upload images. Please try again.');
    } finally {
      setUploadingMultiple(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status toggle (Active/Inactive)
  const handleStatusToggle = async (productId, newStatus) => {
    try {
      // Show loading state
      setStatusUpdating(prev => ({ ...prev, [productId]: true }));
      
      console.log(`🔄 Toggling product ${productId} status to ${newStatus}`);
      
      // Get the admin token
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      if (!adminToken) {
        throw new Error('Please login as admin to change product status');
      }
      
      console.log('🔑 Using token:', adminToken.substring(0, 20) + '...');
      
      const response = await fetch(`${config.API_BASE_URL}/products/${productId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message || 'Failed to update product status');
      }

      const result = await response.json();
      console.log('✅ Status updated:', result);

      // Update the product in the local state
      setProducts(products.map(product => 
        product._id === productId 
          ? { ...product, status: newStatus }
          : product
      ));

      // Refresh the products list to ensure all sections are updated
      setTimeout(() => {
        fetchProducts();
      }, 1000);

      // Show success notification
      setNotification({
        type: 'success',
        message: `🎉 Product activated and visible successfully!`
      });

    } catch (error) {
      console.error('❌ Error toggling status:', error);
      setNotification({
        type: 'error',
        message: `❌ ${error.message || 'Failed to update product status. Please try again.'}`
      });
    } finally {
      // Remove loading state
      setStatusUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Filter products based on search, category, and display type
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || (product.category?.name || product.category) === filterCategory;
    const matchesDisplayType = filterDisplayType === 'all' || 
                              (filterDisplayType === 'bestSeller' && (product.isBestSeller || product.displaySections?.ourBestSellers || product.tags?.some(tag => ['premium', 'organic', 'healthy', 'natural', 'protein-rich'].includes(tag.toLowerCase())))) ||
                              (filterDisplayType === 'popular' && product.isPopular) ||
                              (filterDisplayType === 'valueCombo' && (product.isValueCombo || product.displaySections?.valueCombos || product.tags?.some(tag => tag.toLowerCase().includes('value')))) ||
                              (filterDisplayType === 'youMayLike' && (product.isYouMayLike || product.displaySections?.youMayAlsoLike || product.tags?.some(tag => ['premium', 'organic', 'healthy', 'natural', 'protein-rich', 'antioxidants'].includes(tag.toLowerCase())))) ||
                              (filterDisplayType === 'regular' && !product.isBestSeller && !product.isPopular && !product.isValueCombo && !product.isYouMayLike);
    
    return matchesSearch && matchesCategory && matchesDisplayType;
  });

  // Get unique categories for filter dropdown
  const productCategories = [...new Set(products.map(p => p.category?.name || p.category))];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Product Management
          </h2>
          <p className="text-gray-600 mt-2">Manage your product catalog and inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Products</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Search by name or description..."
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">All Categories</option>
              {productCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Display Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Type</label>
            <select
              value={filterDisplayType}
              onChange={(e) => setFilterDisplayType(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">All Types</option>
              <option value="bestSeller">Our Best Sellers</option>
              <option value="valueCombo">Value Combos</option>
              <option value="youMayLike">You May Also Like</option>
              <option value="popular">Popular</option>
              <option value="regular">Regular Products</option>
            </select>
          </div>

          {/* Results Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Results</label>
            <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
              <span className="text-lg font-bold text-gray-800">{filteredProducts.length}</span>
              <span className="text-sm text-gray-600 ml-1">products found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white/95 backdrop-blur-sm w-full h-full flex flex-col">
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="text-green-100 mt-1">
                    {editingProduct ? 'Update product information' : 'Create a new product for your store'}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Basic Information</h4>
                    <p className="text-sm text-gray-500">Enter the basic details of your product</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 h-24 resize-none"
                      placeholder="Describe your product..."
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        value={formData.subcategory}
                        onChange={(e) => handleInputChange('subcategory', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                        placeholder="e.g., Almonds, Blueberries, Omani Dates, Chia Seeds"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">Product Images</h4>
                      <p className="text-sm text-gray-500">Upload single images, multiple images at once, or add URLs with alt text</p>
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs text-green-700 font-medium">
                          💡 <strong>Pro Tip:</strong> Use square images (1:1 ratio) with white backgrounds for best mobile display
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => addArrayItem('images')}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                      <span>Add Single Image</span>
                  </button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleFileUpload}
                        className="hidden"
                        id="multiple-file-upload"
                        disabled={uploadingMultiple}
                      />
                      <label
                        htmlFor="multiple-file-upload"
                        className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                          uploadingMultiple 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        }`}
                      >
                        {uploadingMultiple ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span>Upload Multiple Images</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Multiple Upload Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-blue-800 mb-1">Multiple Image Upload</h5>
                      <p className="text-sm text-blue-700 mb-2">
                        Use "Upload Multiple Images" to select and upload 2 or more images at once. 
                        Each image will be automatically added to your product with a default alt text that you can customize.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-blue-600">
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Total Images: {formData.images.length}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Max 5 images per upload</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {formData.images.map((image, index) => (
                    <div key={`image-${index}-${image.url}`} className="bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                      <div className="space-y-4">
                        {/* Upload Option Toggle */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Add Image</label>
                          
                          {/* Toggle Buttons */}
                          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                images: prev.images.map((img, i) => 
                                  i === index ? { ...img, uploadType: 'file' } : img
                                )
                              }))}
                              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                (formData.images[index]?.uploadType || 'file') === 'file'
                                  ? 'bg-blue-500 text-white shadow-sm'
                                  : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span>Upload File</span>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                images: prev.images.map((img, i) => 
                                  i === index ? { ...img, uploadType: 'url' } : img
                                )
                              }))}
                              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                formData.images[index]?.uploadType === 'url'
                                  ? 'bg-blue-500 text-white shadow-sm'
                                  : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span>Enter URL</span>
                              </div>
                            </button>
                          </div>

                          {/* File Upload Section */}
                          {(formData.images[index]?.uploadType || 'file') === 'file' && (
                            <div className="mb-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, index)}
                                className="hidden"
                                id={`file-upload-${index}`}
                              />
                              <label
                                htmlFor={`file-upload-${index}`}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer flex items-center space-x-2 w-full justify-center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span>Choose Image File</span>
                              </label>
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                              </p>
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="text-sm font-semibold text-blue-800 mb-2">📱 Mobile-Optimized Image Guidelines:</h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                  <li>• <strong>Recommended Size:</strong> 800x800px or 1:1 aspect ratio</li>
                                  <li>• <strong>Min Size:</strong> 400x400px</li>
                                  <li>• <strong>Max Size:</strong> 1200x1200px</li>
                                  <li>• <strong>Format:</strong> JPG or PNG for best quality</li>
                                  <li>• <strong>Background:</strong> Use white or transparent background</li>
                                  <li>• <strong>Product:</strong> Center the product in the image</li>
                                </ul>
                                <p className="text-xs text-blue-600 mt-2 font-medium">
                                  ✅ These dimensions ensure images display properly on mobile without overlapping text
                                </p>
                              </div>
                            </div>
                          )}

                          {/* URL Input Section */}
                          {formData.images[index]?.uploadType === 'url' && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-2 text-center">
                                Enter the URL of your image
                              </p>
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="text-sm font-semibold text-blue-800 mb-2">📱 Mobile-Optimized Image Guidelines:</h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                  <li>• <strong>Recommended Size:</strong> 800x800px or 1:1 aspect ratio</li>
                                  <li>• <strong>Min Size:</strong> 400x400px</li>
                                  <li>• <strong>Max Size:</strong> 1200x1200px</li>
                                  <li>• <strong>Format:</strong> JPG or PNG for best quality</li>
                                  <li>• <strong>Background:</strong> Use white or transparent background</li>
                                  <li>• <strong>Product:</strong> Center the product in the image</li>
                                </ul>
                                <p className="text-xs text-blue-600 mt-2 font-medium">
                                  ✅ These dimensions ensure images display properly on mobile without overlapping text
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Image URL - Only show when URL mode is selected */}
                        {formData.images[index]?.uploadType === 'url' && (
                          <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                          <input
                            type="text"
                            value={image.url}
                            onChange={(e) => handleInputChange('images', { url: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        )}

                        {/* Show URL when file is uploaded */}
                        {(formData.images[index]?.uploadType || 'file') === 'file' && image.url && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Uploaded Image URL</label>
                            <div className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600">
                              {image.url}
                            </div>
                          </div>
                        )}

                        {/* Alt Text */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Text</label>
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => handleInputChange('images', { alt: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            placeholder="Product image"
                          />
                        </div>

                        {/* Image Preview */}
                        {image.url && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                            <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={getImageUrl(image.url)}
                                alt={image.alt || 'Product preview'}
                                className="w-full h-full object-cover"
                                onLoad={() => {
                                  console.log('Image loaded successfully:', image.url);
                                }}
                                onError={(e) => {
                                  console.error('Image failed to load:', image.url);
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm" style={{ display: 'none' }}>
                                Invalid URL
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              URL: {image.url}
                            </p>
                          </div>
                        )}

                        {/* Remove Button */}
                        <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeArrayItem('images', index)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                            <span>Remove Image</span>
                        </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Sizes & Pricing */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">Sizes & Pricing</h4>
                      <p className="text-sm text-gray-500">Set different sizes, prices, and stock levels</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('sizes')}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Size</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.sizes.map((size, index) => (
                    <div key={`size-${index}`} className="bg-gray-50/50 p-3 rounded-xl border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Size <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={size.size}
                            onChange={(e) => {
                              console.log('🔍 Size input changed:', e.target.value);
                              handleInputChange('sizes', { size: e.target.value }, index);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            placeholder="200g"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            value={size.price}
                            onChange={(e) => handleInputChange('sizes', { price: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            placeholder="299"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price (₹)</label>
                          <input
                            type="number"
                            value={size.originalPrice}
                            onChange={(e) => handleInputChange('sizes', { originalPrice: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            placeholder="399"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Stock <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            value={size.stock}
                            onChange={(e) => handleInputChange('sizes', { stock: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            placeholder="100"
                            required
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('sizes', index)}
                            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Features */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">Product Features</h4>
                      <p className="text-sm text-gray-500">Add key features and benefits of your product</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('features')}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Feature</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={`feature-${index}`} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          console.log('🔍 Feature input changed:', e.target.value);
                          handleInputChange('features', e.target.value, index);
                        }}
                        className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        placeholder="Premium quality almonds"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('features', index)}
                        className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Badges */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">Product Badges</h4>
                      <p className="text-sm text-gray-500">Add promotional badges and labels</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('badges')}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Badge</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.badges.map((badge, index) => (
                    <div key={`badge-${index}-${badge.text}`} className="bg-gray-50/50 p-3 rounded-xl border border-gray-200">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Badge Text</label>
                          <input
                            type="text"
                            value={badge.text}
                            onChange={(e) => handleInputChange('badges', { text: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="BEST SELLER"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                          <select
                            value={badge.color}
                            onChange={(e) => handleInputChange('badges', { color: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          >
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="yellow">Yellow</option>
                            <option value="purple">Purple</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('badges', index)}
                          className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Additional Information</h4>
                    <p className="text-sm text-gray-500">Set product details, tags, and display settings</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country of Origin</label>
                    <input
                      type="text"
                      value={formData.countryOfOrigin}
                      onChange={(e) => handleInputChange('countryOfOrigin', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Shelf Life</label>
                    <input
                      type="text"
                      value={formData.shelfLife}
                      onChange={(e) => handleInputChange('shelfLife', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="Active">Active</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="almonds, nuts, healthy, premium, best seller, value combo"
                  />
                </div>

                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-gray-700">Display Settings</h5>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h6 className="text-sm font-medium text-blue-800 mb-3">Where to Show This Product</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`flex items-center p-3 rounded-lg border ${
                          (formData.displaySections?.valueCombos || formData.isValueCombo || 
                           formData.displaySections?.youMayAlsoLike || formData.isYouMayLike) 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-white border-blue-100'
                        }`}>
                      <input
                        type="checkbox"
                        checked={formData.displaySections?.ourBestSellers || formData.isBestSeller}
      onChange={(e) => {
        const newValue = e.target.checked;
        handleInputChange('isBestSeller', newValue);
        handleInputChange('displaySections', {
          ...formData.displaySections,
          ourBestSellers: newValue
        });
      }}
                        disabled={(formData.displaySections?.valueCombos || formData.isValueCombo || 
                                 formData.displaySections?.youMayAlsoLike || formData.isYouMayLike)}
                        className={`mr-3 w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 ${
                          (formData.displaySections?.valueCombos || formData.isValueCombo || 
                           formData.displaySections?.youMayAlsoLike || formData.isYouMayLike) 
                            ? 'opacity-50 cursor-not-allowed' 
                            : ''
                        }`}
                      />
                      <div>
                            <div className="font-medium text-gray-900">
                              Our Best Sellers
                              {(formData.displaySections?.valueCombos || formData.isValueCombo || 
                                formData.displaySections?.youMayAlsoLike || formData.isYouMayLike) && (
                                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  Auto-enabled
                                </span>
                              )}
                      </div>
                            <div className="text-xs text-gray-500">
                              {(formData.displaySections?.valueCombos || formData.isValueCombo || 
                                formData.displaySections?.youMayAlsoLike || formData.isYouMayLike) 
                                ? 'Automatically enabled by other selections'
                                : 'Show in "Our Best Sellers" section'
                              }
                    </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-white rounded-lg border border-blue-100">
                          <input
                            type="checkbox"
                            checked={formData.displaySections?.valueCombos || formData.isValueCombo}
                            onChange={(e) => {
                              const newValue = e.target.checked;
                              handleInputChange('isValueCombo', newValue);
                              handleInputChange('displaySections', {
                                ...formData.displaySections,
                                valueCombos: newValue,
                                // Auto-enable best sellers when value combo is selected
                                ourBestSellers: newValue ? true : formData.displaySections?.ourBestSellers
                              });
                              // Also update the isBestSeller field
                              if (newValue) {
                                handleInputChange('isBestSeller', true);
                              }
                            }}
                            className="mr-3 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">Value Combos</div>
                            <div className="text-xs text-gray-500">Show in "Value Combos" section (auto-includes Best Sellers)</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-white rounded-lg border border-blue-100">
                          <input
                            type="checkbox"
                            checked={formData.displaySections?.youMayAlsoLike || formData.isYouMayLike}
                            onChange={(e) => {
                              const newValue = e.target.checked;
                              handleInputChange('isYouMayLike', newValue);
                              handleInputChange('displaySections', {
                                ...formData.displaySections,
                                youMayAlsoLike: newValue,
                                // Auto-enable best sellers when you may like is selected
                                ourBestSellers: newValue ? true : formData.displaySections?.ourBestSellers
                              });
                              // Also update the isBestSeller field
                              if (newValue) {
                                handleInputChange('isBestSeller', true);
                              }
                            }}
                            className="mr-3 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">You May Also Like</div>
                            <div className="text-xs text-gray-500">Show in "You May Also Like" section (auto-includes Best Sellers)</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-white rounded-lg border border-blue-100">
                      <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Popular</div>
                        <div className="text-xs text-gray-500">Mark as popular product</div>
                      </div>
                    </div>
                  </div>
                      
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-sm font-medium text-yellow-800">Smart Display Logic</div>
                            <div className="text-xs text-yellow-700 mt-1">
                              • <strong>Value Combos</strong> → Automatically enables "Our Best Sellers" ✅<br/>
                              • <strong>You May Also Like</strong> → Automatically enables "Our Best Sellers" ✅<br/>
                              • <strong>Our Best Sellers</strong> → Only shows in "Our Best Sellers" section<br/>
                              • Products can appear in multiple sections simultaneously
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Rating Settings */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Quick Rating Setup</h4>
                    <p className="text-sm text-gray-500">Set initial rating and review count for this product</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Product Rating *</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleInputChange('quickRating', star)}
                          className={`text-2xl transition-colors duration-200 ${
                            formData.quickRating >= star 
                              ? 'text-yellow-500' 
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {formData.quickRating > 0 ? `${formData.quickRating} stars` : 'No rating'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Reviews</label>
                    <input
                      type="number"
                      value={formData.quickReviewCount}
                      onChange={(e) => handleInputChange('quickReviewCount', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder=""
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      This will show as "{formData.quickRating > 0 ? formData.quickRating : '___'} | {formData.quickReviewCount || '___'} Reviews" on frontend
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Quick Setup Tip:</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Use this for quick rating setup. For detailed customer reviews, use the "Product Reviews" section below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popularity & Urgency Settings */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Popularity & Urgency Settings</h4>
                    <p className="text-sm text-gray-500">Configure product popularity display and offer countdown timer</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">
                      👥 Order Count Display <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                          type="number"
                          value={formData.popularitySettings?.orderCount || ''}
                          onChange={(e) => {
                            console.log('Order count changed:', e.target.value);
                            const value = parseInt(e.target.value) || 0;
                            console.log('New value:', value);
                            handleInputChange('popularitySettings', {
                              ...formData.popularitySettings,
                              orderCount: value
                            });
                          }}
                          className="w-full p-4 border-3 border-orange-300 rounded-xl focus:ring-4 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg font-semibold bg-white shadow-lg"
                          placeholder=""
                          style={{ fontSize: '18px', fontWeight: 'bold' }}
                        />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-gray-400 text-sm">📝 Editable</span>
                      </div>
                    </div>
                    <div className="mt-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                      <p className="text-base text-green-700 font-bold">
                        📱 Live Preview: "{formData.popularitySettings?.orderCount || '___'} people ordered this in the last 7 days"
                      </p>
                      <p className="text-sm text-green-600 mt-2 font-medium">
                        💡 Type any number you want - no limits!
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Offer Countdown Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={formData.popularitySettings?.offerCountdown?.duration || 15}
                      onChange={(e) => handleInputChange('popularitySettings', {
                        ...formData.popularitySettings,
                        offerCountdown: {
                          ...formData.popularitySettings?.offerCountdown,
                          duration: parseInt(e.target.value) || 15
                        }
                      })}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      placeholder="e.g., 15"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Timer will start when product is saved/updated
                    </p>
                  </div>
                </div>


                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableCountdown"
                      checked={formData.popularitySettings?.offerCountdown?.enabled || true}
                      onChange={(e) => handleInputChange('popularitySettings', {
                        ...formData.popularitySettings,
                        offerCountdown: {
                          ...formData.popularitySettings?.offerCountdown,
                          enabled: e.target.checked
                        }
                      })}
                      className="mr-3 w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="enableCountdown" className="text-sm font-medium text-gray-700">
                      Enable Offer Countdown Timer
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 ml-7">
                    When enabled, shows "Offer ends in Xmin Ysec" on the product page
                  </p>

                </div>

                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-orange-800">How it works</div>
                      <div className="text-xs text-orange-700 mt-1">
                        • <strong>Order Count:</strong> Shows the number of people who ordered this product<br/>
                        • <strong>Offer Countdown:</strong> Starts automatically when product is saved and counts down from the specified duration<br/>
                        • <strong>Delivery Timer:</strong> Frontend automatically runs a 15-minute timer that restarts when it reaches zero<br/>
                        • <strong>Timer Reset:</strong> Offer countdown resets each time the product is updated
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Reviews */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">Detailed Reviews (Optional)</h4>
                      <p className="text-sm text-gray-500">Add unlimited customer reviews with comments</p>
                      <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700 font-medium">
                          ♾️ <strong>Unlimited Reviews:</strong> Add as many reviews as needed using the "Add Review" button
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('reviews')}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Review</span>
                  </button>
                </div>
                
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Total Reviews:</strong> {formData.reviews.length} review{formData.reviews.length !== 1 ? 's' : ''} added
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click "Add Review" to add more, or remove unwanted reviews with the red X button
                  </p>
                </div>

                <div className="space-y-4">
                  {formData.reviews.map((review, index) => (
                    <div key={`review-${index}-${review.id}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                          <input
                            type="text"
                            value={review.customerName}
                            onChange={(e) => handleInputChange('reviews', { customerName: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                          <input
                            type="email"
                            value={review.customerEmail}
                            onChange={(e) => handleInputChange('reviews', { customerEmail: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                          <select
                            value={review.rating}
                            onChange={(e) => handleInputChange('reviews', { rating: parseInt(e.target.value) }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                          >
                            <option value={1}>⭐ 1 Star</option>
                            <option value={2}>⭐⭐ 2 Stars</option>
                            <option value={3}>⭐⭐⭐ 3 Stars</option>
                            <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                            <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Review Date</label>
                          <input
                            type="date"
                            value={review.date}
                            onChange={(e) => handleInputChange('reviews', { date: e.target.value }, index)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                        <input
                          type="text"
                          value={review.title}
                          onChange={(e) => handleInputChange('reviews', { title: e.target.value }, index)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                          placeholder="Great product!"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review Comment</label>
                        <textarea
                          value={review.comment}
                          onChange={(e) => handleInputChange('reviews', { comment: e.target.value }, index)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                          rows={3}
                          placeholder="This product is amazing! Great quality and fast delivery."
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={review.verified}
                              onChange={(e) => handleInputChange('reviews', { verified: e.target.checked }, index)}
                              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Verified Purchase</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Helpful:</label>
                            <input
                              type="number"
                              value={review.helpful}
                              onChange={(e) => handleInputChange('reviews', { helpful: parseInt(e.target.value) || 0 }, index)}
                              className="w-16 p-2 border border-gray-300 rounded text-center"
                              min="0"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('reviews', index)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              </form>
            </div>
            
            {/* Footer - Fixed */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="product-form"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading products...</div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={getImageUrl(product.images && product.images.length > 0 ? product.images[0].url : null)}
                        alt={product.name}
                        className="w-12 h-12 object-contain bg-gray-100 rounded mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {product.name}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(product.isBestSeller || product.displaySections?.ourBestSellers) && (
                            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              Best Seller
                            </span>
                          )}
                          {(product.isValueCombo || product.displaySections?.valueCombos) && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Value Combo
                            </span>
                          )}
                          {(product.isYouMayLike || product.displaySections?.youMayAlsoLike) && (
                            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              You May Like
                            </span>
                          )}
                          {product.isPopular && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Popular
                            </span>
                          )}
                          {product.tags?.includes('value combo') && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Value Combo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{product.category?.name || product.category}</div>
                      {product.subcategory && (
                        <div className="text-xs text-gray-500">{product.subcategory}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.sizes && product.sizes.length > 0 ? (
                      <div>
                        {product.sizes.length === 1 ? (
                          <div>
                            <div className="font-medium text-green-600">₹{product.sizes[0].price}</div>
                            <div className="text-xs text-gray-500">1 size</div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-green-600">₹{Math.min(...product.sizes.map(s => s.price))} - ₹{Math.max(...product.sizes.map(s => s.price))}</div>
                            <div className="text-xs text-gray-500">{product.sizes.length} sizes</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500">No pricing</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.sizes && product.sizes.length > 0 ? (
                      <div>
                        <div className="font-medium">{product.sizes.reduce((total, size) => total + (size.stock || 0), 0)}</div>
                        <div className="text-xs text-gray-500">Total stock</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">0</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      {/* Status Dropdown */}
                      <div className="relative">
                        <select
                          value={product.status}
                          onChange={(e) => handleStatusToggle(product._id, e.target.value)}
                          disabled={statusUpdating[product._id] || !isAdminLoggedIn}
                          className={`px-3 py-1 text-xs font-semibold rounded-full border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${getStatusColor(product.status)} border-transparent hover:border-gray-300`}
                        >
                          <option value="Active">Active</option>
                        </select>
                        {statusUpdating[product._id] && (
                          <div className="absolute -top-1 -right-1">
                            <div className="animate-spin w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Status Description */}
                      <span className="text-xs text-gray-500 mt-1">
                        {!isAdminLoggedIn ? 'Login required' : 'Visible on site'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{product.rating?.average || 0}</span>
                      <span className="text-gray-500 ml-1">({product.reviews?.length || product.rating?.count || 0})</span>
                    </div>
                    {product.reviews && product.reviews.length > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {products.length === 0 ? 'No products found. Add your first product!' : 'No products match your filters.'}
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{filteredProducts.length}</div>
              <div className="text-sm font-medium text-blue-800">
                {filterCategory === 'all' && filterDisplayType === 'all' ? 'Total Products' : 'Filtered Results'}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {filteredProducts.filter(p => p.status === 'Active').length}
              </div>
              <div className="text-sm font-medium text-green-800">Active Products</div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">
                {filteredProducts.filter(p => p.isBestSeller || p.displaySections?.ourBestSellers || p.tags?.some(tag => ['premium', 'organic', 'healthy', 'natural', 'protein-rich'].includes(tag.toLowerCase()))).length}
              </div>
              <div className="text-sm font-medium text-red-800">Best Sellers</div>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {filteredProducts.filter(p => p.isValueCombo || p.displaySections?.valueCombos || p.tags?.some(tag => tag.toLowerCase().includes('value'))).length}
              </div>
              <div className="text-sm font-medium text-green-800">Value Combos</div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {filteredProducts.filter(p => p.isYouMayLike || p.displaySections?.youMayAlsoLike || p.tags?.some(tag => ['premium', 'organic', 'healthy', 'natural', 'protein-rich', 'antioxidants'].includes(tag.toLowerCase()))).length}
              </div>
              <div className="text-sm font-medium text-purple-800">You May Like</div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                {filteredProducts.filter(p => p.tags?.some(tag => tag.toLowerCase().includes('value'))).length}
              </div>
              <div className="text-sm font-medium text-yellow-800">Value Combos</div>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

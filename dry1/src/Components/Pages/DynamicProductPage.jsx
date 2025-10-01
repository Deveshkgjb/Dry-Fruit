import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';
import YouMayAlsoLike from '../Homepages/YouMayAlsoLike.jsx';
import { productsAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import config from '../../config/environment.js';
import { getImageUrl } from '../../utils/urls.js';

const DynamicProductPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const { showSuccess, showError } = useNotification();

  // Exclude certain routes that should not be handled by this component
  const excludedRoutes = [
    'contact-us', 'admin', 'admin-pro', 'cart', 'checkout', 'orders', 'track-order',
    'fitness-mix', 'roasted-party-mix', 'nuts-and-berries-mix', 'berries-mix', 
    'champion-mix', 'nutty-trail-mix', 'seeds-mix',
    'peanut-butter', 'party-snacks', 'gameful-corn-nuts'
  ];
  
  if (excludedRoutes.includes(slug)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
          <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  useEffect(() => {
    // Listen for product creation events to refresh the page
    const handleProductCreated = (event) => {
      const { categorySlug } = event.detail;
      // Refresh if the new product belongs to this category
      if (categorySlug === slug) {
        console.log('🔄 Product created for this category, force refreshing...');
        fetchProducts(true);
      }
    };

    // Periodic refresh every 10 seconds to ensure up-to-date data
    const refreshInterval = setInterval(() => {
      console.log('🔄 Periodic refresh of category products...');
      fetchProducts(true);
    }, 10000);

    window.addEventListener('productCreated', handleProductCreated);

    return () => {
      window.removeEventListener('productCreated', handleProductCreated);
      clearInterval(refreshInterval);
    };
  }, [slug]);

  const fetchProducts = async (forceRefresh = false) => {
    try {
      setLoading(true);
      console.log('🔍 DynamicProductPage - Fetching products for slug:', slug, forceRefresh ? '(FORCE REFRESH)' : '');
      console.log('🌐 DynamicProductPage - API Base URL:', config.API_BASE_URL);
      console.log('🔍 DynamicProductPage - Calling productsAPI.getAll...');
      
      // Fetch all products and filter by categorySlug on frontend
      // This is more reliable than backend filtering for dynamic pages
      const response = await productsAPI.getAll({ 
        limit: 1000, // Get more products to ensure we have all categories
        _t: Date.now() // Always add timestamp to prevent caching
      });
      
      console.log('📡 DynamicProductPage - API Response received');
      console.log('📡 DynamicProductPage - Response type:', typeof response);
      console.log('📡 DynamicProductPage - Response keys:', Object.keys(response || {}));
      console.log('📡 DynamicProductPage - Full response:', JSON.stringify(response, null, 2).substring(0, 500));
      
      console.log('📦 DynamicProductPage - All products fetched:', response.products?.length || 0);
      console.log('📦 DynamicProductPage - Sample products:', response.products?.slice(0, 3));
      
      // Debug: Show all unique categorySlug values
      const allCategorySlugs = [...new Set(response.products?.map(p => p.categorySlug).filter(Boolean) || [])];
      console.log('🏷️ DynamicProductPage - All categorySlugs in database:', allCategorySlugs);
      
      // Filter products by categorySlug - Simple and direct matching
      const categoryProducts = (response.products || []).filter(product => {
        // Primary match: categorySlug
        const matches = product.categorySlug === slug;
        
        console.log('🔍 DynamicProductPage - Checking product:', product.name, {
          productCategorySlug: product.categorySlug,
          lookingForSlug: slug,
          matches: matches
        });
        
        return matches;
      });
      
      console.log('🎯 DynamicProductPage - Filtered products for category:', categoryProducts.length);
      
      if (categoryProducts.length > 0) {
        console.log('✅ DynamicProductPage - Found products:', categoryProducts.map(p => ({ name: p.name, categorySlug: p.categorySlug, createdAt: p.createdAt })));
        showSuccess(`Found ${categoryProducts.length} products in ${getPageTitle()} category`);
      } else {
        console.log('⚠️ DynamicProductPage - No products found for category slug:', slug);
        console.log('💡 DynamicProductPage - Available categorySlugs:', allCategorySlugs);
        console.log('💡 DynamicProductPage - Looking for:', slug);
        console.log('💡 DynamicProductPage - All products:', response.products?.map(p => ({ name: p.name, categorySlug: p.categorySlug })));
        console.log('💡 DynamicProductPage - This is normal if no products exist for this category - NO FALLBACK DATA WILL BE SHOWN');
      }
      
      setProducts(categoryProducts);
    } catch (error) {
      console.error('❌ DynamicProductPage - Error fetching products:', error);
      console.error('❌ Error details:', error.message, error.stack);
      showError(`Failed to load products: ${error.message}`);
      // Don't use fallback data - show empty products array
      setProducts([]);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  // Fallback data removed - we only show real products from database

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    // Implement sorting logic
    let sortedProducts = [...products];
    
    switch (sortType) {
      case 'price-low':
        sortedProducts.sort((a, b) => (a.sizes[0]?.price || 0) - (b.sizes[0]?.price || 0));
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => (b.sizes[0]?.price || 0) - (a.sizes[0]?.price || 0));
        break;
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        break;
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // Featured - keep original order
        break;
    }
    
    setProducts(sortedProducts);
  };

  const handleSizeFilter = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesPrice = product.sizes.some(size => 
      size.price >= priceRange[0] && size.price <= priceRange[1]
    );
    
    const matchesSize = selectedSizes.length === 0 || 
      product.sizes.some(size => selectedSizes.includes(size.size));
    
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPrice && matchesSize && matchesSearch;
  });

  const getPageTitle = () => {
    const titleMap = {
      'almonds': 'Almonds',
      'macadamia-nuts': 'Macadamia Nuts',
      'hazelnuts': 'Hazelnuts',
      'walnuts': 'Walnuts',
      'cashews': 'Cashews',
      'pecans': 'Pecans',
      'pine-nuts': 'Pine Nuts',
      'pistachios': 'Pistachios',
      'brazil-nuts': 'Brazil Nuts',
      'dried-fruits': 'Dried Fruits',
      'blueberries': 'Blueberries',
      'cranberries': 'Cranberries',
      'strawberries': 'Strawberries',
      'goji-berries': 'Goji Berries',
      'dates': 'Dates',
      'omani-dates': 'Omani Dates',
      'chia-seeds': 'Chia Seeds',
      'seeds': 'Seeds'
    };
    return titleMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600">
                Discover our premium selection of {getPageTitle().toLowerCase()}
              </p>
              {lastRefresh && (
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  console.log('🧪 Testing direct API call...');
                  try {
                    const response = await fetch(`${config.API_BASE_URL}/products?limit=1000`);
                    const data = await response.json();
                    console.log('🧪 Direct API Response:', data);
                    console.log('🧪 Products found:', data.products?.length || 0);
                    showSuccess(`Direct API test: Found ${data.products?.length || 0} products`);
                  } catch (error) {
                    console.error('🧪 Direct API Error:', error);
                    showError('Direct API test failed');
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                title="Test direct API call"
              >
                🧪 Test API
              </button>
              <button
                onClick={() => {
                  console.log('🔄 Manual force refresh triggered');
                  showSuccess('Force refreshing products...');
                  fetchProducts(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Force refresh products (bypass cache)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Search</h3>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Price Range */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
              <div className="space-y-2">
                {['100g', '250g', '500g', '1kg'].map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeFilter(size)}
                      className="mr-2"
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'featured', label: 'Featured' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Customer Rating' },
                  { value: 'newest', label: 'Newest' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      sortBy === option.value
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredProducts.map((product) => {
                  const mainSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
                  const mainBadge = product.badges && product.badges.length > 0 ? product.badges[0] : null;
                  const discountPercentage = mainSize && mainSize.originalPrice ? 
                    Math.round(((mainSize.originalPrice - mainSize.price) / mainSize.originalPrice) * 100) : 0;
                  
                  return (
                    <Link 
                      key={product._id} 
                      to={`/product/${product._id}`}
                      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Badge */}
                      {mainBadge && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className={`bg-${mainBadge.color}-600 text-white px-2 py-1 text-xs font-semibold rounded`}>
                            {mainBadge.text}
                          </span>
                        </div>
                      )}

                      {/* Sale Tag */}
                      {discountPercentage > 0 && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="bg-green-500 text-white px-2 py-1 text-xs rounded">
                            {discountPercentage}% OFF
                          </span>
                        </div>
                      )}

                      {/* Product Image */}
                      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={getImageUrl(product.images[0].url)} 
                            alt={product.images[0].alt || product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Product Image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                        
                        {mainSize && (
                          <div className="mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-green-600">₹{mainSize.price}</span>
                              {mainSize.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₹{mainSize.originalPrice}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{mainSize.size}</p>
                          </div>
                        )}

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center space-x-1 mb-3">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating.average) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({product.rating.count})</span>
                          </div>
                        )}

                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No products found for "{slug}"
                  </h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any products in this category. This might be because:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1 mb-6">
                    <li>• No products have been added to this category yet</li>
                    <li>• The category name doesn't match our product categories</li>
                    <li>• Products are still being loaded</li>
                  </ul>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        console.log('🔄 Debug refresh from no products found');
                        showSuccess('Debug refresh triggered...');
                        fetchProducts(true);
                      }}
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-3"
                    >
                      🔄 Debug Refresh
                    </button>
                    <Link 
                      to="/" 
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Browse All Products
                    </Link>
                    <div className="text-xs text-gray-400">
                      Looking for: {slug} | Check browser console for debug info
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <YouMayAlsoLike />
      <Footer />
    </div>
  );
};

export default DynamicProductPage;

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
      
      const response = await productsAPI.getAll({ 
        limit: 1000,
        _t: Date.now()
      });
      
      // Filter products based on slug type
      let categoryProducts = [];
      
      if (slug === 'combos') {
        // For combos page, use value combo filtering logic
        categoryProducts = (response.products || []).filter(product => {
          const isValueCombo = product.isValueCombo || 
                              product.displaySections?.valueCombos ||
                              product.tags?.includes('value combo');
          return isValueCombo;
        });
      } else {
        // For other categories, use categorySlug filtering
        categoryProducts = (response.products || []).filter(product => {
          return product.categorySlug === slug;
        });
      }
      
      setProducts(categoryProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  // Fallback data removed - we only show real products from database


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
      'seeds': 'Seeds',
      'combos': 'Value Combos'
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full">
          {/* Products Grid */}
          {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                {products.map((product) => {
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
                      <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={getImageUrl(product.images[0].url)} 
                            alt={product.images[0].alt || product.name}
                            className="w-full h-full object-contain p-2"
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
                            <span className="text-sm text-gray-600">({product.rating.count} Reviews)</span>
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
                    <Link 
                      to="/" 
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Browse All Products
                    </Link>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      <YouMayAlsoLike />
      <Footer />
    </div>
  );
};

export default DynamicProductPage;

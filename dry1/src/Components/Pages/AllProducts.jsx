import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';
import { productsAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import { 
  getProductImageUrl, 
  getProductImageAlt,
  getProductBadge,
  getProductSizeAndPrice,
  renderStars,
  renderRatingDisplay,
  createSafeImageErrorHandler
} from '../../utils/productUtils.jsx';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array to run only once


  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('🌐 Fetching ALL products from database...');
      const response = await productsAPI.getAll({ limit: 1000 });
      console.log('🌐 All Products response:', response);
      setProducts(response.products || []);
      // Removed automatic success notification to prevent infinite loop
      if (response.products && response.products.length === 0) {
        console.log(`⚠️ No products found in database`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = useCallback((product) => {
    console.log('🛒 Buy Now clicked for product:', product.name, 'ID:', product._id || product.id);
    
    // Navigate to product detail page
    const productId = product._id || product.id;
    if (productId) {
      console.log('🛒 Navigating to product detail page:', `/product/${productId}`);
      // Simple navigation
      window.location.href = `/product/${productId}`;
    } else {
      console.error('❌ No product ID found for:', product);
      showError('Product ID not found');
    }
  }, [showError]);


  return (
    <div className="w-full min-h-screen">
      <Header />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">All Products</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Showing {products.length} products
            </p>
          </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : products.map((product) => (
                <div key={product._id || product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
                  {/* Clickable Product Area */}
                  <Link to={`/product/${product._id || product.id}`} className="block">
                    {/* Product Image */}
                    <div className="relative">
                      <div className="w-full h-40 sm:h-44 md:h-48 bg-gray-100 flex items-center justify-center relative">
                        {/* Badge */}
                        {getProductBadge(product) && (
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                            <span className={`${getProductBadge(product).color} text-white px-1 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded`}>
                              {getProductBadge(product).text}
                            </span>
                          </div>
                        )}
                        
                        {/* Product Image */}
                        <img
                          src={getProductImageUrl(product) || '/placeholder-product.jpg'} 
                          alt={getProductImageAlt(product)}
                          className="w-full h-full object-contain p-1 sm:p-2"
                          loading="lazy"
                          decoding="async"
                          onError={createSafeImageErrorHandler('/placeholder-product.jpg')}
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-2 sm:p-3 md:p-4">
                      {/* Product Name */}
                      <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2 line-clamp-2 h-8 sm:h-10">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      {renderRatingDisplay(product)}

                      {/* Size */}
                      <div className="mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-800">
                          {product.sizes && product.sizes.length > 0 ? product.sizes[0].size : 'N/A'}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-2 sm:mb-3">
                        {(() => {
                          const priceInfo = getProductSizeAndPrice(product);
                          return (
                            <div className="text-xs sm:text-sm">
                              <span className="text-green-600 font-semibold">₹{priceInfo.price}</span>
                              {priceInfo.originalPrice && priceInfo.originalPrice > priceInfo.price && (
                                <span className="text-gray-500 line-through ml-1 sm:ml-2">₹{priceInfo.originalPrice}</span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </Link>

                  {/* Buy Now Button - Outside Link */}
                  <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔴 Button clicked for:', product.name);
                        handleBuyNow(product);
                      }}
                      className="w-full !bg-blue-600 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg hover:!bg-blue-700 transition-colors duration-200 text-xs sm:text-sm font-medium"
                      style={{backgroundColor: '#2563eb', color: 'white'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

          {/* No Products Message */}
          {!loading && products.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                No products are currently available.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AllProducts;

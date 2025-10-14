import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api.js';
import config, { initializeConfig } from '../../config/environment.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import { getImageUrl } from '../../utils/urls.js';

const OurBestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();
  console.log("Hello this is the product",products);

  

  useEffect(() => {
    fetchBestSellers();
    
    // Listen for refresh events
    const handleRefresh = () => {
      console.log('🔄 Refreshing Best Sellers due to product update');
      fetchBestSellers();
    };
    
    window.addEventListener('refreshHomeSections', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshHomeSections', handleRefresh);
    };
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      console.log('🔄 OurBestSellers - Starting to fetch best sellers...');
      
      await initializeConfig();
      
      let response;
      try {
        console.log('🌐 OurBestSellers - Calling productsAPI.getFeatured()...');
        response = await productsAPI.getFeatured();
        console.log('📡 OurBestSellers - Featured API response:', response);
        console.log('📊 OurBestSellers - Best sellers from featured API:', response.bestSellers?.length || 0);
        setProducts(response.bestSellers || []);
      } catch (featuredError) {
        console.log('❌ OurBestSellers - Featured endpoint failed:', featuredError);
        console.log('🔄 OurBestSellers - Trying all products API...');
        response = await productsAPI.getAll({ limit: 1000 });
        const allProducts = response.products || [];
        
        console.log('🔍 OurBestSellers - All products from API:', allProducts);
        console.log('📊 OurBestSellers - Total products found:', allProducts.length);
        
        // Filter for best sellers using the new display logic
        const bestSellers = allProducts.filter(p => {
          const isBestSeller = p.isBestSeller || 
                              p.displaySections?.ourBestSellers ||
                              p.isValueCombo || 
                              p.displaySections?.valueCombos ||
                              p.isYouMayLike || 
                              p.displaySections?.youMayAlsoLike;
          
          console.log(`🔍 OurBestSellers - Product: ${p.name}`, {
            isBestSeller: p.isBestSeller,
            displaySections: p.displaySections,
            isValueCombo: p.isValueCombo,
            isYouMayLike: p.isYouMayLike,
            matches: isBestSeller
          });
          
          return isBestSeller;
        });
        
        console.log('✅ OurBestSellers - Best seller products found:', bestSellers);
        console.log('📈 OurBestSellers - Best seller count:', bestSellers.length);
        console.log('🎯 OurBestSellers - Setting products state with:', bestSellers.length, 'products');
        
        setProducts(bestSellers);
      }
    } catch (error) {
      if (config.IS_DEVELOPMENT) {
        console.error('Error fetching best sellers:', error);
      }
      // No fallback data - show empty array when API fails
      console.log('No products found from API');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data removed - we only show real products from database

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to product detail page
    window.location.href = `/product/${product._id}`;
  };

  if (loading) {
    return (
      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Our Best Sellers
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Our Best Sellers
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white relative -mt-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800">
          Our Best Sellers
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => {
            const mainSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
            const mainBadge = product.badges && product.badges.length > 0 ? product.badges[0] : null;
            const discountPercentage = mainSize && mainSize.originalPrice ? 
              Math.round(((mainSize.originalPrice - mainSize.price) / mainSize.originalPrice) * 100) : 0;
            
            return (
              <div key={product._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border relative h-full flex flex-col">
                <Link
                  to={`/product/${product._id}`}
                  className="block flex-1"
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
                        className="w-full h-full object-contain p-1 sm:p-2"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-gray-400 text-xs sm:text-sm">Product Image</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
                  {/* Product Title */}
                  <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2 line-clamp-2 leading-tight flex-shrink-0">
                      {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-1 sm:mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`w-2 h-2 sm:w-3 sm:h-3 ${
                              index < Math.floor(product.rating?.average || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-600">
                        {product.rating?.average?.toFixed(1) || '0.0'}
                      </span>
                  </div>

                  {/* Reviews Count */}
                    <p className="text-xs text-gray-500 mb-2 sm:mb-3">
                      {product.rating?.count || 0} Reviews
                    </p>

                  {/* Weight */}
                    {mainSize && (
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{mainSize.size}</p>
                    )}

                  {/* Price Section */}
                    {mainSize && (
                  <div className="mb-2 sm:mb-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <span className="text-sm sm:text-lg font-bold text-green-700">₹{mainSize.price}</span>
                          {mainSize.originalPrice && mainSize.originalPrice > mainSize.price && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through">₹{mainSize.originalPrice}</span>
                          )}
                    </div>
                  </div>
                    )}
                </div>
                </Link>

                {/* Buy Now Button - Outside Link */}
                <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
                  <button 
                    className="w-full !bg-blue-700 text-white py-1.5 sm:py-2 rounded font-semibold text-xs sm:text-sm hover:!bg-blue-800 transition-colors disabled:bg-gray-400"
                    style={{backgroundColor: '#1d4ed8', color: 'white'}}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onClick={(e) => handleBuyNow(e, product)}
                    disabled={!mainSize || mainSize.stock === 0}
                  >
                    {!mainSize || mainSize.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurBestSellers;

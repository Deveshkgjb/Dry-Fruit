import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import { getImageUrl } from '../../utils/urls.js';
import { initializeConfig } from '../../config/environment.js';

const YouMayAlsoLike = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();

  // Fetch "You May Also Like" products from backend
  useEffect(() => {
    const fetchYouMayLikeProducts = async () => {
      try {
        setLoading(true);
        // Initialize config first to ensure correct API URL
        await initializeConfig();
        const response = await productsAPI.getAll({ limit: 100 });
        const allProducts = response.products || [];
        
        // Filter products that are marked for "You May Also Like" OR from "Value Combos" (which auto-enables Our Best Sellers)
        const youMayLikeProducts = allProducts.filter(product => {
          const isYouMayLike = product.isYouMayLike || 
                              product.displaySections?.youMayAlsoLike ||
                              product.isValueCombo || 
                              product.displaySections?.valueCombos;
          
          console.log(`🔍 You May Also Like - Product: ${product.name}`, {
            isYouMayLike: product.isYouMayLike,
            displaySections: product.displaySections,
            isValueCombo: product.isValueCombo,
            matches: isYouMayLike
          });
          
          return isYouMayLike;
        });
        
        setProducts(youMayLikeProducts);
      } catch (error) {
        console.error('Error fetching you may like products:', error);
        console.error('Error details:', error.message, error.stack);
        // Don't show error notification, just silently fail with empty products
        // showError('Failed to load recommended products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYouMayLikeProducts();
    
    // Listen for refresh events
    const handleRefresh = () => {
      console.log('🔄 Refreshing You May Also Like due to product update');
      fetchYouMayLikeProducts();
    };
    
    window.addEventListener('refreshHomeSections', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshHomeSections', handleRefresh);
    };
  }, []); // Empty dependency array - only run once on mount

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to product detail page
    window.location.href = `/product/${product._id || product.id}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (products.length === 0) {
    return null; // Don't show the section if no products
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-yellow-400 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="w-full bg-white py-[8vh] md:py-[10vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800">
          You May Also Like
        </h2>

        {/* Products Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => {
            const firstSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
            const price = firstSize?.price || product.price || 0;
            const originalPrice = firstSize?.originalPrice || product.originalPrice || 0;
            const isSoldOut = product.status === 'Inactive' || (firstSize && firstSize.stock <= 0);
            const rating = product.rating?.average || product.rating || 0;
            const totalRatings = product.rating?.count || product.totalRatings || 0;
            const weight = firstSize?.size || product.weight || 'Standard';

            return (
              <Link 
                key={product._id || product.id}
                to={`/product/${product._id || product.id}`}
                className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
              >
                      {/* Product Image */}
                      <div className="relative">
                        <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center relative">
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <span className="px-2 py-1 text-xs font-semibold rounded text-white bg-purple-500">
                              Recommended
                            </span>
                            {isSoldOut && (
                              <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                                Sold out
                              </span>
                            )}
                          </div>
                          
                          {/* Product Image */}
                          <img 
                            src={getImageUrl(product.images?.[0]?.url || product.image)} 
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                            <span className="text-gray-400 text-xs">Product</span>
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        {/* Product Name */}
                        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        {rating > 0 && (
                          <div className="flex items-center mb-2">
                            <div className="flex mr-1">
                              {renderStars(rating)}
                            </div>
                            <span className="text-xs text-gray-600">
                              {rating} | {totalRatings} Review{totalRatings !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}

                        {/* Weight */}
                        {weight && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-800">{weight}</span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-800">₹ {price}</span>
                            {originalPrice > price && (
                              <span className="text-sm text-gray-500 line-through">MRP ₹ {originalPrice}</span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={(e) => handleBuyNow(e, product)}
                          disabled={isSoldOut}
                          className={`w-full py-2 px-4 rounded font-medium text-sm transition-colors ${
                            isSoldOut
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : '!bg-blue-700 hover:!bg-blue-800 text-white'
                          }`}
                          style={!isSoldOut ? {backgroundColor: '#1d4ed8', color: 'white'} : {}}
                          onMouseEnter={!isSoldOut ? (e) => e.target.style.backgroundColor = '#1e40af' : undefined}
                          onMouseLeave={!isSoldOut ? (e) => e.target.style.backgroundColor = '#1d4ed8' : undefined}
                        >
                          {isSoldOut ? 'Sold Out' : 'Buy Now'}
                        </button>
                      </div>
                    </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default YouMayAlsoLike;

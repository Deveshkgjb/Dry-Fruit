import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { productsAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import { getImageUrl } from '../../utils/urls.js';
import { initializeConfig } from '../../config/environment.js';
import config from '../../config/environment.js';

const ValueCombos = () => {
  const { showSuccess, showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Fetch value combo products from backend
  useEffect(() => {
    console.log('🔄 ValueCombos component mounted - starting data fetch');
    
    const fetchValueComboProducts = async () => {
      try {
        setLoading(true);
        
        // Initialize config first to ensure correct API URL
        await initializeConfig();
        console.log('🔍 API Base URL:', config.API_BASE_URL);
        
        // Use productsAPI to get products (same as other components)
        const response = await productsAPI.getAll({ limit: 100 });
        const allProducts = response.products || [];
        console.log('📊 Total products from API:', allProducts.length);
        console.log('🔍 Raw API response:', response);
        console.log('🔍 First few products:', allProducts.slice(0, 3));
        
        // Filter for value combo products
        const valueComboProducts = allProducts.filter(product => {
          // Check multiple conditions for value combo products
          const isValueCombo = product.isValueCombo === true;
          const hasValueComboSection = product.displaySections?.valueCombos === true;
          const hasValueComboTag = product.tags && product.tags.some(tag => 
            tag.toLowerCase().includes('value') || tag.toLowerCase().includes('combo')
          );
          const isComboCategory = product.categorySlug === 'combos' || 
                                product.category?.name?.toLowerCase().includes('combo');
          
          const matches = isValueCombo || hasValueComboSection || hasValueComboTag || isComboCategory;
          
          if (matches) {
            console.log(`✅ Combo match found: ${product.name}`, {
              isValueCombo,
              hasValueComboSection,
              hasValueComboTag,
              isComboCategory,
              displaySections: product.displaySections,
              tags: product.tags,
              category: product.category
            });
          }
          
          return matches;
        });
        
        console.log('✅ Value combo products found:', valueComboProducts.length);
        console.log('📝 Combo products:', valueComboProducts.map(p => p.name));
        
        // Update state
        setProducts(valueComboProducts);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error fetching value combo products:', error);
        setProducts([]);
        setLoading(false);
        showError('Failed to load combo products: ' + error.message);
      }
    };

    fetchValueComboProducts();
    
    // Listen for refresh events
    const handleRefresh = () => {
      console.log('🔄 Refreshing Value Combos due to product update');
      fetchValueComboProducts();
    };
    
    window.addEventListener('refreshHomeSections', handleRefresh);
    
    return () => {
      console.log('🔄 ValueCombos component unmounting - cleaning up');
      window.removeEventListener('refreshHomeSections', handleRefresh);
      isMountedRef.current = false;
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
      <div className="py-16 min-h-96">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading combo products...</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (products.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Value Combos</h2>
            <p className="text-gray-600 mb-4">No combo products found.</p>
            <p className="text-sm text-gray-500 mb-4">Check browser console for debug info.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Section Title */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Value Combos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our amazing value combo packs with premium dry fruits and nuts at unbeatable prices
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map((product) => {
            const firstSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
            const price = firstSize?.price || product.price || 0;
            const originalPrice = firstSize?.originalPrice || product.originalPrice || 0;
            const isSoldOut = product.status === 'Inactive' || (firstSize && firstSize.stock <= 0);
            const rating = product.rating?.average || product.rating || 0;
            const totalRatings = product.rating?.count || product.totalRatings || 0;

            return (
              <div
                key={product._id || product.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border relative"
              >
                {/* Clickable Product Area */}
                <Link 
                  to={`/product/${product._id || product.id}`}
                  className="block"
                >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                    Value Pack
                  </span>
                </div>

                {/* Sold Out Tag */}
                {isSoldOut && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gray-500 text-white px-2 py-1 text-xs rounded">
                      Sold out
                    </span>
                  </div>
                )}

                {/* Product Image */}
                <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
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
                    <span className="text-gray-400 text-sm">Combo Package</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  {/* Product Title */}
                  <h3 className="text-sm font-medium text-gray-800 mb-3 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {rating > 0 && (
                    <>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className={`w-3 h-3 ${
                                index < Math.floor(rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Reviews Count */}
                      <p className="text-xs text-gray-500 mb-3">
                        {totalRatings > 0 ? `${totalRatings} | Reviews` : ''}
                      </p>
                    </>
                  )}

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-lg font-bold text-gray-900">₹{price}</span>
                    {originalPrice > price && (
                      <span className="text-sm text-gray-500 ml-2 line-through">₹{originalPrice}</span>
                    )}
                  </div>
                </div>
                </Link>

                {/* Buy Now Button - Outside Link */}
                <div className="px-4 pb-4">
                  <button 
                    onClick={(e) => handleBuyNow(e, product)}
                    disabled={isSoldOut}
                    className={`w-full py-2 rounded font-semibold text-sm transition-colors ${
                      isSoldOut
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : '!bg-blue-700 text-white hover:!bg-blue-800'
                    }`}
                    style={!isSoldOut ? {backgroundColor: '#1d4ed8', color: 'white'} : {}}
                    onMouseEnter={!isSoldOut ? (e) => e.target.style.backgroundColor = '#1e40af' : undefined}
                    onMouseLeave={!isSoldOut ? (e) => e.target.style.backgroundColor = '#1d4ed8' : undefined}
                  >
                    {isSoldOut ? 'Sold Out' : 'Buy Now'}
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

export default ValueCombos;
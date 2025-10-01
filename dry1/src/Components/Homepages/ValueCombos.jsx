import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cartAPI, productsAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import { getImageUrl } from '../../utils/urls.js';
import { initializeConfig } from '../../config/environment.js';

const ValueCombos = () => {
  const { showSuccess, showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch value combo products from backend
  useEffect(() => {
    const fetchValueComboProducts = async () => {
      try {
        setLoading(true);
        // Initialize config first to ensure correct API URL
        await initializeConfig();
        const response = await productsAPI.getAll({ limit: 100 });
        const allProducts = response.products || [];
        
        console.log('🔍 All products from API:', allProducts);
        console.log('📊 Total products found:', allProducts.length);
        
        // Filter products that are marked as value combos
        const valueComboProducts = allProducts.filter(product => {
          const isValueCombo = product.isValueCombo || 
                              product.displaySections?.valueCombos ||
                              product.tags?.includes('value combo');
          
          console.log(`🔍 Value Combos - Product: ${product.name}`, {
            isValueCombo: product.isValueCombo,
            displaySections: product.displaySections,
            tags: product.tags,
            matches: isValueCombo
          });
          
          return isValueCombo;
        });
        
        console.log('✅ Value combo products found:', valueComboProducts);
        console.log('📈 Value combo count:', valueComboProducts.length);
        
        setProducts(valueComboProducts);
      } catch (error) {
        console.error('Error fetching value combo products:', error);
        console.error('Error details:', error.message, error.stack);
        // Don't show error notification, just silently fail with empty products
        // showError('Failed to load value combo products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchValueComboProducts();
  }, [showError]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the first available size/price from the product
    const firstSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    const price = firstSize?.price || product.price || 0;
    const size = firstSize?.size || 'Combo';

    const cartItem = {
      productId: product._id || product.id,
      name: product.name,
      size: size,
      price: price,
      quantity: 1,
      image: getImageUrl(product.images?.[0]?.url || product.image)
    };

    try {
      cartAPI.addToCart(cartItem);
      showSuccess('Combo added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add combo to cart');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading value combos...</p>
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
            <p className="text-gray-600">No value combo products available at the moment.</p>
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
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={getImageUrl(product.images?.[0]?.url || product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
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
                <div className="p-4">
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

                      {/* Ratings Count */}
                      <p className="text-xs text-gray-500 mb-3">
                        {totalRatings > 0 ? `${totalRatings} | Ratings` : ''}
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

                {/* Add to Cart Button - Outside Link */}
                <div className="px-4 pb-4">
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isSoldOut}
                    className={`w-full py-2 rounded font-semibold text-sm transition-colors ${
                      isSoldOut
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-700 text-white hover:bg-green-800'
                    }`}
                  >
                    {isSoldOut ? 'Sold Out' : 'Add to Cart'}
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

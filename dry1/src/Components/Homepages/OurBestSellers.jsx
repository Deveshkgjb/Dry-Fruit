import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { productsAPI, cartAPI } from '../../services/api.js';
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
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      
      await initializeConfig();
      
      let response;
      try {
        response = await productsAPI.getFeatured();
        setProducts(response.bestSellers || []);
      } catch (featuredError) {
        console.log('Featured endpoint failed, trying all products...');
        response = await productsAPI.getAll({ limit: 100 });
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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.sizes || product.sizes.length === 0) {
      showError('Product size not available');
      return;
    }

    const mainSize = product.sizes[0];
    const cartItem = {
      productId: product._id,
      name: product.name,
      size: mainSize.size,
      price: mainSize.price,
      quantity: 1,
      image: product.images && product.images.length > 0 ? getImageUrl(product.images[0].url) : ''
    };

    try {
      cartAPI.addToCart(cartItem);
      showSuccess('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add product to cart');
    }
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
    <div className="w-f bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Our Best Sellers
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => {
            const mainSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
            const mainBadge = product.badges && product.badges.length > 0 ? product.badges[0] : null;
            const discountPercentage = mainSize && mainSize.originalPrice ? 
              Math.round(((mainSize.originalPrice - mainSize.price) / mainSize.originalPrice) * 100) : 0;
            
            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border relative"
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
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Product Image</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Product Title */}
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`w-3 h-3 ${
                            index < Math.floor(product.rating?.average || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                    <span className="ml-2 text-xs text-gray-600">
                      {product.rating?.average?.toFixed(1) || '0.0'}
                    </span>
                </div>

                {/* Ratings Count */}
                  <p className="text-xs text-gray-500 mb-3">
                    {product.rating?.count || 0} Reviews
                  </p>

                {/* Weight */}
                  {mainSize && (
                    <p className="text-sm font-medium text-gray-700 mb-2">{mainSize.size}</p>
                  )}

                {/* Price Section */}
                  {mainSize && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-green-700">₹{mainSize.price}</span>
                        {mainSize.originalPrice && mainSize.originalPrice > mainSize.price && (
                          <span className="text-sm text-gray-500 line-through">₹{mainSize.originalPrice}</span>
                        )}
                  </div>
                </div>
                  )}

                {/* Add to Cart Button */}
                  <button 
                    className="w-full bg-green-700 text-white py-2 rounded font-semibold text-sm hover:bg-green-800 transition-colors disabled:bg-gray-400"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!mainSize || mainSize.stock === 0}
                  >
                    {!mainSize || mainSize.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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

export default OurBestSellers;

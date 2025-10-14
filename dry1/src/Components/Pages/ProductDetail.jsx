import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';
import YouMayAlsoLike from '../Homepages/YouMayAlsoLike.jsx';
import { productsAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import config from '../../config/environment.js';
import { getImageUrl } from '../../utils/urls.js';
import { 
  FaStar, 
  FaRocket, 
  FaUsers,
  FaGlobe
} from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedSize, setSelectedSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [countdownTime, setCountdownTime] = useState({ minutes: 15, seconds: 30 });
  const [deliveryTime, setDeliveryTime] = useState({ minutes: 14, seconds: 9 });
  
  // Debug useEffect removed to prevent infinite loops

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product && !loading) {
      window.scrollTo(0, 0);
    }
  }, [product, loading]);

  useEffect(() => {
    if (!product) {
      return;
    }
    
    const totalSeconds = 15 * 60 + 30;
    
    const updateOfferCountdown = () => {
      setCountdownTime(prevTime => {
        let totalTimeLeft = prevTime.minutes * 60 + prevTime.seconds;
        
        totalTimeLeft -= 1;
        
        if (totalTimeLeft <= 0) {
          totalTimeLeft = totalSeconds;
        }
        
        const minutes = Math.floor(totalTimeLeft / 60);
        const seconds = totalTimeLeft % 60;
        
        return { minutes, seconds };
      });
    };
    
    updateOfferCountdown();

    const interval = setInterval(updateOfferCountdown, 1000);

    return () => clearInterval(interval);
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const duration = 15 * 60 * 1000; // 15 minutes in milliseconds
    let startTime = new Date();
    let endTime = new Date(startTime.getTime() + duration);

    const updateDeliveryTimer = () => {
      const now = new Date();
      let timeLeft = endTime.getTime() - now.getTime();

      if (timeLeft <= 0) {        
        startTime = new Date();
        endTime = new Date(startTime.getTime() + duration);
        timeLeft = endTime.getTime() - now.getTime();
      }

      const minutes = Math.floor(timeLeft / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      setDeliveryTime({ minutes, seconds });
    };
    
    updateDeliveryTimer();

    const interval = setInterval(updateDeliveryTimer, 1000);

    return () => clearInterval(interval);
  }, [product]);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (product && product.images && product.images.length > 1) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, selectedImage]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]); // Removed showError from dependencies to prevent infinite loops

  useEffect(() => {
    const handleProductUpdate = () => {
      console.log('🔄 Product update detected, refreshing product data...');
      if (id) {
        fetchProduct();
      }
    };
    
    window.addEventListener('productUpdated', handleProductUpdate);
    window.addEventListener('reviewAdded', handleProductUpdate);

    return () => {
      window.removeEventListener('productUpdated', handleProductUpdate);
      window.removeEventListener('reviewAdded', handleProductUpdate);
    };
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let response;
      
      try {
        console.log('🌐 API CALL: Fetching product with ID:', id);
        response = await productsAPI.getById(id);
        console.log('🌐 API SUCCESS: Raw response received:', response);
      } catch (apiError) {
        console.error('🌐 API FAILED for product:', id, apiError);        
        response = getFallbackProduct(id);
        console.log('🌐 Using fallback product data:', response);
      }
      
      setProduct(response.product || response);
      const productData = response.product || response;
      console.log('🌐 Final product data after processing:', productData);
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0].size);
      }
      
      console.log('🔍 ===== PRODUCT DETAIL DEBUG =====');
      console.log('🔍 Product ID:', id);
      console.log('🔍 Full API Response:', response);
      console.log('🔍 Product Data:', productData);
      console.log('🔍 Product Name:', productData.name);
      console.log('🔍 Product Reviews Array:', productData.reviews);
      console.log('🔍 Reviews Type:', typeof productData.reviews);
      console.log('🔍 Reviews Length:', productData.reviews?.length);
      console.log('🔍 Reviews is Array:', Array.isArray(productData.reviews));
      
      if (productData.reviews && productData.reviews.length > 0) {
        console.log('🔍 Individual Reviews:');
        productData.reviews.forEach((review, index) => {
          console.log(`  Review ${index + 1}:`, {
            id: review.id,
            customerName: review.customerName,
            rating: review.rating,
            comment: review.comment,
            date: review.date,
            verified: review.verified
          });
        });
      } else {
        console.log('🔍 No reviews found in product data');
        console.log('🔍 Product rating info:', productData.rating);
      }
      
      if (response.reviews && response.reviews.length > 0) {        
        const allReviews = response.reviews.filter(review => 
          review.customerName && 
          review.customerName.toLowerCase() !== 'anonymous' &&
          review.customerName.trim() !== ''
        );
        
        const apiReviews = allReviews.map((review, index) => ({
          id: review._id || review.id || `review_${index + 1}`,
          name: review.customerName,
          rating: review.rating,
          date: review.date,
          comment: review.comment
        }));
        setReviews(apiReviews);
        console.log('✅ Loaded all existing reviews from database:', apiReviews.length);
      } else {
        setReviews([]);
        console.log('❌ No reviews in database for this product');
      }      
      console.log('🔍 RATING DEBUG:');
      console.log('  - product.rating:', productData.rating);
      console.log('  - product.rating.average:', productData.rating?.average);
      console.log('  - product.rating.count:', productData.rating?.count);
      console.log('  - product.totalReviews:', productData.totalReviews);
      
      console.log('🔍 ORDER COUNT DEBUG:');
      console.log('  - product.popularitySettings:', productData.popularitySettings);
      console.log('  - product.popularitySettings.orderCount:', productData.popularitySettings?.orderCount);
      
      console.log('🔍 ===== END PRODUCT DETAIL DEBUG =====');
    } catch (error) {
      console.error('Error fetching product:', error);
      showError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const getFallbackProduct = (productId) => {    
    return {
      _id: productId,
      name: 'Product Not Found',
      images: [
        { url: '/dry.png', alt: 'Product Image' }
      ],
      sizes: [{ size: '1', price: 0, originalPrice: 0, stock: 0 }],
      rating: { average: 0, count: 0 },
      badges: [],
      isBestSeller: false,
      description: 'This product could not be loaded. Please try again later.',
      features: [],
      brand: 'Unknown',
      shelfLife: 'Unknown',
      countryOfOrigin: 'Unknown',
      stockCount: 0,
      trustFactors: { reviews: '0 Reviews' }
    };
  };


  const handleBuyNow = () => {
    // For products with sizes
    if (product.sizes && product.sizes.length > 0) {
      if (!selectedSize) {
        showError('Please select a size');
        return;
      }

      const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
      
      if (!selectedSizeData) {
        showError('Selected size not available');
        return;
      }

      // Check stock availability
      if (selectedSizeData.stock <= 0) {
        showError('This size is currently out of stock');
        return;
      }
      
      const orderItem = {
        productId: product._id,
        name: product.name,
        size: selectedSizeData.size,
        price: selectedSizeData.price,
        quantity: 1,
        image: product.images && product.images.length > 0 ? getImageUrl(product.images[0].url) : '',
        stock: selectedSizeData.stock // Include stock info for checkout validation
      };
      
      sessionStorage.setItem('directOrder', JSON.stringify([orderItem]));
      
      window.scrollTo(0, 0);
      
      // Direct redirect to checkout without popup
      window.location.href = '/address';
    } else {
      // For products without sizes (single size products)
      if (!product) {
        showError('Product not available');
        return;
      }

      // Check stock availability for single size products
      if (product.stockCount !== undefined && product.stockCount <= 0) {
        showError('This product is currently out of stock');
        return;
      }
      
      const orderItem = {
        productId: product._id,
        name: product.name,
        size: 'Standard',
        price: product.currentPrice || product.price || 0,
        quantity: 1,
        image: product.images && product.images.length > 0 ? getImageUrl(product.images[0].url) : '',
        stock: product.stockCount || 999 // Include stock info for checkout validation
      };
      
      sessionStorage.setItem('directOrder', JSON.stringify([orderItem]));
      
      window.scrollTo(0, 0);
      
      // Direct redirect to checkout without popup
      window.location.href = '/address';
    }
  };


  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xl ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen">
        <Header />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen">
        <Header />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-gray-600">Product not found</p>
              <p className="text-sm text-gray-500 mt-2">Product ID: {id}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedSizeData = product.sizes.find(s => s.size === selectedSize);

  return (
    <div className="w-full min-h-screen">
      <Header />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="mb-4 relative">
              {product.images && product.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={getImageUrl(product.images[selectedImage]?.url || product.images[selectedImage])}
                    alt={product.images[selectedImage]?.alt || product.name}
                    className="w-full h-64 sm:h-80 lg:h-96 object-contain bg-gray-100 rounded-lg"
                    onError={(e) => {                      
                      if (e.target.src !== window.location.origin + '/dry.png') {
                        e.target.src = '/dry.png';
                      }
                    }}
                  />
                  
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={getImageUrl(image?.url || image)}
                      alt={image?.alt || `Product ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50 rounded"
                      onError={(e) => {
                        e.target.src = '/dry.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {/* Badge */}
            {product.badges && product.badges.length > 0 && (
              <span className={`bg-${product.badges[0].color}-600 text-white px-3 py-1 text-sm font-semibold rounded mb-4 inline-block`}>
                {product.badges[0].text}
              </span>
            )}
            {product.badge && !product.badges && (
              <span className={`${product.badgeColor} text-white px-3 py-1 text-sm font-semibold rounded mb-4 inline-block`}>
                {product.badge}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderStars(product.rating?.average || 0)}
              </div>
              <span className="text-lg font-medium">{product.rating?.average || 0}</span>
              <span className="text-gray-600 ml-2">({product.rating?.count || product.totalReviews || 0} Reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-green-600">₹{selectedSizeData?.price || product.currentPrice}</span>
                {selectedSizeData?.originalPrice && selectedSizeData.originalPrice > selectedSizeData.price && (
                  <span className="text-lg text-gray-500 line-through">MRP ₹{selectedSizeData.originalPrice}</span>
                )}
                {selectedSizeData?.originalPrice && selectedSizeData.originalPrice > selectedSizeData.price && (
                  <span className="text-green-600 font-medium">
                    Save Rs.{selectedSizeData.originalPrice - selectedSizeData.price}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">(MRP is inclusive of all taxes)</p>
            </div>

            {/* Size Selection with Stock Info */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Sizes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.sizes.map((size, index) => {
                    const isSelected = selectedSize === size.size;
                    const isOutOfStock = size.stock <= 0;
                    const isLowStock = size.stock > 0 && size.stock <= 5;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !isOutOfStock && setSelectedSize(size.size)}
                        disabled={isOutOfStock}
                        className={`
                          relative p-3 rounded-lg border-2 text-center transition-all duration-200
                          ${isSelected 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : isOutOfStock
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50'
                          }
                        `}
                      >
                        <div className="font-medium">{size.size}</div>
                        <div className="text-sm font-bold text-green-600">₹{size.price}</div>
                        
                        {/* Stock Status */}
                        {isOutOfStock ? (
                          <div className="text-xs text-red-500 font-medium mt-1">Out of Stock</div>
                        ) : isLowStock ? (
                          <div className="text-xs text-orange-500 font-medium mt-1">Only {size.stock} left!</div>
                        ) : (
                          <div className="text-xs text-green-600 font-medium mt-1">In Stock</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Information */}
            {selectedSizeData && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    {selectedSizeData.stock <= 0 ? (
                      <div className="text-red-600 font-semibold">Currently Out of Stock</div>
                    ) : selectedSizeData.stock <= 5 ? (
                      <div className="text-orange-600 font-semibold">Limited Stock - Only {selectedSizeData.stock} units left!</div>
                    ) : selectedSizeData.stock <= 20 ? (
                      <div className="text-yellow-600 font-semibold">Low Stock - {selectedSizeData.stock} units available</div>
                    ) : (
                      <div className="text-green-600 font-semibold">In Stock - {selectedSizeData.stock} units available</div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedSizeData.stock > 0 ? 'Order now to secure your purchase' : 'We\'ll notify you when back in stock'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Information for products without sizes */}
            {(!product.sizes || product.sizes.length === 0) && product.stockCount !== undefined && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    {product.stockCount <= 0 ? (
                      <div className="text-red-600 font-semibold">Currently Out of Stock</div>
                    ) : product.stockCount <= 5 ? (
                      <div className="text-orange-600 font-semibold">Limited Stock - Only {product.stockCount} units left!</div>
                    ) : product.stockCount <= 20 ? (
                      <div className="text-yellow-600 font-semibold">Low Stock - {product.stockCount} units available</div>
                    ) : (
                      <div className="text-green-600 font-semibold">In Stock - {product.stockCount} units available</div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      {product.stockCount > 0 ? 'Order now to secure your purchase' : 'We\'ll notify you when back in stock'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Popularity & Urgency Info */}
            <div className="space-y-4 mb-6">
              {/* Product Popularity */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-b border-gray-200">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">
                  <span className="text-pink-500 font-semibold">{product.popularitySettings?.orderCount || 0}</span> people ordered this in the last 7 days
                </span>
              </div>

              {/* Offer Countdown - Always visible, positioned above delivery */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-b border-gray-200">
                <span className="text-sm text-gray-700">
                  Offer ends in <span className="text-orange-500 font-semibold">{countdownTime.minutes}min {countdownTime.seconds}sec</span>
                </span>
              </div>

              {/* Delivery Information */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="text-green-600 font-semibold">FREE Delivery</span> • Delivery by
                    </div>
                    <div className="text-sm text-gray-600 ml-4">
                      If ordered within <span className="text-pink-500 font-semibold">{deliveryTime.minutes}m {deliveryTime.seconds}s</span>
                    </div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Return and Payment Policy */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">7 days Replacement</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">No Cash On Delivery</div>
                  </div>
                </div>
              </div>
            </div>



            {/* Direct Purchase Button */}
            <div className="space-y-4 mb-8">
              {/* For products with sizes */}
              {product.sizes && product.sizes.length > 0 && selectedSizeData && selectedSizeData.stock <= 0 ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-5 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Out of Stock
                </button>
              ) : product.sizes && product.sizes.length > 0 && selectedSizeData && selectedSizeData.stock <= 5 ? (
                <button
                  onClick={handleBuyNow}
                  className="w-full !bg-orange-600 text-white py-5 rounded-xl font-bold text-lg hover:!bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                  style={{background: 'linear-gradient(to right, #ea580c, #dc2626)', color: 'white'}}
                  onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)'}
                  onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #ea580c, #dc2626)'}
                >
                  <FaRocket className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Buy Now - Only {selectedSizeData.stock} Left! - ₹{selectedSizeData?.price || 0}
                </button>
              ) : product.sizes && product.sizes.length > 0 ? (
                <button
                  onClick={handleBuyNow}
                  className="w-full !bg-blue-700 text-white py-5 rounded-xl font-bold text-lg hover:!bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                  style={{background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: 'white'}}
                  onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)'}
                  onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)'}
                >
                  <FaRocket className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Buy Now - ₹{product && selectedSize ? (product.sizes.find(size => size.size === selectedSize)?.price || 0).toFixed(2) : '0.00'}
                </button>
              ) : /* For products without sizes */ (
                product.stockCount <= 0 ? (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-5 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Out of Stock
                  </button>
                ) : product.stockCount <= 5 ? (
                  <button
                    onClick={handleBuyNow}
                    className="w-full !bg-orange-600 text-white py-5 rounded-xl font-bold text-lg hover:!bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                    style={{background: 'linear-gradient(to right, #ea580c, #dc2626)', color: 'white'}}
                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)'}
                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #ea580c, #dc2626)'}
                  >
                    <FaRocket className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    Buy Now - Only {product.stockCount} Left! - ₹{product.currentPrice || product.price || 0}
                  </button>
                ) : (
                  <button
                    onClick={handleBuyNow}
                    className="w-full !bg-blue-700 text-white py-5 rounded-xl font-bold text-lg hover:!bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                    style={{background: 'linear-gradient(to right, #2563eb, #1d4ed8)', color: 'white'}}
                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)'}
                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)'}
                  >
                    <FaRocket className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    Buy Now - ₹{product.currentPrice || product.price || 0}
                  </button>
                )
              )}
            </div>

          </div>
        </div>

        {/* Product Description & Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Product Description</h2>
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <h3 className="text-xl font-semibold mb-4">Key Features:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {product.features && Array.isArray(product.features) ? product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            )) : (
              <li>Premium quality product with natural ingredients</li>
            )}
          </ul>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
          </div>
          

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 && (
              <>
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{review.name}</span>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500 ml-2">
                              {review.rating === 1 && "Poor"}
                              {review.rating === 2 && "Fair"}
                              {review.rating === 3 && "Good"}
                              {review.rating === 4 && "Very Good"}
                              {review.rating === 5 && "Excellent"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* You May Also Like */}
        <YouMayAlsoLike />
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';
import YouMayAlsoLike from '../Homepages/YouMayAlsoLike.jsx';
import { productsAPI, cartAPI } from '../../services/api.js';
import { useNotification } from '../Common/NotificationProvider.jsx';
import config from '../../config/environment.js';
import { getImageUrl } from '../../utils/urls.js';
import { 
  FaStar, 
  FaPlus, 
  FaMinus, 
  FaShoppingCart, 
  FaRocket, 
  FaUsers,
  FaGlobe,
  FaWeight
} from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });
  const { showSuccess, showError } = useNotification();

  // Handle keyboard navigation for images
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

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let response;
        
        try {
          response = await productsAPI.getById(id);
        } catch (apiError) {
          console.error('API failed for product:', id, apiError);
          // Use fallback data when API fails
          response = getFallbackProduct(id);
        }
        
        setProduct(response.product || response);
        const productData = response.product || response;
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0].size);
        }
        
        // Sample reviews for now - in real app, fetch from reviews API
        const sampleReviews = [
          {
            id: 1,
            name: "Rahul Sharma",
            rating: 5,
            date: "2024-01-15",
            comment: "Excellent quality! Fresh, crunchy, and perfectly salted. Will definitely order again."
          },
          {
            id: 2,
            name: "Priya Patel",
            rating: 4,
            date: "2024-01-10",
            comment: "Good taste and quality. Packaging is also nice. Slightly expensive but worth it."
          },
          {
            id: 3,
            name: "Amit Kumar",
            rating: 4,
            date: "2024-01-05",
            comment: "Fresh with good taste. Fast delivery. Recommended for healthy snacking."
          }
        ];
        setReviews(sampleReviews);
      } catch (error) {
        console.error('Error fetching product:', error);
        showError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, showError]);

  // Fallback product data for when API is not available
  const getFallbackProduct = (productId) => {
    // Return a generic fallback product for any ID
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

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      showError('Please select a size');
      return;
    }

    const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
    if (!selectedSizeData) {
      showError('Selected size not available');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      size: selectedSizeData.size,
      price: selectedSizeData.price,
      quantity: quantity,
      image: product.images && product.images.length > 0 ? getImageUrl(product.images[0].url) : ''
    };

    try {
      cartAPI.addToCart(cartItem);
      showSuccess('Product added to cart!');
      // Optional: Navigate to cart page after a short delay
      // setTimeout(() => {
      //   navigate('/cart');
      // }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add product to cart');
    }
  };

  const handleBuyNow = () => {
    if (!product || !selectedSize) {
      showError('Please select a size');
      return;
    }

    const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
    if (!selectedSizeData) {
      showError('Selected size not available');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      size: selectedSizeData.size,
      price: selectedSizeData.price,
      quantity: quantity,
      image: product.images && product.images.length > 0 ? getImageUrl(product.images[0].url) : ''
    };

    try {
      cartAPI.addToCart(cartItem);
      showSuccess('Product added to cart! Redirecting to checkout...');
      // Navigate to checkout page
      setTimeout(() => {
        navigate('/address');
      }, 1000); // Small delay to show the success message
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add product to cart');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    // Validate review data
    if (!newReview.name.trim() || !newReview.comment.trim() || newReview.rating === 0) {
      showError('Please fill in all fields and select a rating');
      return;
    }
    
    if (newReview.comment.length > 500) {
      showError('Review must be 500 characters or less');
      return;
    }
    
    const review = {
      id: reviews.length + 1,
      name: newReview.name.trim(),
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment.trim()
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '', name: '' });
    showSuccess('Thank you for your review!');
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="mb-4 relative">
              {product.images && product.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={getImageUrl(product.images[selectedImage]?.url || product.images[selectedImage])}
                    alt={product.images[selectedImage]?.alt || product.name}
                    className="w-full h-96 object-contain bg-gray-100 rounded-lg"
                    onError={(e) => {
                      e.target.src = '/dry.png';
                    }}
                  />
                  
                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      {/* Left Arrow */}
                      <button
                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                        aria-label="Previous image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {/* Right Arrow */}
                      <button
                        onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                        aria-label="Next image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {selectedImage + 1} / {product.images.length}
                    </div>
                  )}
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
              <span className="text-gray-600 ml-2">({product.rating?.count || product.totalReviews || 0} Ratings)</span>
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

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="font-medium">Brand:</span> {product.brand || 'Happilo'}
              </div>
              <div>
                <span className="font-medium">Shelf Life:</span> {product.shelfLife || '12 months'}
              </div>
              <div>
                <span className="font-medium">Country of Origin:</span> {product.countryOfOrigin || 'Mixed'}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Stock:</span>
                <span className="text-green-600">✓ {selectedSizeData?.stock || product.stockCount || 0} stock left</span>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Size:</h3>
              <div className="space-y-2">
                {product.sizes.map((sizeOption) => (
                  <label key={sizeOption.size} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <input
                      type="radio"
                      name="size"
                      value={sizeOption.size}
                      checked={selectedSize === sizeOption.size}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="text-green-600 w-4 h-4"
                    />
                    <span className="font-medium">{sizeOption.size}</span>
                    <span className="text-green-600 font-semibold">₹{sizeOption.price}</span>
                    {sizeOption.originalPrice && sizeOption.originalPrice > sizeOption.price && (
                      <span className="text-gray-500 line-through text-sm">₹{sizeOption.originalPrice}</span>
                    )}
                    <span className="text-sm text-gray-600 ml-auto">({sizeOption.stock} in stock)</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Premium Quantity Controls */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaWeight className="w-4 h-4 text-green-600" />
                Quantity:
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <FaMinus className="w-4 h-4 text-red-600 group-hover:text-red-700 transition-colors duration-300" />
                </button>
                <div className="w-16 h-10 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-lg font-semibold text-gray-800">{quantity}</span>
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <FaPlus className="w-4 h-4 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                </button>
              </div>
            </div>

            {/* Premium Action Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-white to-gray-50 border-2 border-green-600 text-green-600 py-4 rounded-xl font-semibold hover:from-green-50 hover:to-green-100 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-3 group"
              >
                <FaShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Add To Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                <FaRocket className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Buy It Now
              </button>
            </div>

            {/* Premium Trust Factors */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <div className="text-yellow-600 text-2xl mb-2 flex justify-center">
                  <FaStar className="w-6 h-6" />
                </div>
                <div className="font-semibold text-gray-800">{product.trustFactors?.reviews || `${product.rating?.count || 0}+ Reviews`}</div>
                <div className="text-gray-600">Reviews</div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-blue-600 text-2xl mb-2 flex justify-center">
                  <FaGlobe className="w-6 h-6" />
                </div>
                <div className="font-semibold text-gray-800">Globally Sourced</div>
                <div className="text-gray-600">Ingredients</div>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-green-600 text-2xl mb-2 flex justify-center">
                  <FaUsers className="w-6 h-6" />
                </div>
                <div className="font-semibold text-gray-800">Consumed By</div>
                <div className="text-gray-600">1 Crore+ Indians</div>
              </div>
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
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          
          {/* Add Review Form */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className={`text-2xl transition-colors duration-200 ${
                        star <= newReview.rating 
                          ? 'text-yellow-400 hover:text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {newReview.rating === 1 && "Poor"}
                  {newReview.rating === 2 && "Fair"}
                  {newReview.rating === 3 && "Good"}
                  {newReview.rating === 4 && "Very Good"}
                  {newReview.rating === 5 && "Excellent"}
                  {newReview.rating === 0 && "Click on a star to rate"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 500) {
                      setNewReview({...newReview, comment: value});
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded h-24 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Share your experience with this product..."
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newReview.comment.length}/500 characters
                </p>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded font-medium hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!newReview.name.trim() || !newReview.comment.trim() || newReview.rating === 0}
              >
                Submit Review
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
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
              ))
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

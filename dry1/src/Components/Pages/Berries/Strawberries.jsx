import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';
import { productsAPI, cartAPI } from '../../../services/api.js';
import { useNotification } from '../../Common/NotificationProvider.jsx';
import { getImageUrl } from '../../../utils/urls.js';

const Strawberries = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchStrawberries();
  }, []);

  const fetchStrawberries = async () => {
    try {
      setLoading(true);
      // Try API first, no fallback data
      try {
        const response = await productsAPI.getAll({ categorySlug: 'strawberries' });
        setProducts(response.products || []);
      } catch (apiError) {
        console.log('API failed for strawberries...');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching strawberries:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackStrawberries = () => [
    {
      id: 1,
      name: "Happilo Premium Dried Strawberries",
      image: "/dev1.png",
      weight: "200g",
      price: 379,
      originalPrice: 479,
      rating: 4.6,
      reviews: 95,
      badge: "SWEET & AROMATIC",
      badgeColor: "bg-pink-500"
    },
    {
      id: 2,
      name: "Happilo Organic Strawberries",
      image: "/dev2.png",
      weight: "150g",
      price: 429,
      originalPrice: 529,
      rating: 4.8,
      reviews: 142,
      badge: "ORGANIC",
      badgeColor: "bg-green-500"
    },
    {
      id: 3,
      name: "Happilo Freeze-Dried Strawberries",
      image: "/dev1.png",
      weight: "100g",
      price: 499,
      originalPrice: 649,
      rating: 4.4,
      reviews: 67,
      badge: "FREEZE-DRIED",
      badgeColor: "bg-blue-500"
    },
    {
      id: 4,
      name: "Happilo Natural Strawberries",
      image: "/dev2.png",
      weight: "250g",
      price: 299,
      originalPrice: null,
      rating: 4.5,
      reviews: 89,
      badge: "NATURAL",
      badgeColor: "bg-purple-500"
    },
    {
      id: 5,
      name: "Happilo Premium Strawberry Mix",
      image: "/dev1.png",
      weight: "300g",
      price: 599,
      originalPrice: 749,
      rating: 4.7,
      reviews: 156,
      badge: "BEST SELLER",
      badgeColor: "bg-red-500"
    },
    {
      id: 6,
      name: "Happilo Sweet Strawberries",
      image: "/dev2.png",
      weight: "500g",
      price: 899,
      originalPrice: null,
      rating: 4.3,
      reviews: 78,
      badge: "On Sale",
      badgeColor: "bg-green-500"
    }
  ];

  const sizes = ['100g (1)', '150g (1)', '200g (1)', '250g (1)', '300g (1)', '500g (1)'];

  const renderStars = (rating) => {
    if (!rating) return null;
    const ratingValue = typeof rating === 'object' ? rating.average : rating;
    if (!ratingValue) return null;
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-yellow-400 ${index < Math.floor(ratingValue) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = {
      productId: product.id,
      name: product.name,
      size: product.weight,
      price: product.price,
      quantity: 1,
      image: product.image
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
      <div className="w-full min-h-screen">
        <Header />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading strawberries...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <Header />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            {/* Sort By */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span className="font-medium">Sorted By</span>
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Customer Rating</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-4">Price</h3>
              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="number" 
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                  className="w-16 p-1 border border-gray-300 rounded text-sm"
                />
                <span>to</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                  className="w-16 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-4">Size</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sizes.map((size, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Top bar with sort */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Strawberries</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative">
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`${product.badgeColor} text-white px-2 py-1 text-xs font-semibold rounded`}>
                          {product.badge}
                        </span>
                      </div>
                      
                      {/* Product Image */}
                      <img 
                        src={getImageUrl(product.images?.[0]?.url || product.image) || '/placeholder-product.jpg'} 
                        alt={product.name}
                        className="w-24 h-24 object-contain"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex mr-1">
                          {renderStars(typeof product.rating === 'object' ? product.rating.average : product.rating)}
                        </div>
                        <span className="text-xs text-gray-600">
                          {typeof product.rating === 'object' ? product.rating.average : product.rating} | {typeof product.rating === 'object' ? product.rating.count : (product.reviews || 0)} Rating{(typeof product.rating === 'object' ? product.rating.count : (product.reviews || 0)) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {/* Weight */}
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-800">{product.weight}</span>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      {product.price > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-800">₹ {product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₹ {product.originalPrice}</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">Price on request</div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      className="w-full py-2 px-4 rounded font-medium text-sm transition-colors bg-green-700 hover:bg-green-800 text-white"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Products Message */}
            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍓</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Sorry, strawberry items are not present
                </h3>
                <p className="text-gray-500 mb-4">
                  We couldn't find any strawberry products in our database at the moment.
                </p>
                <p className="text-sm text-gray-400">
                  Please check back later or explore other categories.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Premium Quality Strawberries Dry Fruits Online from Happilo</h2>
            <p className="text-gray-600 leading-relaxed">
              Happilo provides a variety of strawberries which guarantee a premium-quality healthy snack at affordable prices. These sweet and aromatic berries are packed with nutrients that boost your health functions, enhancing immune system and providing vitamin C benefits.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">What are Strawberries?</h3>
            <p className="text-gray-600 leading-relaxed">
              Strawberries are sweet, red berries that are rich in vitamin C and antioxidants. They are known for their distinctive aroma and sweet taste. Dried strawberries retain most of their nutritional value while providing a convenient, long-lasting snack option.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Health Benefits of Strawberries</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong>Rich in Vitamin C:</strong> High levels of vitamin C support immune system function and skin health.</p>
              <p><strong>Antioxidant Power:</strong> Contains powerful antioxidants that fight free radicals and reduce inflammation.</p>
              <p><strong>Heart Health:</strong> Regular consumption may help improve cardiovascular health and reduce blood pressure.</p>
              <p><strong>Digestive Health:</strong> Good source of dietary fiber that supports healthy digestion.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Strawberries;

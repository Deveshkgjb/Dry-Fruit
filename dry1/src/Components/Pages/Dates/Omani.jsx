import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';
import { productsAPI, cartAPI } from '../../../services/api.js';
import { useNotification } from '../../Common/NotificationProvider.jsx';

const Omani = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchOmaniDates();
  }, []);

  const fetchOmaniDates = async () => {
    try {
      setLoading(true);
      // Try API first, no fallback data
      try {
        const response = await productsAPI.getAll({ categorySlug: 'omani' });
        setProducts(response.products || []);
      } catch (apiError) {
        console.log('API failed for Omani dates...');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching Omani dates:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackOmaniDates = () => [
    {
      id: 1,
      name: "Happilo Premium Omani Dates",
      image: "/dev1.png",
      weight: "500g",
      price: 299,
      originalPrice: 399,
      rating: 4.7,
      reviews: 156,
      badge: "PREMIUM QUALITY",
      badgeColor: "bg-yellow-500"
    },
    {
      id: 2,
      name: "Happilo Organic Omani Dates",
      image: "/dev2.png",
      weight: "1kg",
      price: 549,
      originalPrice: 699,
      rating: 4.8,
      reviews: 203,
      badge: "ORGANIC",
      badgeColor: "bg-green-500"
    },
    {
      id: 3,
      name: "Happilo Soft Omani Dates",
      image: "/dev1.png",
      weight: "250g",
      price: 199,
      originalPrice: 249,
      rating: 4.5,
      reviews: 89,
      badge: "SOFT & JUICY",
      badgeColor: "bg-orange-500"
    },
    {
      id: 4,
      name: "Happilo Natural Omani Dates",
      image: "/dev2.png",
      weight: "750g",
      price: 399,
      originalPrice: null,
      rating: 4.6,
      reviews: 124,
      badge: "NATURAL",
      badgeColor: "bg-blue-500"
    },
    {
      id: 5,
      name: "Happilo Premium Omani Mix",
      image: "/dev1.png",
      weight: "2kg",
      price: 999,
      originalPrice: 1299,
      rating: 4.9,
      reviews: 267,
      badge: "BEST SELLER",
      badgeColor: "bg-red-500"
    },
    {
      id: 6,
      name: "Happilo Sweet Omani Dates",
      image: "/dev2.png",
      weight: "300g",
      price: 249,
      originalPrice: 299,
      rating: 4.4,
      reviews: 78,
      badge: "On Sale",
      badgeColor: "bg-green-500"
    }
  ];

  const sizes = ['250g (1)', '300g (1)', '500g (1)', '750g (1)', '1kg (1)', '2kg (1)'];

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
      productId: "68d8dda535ea6787be8e1824", // Use a valid product ID from database
      name: product.name,
      size: product.weight || "250g",
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
            <div className="text-lg text-gray-600">Loading Omani dates...</div>
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
              <h1 className="text-2xl font-bold">Omani Dates</h1>
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
                <Link 
                  key={product._id} 
                  to={`/product/${product._id}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
                >
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
                        src={product.image} 
                        alt={product.name}
                        className="w-24 h-24 object-contain"
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
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-xs text-gray-600">
                          {product.rating?.average || 0} | {product.rating?.count || 0} Rating{(product.rating?.count || 0) !== 1 ? 's' : ''}
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
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Premium Quality Omani Dates Online from Happilo</h2>
            <p className="text-gray-600 leading-relaxed">
              Happilo provides a variety of Omani dates which guarantee a premium-quality healthy snack at affordable prices. These rich and flavorful dates are packed with nutrients that boost your health functions, providing natural energy and supporting overall wellness.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">What are Omani Dates?</h3>
            <p className="text-gray-600 leading-relaxed">
              Omani dates are premium quality dates from Oman, known for their rich flavor, soft texture, and natural sweetness. They are considered among the finest dates in the world and are prized for their superior taste and nutritional value.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Health Benefits of Omani Dates</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong>Natural Energy:</strong> Rich in natural sugars that provide sustained energy without causing blood sugar spikes.</p>
              <p><strong>Rich in Nutrients:</strong> Contains potassium, fiber, and essential minerals that support overall health.</p>
              <p><strong>Bone Health:</strong> Good source of calcium and magnesium for maintaining strong bones and teeth.</p>
              <p><strong>Digestive Health:</strong> High fiber content promotes healthy digestion and prevents constipation.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Omani;

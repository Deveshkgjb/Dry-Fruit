import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';
import { productsAPI, cartAPI } from '../../../services/api.js';
import { useNotification } from '../../Common/NotificationProvider.jsx';
import { 
  getProductImageUrl, 
  getProductImageAlt, 
  getProductBadge, 
  getProductRating, 
  getProductSizeAndPrice, 
  createCartItem, 
  renderStars,
  renderRatingDisplay 
} from '../../../utils/productUtils.jsx';

const ChiaSeeds = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchChiaSeeds();
  }, []);

  const fetchChiaSeeds = async () => {
    try {
      setLoading(true);
      // Try API first, no fallback data
      try {
        const response = await productsAPI.getAll({ categorySlug: 'chia-seeds' });
        setProducts(response.products || []);
      } catch (apiError) {
        console.log('API failed for chia seeds...');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching chia seeds:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackChiaSeeds = () => [
    {
      id: 1,
      name: "Happilo Premium Chia Seeds",
      image: "/dev1.png",
      weight: "250g",
      price: 199,
      originalPrice: 249,
      rating: 4.7,
      reviews: 156,
      badge: "SUPERFOOD",
      badgeColor: "bg-blue-500"
    },
    {
      id: 2,
      name: "Happilo Organic Chia Seeds",
      image: "/dev2.png",
      weight: "500g",
      price: 349,
      originalPrice: 449,
      rating: 4.8,
      reviews: 203,
      badge: "ORGANIC",
      badgeColor: "bg-green-500"
    },
    {
      id: 3,
      name: "Happilo Black Chia Seeds",
      image: "/dev1.png",
      weight: "1kg",
      price: 599,
      originalPrice: 749,
      rating: 4.6,
      reviews: 134,
      badge: "OMEGA-3 RICH",
      badgeColor: "bg-purple-500"
    },
    {
      id: 4,
      name: "Happilo White Chia Seeds",
      image: "/dev2.png",
      weight: "200g",
      price: 179,
      originalPrice: null,
      rating: 4.5,
      reviews: 89,
      badge: "NATURAL",
      badgeColor: "bg-gray-500"
    },
    {
      id: 5,
      name: "Happilo Premium Chia Mix",
      image: "/dev1.png",
      weight: "750g",
      price: 499,
      originalPrice: 649,
      rating: 4.9,
      reviews: 267,
      badge: "BEST SELLER",
      badgeColor: "bg-red-500"
    },
    {
      id: 6,
      name: "Happilo Chia Seed Powder",
      image: "/dev2.png",
      weight: "100g",
      price: 149,
      originalPrice: 199,
      rating: 4.4,
      reviews: 78,
      badge: "On Sale",
      badgeColor: "bg-green-500"
    }
  ];

  const sizes = ['100g (1)', '200g (1)', '250g (1)', '500g (1)', '750g (1)', '1kg (1)'];


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
    
    const cartItem = createCartItem(product);

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
            <div className="text-lg text-gray-600">Loading chia seeds...</div>
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
              <h1 className="text-2xl font-bold">Chia Seeds</h1>
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
              {products.map((product) => {
                const badge = getProductBadge(product);
                const rating = getProductRating(product);
                const { size, price, originalPrice } = getProductSizeAndPrice(product);
                
                return (
                  <Link key={product._id} to={`/product/${product._id}`} className="block">
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
                      {/* Product Image */}
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative">
                          {/* Badge */}
                          {badge && (
                            <div className="absolute top-3 left-3">
                              <span className={`bg-${badge.color}-600 text-white px-2 py-1 text-xs font-semibold rounded`}>
                                {badge.text}
                              </span>
                            </div>
                          )}
                          
                          {/* Product Image */}
                          <img 
                            src={getProductImageUrl(product)} 
                            alt={getProductImageAlt(product)}
                            className="w-24 h-24 object-contain"
                            onError={(e) => {
                              e.target.src = '/dev1.png';
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
                        {renderRatingDisplay(product)}

                        {/* Weight */}
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-800">{size}</span>
                        </div>

                        {/* Price */}
                        <div className="mb-3">
                          {price > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-800">₹ {price}</span>
                              {originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₹ {originalPrice}</span>
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
                  </Link>
                );
              })}
            </div>

            {/* No Products Message */}
            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Sorry, chia seed items are not present
                </h3>
                <p className="text-gray-500 mb-4">
                  We couldn't find any chia seed products in our database at the moment.
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
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Premium Quality Chia Seeds Online from Happilo</h2>
            <p className="text-gray-600 leading-relaxed">
              Happilo provides a variety of chia seeds which guarantee a premium-quality healthy snack at affordable prices. These superfood seeds are packed with nutrients that boost your health functions, providing omega-3 fatty acids and supporting overall wellness.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">What are Chia Seeds?</h3>
            <p className="text-gray-600 leading-relaxed">
              Chia seeds are tiny black or white seeds from the Salvia hispanica plant. They are considered a superfood due to their high nutritional content, including omega-3 fatty acids, fiber, protein, and various minerals. Chia seeds have been used for centuries for their health benefits.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Health Benefits of Chia Seeds</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong>Omega-3 Rich:</strong> High levels of omega-3 fatty acids support heart health and brain function.</p>
              <p><strong>High in Fiber:</strong> Excellent source of dietary fiber that promotes digestive health and satiety.</p>
              <p><strong>Protein Powerhouse:</strong> Contains all essential amino acids, making it a complete protein source.</p>
              <p><strong>Antioxidant Properties:</strong> Rich in antioxidants that help fight free radicals and reduce inflammation.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChiaSeeds;

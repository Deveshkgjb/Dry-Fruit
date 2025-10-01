import React, { useState } from 'react';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';

const Peanuts = () => {
  const [sortBy, setSortBy] = useState('Featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 400 });
  const [selectedSizes, setSelectedSizes] = useState([]);

  const products = [
    {
      id: 1,
      name: "Happilo Roasted & Salted Peanuts",
      image: "/dev1.png",
      weight: "200g",
      price: 185,
      originalPrice: 215,
      rating: 4.2,
      reviews: 45,
      badge: "BEST SELLER",
      badgeColor: "bg-red-500"
    },
    {
      id: 2,
      name: "Happilo Raw Peanuts - Groundnuts",
      image: "/dev2.png",
      weight: "500g",
      price: 295,
      originalPrice: 325,
      rating: 4.0,
      reviews: 38,
      badge: "Popular",
      badgeColor: "bg-orange-500"
    },
    {
      id: 3,
      name: "Happilo Organic Peanuts",
      image: "/dev1.png",
      weight: "250g",
      price: 245,
      originalPrice: null,
      rating: 4.3,
      reviews: 22,
      badge: "Organic",
      badgeColor: "bg-green-500"
    },
    {
      id: 4,
      name: "Happilo Masala Peanuts - Spicy",
      image: "/dev2.png",
      weight: "150g",
      price: 165,
      originalPrice: 185,
      rating: 4.4,
      reviews: 31,
      badge: "Spicy",
      badgeColor: "bg-red-600"
    },
    {
      id: 5,
      name: "Happilo Honey Roasted Peanuts",
      image: "/dev1.png",
      weight: "200g",
      price: 225,
      originalPrice: null,
      rating: 4.1,
      reviews: 18,
      badge: "Sweet",
      badgeColor: "bg-yellow-500"
    },
    {
      id: 6,
      name: "Happilo Peanut Butter Crunchy",
      image: "/dev2.png",
      weight: "340g",
      price: 285,
      originalPrice: 315,
      rating: 4.5,
      reviews: 67,
      badge: "Protein Rich",
      badgeColor: "bg-blue-500"
    },
    {
      id: 7,
      name: "Happilo Peanut Butter Smooth",
      image: "/dev1.png",
      weight: "340g",
      price: 285,
      originalPrice: 315,
      rating: 4.6,
      reviews: 78,
      badge: "Creamy",
      badgeColor: "bg-purple-500"
    },
    {
      id: 8,
      name: "Happilo Chocolate Coated Peanuts",
      image: "/dev2.png",
      weight: "100g",
      price: 0,
      originalPrice: null,
      rating: null,
      reviews: 0,
      badge: "SOLD OUT",
      badgeColor: "bg-gray-500"
    }
  ];

  const sizes = ['100g (1)', '150g (1)', '200g (2)', '250g (1)', '340g (2)', '500g (1)', '200g (pack of 3) (1)', '250g (pack of 2) (1)'];

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
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 400 }))}
                  className="w-16 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
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
              <h1 className="text-2xl font-bold">Peanuts</h1>
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
                      className={`w-full py-2 px-4 rounded font-medium text-sm transition-colors ${
                        product.badge === 'SOLD OUT'
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-green-700 hover:bg-green-800 text-white'
                      }`}
                      disabled={product.badge === 'SOLD OUT'}
                    >
                      {product.badge === 'SOLD OUT' ? 'Sold Out' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Products Message */}
            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🥜</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Sorry, peanut items are not present
                </h3>
                <p className="text-gray-500 mb-4">
                  We couldn't find any peanut products in our database at the moment.
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
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Premium Quality Peanuts Online from Happilo</h2>
            <p className="text-gray-600 leading-relaxed">
              Happilo offers the finest selection of peanuts (groundnuts) and peanut products. Our peanuts are carefully sourced from premium farms and available in various forms - raw, roasted, salted, spiced, and as delicious peanut butter. Rich in protein and essential nutrients, peanuts are an affordable and nutritious snack option.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">What are Peanuts?</h3>
            <p className="text-gray-600 leading-relaxed">
              Despite their name, peanuts are actually legumes that grow underground, not tree nuts. Also known as groundnuts, they develop in pods beneath the soil after the flower self-pollinates and sends a shoot (peg) into the ground. Peanuts have a distinctive oval shape with a reddish-brown skin and a mild, nutty flavor.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Health Benefits of Peanuts</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong>High Protein Content:</strong> Excellent source of plant-based protein, making them ideal for vegetarians and vegans.</p>
              <p><strong>Heart Health:</strong> Rich in monounsaturated fats, especially oleic acid, which supports cardiovascular health.</p>
              <p><strong>Weight Management:</strong> High protein and fiber content promote satiety and help control appetite.</p>
              <p><strong>Energy Boost:</strong> Good source of healthy fats and calories that provide sustained energy.</p>
              <p><strong>Niacin Rich:</strong> High in vitamin B3 (niacin) which supports brain function and energy metabolism.</p>
              <p><strong>Folate Source:</strong> Contains folate, essential for DNA synthesis and red blood cell formation.</p>
              <p><strong>Antioxidants:</strong> Contains resveratrol and other antioxidants that help fight inflammation.</p>
              <p><strong>Affordable Nutrition:</strong> One of the most cost-effective sources of protein and essential nutrients.</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Peanut Products</h3>
            <p className="text-gray-600 leading-relaxed">
              Explore our range of peanut products including natural peanut butter (crunchy and smooth), roasted peanuts, masala peanuts, and honey-roasted varieties. Our peanut butters are made from 100% peanuts with no added oils or preservatives, providing you with pure, nutritious spreads perfect for breakfast, snacks, or cooking.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Peanuts;

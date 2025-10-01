import React, { useState } from 'react';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';

const Mango = () => {
  const [sortBy, setSortBy] = useState('Featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 600 });
  const [selectedSizes, setSelectedSizes] = useState([]);

  const products = [
    {
      id: 1,
      name: "Happilo Premium Dried Mango Slices",
      image: "/dev1.png",
      weight: "200g",
      price: 385,
      originalPrice: 435,
      rating: 4.5,
      reviews: 42,
      badge: "BEST SELLER",
      badgeColor: "bg-red-500"
    },
    {
      id: 2,
      name: "Happilo Organic Dried Mango Strips",
      image: "/dev2.png",
      weight: "250g",
      price: 485,
      originalPrice: 545,
      rating: 4.4,
      reviews: 28,
      badge: "Organic",
      badgeColor: "bg-green-500"
    },
    {
      id: 3,
      name: "Happilo No Sugar Added Dried Mango",
      image: "/dev1.png",
      weight: "150g",
      price: 325,
      originalPrice: null,
      rating: 4.3,
      reviews: 22,
      badge: "No Sugar",
      badgeColor: "bg-blue-500"
    },
    {
      id: 4,
      name: "Happilo Alphonso Dried Mango - Premium",
      image: "/dev2.png",
      weight: "200g",
      price: 565,
      originalPrice: 625,
      rating: 4.6,
      reviews: 19,
      badge: "Alphonso",
      badgeColor: "bg-yellow-500"
    },
    {
      id: 5,
      name: "Happilo Soft Dried Mango Chunks",
      image: "/dev1.png",
      weight: "500g",
      price: 795,
      originalPrice: null,
      rating: 4.2,
      reviews: 15,
      badge: "Bulk Pack",
      badgeColor: "bg-purple-500"
    },
    {
      id: 6,
      name: "Happilo Mango Fruit Leather - Natural",
      image: "/dev2.png",
      weight: "100g",
      price: 245,
      originalPrice: 285,
      rating: 4.4,
      reviews: 12,
      badge: "Fruit Leather",
      badgeColor: "bg-orange-500"
    },
    {
      id: 7,
      name: "Happilo Freeze Dried Mango Chips",
      image: "/dev1.png",
      weight: "80g",
      price: 0,
      originalPrice: null,
      rating: null,
      reviews: 0,
      badge: "SOLD OUT",
      badgeColor: "bg-gray-500"
    },
    {
      id: 8,
      name: "Happilo Mango Mix Trail Pack",
      image: "/dev2.png",
      weight: "300g",
      price: 0,
      originalPrice: null,
      rating: null,
      reviews: 0,
      badge: "SOLD OUT",
      badgeColor: "bg-gray-500"
    }
  ];

  const sizes = ['80g (1)', '100g (1)', '150g (1)', '200g (2)', '250g (1)', '300g (1)', '500g (1)', '200g (pack of 2) (1)'];

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
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 600 }))}
                  className="w-16 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
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
              <h1 className="text-2xl font-bold">Dried Mango</h1>
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
          </div>
        </div>

        {/* Product Information Section */}
        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Premium Quality Dried Mango Online from Happilo</h2>
            <p className="text-gray-600 leading-relaxed">
              Savor the tropical sweetness of Happilo's premium dried mango. Our dried mango is made from the finest quality mangoes, including the legendary Alphonso variety, carefully processed to preserve their natural flavor, vibrant color, and nutritional benefits. Rich in vitamins, minerals, and natural sweetness, dried mango is a delicious and healthy snack that brings the taste of summer year-round.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">What is Dried Mango?</h3>
            <p className="text-gray-600 leading-relaxed">
              Dried mango is fresh mango fruit that has been dehydrated to remove water content while concentrating its natural sweetness and preserving essential nutrients. The process intensifies the tropical flavor and creates a chewy, satisfying texture. Our dried mango retains the golden color and distinctive taste that makes mango the "king of fruits."
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Varieties of Dried Mango</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong>Alphonso Dried Mango:</strong> Made from the premium Alphonso variety, known for its exceptional sweetness and rich flavor.</p>
              <p><strong>Organic Dried Mango:</strong> Grown without pesticides or chemicals, naturally processed and preserved.</p>
              <p><strong>No Sugar Added:</strong> Natural processing without additional sweeteners, preserving the fruit's natural taste.</p>
              <p><strong>Soft Dried Mango:</strong> Retains more moisture for a softer, more tender texture.</p>
              <p><strong>Mango Strips/Slices:</strong> Cut in different shapes for varied snacking experiences.</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Health Benefits of Dried Mango</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong>Vitamin A Powerhouse:</strong> Excellent source of beta-carotene, essential for eye health and vision.</p>
              <p><strong>Immune Support:</strong> Rich in vitamin C that boosts immune system function and fights infections.</p>
              <p><strong>Digestive Health:</strong> Contains fiber and enzymes that support healthy digestion and gut function.</p>
              <p><strong>Antioxidant Rich:</strong> High levels of antioxidants protect against free radical damage and aging.</p>
              <p><strong>Energy Boost:</strong> Natural sugars provide sustained energy for active lifestyles.</p>
              <p><strong>Skin Health:</strong> Vitamins A and C promote healthy, glowing skin and collagen production.</p>
              <p><strong>Heart Health:</strong> Potassium supports cardiovascular function and blood pressure regulation.</p>
              <p><strong>Bone Health:</strong> Contains vitamin K and magnesium that support bone strength and density.</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">The Alphonso Advantage</h3>
            <p className="text-gray-600 leading-relaxed">
              Our premium Alphonso dried mango is made from the world-renowned Alphonso variety, primarily grown in Maharashtra, India. Known as the "King of Mangoes," Alphonso mangoes are prized for their exceptional sweetness, rich flavor, and smooth texture. When dried, they retain all these qualities while offering the convenience of a shelf-stable, portable snack.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ways to Enjoy Dried Mango</h3>
            <div className="space-y-2 text-gray-600 leading-relaxed">
              <p>• Perfect as a healthy snack on its own</p>
              <p>• Add to trail mix with nuts and other dried fruits</p>
              <p>• Mix into yogurt, oatmeal, and breakfast cereals</p>
              <p>• Use in baking - muffins, cookies, and tropical cakes</p>
              <p>• Blend into smoothies for tropical flavor and sweetness</p>
              <p>• Chop and add to salads for a sweet and colorful element</p>
              <p>• Include in homemade granola and energy bars</p>
              <p>• Pair with cheese and nuts for gourmet snack platters</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Mango;

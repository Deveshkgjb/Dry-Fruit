import React, { useState } from 'react';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';

const Prunes = () => {
  const [sortBy, setSortBy] = useState('Featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 700 });
  const [selectedSizes, setSelectedSizes] = useState([]);

  const products = [
    {
      id: 1,
      name: "Happilo Premium Californian Prunes - Pitted",
      image: "/dev1.png",
      weight: "250g",
      price: 425,
      originalPrice: 485,
      rating: 4.3,
      reviews: 26,
      badge: "BEST SELLER",
      badgeColor: "bg-red-500"
    },
    {
      id: 2,
      name: "Happilo Organic Dried Prunes",
      image: "/dev2.png",
      weight: "200g",
      price: 385,
      originalPrice: 435,
      rating: 4.4,
      reviews: 19,
      badge: "Organic",
      badgeColor: "bg-green-500"
    },
    {
      id: 3,
      name: "Happilo Jumbo Prunes - Extra Large",
      image: "/dev1.png",
      weight: "500g",
      price: 795,
      originalPrice: null,
      rating: 4.5,
      reviews: 15,
      badge: "Jumbo Size",
      badgeColor: "bg-yellow-500"
    },
    {
      id: 4,
      name: "Happilo Soft & Juicy Prunes",
      image: "/dev2.png",
      weight: "250g",
      price: 465,
      originalPrice: 515,
      rating: 4.2,
      reviews: 12,
      badge: "Soft & Sweet",
      badgeColor: "bg-orange-500"
    },
    {
      id: 5,
      name: "Happilo Prune Juice Concentrate",
      image: "/dev1.png",
      weight: "500ml",
      price: 325,
      originalPrice: null,
      rating: 4.1,
      reviews: 8,
      badge: "Liquid Form",
      badgeColor: "bg-blue-500"
    },
    {
      id: 6,
      name: "Happilo Pitted Prunes for Digestive Health",
      image: "/dev2.png",
      weight: "200g",
      price: 365,
      originalPrice: 405,
      rating: 4.6,
      reviews: 22,
      badge: "Health Plus",
      badgeColor: "bg-purple-500"
    },
    {
      id: 7,
      name: "Happilo Stuffed Prunes with Walnuts",
      image: "/dev1.png",
      weight: "200g",
      price: 0,
      originalPrice: null,
      rating: null,
      reviews: 0,
      badge: "SOLD OUT",
      badgeColor: "bg-gray-500"
    },
    {
      id: 8,
      name: "Happilo Prunes Gift Pack",
      image: "/dev2.png",
      weight: "1kg",
      price: 0,
      originalPrice: null,
      rating: null,
      reviews: 0,
      badge: "SOLD OUT",
      badgeColor: "bg-gray-500"
    }
  ];

  const sizes = ['200g (3)', '250g (2)', '500g (1)', '500ml (1)', '1kg (1)', '200g (pack of 2) (1)', '250g (pack of 2) (1)'];

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
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 700 }))}
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
              <h1 className="text-2xl font-bold">Prunes</h1>
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
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Premium Quality Prunes Online from Happilo</h2>
            <p className="text-gray-600 leading-relaxed">
              Discover the natural sweetness and incredible health benefits of Happilo's premium prunes. Our prunes are carefully selected from the finest plum orchards in California, known for producing the world's best quality dried plums. Rich in fiber, antioxidants, and essential nutrients, prunes are nature's perfect digestive health solution.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">What are Prunes?</h3>
            <p className="text-gray-600 leading-relaxed">
              Prunes are dried plums, specifically from the European plum tree (Prunus domestica). They have a distinctive dark purple-black color, wrinkled appearance, and intensely sweet flavor with subtle tartness. The drying process concentrates the nutrients and natural sugars, making prunes both delicious and incredibly nutritious.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Health Benefits of Prunes</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong>Digestive Health:</strong> Exceptional source of dietary fiber that promotes healthy digestion and prevents constipation.</p>
              <p><strong>Bone Health:</strong> Rich in vitamin K, potassium, and boron that support bone density and prevent osteoporosis.</p>
              <p><strong>Heart Health:</strong> Fiber and potassium help reduce cholesterol levels and support cardiovascular function.</p>
              <p><strong>Antioxidant Power:</strong> High in phenolic compounds that protect against oxidative stress and inflammation.</p>
              <p><strong>Blood Sugar Control:</strong> Low glycemic index helps maintain stable blood sugar levels.</p>
              <p><strong>Weight Management:</strong> High fiber content promotes satiety and helps control appetite.</p>
              <p><strong>Eye Health:</strong> Contains vitamin A and antioxidants that support vision and eye health.</p>
              <p><strong>Iron Rich:</strong> Helps prevent anemia and supports healthy blood circulation.</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Digestive Health Benefits</h3>
            <p className="text-gray-600 leading-relaxed">
              Prunes are particularly renowned for their digestive health benefits. They contain both soluble and insoluble fiber, along with sorbitol, a natural sugar alcohol that acts as a gentle laxative. Regular consumption of 3-4 prunes daily can help maintain regular bowel movements and support overall digestive wellness.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">How to Enjoy Prunes</h3>
            <div className="space-y-2 text-gray-600 leading-relaxed">
              <p>• Eat 3-4 prunes daily for digestive health benefits</p>
              <p>• Soak in warm water for 10-15 minutes for softer texture</p>
              <p>• Add to breakfast cereals, oatmeal, and yogurt</p>
              <p>• Use in baking - muffins, breads, and energy bars</p>
              <p>• Blend into smoothies for natural sweetness and fiber</p>
              <p>• Chop and add to salads for sweet and chewy elements</p>
              <p>• Make prune juice or concentrate for liquid consumption</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Prunes;

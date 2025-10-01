import React, { useState } from 'react';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';

const Apricots = () => {
  const [sortBy, setSortBy] = useState('Featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 600 });
  const [selectedSizes, setSelectedSizes] = useState([]);

  const products = [
    {
      id: 1,
      name: "Happilo Premium Turkish Dried Apricots",
      image: "/dev1.png",
      weight: "200g",
      price: 385,
      originalPrice: 435,
      rating: 4.4,
      reviews: 31,
      badge: "BEST SELLER",
      badgeColor: "bg-red-500"
    },
    {
      id: 2,
      name: "Happilo Organic Dried Apricots",
      image: "/dev2.png",
      weight: "250g",
      price: 465,
      originalPrice: 515,
      rating: 4.5,
      reviews: 22,
      badge: "Organic",
      badgeColor: "bg-green-500"
    },
    {
      id: 3,
      name: "Happilo Soft Dried Apricots - Unsulfured",
      image: "/dev1.png",
      weight: "500g",
      price: 795,
      originalPrice: null,
      rating: 4.3,
      reviews: 18,
      badge: "Natural",
      badgeColor: "bg-blue-500"
    },
    {
      id: 4,
      name: "Happilo Jumbo Dried Apricots",
      image: "/dev2.png",
      weight: "200g",
      price: 425,
      originalPrice: 475,
      rating: 4.6,
      reviews: 14,
      badge: "Jumbo Size",
      badgeColor: "bg-yellow-500"
    },
    {
      id: 5,
      name: "Happilo Hunza Dried Apricots",
      image: "/dev1.png",
      weight: "250g",
      price: 545,
      originalPrice: null,
      rating: 4.2,
      reviews: 10,
      badge: "Premium",
      badgeColor: "bg-purple-500"
    },
    {
      id: 6,
      name: "Happilo Dried Apricot Kernels",
      image: "/dev2.png",
      weight: "100g",
      price: 285,
      originalPrice: 325,
      rating: 4.1,
      reviews: 8,
      badge: "Superfood",
      badgeColor: "bg-orange-500"
    },
    {
      id: 7,
      name: "Happilo Stuffed Apricots with Almonds",
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
      name: "Happilo Apricot Gift Hamper",
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

  const sizes = ['100g (1)', '200g (3)', '250g (2)', '500g (1)', '1kg (1)', '200g (pack of 2) (1)', '250g (pack of 2) (1)'];

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
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
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
              <h1 className="text-2xl font-bold">Dried Apricots</h1>
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
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Premium Quality Dried Apricots Online from Happilo</h2>
            <p className="text-gray-600 leading-relaxed">
              Experience the golden sweetness of Happilo's premium dried apricots. Sourced from the finest apricot orchards in Turkey and Central Asia, our dried apricots are naturally sweet, soft, and bursting with flavor. Rich in vitamins, minerals, and antioxidants, they make for a perfect healthy snack.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">What are Dried Apricots?</h3>
            <p className="text-gray-600 leading-relaxed">
              Dried apricots are fresh apricots that have been dehydrated to remove water content while preserving their nutritional value and intensifying their natural sweetness. They have a distinctive orange color, chewy texture, and sweet-tart flavor. Our apricots are available both sulfured (bright orange) and unsulfured (darker, more natural) varieties.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Types of Dried Apricots</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong>Turkish Apricots:</strong> Known for their exceptional sweetness and soft texture, considered the gold standard.</p>
              <p><strong>Hunza Apricots:</strong> Wild variety from Pakistan, smaller but intensely flavorful with higher nutrient density.</p>
              <p><strong>Organic Apricots:</strong> Grown without pesticides or chemicals, naturally processed and preserved.</p>
              <p><strong>Unsulfured Apricots:</strong> Darker in color, more natural processing without sulfur dioxide treatment.</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Health Benefits of Dried Apricots</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p><strong>Eye Health:</strong> Rich in beta-carotene and vitamin A, essential for maintaining healthy vision.</p>
              <p><strong>Skin Health:</strong> Antioxidants and vitamins promote healthy, glowing skin and prevent premature aging.</p>
              <p><strong>Digestive Health:</strong> High fiber content supports healthy digestion and prevents constipation.</p>
              <p><strong>Iron Rich:</strong> Helps prevent anemia and supports healthy blood circulation.</p>
              <p><strong>Heart Health:</strong> Potassium helps regulate blood pressure and supports cardiovascular function.</p>
              <p><strong>Bone Health:</strong> Contains calcium and phosphorus essential for maintaining strong bones.</p>
              <p><strong>Immune Support:</strong> High vitamin C content boosts immune system function.</p>
              <p><strong>Energy Boost:</strong> Natural sugars provide sustained energy for active lifestyles.</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Culinary Uses</h3>
            <div className="space-y-2 text-gray-600 leading-relaxed">
              <p>• Perfect for snacking on their own or mixed with nuts</p>
              <p>• Add to breakfast cereals, oatmeal, and yogurt for natural sweetness</p>
              <p>• Use in baking - cookies, cakes, and energy bars</p>
              <p>• Excellent in savory dishes like rice pilafs and meat stews</p>
              <p>• Chop and add to salads for a sweet and chewy element</p>
              <p>• Make homemade trail mix with nuts and seeds</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Apricots;

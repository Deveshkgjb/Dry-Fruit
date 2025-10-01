import React, { useState, useEffect } from 'react';
import { useNotification } from '../../Common/NotificationProvider.jsx';
import apiService from '../../../services/api.js';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';
import { renderStars, renderRatingDisplay } from '../../../utils/productUtils.jsx';

const { productsAPI } = apiService;

const RoastedPartyMix = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({ limit: 100 });
      const partyMixProducts = response.products.filter(product => 
        product.tags?.includes('party mix') || 
        product.tags?.includes('roasted party mix') ||
        product.name?.toLowerCase().includes('party mix') ||
        product.name?.toLowerCase().includes('roasted party')
      );
      setProducts(partyMixProducts);
    } catch (error) {
      console.error('Error fetching roasted party mix products:', error);
      showError('Failed to load roasted party mix products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Roasted Party Mix</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Perfect blend of roasted nuts and snacks for your parties and gatherings
          </p>
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Sorry, roasted party mix items are not present
            </h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any roasted party mix products in our database at the moment.
            </p>
            <p className="text-sm text-gray-400">
              Please check back later or explore other categories.
            </p>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.rating && product.rating.count > 0 && (
                    <div className="flex items-center mb-2">
                      {renderStars(product.rating.average)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({product.rating.count})
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">
                      ₹{product.price}
                    </span>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RoastedPartyMix;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaUser, 
  FaShoppingCart, 
  FaSearch, 
  FaTruck,
  FaHeart,
  FaBell,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaShoppingBag
} from "react-icons/fa";
import { 
  HiOutlineUser, 
  HiOutlineShoppingCart, 
  HiOutlineSearch,
  HiOutlineTruck,
  HiOutlineHeart,
  HiOutlineBell
} from "react-icons/hi";
import { 
  IoPersonOutline, 
  IoCartOutline, 
  IoSearchOutline,
  IoCarOutline,
  IoHeartOutline,
  IoNotificationsOutline
} from "react-icons/io5";
import { cartAPI, categoriesAPI, productsAPI } from '../../services/api.js';
import { pageAPI } from '../../services/pageAPI.js';
import { getImageUrl } from '../../utils/urls.js';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState({
    nuts: {
      title: "Nuts",
      items: ["Almonds", "Cashews", "Pistachios", "Walnuts", "Brazil Nuts", "Peanuts"]
    },
    driedFruits: {
      title: "Dried Fruits",
      items: ["Raisins", "Anjeer", "Apricots", "Prunes", "Kiwi", "Mango"]
    },
    berries: {
      title: "Berries",
      items: ["Blueberries", "Cranberries", "Strawberries"]
    },
    dates: {
      title: "Dates",
      items: ["Omani", "Queen Kalmi", "Arabian", "Ajwa"]
    },
    seeds: {
      title: "Seeds",
      items: ["Chia", "Flax", "Pumpkin", "Sunflower"]
    },
    mixes: {
      title: "Mixes",
      items: ["Fitness Mix", "Roasted Party Mix", "Nuts & Berries Mix", "Berries Mix", "Champion Mix", "Nutty Trail Mix", "Seeds Mix"]
    },
    newLaunches: {
      title: "New Launches",
      items: ["Peanut Butter", "Party Snacks", "GameFul Corn Nuts"]
    }
  });
  
  // Debug: Log categories when they change
  useEffect(() => {
    if (categories) {
      console.log('📋 Navbar categories updated:', categories);
    }
  }, [categories]);
  const [logo, setLogo] = useState({
    image: '/logo.avif',
    alt: 'Happilo Logo'
  });

  useEffect(() => {
    // Load initial cart count
    updateCartCount();
    
    // Load categories from page management
    loadCategories();
    
    // Listen for cart changes
    const handleStorageChange = () => {
      updateCartCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for cart updates within the same tab
    window.addEventListener('cartUpdated', handleStorageChange);
    
    // Listen for category updates
    const handleCategoryUpdate = () => {
      loadCategories();
    };
    
    // Listen for page content updates (like logo changes)
    const handlePageUpdate = () => {
      // Add a small delay to ensure backend has time to save
      setTimeout(() => {
        loadCategories();
      }, 1000);
    };
    
    window.addEventListener('categoriesUpdated', handleCategoryUpdate);
    window.addEventListener('pageContentUpdated', handlePageUpdate);
    
    // Check for logo updates every 10 seconds (more frequent)
    const logoUpdateInterval = setInterval(() => {
      loadCategories();
    }, 10000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('categoriesUpdated', handleCategoryUpdate);
      window.removeEventListener('pageContentUpdated', handlePageUpdate);
      clearInterval(logoUpdateInterval);
    };
  }, []);

  const updateCartCount = () => {
    try {
      const count = cartAPI.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error('Error updating cart count:', error);
      setCartCount(0);
    }
  };

  const loadCategories = async () => {
    try {
      const pageContent = await pageAPI.getAllPages();
      console.log('📄 Page content loaded:', pageContent);
      
      // Load logo data
      if (pageContent?.navbar?.logo) {
        setLogo(pageContent.navbar.logo);
      }
      
      // Categories are now static - no need to load from database
      console.log('📋 Navbar - Using static categories structure');
      
    } catch (error) {
      console.error('Error loading page content:', error);
      // Categories remain static even on error
    }
  };

  return (
    <nav className="shadow-sm bg-white border-b">
      <div className="flex items-center justify-between px-1 sm:px-4 md:px-8 py-2 md:py-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 h-full w-15">
          <Link to="/" className="flex items-center">
            <img 
              key={logo.image} // Force re-render when logo changes
              src={getImageUrl(logo.image) || '/logo.avif'} 
              alt={logo.alt || 'Happilo Logo'} 
              className='h-4 sm:h-6 md:h-10 w-auto object-contain max-w-[40px] sm:max-w-[70px] md:max-w-none'
              onError={(e) => {
                e.target.src = '/logo.avif';
              }}
              onClick={() => {
                // Manual refresh for testing - remove this later
                loadCategories();
              }}
              style={{ cursor: 'pointer' }}
              title="Click to refresh logo"
            />
          </Link>
        </div>

        {/* Mobile Navigation Menu - Visible on mobile */}
        <div className="flex lg:hidden items-center space-x-1 text-[11px] sm:text-xs flex-1 justify-center mx-1 h-full">
          <div 
            className="relative group flex items-center h-full"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <a href="#" className="flex items-center text-gray-700 hover:text-green-600 font-medium px-0.5 whitespace-nowrap h-full">
              Categories
              <svg className="ml-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
          <Link to="/combos" className="flex items-center text-gray-700 hover:text-green-600 font-medium px-0.5 whitespace-nowrap h-full">Combos</Link>
          <Link to="/contact-us" className="flex items-center text-gray-700 hover:text-green-600 font-medium px-0.5 whitespace-nowrap h-full">Contact</Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          <div 
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <a href="#" className="flex items-center text-gray-700 hover:text-green-600 font-medium">
              Shop by Categories
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-[900px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-6">
                  {categories ? (
                    <div className="grid grid-cols-4 gap-8">
                      {Object.entries(categories).map(([parentKey, parentCategory]) => (
                        <div key={parentKey}>
                          <h3 className="text-red-600 font-bold text-lg mb-4 block">
                            {parentCategory.title}
                          </h3>
                          <ul className="space-y-1">
                            {parentCategory.items.map((item, index) => (
                              <li key={index}>
                                <Link 
                                  to={`/${item.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/\(/g, '').replace(/\)/g, '')}`}
                                  className="text-gray-700 hover:text-green-600 block py-1 transition-colors duration-200 text-sm"
                                  onClick={() => {
                                    console.log(`🔗 Navigating to: ${item}`);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {parentKey !== 'newLaunches' && (
                            <hr className="mt-4 mb-4 border-gray-200" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading categories...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <Link to="/combos" className="text-gray-700 hover:text-green-600 font-medium">Combos</Link>
          <Link to="/contact-us" className="text-gray-700 hover:text-green-600 font-medium">Contact Us</Link>
        </div>

        {/* Search Bar and Icons */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0 h-full">
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search premium dry fruits..."
              className="bg-transparent px-2 sm:px-4 py-2 outline-none text-sm w-32 sm:w-48 lg:w-64 focus:bg-white focus:shadow-sm transition-all duration-300"
            />
            <button className="px-3 text-gray-600 hover:text-green-600 transition-colors duration-300">
              <FaSearch className="w-4 h-4" />
            </button>
          </div>

          {/* Premium Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-5">
            {/* User Profile Icon */}
            <div className="relative group">
              <div className="p-0.5 sm:p-1.5 md:p-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                <FaUserCircle className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
              </div>
              <span className="hidden md:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Profile
              </span>
            </div>
            
            {/* Order Tracking Link */}
            <Link to="/track-order" className="relative group" title="Track Your Order">
              <div className="p-0.5 sm:p-1.5 md:p-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-sm hover:shadow-md">
                <FaTruck className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
              </div>
              <span className="hidden md:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Track Order
              </span>
            </Link>
            
            {/* Wishlist Icon */}
            <div className="relative group">
              <div className="p-0.5 sm:p-1.5 md:p-2 rounded-full bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                <FaHeart className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pink-600 group-hover:text-pink-700 transition-colors duration-300" />
              </div>
              <span className="hidden md:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Wishlist
              </span>
            </div>
            
            {/* Cart with premium badge */}
            <Link to="/cart" className="relative group">
              <div className="p-0.5 sm:p-1.5 md:p-2 rounded-full bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 shadow-sm hover:shadow-md">
                <FaShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
              </div>
              {cartCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[9px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="font-bold">{cartCount}</span>
                </div>
              )}
              <span className="hidden md:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Cart ({cartCount})
              </span>
            </Link>
          </div>
        </div>
      </div>
      
    </nav>
  );
}

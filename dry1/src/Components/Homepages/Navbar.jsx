import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaUser, 
  FaSearch, 
  FaTruck,
  FaHeart,
  FaBell,
  FaBars,
  FaTimes,
  FaUserCircle
} from "react-icons/fa";
import { 
  HiOutlineUser, 
  HiOutlineSearch,
  HiOutlineTruck,
  HiOutlineHeart,
  HiOutlineBell
} from "react-icons/hi";
import { 
  IoPersonOutline, 
  IoSearchOutline,
  IoCarOutline,
  IoHeartOutline,
  IoNotificationsOutline
} from "react-icons/io5";
import { categoriesAPI, productsAPI } from '../../services/api.js';
import { pageAPI } from '../../services/pageAPI.js';
import { getImageUrl } from '../../utils/urls.js';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState({});
  
  // Debug: Log categories when they change
  useEffect(() => {
    if (categories) {
      console.log('📋 Navbar categories updated:', categories);
    }
  }, [categories]);
  const [logo, setLogo] = useState({
    image: '/Logo.png',
    alt: 'TriThread Logo'
  });
  const [logoKey, setLogoKey] = useState(0); // For forcing logo refresh

  useEffect(() => {
    // Load categories from page management only once
    loadCategories();
    
    // Listen for page content updates (like logo changes) - but less frequently
    const handlePageUpdate = () => {
      console.log('🔄 Navbar - Page content update detected, refreshing logo...');
      // Add a small delay to ensure backend has time to save
      setTimeout(() => {
        loadCategories(); // This will also reload the logo
      }, 2000); // Increased delay to reduce requests
    };
    
    window.addEventListener('pageContentUpdated', handlePageUpdate);
    
    // Removed the 10-second polling interval to reduce API calls
    // Logo will only update when pageContentUpdated event is fired
    
    return () => {
      window.removeEventListener('pageContentUpdated', handlePageUpdate);
    };
  }, []);


  const loadCategories = async () => {
    try {
      const pageContent = await pageAPI.getAllPages();
      console.log('📄 Page content loaded:', pageContent);
      
      // Load logo data only if it has actually changed
      if (pageContent?.navbar?.logo && pageContent.navbar.logo.image !== logo.image) {
        setLogo(pageContent.navbar.logo);
        setLogoKey(prev => prev + 1); // Force logo refresh only when changed
        console.log('🔄 Logo updated in navbar:', pageContent.navbar.logo);
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
              key={`logo-${logoKey}`} // Force re-render when logo changes
              src="/Logo.png" 
              alt="TriThread Logo" 
              className='h-8 sm:h-10 md:h-12 w-auto object-contain'
              onError={(e) => {
                console.error('Logo failed to load:', e.target.src);
                e.target.src = '/Logo.png';
              }}
              onLoad={() => {
                console.log('Logo loaded successfully');
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
        <div className="flex lg:hidden items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-xs flex-1 justify-center mx-1 h-full">
          <Link to="/all-products" className="flex text-xl font-bold items-center text-black hover:text-blue-900 font-black px-1 sm:px-2 py-1 whitespace-nowrap h-full rounded-md transition-all duration-200 hover:bg-blue-100" style={{color: '#000000', fontWeight: '1200', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', letterSpacing: '0.5px'}}>Products</Link>
          <Link to="/combos" className="flex text-xl font-bold items-center text-black hover:text-green-900 font-black px-1 sm:px-2 py-1 whitespace-nowrap h-full rounded-md transition-all duration-200 hover:bg-green-100" style={{color: '#000000', fontWeight: '1200', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', letterSpacing: '0.5px'}}>Combos</Link>
          <Link to="/contact-us" className="flex text-xl font-bold items-center text-black hover:text-purple-900 font-black px-1 sm:px-2 py-1 whitespace-nowrap h-full rounded-md transition-all duration-200 hover:bg-purple-100" style={{color: '#000000', fontWeight: '1200', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', letterSpacing: '0.5px'}}>Contact</Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          <Link to="/all-products" className="flex items-center text-black hover:text-blue-900 font-black text-3xl px-3 py-2 rounded-md transition-all duration-200 hover:bg-blue-100" style={{color: '#000000', fontWeight: '1200', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', letterSpacing: '0.5px'}}>
            All Products
          </Link>
          <Link to="/combos" className="text-black hover:text-green-900 font-black text-3xl px-3 py-2 rounded-md transition-all duration-200 hover:bg-green-100" style={{color: '#000000', fontWeight: '1200', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', letterSpacing: '0.5px'}}>Combos</Link>
          <Link to="/contact-us" className="text-black hover:text-purple-900 font-black text-3xl px-3 py-2 rounded-md transition-all duration-200 hover:bg-purple-100" style={{color: '#000000', fontWeight: '1200', textShadow: '2px 2px 4px rgba(0,0,0,0.4)', letterSpacing: '0.5px'}}>Contact Us</Link>
        </div>

        {/* Search Bar and Icons */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0 h-full">
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search trendy clothing..."
              className="bg-transparent px-2 sm:px-4 py-2 outline-none text-sm w-32 sm:w-48 lg:w-64 focus:bg-white focus:shadow-sm transition-all duration-300"
            />
            <button className="px-3 text-gray-600 hover:text-green-600 transition-colors duration-300">
              <FaSearch className="w-4 h-4" />
            </button>
          </div>

          {/* Premium Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-5">
            {/* Order Tracking Link */}
            <Link to="/track-order" className="relative group" title="Track Your Order">
              <div className="p-0.5 sm:p-1.5 md:p-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-sm hover:shadow-md">
                <FaTruck className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
              </div>
              <span className="hidden md:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Track Order
              </span>
            </Link>
            
            
          </div>
        </div>
      </div>
      
    </nav>
  );
}

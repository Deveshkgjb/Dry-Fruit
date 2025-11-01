import React from 'react';

const Footer = () => {

  return (
    <footer className="bg-green-600 text-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          
          {/* Terms & Policies Section - First */}
          <div className="lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Terms & Policies</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/terms-of-service" className="text-white hover:text-gray-200 transition-colors duration-200 !text-white text-sm sm:text-base" style={{color: 'white'}}>
                  Terms of Services
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-white hover:text-gray-200 transition-colors duration-200 !text-white text-sm sm:text-base" style={{color: 'white'}}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/shipping-policy" className="text-white hover:text-gray-200 transition-colors duration-200 !text-white text-sm sm:text-base" style={{color: 'white'}}>
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/return-refund-policy" className="text-white hover:text-gray-200 transition-colors duration-200 !text-white text-sm sm:text-base" style={{color: 'white'}}>
                  Return & Refund policy
                </a>
              </li>
            </ul>
          </div>

          {/* Help Section - Second */}
          <div className="lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Help</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-200 !text-white text-sm sm:text-base" style={{color: 'white'}}>
                  My Account
                </a>
              </li>
              <li>
                <a href="/track-order" className="text-white hover:text-gray-200 transition-colors duration-200 !text-white text-sm sm:text-base" style={{color: 'white'}}>
                  Track your Order
                </a>
              </li>
              <li>
                <a href="/contact-us" className="text-white hover:text-gray-200 transition-colors duration-200 !text-white text-sm sm:text-base" style={{color: 'white'}}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* About Section - Third */}
          <div className="lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">About</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/about" className="text-white hover:text-gray-200 transition-colors duration-200 !text-white text-sm sm:text-base" style={{color: 'white'}}>
                  About TriThread
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-200 !text-white text-sm sm:text-base" style={{color: 'white'}}>
                  Why We Exist
                </a>
              </li>
            </ul>
          </div>
        </div>


        {/* Payment Methods Section */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-black mb-4 sm:mb-6 text-sm sm:text-base">We Accept</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {/* PhonePe */}
            <div className="bg-white rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
              <img 
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-icon.png" 
                alt="PhonePe" 
                className="w-6 h-6 sm:w-8 sm:h-8"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                <span className="text-white text-xs sm:text-sm font-bold">P</span>
              </div>
              <span className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg">PhonePe</span>
            </div>
            
            {/* Google Pay */}
            <div className="bg-white rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo2H45E7LPl93gI0RFPGkZ9YPW1YzCSTR4jQ&s" 
                alt="Google Pay" 
                className="w-6 h-6 sm:w-8 sm:h-8"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                <span className="text-white text-xs sm:text-sm font-bold">G</span>
              </div>
              <span className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg">Google Pay</span>
            </div>
            
            {/* Amazon Pay */}
            <div className="bg-white rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
              <img 
                src="https://www.iconpacks.net/icons/free-icons-6/free-amazon-pay-circle-round-logo-icon-19775-thumb.png" 
                alt="Amazon Pay" 
                className="w-6 h-6 sm:w-8 sm:h-8"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded flex items-center justify-center" style={{display: 'none'}}>
                <span className="text-white text-xs sm:text-sm font-bold">A</span>
              </div>
              <span className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg">Amazon Pay</span>
            </div>
            
            {/* Paytm */}
            <div className="bg-white rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtzgoGnOSSiaow6ecaZ7aUUVU6BcIIAW4p3Q&s" 
                alt="Paytm" 
                className="w-6 h-6 sm:w-8 sm:h-8"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center" style={{display: 'none'}}>
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg">Paytm</span>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-black mb-4 sm:mb-6 text-sm sm:text-base">Follow Us!</p>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Facebook */}
            <a href="#" className="bg-white text-blue-600 p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            {/* Twitter */}
            <a href="#" className="bg-white text-blue-400 p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            
            {/* Instagram */}
            <a href="#" className="bg-white text-pink-600 p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348z"/>
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a href="#" className="bg-white text-blue-700 p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            {/* YouTube */}
            <a href="#" className="bg-white text-red-600 p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-green-500 text-center text-black">
          <p className="text-xs sm:text-sm">&copy; 2024 Mufindryfruit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

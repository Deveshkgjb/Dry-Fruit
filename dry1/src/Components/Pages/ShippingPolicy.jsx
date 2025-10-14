import React from 'react';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shipping Policy
            </h1>
            <div className="text-lg text-gray-600">
              <p><strong>Muffin DryFruits</strong></p>
              <p>Effective Date: 6 August 2025</p>
              <p>Last Updated: 2024</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            
            {/* Section 1: Free Shipping */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-100 text-green-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                Free Shipping
              </h2>
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>No minimum order value for free shipping</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Valid for all locations across India</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Standard delivery time applies</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2: Delivery Timeframes */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                Delivery Timeframes
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-2">Metro Cities</h3>
                    <p className="text-gray-700">2-3 business days</p>
                    <p className="text-sm text-gray-600">Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-2">Other Cities</h3>
                    <p className="text-gray-700">3-5 business days</p>
                    <p className="text-sm text-gray-600">All other cities and towns</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Order Processing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                Order Processing
              </h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <ol className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-yellow-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                    <div>
                      <p><strong>Order Confirmation:</strong> You'll receive an email confirmation within 1 hour</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                    <div>
                      <p><strong>Processing:</strong> Orders are processed within 24 hours (Monday-Friday)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                    <div>
                      <p><strong>Shipping:</strong> You'll receive tracking information once shipped</p>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            {/* Section 4: Delivery Areas */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                Delivery Areas
              </h2>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <p className="text-gray-700 mb-3">
                  We deliver to all major cities and towns across India. Some remote areas may have extended delivery times.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">North India</h4>
                    <p className="text-gray-600">Delhi, Punjab, Haryana, Himachal Pradesh, Jammu & Kashmir, Uttarakhand, Uttar Pradesh, Rajasthan</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">South India</h4>
                    <p className="text-gray-600">Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana, Goa, Puducherry</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">East & West</h4>
                    <p className="text-gray-600">Maharashtra, Gujarat, West Bengal, Odisha, Bihar, Jharkhand, Chhattisgarh, Madhya Pradesh</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Delivery Issues */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-red-100 text-red-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                Delivery Issues
              </h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>If you're not available, the delivery partner will attempt delivery 2 more times</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>After 3 failed attempts, the package will be returned to us</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Contact us immediately if you don't receive your order within the expected timeframe</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mt-12 p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help with Shipping?</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:Rajsinghindia2025@gmail.com" className="text-blue-600 hover:text-blue-800">Rajsinghindia2025@gmail.com</a></p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Note:</strong> This shipping policy is subject to change. Please check back periodically for updates. 
                Last updated: 2024
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ShippingPolicy;

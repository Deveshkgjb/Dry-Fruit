import React from 'react';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';

const ReturnRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Return & Refund Policy
            </h1>
            <div className="text-lg text-gray-600">
              <p><strong>Muffin DryFruits</strong></p>
              <p>Effective Date: 6 August 2025</p>
              <p>Last Updated: 2024</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            
            {/* Section 1: Returns */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                Returns
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Requests must be made within <strong>7 days of delivery</strong>.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Product must be <strong>unused, in original packaging</strong>, and in same condition.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Certain items (custom or clearance) may not be returnable.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2: Return Process */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-100 text-green-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                Return Process
              </h2>
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <ol className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-green-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                    <div>
                      <p>Contact <a href="mailto:Rajsinghindia2025@gmail.com" className="text-green-600 hover:text-green-800 font-semibold">Rajsinghindia2025@gmail.com</a> with order number & reason.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                    <div>
                      <p>Once approved, follow provided return instructions.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                    <div>
                      <p>Refund processed after inspection.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            {/* Section 3: Refunds */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                Refunds
              </h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>Refunds are credited within <strong>7–14 business days</strong> via original payment method.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>Shipping fees are non-refundable unless item is defective.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Exchanges */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                Exchanges
              </h2>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <p className="text-gray-700">
                  Exchange requests (size or variant) accepted within <strong>7 days</strong>.
                </p>
              </div>
            </section>

            {/* Section 5: Damaged/Defective Items */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-red-100 text-red-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                Damaged/Defective Items
              </h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <p className="text-gray-700">
                  Report damaged items within <strong>48 hours</strong> with photos for verification.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mt-12 p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:Rajsinghindia2025@gmail.com" className="text-blue-600 hover:text-blue-800">Rajsinghindia2025@gmail.com</a></p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Note:</strong> This policy is subject to change. Please check back periodically for updates. 
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

export default ReturnRefundPolicy;

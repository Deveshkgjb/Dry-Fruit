import React from 'react';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <div className="text-lg text-gray-600">
              <p><strong>Muffin DryFruits</strong></p>
              <p>Effective Date: 6 August 2025</p>
              <p>Last Updated: 2024</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            
            {/* Section 1: Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                Acceptance of Terms
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <p className="text-gray-700">
                  By accessing and using Muffin DryFruits website and services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </div>
            </section>

            {/* Section 2: Use License */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-100 text-green-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                Use License
              </h2>
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Permission is granted to temporarily download one copy of the materials on Muffin DryFruits website for personal, non-commercial transitory viewing only.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Use the materials for any commercial purpose or for any public display (commercial or non-commercial).</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: Product Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                Product Information
              </h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>We strive to provide accurate product descriptions, images, and pricing information.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>Product colors may vary slightly due to monitor settings and lighting conditions.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>We reserve the right to correct any errors in product information without prior notice.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Orders and Payment */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                Orders and Payment
              </h2>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>All orders are subject to acceptance and availability.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>Prices are subject to change without notice.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>Payment must be received before order processing.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5: Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-red-100 text-red-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                Limitation of Liability
              </h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <p className="text-gray-700">
                  In no event shall Muffin DryFruits or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Muffin DryFruits website.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mt-12 p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:Rajsinghindia2025@gmail.com" className="text-blue-600 hover:text-blue-800">Rajsinghindia2025@gmail.com</a></p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Note:</strong> These terms are subject to change. Please check back periodically for updates. 
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

export default TermsOfService;

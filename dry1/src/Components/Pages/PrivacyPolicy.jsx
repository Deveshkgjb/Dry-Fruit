import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <div className="text-lg text-gray-600">
              <p><strong>Muffin DryFruits</strong></p>
              <p>Effective Date: 6 August 2025</p>
              <p>Last Updated: 2024</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            
            {/* Section 1: Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                Information We Collect
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span><strong>Personal Information:</strong> Name, email address, phone number, shipping address</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span><strong>Payment Information:</strong> Billing address, payment method details (processed securely)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span><strong>Usage Data:</strong> Website interactions, browsing patterns, device information</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2: How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-100 text-green-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                How We Use Information
              </h2>
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Process and fulfill your orders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Provide customer support and respond to inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Send order updates and delivery notifications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Improve our website and services</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                Information Sharing
              </h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <p className="text-gray-700 mb-3">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>With shipping partners for order delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>With payment processors for transaction processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>When required by law or legal process</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                Data Security
              </h2>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>We implement appropriate security measures to protect your personal information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>All payment information is encrypted and processed securely</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>We regularly review and update our security practices</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5: Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-red-100 text-red-800 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                Your Rights
              </h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Access and update your personal information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Request deletion of your account and data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Opt-out of marketing communications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Request a copy of your data</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mt-12 p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:Rajsinghindia2025@gmail.com" className="text-blue-600 hover:text-blue-800">Rajsinghindia2025@gmail.com</a></p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Note:</strong> This privacy policy is subject to change. Please check back periodically for updates. 
                Last updated: 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
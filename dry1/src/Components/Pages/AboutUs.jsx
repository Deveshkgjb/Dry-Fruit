import React from 'react';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';

const AboutUs = () => {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Mufin Dry Fruit
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted destination for premium, handpicked, and 100% natural dry fruits
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Introduction */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Welcome to Mufin Dry Fruit — your trusted destination for premium, handpicked, and 100% natural dry fruits.
              At Mufin, we believe that true wellness begins with what you eat, and that's why we are dedicated to delivering only the purest and freshest dry fruits straight from nature's best farms.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Mufin Dry Fruit was born with a simple vision — to make healthy eating easy, accessible, and luxurious.
              What started as a small idea quickly grew into a trusted brand loved by hundreds of health-conscious families across India.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We realized that in today's fast-paced world, people often compromise on quality and health. So, we decided to bridge that gap by offering natural, chemical-free, and premium-quality dry fruits that bring both taste and nutrition to your life.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every product we deliver goes through strict quality checks to ensure it meets the highest standards of freshness, taste, and purity.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Mission</h2>
          <div className="bg-gradient-to-r from-green-100 to-yellow-100 rounded-2xl p-8">
            <p className="text-xl text-gray-800 text-center leading-relaxed mb-6">
              Our mission is simple —
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">
              To provide wholesome, nutritious, and high-quality dry fruits that support a healthy lifestyle and bring joy to every household.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              We want to redefine the way people see dry fruits — not just as a snack, but as a daily essential for a strong, energetic, and balanced life.
            </p>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Natural & Handpicked</h3>
              <p className="text-gray-600">
                Only the finest dry fruits make it to your table. Each product is sourced from trusted farms and carefully hand-selected for quality.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🥥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Preservatives or Chemicals</h3>
              <p className="text-gray-600">
                We believe in purity — our dry fruits are free from artificial colors, flavors, or additives.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hygienically Packed</h3>
              <p className="text-gray-600">
                Every pack is sealed with care to maintain taste, aroma, and nutrients.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Quality, Affordable Prices</h3>
              <p className="text-gray-600">
                Luxury shouldn't be expensive. We deliver top-grade dry fruits at honest prices.
              </p>
            </div>
          </div>
        </div>

        {/* Our Products */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Products</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              From Almonds, Cashews, Pistachios, Walnuts, Raisins, and Dates to a range of premium nuts and exotic dry fruit mixes, we offer something for everyone.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you're shopping for personal use, festive gifting, or business hampers — Mufin Dry Fruit has you covered.
            </p>
          </div>
        </div>

        {/* Our Promise */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Promise to You</h2>
          <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-8">
            <p className="text-lg text-gray-700 text-center mb-8">
              When you choose Mufin Dry Fruit, you choose:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Purity that you can taste</h3>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Freshness that you can smell</h3>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality that you can trust</h3>
              </div>
            </div>
            <p className="text-lg text-gray-700 text-center mt-8">
              We promise to continue bringing you the best of nature, packed with care, delivered with love.
            </p>
          </div>
        </div>

        {/* Our Vision */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Vision</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
              To become India's most trusted dry fruit brand by combining health, honesty, and happiness in every pack.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              We aim to promote a lifestyle that values nutrition without compromising on taste and quality.
            </p>
          </div>
        </div>

        {/* Join the Family */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Join the Mufin Family</h2>
          <div className="bg-gradient-to-r from-green-100 to-yellow-100 rounded-2xl p-8 text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We're more than just a brand — we're a community that believes in living healthy and eating pure.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Join the Mufin family today and make a healthy choice that your body will thank you for.
            </p>
            <div className="text-2xl font-bold text-green-800">
              Mufin Dry Fruit – Taste of Purity, Promise of Health.
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;

import React, { useState, useEffect } from 'react';
import { pageAPI } from '../../services/pageAPI.js';

const DoYouKnow = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default fallback data
  const defaultFacts = [
    {
      id: 1,
      icon: "🌿",
      title: "100% Natural",
      description: "All our dry fruits are naturally processed without any artificial preservatives, colors, or additives."
    },
    {
      id: 2,
      icon: "💪",
      title: "Rich in Nutrients",
      description: "Packed with essential vitamins, minerals, fiber, and antioxidants that boost your immunity and energy."
    },
    {
      id: 3,
      icon: "🚚",
      title: "Farm Fresh Delivery",
      description: "Direct sourcing from farms ensures maximum freshness and quality delivered right to your doorstep."
    },
    {
      id: 4,
      icon: "🏆",
      title: "Premium Quality",
      description: "Each product undergoes strict quality checks to ensure you get only the finest dry fruits and nuts."
    },
    {
      id: 5,
      icon: "🌍",
      title: "Global Sourcing",
      description: "We source the best varieties from around the world - California almonds, Turkish figs, Iranian pistachios."
    },
    {
      id: 6,
      icon: "❤️",
      title: "Heart Healthy",
      description: "Rich in good fats, protein, and fiber that support heart health and help maintain cholesterol levels."
    }
  ];

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      console.log('🔄 DoYouKnow - Fetching page content...');
      
      // Get homepage content
      const homepageContent = await pageAPI.getPageContent('homepage');
      console.log('📄 DoYouKnow - Raw homepage content:', homepageContent);
      
      // Set the content with proper structure
      setPageContent({ homepage: homepageContent });
      
      console.log('📄 DoYouKnow - Page content loaded:', homepageContent?.doYouKnow);
      console.log('📄 DoYouKnow - Facts loaded:', homepageContent?.doYouKnow?.facts);
    } catch (error) {
      console.error('❌ DoYouKnow - Error loading page content:', error);
      setPageContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent();

    // Listen for real-time updates
    const handlePageUpdate = () => {
      console.log('🔄 DoYouKnow - Page content update detected, refreshing...');
      // Force a complete refresh by clearing localStorage cache
      setTimeout(() => {
        fetchPageContent();
      }, 100);
    };

    window.addEventListener('pageContentUpdated', handlePageUpdate);

    return () => {
      window.removeEventListener('pageContentUpdated', handlePageUpdate);
    };
  }, []);

  // Use dynamic content if available, otherwise fallback to default
  const doYouKnowData = pageContent?.homepage?.doYouKnow || {
    title: "Do You Know?",
    subtitle: "Discover amazing facts about our premium dry fruits and nuts that make them the perfect choice for your healthy lifestyle.",
    facts: defaultFacts
  };

  // Handle both old format (array of strings) and new format (array of objects)
  let facts = doYouKnowData.facts || defaultFacts;
  
  // If facts is an array of strings, convert to objects
  if (facts.length > 0 && typeof facts[0] === 'string') {
    const icons = ["🥜", "💪", "❤️", "🧠", "🛡️", "⚡"];
    facts = facts.map((factText, index) => ({
      id: index + 1,
      icon: icons[index] || "📝",
      title: factText.split(':')[0] || `Fact ${index + 1}`,
      description: factText.includes(':') ? factText.split(':').slice(1).join(':').trim() : factText
    }));
  }
  
  console.log('📄 DoYouKnow - Processed facts:', facts);

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-blue-50 py-[8vh] md:py-[12vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Main Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {doYouKnowData.title || "Do You Know?"}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {doYouKnowData.subtitle || "Discover amazing facts about our premium dry fruits and nuts that make them the perfect choice for your healthy lifestyle."}
          </p>
        </div>

        {/* Facts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 animate-pulse">
                <div className="text-4xl md:text-5xl mb-4 text-center bg-gray-200 h-12 rounded"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {facts.map((fact, index) => (
              <div
                key={fact.id || index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-gray-100 hover:transform hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="text-4xl md:text-5xl mb-4 text-center">
                  {fact.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-center">
                  {fact.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-center leading-relaxed">
                  {fact.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA Section */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Ready to Experience Premium Quality?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made Mufindryfruit their trusted choice 
              for healthy, delicious, and premium dry fruits and nuts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
                Shop Now
              </button>
              <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoYouKnow;

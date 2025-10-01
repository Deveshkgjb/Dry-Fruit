import React from 'react';

const DoYouKnow = () => {
  const facts = [
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

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-blue-50 py-[8vh] md:py-[12vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Main Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Do You Know?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing facts about our premium dry fruits and nuts that make them 
            the perfect choice for your healthy lifestyle.
          </p>
        </div>

        {/* Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {facts.map((fact) => (
            <div
              key={fact.id}
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

        {/* Bottom CTA Section */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Ready to Experience Premium Quality?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made Happilo their trusted choice 
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

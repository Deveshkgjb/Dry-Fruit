import React from 'react';

const Offer3 = () => {
  return (
    <div className="w-full h-32 md:h-40 lg:h-48 relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            Premium Quality
          </h2>
          <p className="text-lg md:text-xl">
            Handpicked dry fruits & nuts for your family
          </p>
        </div>
      </div>
      {/* Fallback background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default Offer3;
  
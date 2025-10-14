import React from 'react';

const OfferBar2 = () => {
  return (
    <div className="w-full h-32 md:h-40 lg:h-48 relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            Special Offer
          </h2>
          <p className="text-lg md:text-xl">
            Get 20% off on all value combo packs!
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

export default OfferBar2;
  
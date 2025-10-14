const MufindryfruitsJourney = () => {
  return (
    <div className="w-full bg-gray-100 py-[8vh] md:py-[10vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-gray-800">
          Journey 🙌
        </h2>

        {/* Description Text */}
        <div className="mb-8">
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-6xl">
            is a health food brand founded in the year 2016, headquartered in Bengaluru. Mufindryfruit bring to you an exclusive range of Nuts, dried fruits, seeds, Dry Roasted snacks, trail mixes, 
            festive gift hampers and more. With a wide variety products that cater to every taste and age group, our best sellers have found their way into the homes and hearts of many households. 
            The product innovations over the years and production volumes were made possible with our automated manufacturing unit at yeshwantpur – Bengaluru. Gourmet brand Mufindryfruit is 
            available across all leading Modern Retail and General Trades. and is also one of the most popular FMCG brands searched for on e-commerce sites.
          </p>
        </div>

        {/* Read More Button */}
        <button className="bg-green-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded font-semibold text-sm sm:text-base md:text-lg hover:bg-green-800 transition-colors">
          READ MORE
        </button>
      </div>
    </div>
  );
};

export default MufindryfruitsJourney;

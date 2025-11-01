const TriThreadJourney = () => {
  return (
    <div className="w-full bg-gray-100 py-[8vh] md:py-[10vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-gray-800">
          Our Journey 🙌
        </h2>

        {/* Description Text */}
        <div className="mb-8">
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-6xl">
            TriThread is a premium fashion brand founded in the year 2016, headquartered in Bengaluru. TriThread brings to you an exclusive range of trendy apparel, stylish accessories, premium fabrics, curated fashion collections, 
            festive gift hampers and more. With a wide variety of products that cater to diverse styles and preferences, our best-selling collections have found their way into the wardrobes and hearts of fashion enthusiasts across India. 
            The design innovations over the years and production excellence were made possible with our state-of-the-art manufacturing facility at Yeshwantpur – Bengaluru. Fashion brand TriThread is 
            available across all leading Modern Retail outlets and Fashion stores, and is also one of the most popular clothing brands searched for on e-commerce platforms.
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

export default TriThreadJourney;

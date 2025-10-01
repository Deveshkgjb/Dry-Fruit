const ExploreCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Dry Fruits & Nuts",
      image: "", // Placeholder for product image
      bgColor: "bg-green-700"
    },
    {
      id: 2,
      title: "Summer Collection",
      image: "", // Placeholder for product image
      bgColor: "bg-green-700"
    },
    {
      id: 3,
      title: "Seeds & Berries",
      image: "", // Placeholder for product image
      bgColor: "bg-green-700"
    },
    {
      id: 4,
      title: "Mixes",
      image: "", // Placeholder for product image
      bgColor: "bg-green-700"
    },
    {
      id: 5,
      title: "Snacks",
      image: "", // Placeholder for product image
      bgColor: "bg-green-700"
    },
    {
      id: 6,
      title: "Gifting",
      image: "", // Placeholder for product image
      bgColor: "bg-green-700"
    }
  ];

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800">
          Explore Our Categories
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* Product Image Container */}
              <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3 md:mb-4 flex items-center justify-center overflow-hidden relative">
                {/* Placeholder for product packages image */}
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Product Packages</span>
                </div>
              </div>

              {/* Category Title Button */}
              <button className={`${category.bgColor} text-white px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs sm:text-sm hover:bg-green-800 transition-colors w-full`}>
                {category.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCategories;

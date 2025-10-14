const BlogPosts = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Important Health Benefits of Brazil Nuts Explained",
      description: "Brazil nuts are seeds obtained from the brazil nut tree. They are known to have a smooth and buttery texture, with each seed encased in a fruit surrounded by a hard shell. Brazil nuts originate in ...",
      date: "May 30, 2025",
      // Placeholder for blog image
      category: "brazil nuts benefits",
      bgColor: "bg-orange-100"
    },
    {
      id: 2,
      title: "6 Benefits of Black Raisins For Females",
      description: "Black raisins are tangy, sweet, dehydrated grapes that have a darker shade compared to other raisins. When it comes to women's health, black raisins are beneficial in many aspects. They are a good ...",
      date: "May 30, 2025",
      category: "black raisins benefits for females",
      bgColor: "bg-pink-100"
    },
    {
      id: 3,
      title: "Health Benefits of Eating Sunflower Seeds",
      description: "In addition to being a delicious snack, sunflower seeds provide several health advantages. When it comes to using sunflower seeds, we may use them in salads or to produce butter. These little see...",
      date: "May 29, 2025",
      category: "benefits of sunflower seeds",
      bgColor: "bg-yellow-100"
    }
  ];

  return (
    <div className="w-full bg-white py-[8vh] md:py-[10vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800">
          Blog posts
        </h2>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer p-6"
            >
              {/* Category Badge */}
              <div className="mb-4">
                <span className="bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded">
                  {post.category}
                </span>
              </div>
                {/* Blog Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
                  {post.title}
                </h3>

                {/* Blog Description */}
                <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>

                {/* Blog Date */}
                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {post.date}
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPosts;

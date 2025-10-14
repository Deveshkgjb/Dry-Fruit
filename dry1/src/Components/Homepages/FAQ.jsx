import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "Where can I buy Premium Dry Fruits and Nuts online?",
      answer: "You can buy premium dry fruits and nuts directly from our website. We offer a wide selection of high-quality nuts, dried fruits, and healthy snacks with convenient home delivery options."
    },
    {
      question: "What are the benefits of Dry Fruits?",
      answer: "Dry fruits are packed with essential nutrients, vitamins, and minerals. They provide energy, support heart health, boost immunity, aid in weight management, and are rich in antioxidants that help fight free radicals."
    },
    {
      question: "What is the average shelf life of Dry Fruits?",
      answer: "The shelf life varies by type of dry fruit. Generally, most dry fruits last 6-12 months when stored properly in a cool, dry place. Nuts like almonds and walnuts can last up to a year, while dried fruits like dates and figs last 6-8 months."
    },
    {
      question: "What are the Health benefits of Dry Fruits?",
      answer: "Dry fruits offer numerous health benefits including improved heart health, better digestion, stronger bones, enhanced brain function, better skin health, and weight management. They're also rich in fiber, healthy fats, and essential minerals."
    },
    {
      question: "What are some Healthy Seeds for Weight loss?",
      answer: "Seeds like chia seeds, flax seeds, pumpkin seeds, and sunflower seeds are excellent for weight loss. They're high in fiber and protein, which help you feel full longer, boost metabolism, and provide essential nutrients while supporting your weight loss goals."
    },
    {
      question: "What all products can I buy from Mufindryfruit?",
      answer: "Mufindryfruit offers a wide range of premium dry fruits, nuts, seeds, trail mixes, nut butters, dried fruits, healthy snacks, gift boxes, and specialty combinations. All products are carefully sourced and processed to maintain the highest quality standards."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-gray-50 py-[8vh] md:py-[10vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800">
          Frequently Ask Questions
        </h2>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left bg-green-700 text-white hover:bg-green-800 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="font-medium text-sm md:text-base">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-gray-100">
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;

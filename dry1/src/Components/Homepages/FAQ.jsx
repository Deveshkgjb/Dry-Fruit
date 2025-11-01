import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "Where can I buy trendy clothing online from TriThread?",
      answer: "You can shop the latest fashion trends directly from our TriThread website. We offer a wide selection of high-quality clothing for men, women, and kids with convenient home delivery options and easy returns."
    },
    {
      question: "What types of clothing does TriThread offer?",
      answer: "TriThread offers a diverse range of clothing including casual wear, formal attire, activewear, ethnic wear, accessories, and seasonal collections. We cater to all age groups with stylish and comfortable fashion choices for every occasion."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We offer a hassle-free 7-day return and exchange policy. If you're not satisfied with your purchase, you can return or exchange items within 7 days of delivery. Items must be unused, unwashed, and with original tags attached."
    },
    {
      question: "How do I choose the right size?",
      answer: "Each product page includes a detailed size chart to help you find the perfect fit. We recommend measuring yourself and comparing with our size guide. If you're between sizes, we suggest sizing up for a comfortable fit. Our customer support team is always ready to help with sizing queries."
    },
    {
      question: "What payment methods do you accept?",
      answer: "TriThread accepts multiple payment methods including credit/debit cards, UPI (PhonePe, Google Pay, Paytm), net banking, and cash on delivery (COD). All online transactions are secure and encrypted for your safety."
    },
    {
      question: "What all products can I buy from TriThread?",
      answer: "TriThread offers a comprehensive range of fashion products including t-shirts, shirts, jeans, dresses, tops, ethnic wear, activewear, jackets, accessories, footwear, and seasonal collections. All products are carefully curated to bring you the latest trends in fashion at affordable prices."
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
          Frequently Asked Questions
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

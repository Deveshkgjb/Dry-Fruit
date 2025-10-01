import React from 'react';

/**
 * Product Utility Functions
 * Common functions for handling product data from database
 */

// Get product image URL with fallback
export const getProductImageUrl = (product) => {
  if (!product) return '/dev1.png';
  
  if (product.images && product.images.length > 0) {
    return product.images[0].url || '/dev1.png';
  }
  
  return '/dev1.png';
};

// Get product image alt text
export const getProductImageAlt = (product) => {
  if (!product) return 'Product Image';
  
  if (product.images && product.images.length > 0) {
    return product.images[0].alt || product.name || 'Product Image';
  }
  
  return product.name || 'Product Image';
};

// Get product badge
export const getProductBadge = (product) => {
  if (!product || !product.badges || product.badges.length === 0) {
    return null;
  }
  
  return {
    text: product.badges[0].text,
    color: product.badges[0].color
  };
};

// Get product rating
export const getProductRating = (product) => {
  if (!product || !product.rating) {
    return { average: 0, count: 0 };
  }
  
  if (typeof product.rating === 'object') {
    return {
      average: product.rating.average || 0,
      count: product.rating.count || 0
    };
  }
  
  return {
    average: product.rating,
    count: 0
  };
};

// Get product size and price
export const getProductSizeAndPrice = (product) => {
  if (!product || !product.sizes || product.sizes.length === 0) {
    return {
      size: '250g',
      price: 0,
      originalPrice: null
    };
  }
  
  const firstSize = product.sizes[0];
  return {
    size: firstSize.size || '250g',
    price: firstSize.price || 0,
    originalPrice: firstSize.originalPrice || null
  };
};

// Create cart item from product
export const createCartItem = (product) => {
  const { size, price } = getProductSizeAndPrice(product);
  
  return {
    productId: product._id,
    name: product.name,
    size: size,
    price: price,
    quantity: 1,
    image: getProductImageUrl(product)
  };
};

// Render star rating
export const renderStars = (rating) => {
  if (!rating) return null;
  
  const ratingValue = typeof rating === 'object' ? rating.average : rating;
  if (!ratingValue) return null;
  
  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`text-yellow-400 ${index < Math.floor(ratingValue) ? 'text-yellow-400' : 'text-gray-300'}`}
    >
      ★
    </span>
  ));
};

// Render complete rating display (stars + rating + count)
export const renderRatingDisplay = (product) => {
  const rating = getProductRating(product);
  
  if (rating.average === 0) return null;
  
  return (
    <div className="flex items-center mb-2">
      <div className="flex mr-1">
        {renderStars(rating)}
      </div>
      <span className="text-xs text-gray-600">
        {rating.average} | {rating.count} Rating{rating.count !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

// Safe rating display - handles both object and number ratings
export const renderSafeRating = (product) => {
  if (!product || !product.rating) return null;
  
  const rating = product.rating;
  const ratingValue = typeof rating === 'object' ? rating.average : rating;
  const ratingCount = typeof rating === 'object' ? rating.count : (product.reviews || 0);
  
  if (!ratingValue || ratingValue === 0) return null;
  
  return (
    <div className="flex items-center mb-2">
      <div className="flex mr-1">
        {renderStars(ratingValue)}
      </div>
      <span className="text-xs text-gray-600">
        {ratingValue} | {ratingCount} Rating{ratingCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

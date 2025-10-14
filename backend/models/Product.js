const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const badgeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
    enum: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink']
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  categorySlug: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  sizes: [sizeSchema],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  badges: [badgeSchema],
  brand: {
    type: String,
    default: 'Happilo'
  },
  countryOfOrigin: String,
  shelfLife: String,
  features: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number,
    vitamins: [String],
    minerals: [String]
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Out of Stock'],
    default: 'Active'
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  // Display sections configuration
  displaySections: {
    ourBestSellers: {
      type: Boolean,
      default: false
    },
    valueCombos: {
      type: Boolean,
      default: false
    },
    youMayAlsoLike: {
      type: Boolean,
      default: false
    },
    popular: {
      type: Boolean,
      default: false
    }
  },
  // Legacy fields for backward compatibility
  isValueCombo: {
    type: Boolean,
    default: false
  },
  isYouMayLike: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  tags: [String],
  metaTitle: String,
  metaDescription: String,
  // Admin-added reviews (for display purposes)
  reviews: [{
    id: String,
    customerName: String,
    customerEmail: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    title: String,
    comment: String,
    date: String,
    verified: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    }
  }],
  // Product popularity and urgency settings
  popularitySettings: {
    orderCount: {
      type: Number,
      default: 0,
      min: 0
    },
    offerCountdown: {
      enabled: {
        type: Boolean,
        default: true
      },
      duration: {
        type: Number,
        default: 15, // minutes
        min: 1,
        max: 60
      },
      startTime: {
        type: Date,
        default: Date.now
      }
    },
  }
}, {
  timestamps: true
});

// Create indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ categorySlug: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ 'displaySections.ourBestSellers': 1 });
productSchema.index({ 'displaySections.valueCombos': 1 });
productSchema.index({ 'displaySections.youMayAlsoLike': 1 });
productSchema.index({ 'displaySections.popular': 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.sizes && this.sizes.length > 0) {
    const mainSize = this.sizes[0];
    if (mainSize.originalPrice && mainSize.originalPrice > mainSize.price) {
      return Math.round(((mainSize.originalPrice - mainSize.price) / mainSize.originalPrice) * 100);
    }
  }
  return 0;
});

// Method to update product rating based on approved reviews
productSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  
  // Get all approved reviews for this product
  const reviews = await Review.find({ 
    product: this._id, 
    status: 'approved' 
  });
  
  if (reviews.length === 0) {
    // No approved reviews, reset rating
    this.rating = {
      average: 0,
      count: 0
    };
  } else {
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    this.rating = {
      average: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      count: reviews.length
    };
  }
  
  await this.save();
  return this.rating;
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
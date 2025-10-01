const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get reviews with filtering (Admin)
// @access  Private/Admin
router.get('/', [
  adminAuth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      status,
      rating,
      product,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (rating) filter.rating = parseInt(rating);
    if (product) filter.product = product;

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [reviews, totalCount] = await Promise.all([
      Review.find(filter)
        .populate('product', 'name category images')
        .populate('user', 'name email')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Review.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews: totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a specific product
// @access  Public
router.get('/product/:productId', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { page = 1, limit = 10, rating } = req.query;
    const { productId } = req.params;

    // Build filter object
    const filter = { 
      product: productId, 
      status: 'approved' 
    };
    if (rating) filter.rating = parseInt(rating);

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [reviews, totalCount, ratingDistribution] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } }
      ])
    ]);

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalReviews: totalCount,
        limit: parseInt(limit)
      },
      summary: {
        averageRating: avgRating.length > 0 ? avgRating[0].averageRating : 0,
        totalReviews: avgRating.length > 0 ? avgRating[0].totalReviews : 0,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Product reviews fetch error:', error);
    res.status(500).json({ message: 'Server error fetching product reviews' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', [
  auth,
  body('product').isMongoId().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { product, rating, comment, title } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ 
      product, 
      user: req.user._id 
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if user has purchased this product (optional verification)
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.product': product,
      status: 'delivered'
    });

    const review = new Review({
      product,
      user: req.user._id,
      rating,
      comment,
      title,
      isVerifiedPurchase: !!hasPurchased
    });

    await review.save();

    // Populate user data for response
    await review.populate('user', 'name');

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ message: 'Server error creating review' });
  }
});

// @route   PUT /api/reviews/:id/status
// @desc    Update review status (Admin only)
// @access  Private/Admin
router.put('/:id/status', [
  adminAuth,
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
  body('adminResponse').optional().trim().isLength({ max: 500 }).withMessage('Admin response cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { status, adminResponse } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const oldStatus = review.status;
    review.status = status;

    if (adminResponse) {
      review.adminResponse = {
        message: adminResponse,
        respondedAt: new Date(),
        respondedBy: req.user._id
      };
    }

    await review.save();

    // Update product rating if status changed to/from approved
    if (oldStatus !== status && (status === 'approved' || oldStatus === 'approved')) {
      const product = await Product.findById(review.product);
      if (product) {
        await product.updateRating();
      }
    }

    res.json({
      message: 'Review status updated successfully',
      review
    });
  } catch (error) {
    console.error('Review status update error:', error);
    res.status(500).json({ message: 'Server error updating review status' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review (Admin only)
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const productId = review.product;
    await review.remove();

    // Update product rating after deletion
    const product = await Product.findById(productId);
    if (product) {
      await product.updateRating();
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Review deletion error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update own review
// @access  Private
router.put('/:id', [
  auth,
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }

    // Update fields
    const { rating, comment, title } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (title !== undefined) review.title = title;

    // Reset status to pending if approved review is edited
    if (review.status === 'approved') {
      review.status = 'pending';
    }

    await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    if (product) {
      await product.updateRating();
    }

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Review update error:', error);
    res.status(500).json({ message: 'Server error updating review' });
  }
});

// @route   GET /api/reviews/stats
// @desc    Get review statistics (Admin)
// @access  Private/Admin
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const ratingStats = await Review.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const totalReviews = await Review.countDocuments();
    const avgRating = await Review.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      ratingStats,
      totalReviews,
      averageRating: avgRating.length > 0 ? avgRating[0].averageRating : 0
    });
  } catch (error) {
    console.error('Review stats error:', error);
    res.status(500).json({ message: 'Server error fetching review statistics' });
  }
});

module.exports = router;

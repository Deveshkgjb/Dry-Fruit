const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  query('sort').optional().isIn(['name', 'price', 'rating', 'createdAt', 'popularity']).withMessage('Invalid sort field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      categorySlug,
      subcategory,
      search,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
      isActive = true,
      isBestSeller,
      isPopular
    } = req.query;

    // Build filter object
    const filter = { isActive };

    if (category) filter.category = category;
    if (categorySlug) filter.categorySlug = categorySlug;
    if (subcategory) filter.subcategory = subcategory;
    if (isBestSeller === 'true') filter.isBestSeller = true;
    if (isPopular === 'true') filter.isPopular = true;

    // For frontend API calls, only show active products
    // Admin API calls (with auth token) can see all products
    const isAdminRequest = req.headers.authorization && req.headers.authorization.startsWith('Bearer');
    if (!isAdminRequest) {
      filter.status = 'Active';
      console.log('🌐 Frontend API call - filtering for active products only');
    } else {
      console.log('🔐 Admin API call - showing all products (including inactive)');
    }

    // Price filtering
    if (minPrice || maxPrice) {
      filter['sizes.price'] = {};
      if (minPrice) filter['sizes.price'].$gte = parseInt(minPrice);
      if (maxPrice) filter['sizes.price'].$lte = parseInt(maxPrice);
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    if (sort === 'price') {
      sortObj['sizes.0.price'] = order === 'asc' ? 1 : -1;
    } else if (sort === 'rating') {
      sortObj['rating.average'] = order === 'asc' ? 1 : -1;
    } else if (sort === 'popularity') {
      sortObj.salesCount = order === 'asc' ? 1 : -1;
    } else {
      sortObj[sort] = order === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: totalCount,
        limit: parseInt(limit),
        hasNextPage,
        hasPrevPage
      },
      filters: {
        category,
        subcategory,
        search,
        minPrice,
        maxPrice,
        sort,
        order
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// @route   GET /api/products/categories
// @desc    Get all product categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('productCount')
      .sort({ sortOrder: 1, name: 1 });

    res.json({ categories });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// @route   GET /api/products/category/:categorySlug
// @desc    Get products by category slug
// @access  Public
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12, sort = 'createdAt', order = 'desc' } = req.query;

    // Find category first
    const category = await Category.findOne({ slug: categorySlug, isActive: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Build filter
    const filter = { 
      categorySlug: categorySlug, 
      isActive: true,
      status: 'Active'  // Only show active products on frontend
    };

    // Build sort object
    const sortObj = {};
    if (sort === 'price') {
      sortObj['sizes.0.price'] = order === 'asc' ? 1 : -1;
    } else if (sort === 'rating') {
      sortObj['rating.average'] = order === 'asc' ? 1 : -1;
    } else {
      sortObj[sort] = order === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      category,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: totalCount,
        limit: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Category products fetch error:', error);
    res.status(500).json({ message: 'Server error fetching category products' });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products (best sellers, popular)
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const [bestSellers, popular, newest] = await Promise.all([
      // Updated to use new displaySections logic
      Product.find({ 
        isActive: true, 
        $or: [
          { isBestSeller: true },
          { 'displaySections.ourBestSellers': true },
          { 'displaySections.valueCombos': true },
          { 'displaySections.youMayAlsoLike': true }
        ]
      }).populate('category', 'name slug').limit(1000).lean(),
      Product.find({ 
        isActive: true, 
        $or: [
          { isPopular: true },
          { 'displaySections.popular': true }
        ]
      }).populate('category', 'name slug').limit(1000).lean(),
      Product.find({ isActive: true }).populate('category', 'name slug').sort({ createdAt: -1 }).limit(8).lean()
    ]);

    res.json({
      bestSellers,
      popular,
      newest
    });
  } catch (error) {
    console.error('Featured products fetch error:', error);
    res.status(500).json({ message: 'Server error fetching featured products' });
  }
});

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { q, limit = 10 } = req.query;

    const products = await Product.find({
      $and: [
        { status: 'Active' },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    })
    .limit(parseInt(limit))
    .select('name category images sizes rating')
    .lean();

    res.json({ products, query: q });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug').lean();
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get user-submitted reviews for this product
    const userReviews = await Review.find({ 
      product: req.params.id, 
      status: 'approved' 
    })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    // Combine admin-added reviews (from product.reviews) with user-submitted reviews
    let allReviews = [];
    
    // Add admin-added reviews first (these are embedded in the product document)
    if (product.reviews && product.reviews.length > 0) {
      console.log(`📝 Found ${product.reviews.length} admin-added reviews in product document`);
      const adminReviews = product.reviews.map(review => ({
        _id: review.id || `admin_${Date.now()}_${Math.random()}`,
        customerName: review.customerName,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        date: review.date,
        verified: review.verified || true,
        helpful: review.helpful || 0,
        isAdminAdded: true
      }));
      allReviews = [...adminReviews];
      console.log(`✅ Added ${adminReviews.length} admin reviews to response`);
    }

    // Add user-submitted reviews
    if (userReviews && userReviews.length > 0) {
      console.log(`📝 Found ${userReviews.length} user-submitted reviews`);
      const formattedUserReviews = userReviews.map(review => ({
        ...review,
        customerName: review.user?.name || 'Anonymous',
        isAdminAdded: false
      }));
      allReviews = [...allReviews, ...formattedUserReviews];
      console.log(`✅ Added ${formattedUserReviews.length} user reviews to response`);
    }

    console.log(`📊 Total reviews being returned: ${allReviews.length}`);

    // Get related products (same category, excluding current product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: req.params.id },
      status: 'Active'
    })
    .populate('category', 'name slug')
    .limit(4)
    .select('name images sizes rating category')
    .lean();

    // Check if user has this product in wishlist
    let isInWishlist = false;
    if (req.user) {
      const user = await User.findById(req.user._id);
      isInWishlist = user.wishlist.includes(req.params.id);
    }

    res.json({
      product,
      reviews: allReviews,
      relatedProducts,
      isInWishlist
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
router.post('/', [
  adminAuth,
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('sizes').isArray({ min: 1 }).withMessage('At least one size option is required'),
  body('sizes.*.size').notEmpty().withMessage('Size is required'),
  body('sizes.*.price').isNumeric({ min: 0 }).withMessage('Price must be a positive number'),
  body('sizes.*.stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, description, category, sizes, reviews, ...otherData } = req.body;

    // Debug: Log what backend receives
    console.log('📥 Backend received product data:', {
      name,
      reviewsCount: reviews ? reviews.length : 0,
      reviews: reviews,
      quickRating: req.body.quickRating,
      quickReviewCount: req.body.quickReviewCount
    });
    
    // Additional debug for reviews
    if (reviews && reviews.length > 0) {
      console.log('🔍 Detailed review data received:');
      reviews.forEach((review, index) => {
        console.log(`  Review ${index + 1}:`, {
          customerName: review.customerName,
          rating: review.rating,
          comment: review.comment ? review.comment.substring(0, 50) + '...' : 'No comment',
          date: review.date
        });
      });
    }

    // Find the category by name
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Category not found' });
    }

    // Generate slug from product name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens

    // Check if slug already exists
    let finalSlug = slug;
    let counter = 1;
    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Handle popularity settings
    const { popularitySettings } = req.body;
    let processedPopularitySettings = {
      orderCount: 0,
      offerCountdown: {
        enabled: true,
        duration: 15,
        startTime: new Date()
      }
    };

    if (popularitySettings) {
      processedPopularitySettings = {
        orderCount: popularitySettings.orderCount || 0,
        offerCountdown: {
          enabled: popularitySettings.offerCountdown?.enabled !== false,
          duration: popularitySettings.offerCountdown?.duration || 15,
          startTime: new Date() // Always reset timer when product is created/updated
        },
      };
    }

    const productData = {
      name,
      description,
      category: categoryDoc._id, // Use ObjectId
      categorySlug: categoryDoc.slug, // Use category slug
      slug: finalSlug, // Generated slug
      sizes,
      popularitySettings: processedPopularitySettings,
      ...otherData
    };

    console.log('Creating product with category info:', {
      categoryName: categoryDoc.name,
      categorySlug: categoryDoc.slug,
      productName: name,
      productSlug: finalSlug,
      reviewsCount: reviews ? reviews.length : 0
    });

    const product = new Product(productData);
    await product.save();

    // Auto-set isBestSeller if product is added to Value Combo or You May Like
    const { isValueCombo, isYouMayLike, displaySections } = req.body;
    if (isValueCombo || isYouMayLike || displaySections?.valueCombos || displaySections?.youMayAlsoLike) {
      console.log('🎯 Product added to Value Combo or You May Like - auto-setting as Best Seller');
      product.isBestSeller = true;
      if (!product.displaySections) product.displaySections = {};
      product.displaySections.ourBestSellers = true;
      await product.save();
      console.log('✅ Product automatically added to Our Best Sellers');
    }

    // Process quick rating settings and detailed reviews
    const { quickRating, quickReviewCount } = req.body;
    
    // Initialize rating object
    let finalRating = product.rating || { average: 0, count: 0 };
    
    // Process detailed reviews if provided (priority over quick rating)
    if (reviews && reviews.length > 0) {
      console.log(`📝 Processing ${reviews.length} reviews for product: ${product.name}`);
      console.log(`📝 Raw reviews received:`, JSON.stringify(reviews, null, 2));
      
      // Filter valid reviews (more lenient - only require customer name and rating)
      const validReviews = reviews.filter(review => 
        review.customerName && review.customerName.trim() !== '' && 
        review.rating && review.rating > 0
      );
      
      console.log(`📝 Valid reviews after filtering: ${validReviews.length} out of ${reviews.length}`);
      console.log(`📝 Valid reviews:`, JSON.stringify(validReviews, null, 2));
      
      if (validReviews.length > 0) {
        const totalRating = validReviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
        const averageRating = totalRating / validReviews.length;
        
        // Save reviews to product document AND set rating
        product.reviews = validReviews.map(review => ({
          id: review.id || `review_${Date.now()}_${Math.random()}`,
          customerName: review.customerName,
          customerEmail: review.customerEmail || '',
          rating: parseInt(review.rating),
          title: review.title || '',
          comment: review.comment || 'Great product!', // Default comment if empty
          date: review.date || new Date().toISOString().split('T')[0],
          verified: review.verified || true,
          helpful: review.helpful || 0
        }));
        
        // Update product rating from detailed reviews
        finalRating = {
          average: Math.round(averageRating * 10) / 10,
          count: validReviews.length
        };
        
        console.log(`📊 Set product rating from admin reviews: ${finalRating.average} (${finalRating.count} reviews)`);
        console.log(`📝 Saved ${product.reviews.length} reviews to product document`);
        
        // Log the reviews that were processed
        validReviews.forEach((review, index) => {
          console.log(`✅ Processed review ${index + 1}: ${review.rating} stars - "${review.comment.substring(0, 50)}..."`);
        });
      }
    }
    
    // Process quick rating settings (only if no detailed reviews or as override)
    if (quickRating && quickRating > 0) {
      console.log(`Setting quick rating for product: ${product.name}`);
      finalRating = {
        average: Math.round(quickRating * 10) / 10,
        count: quickReviewCount || finalRating.count || 1
      };
      console.log(`📊 Set quick rating: ${finalRating.average} (${finalRating.count} reviews)`);
    }
    
    // Apply final rating to product
    product.rating = finalRating;
    await product.save();
    
    // Verify reviews and rating were saved by fetching from database
    const savedProduct = await Product.findById(product._id);
    console.log(`🔍 VERIFICATION: Product reviews in database:`, savedProduct.reviews?.length || 0);
    console.log(`🔍 VERIFICATION: Product rating in database:`, savedProduct.rating);
    console.log(`🔍 VERIFICATION: Product order count in database:`, savedProduct.popularitySettings?.orderCount);

    // Populate category for response
    await product.populate('category', 'name slug');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', [
  adminAuth,
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Product description cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { reviews, popularitySettings, ...updateData } = req.body;

    // Handle popularity settings for updates
    if (popularitySettings) {
      updateData.popularitySettings = {
        orderCount: popularitySettings.orderCount || 0,
        offerCountdown: {
          enabled: popularitySettings.offerCountdown?.enabled !== false,
          duration: popularitySettings.offerCountdown?.duration || 15,
          startTime: new Date() // Always reset timer when product is updated
        },
      };
    }
    
    // Debug: Log what backend receives for update
    console.log('📥 Backend received product update data:', {
      productId: req.params.id,
      reviewsCount: reviews ? reviews.length : 0,
      reviews: reviews,
      quickRating: req.body.quickRating,
      quickReviewCount: req.body.quickReviewCount
    });
    
    // Additional debug for reviews in update
    if (reviews && reviews.length > 0) {
      console.log('🔍 Detailed review data received for update:');
      reviews.forEach((review, index) => {
        console.log(`  Review ${index + 1}:`, {
          customerName: review.customerName,
          rating: review.rating,
          comment: review.comment ? review.comment.substring(0, 50) + '...' : 'No comment',
          date: review.date
        });
      });
    }

    // If category is being updated, resolve it to ObjectId
    if (updateData.category) {
      const categoryDoc = await Category.findOne({ name: updateData.category });
      if (!categoryDoc) {
        return res.status(400).json({ message: 'Category not found' });
      }
      updateData.category = categoryDoc._id;
      updateData.categorySlug = categoryDoc.slug;
    }

    // If name is being updated, regenerate slug
    if (updateData.name) {
      const slug = updateData.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      // Check if slug already exists (excluding current product)
      let finalSlug = slug;
      let counter = 1;
      while (await Product.findOne({ slug: finalSlug, _id: { $ne: req.params.id } })) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      updateData.slug = finalSlug;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Auto-set isBestSeller if product is added to Value Combo or You May Like
    const { isValueCombo, isYouMayLike, displaySections } = req.body;
    if (isValueCombo || isYouMayLike || displaySections?.valueCombos || displaySections?.youMayAlsoLike) {
      console.log('🎯 Product updated to Value Combo or You May Like - auto-setting as Best Seller');
      product.isBestSeller = true;
      if (!product.displaySections) product.displaySections = {};
      product.displaySections.ourBestSellers = true;
      await product.save();
      console.log('✅ Product automatically added to Our Best Sellers');
    }

    // Process quick rating settings and detailed reviews
    const { quickRating, quickReviewCount } = req.body;
    
    // Initialize rating object
    let finalRating = product.rating || { average: 0, count: 0 };
    
    // Process detailed reviews if provided (priority over quick rating)
    if (reviews && reviews.length > 0) {
      console.log(`📝 Processing ${reviews.length} reviews for product update: ${product.name}`);
      console.log(`📝 Raw reviews received for update:`, JSON.stringify(reviews, null, 2));
      
      // Filter valid reviews (more lenient - only require customer name and rating)
      const validReviews = reviews.filter(review => 
        review.customerName && review.customerName.trim() !== '' && 
        review.rating && review.rating > 0
      );
      
      console.log(`📝 Valid reviews after filtering (update): ${validReviews.length} out of ${reviews.length}`);
      console.log(`📝 Valid reviews for update:`, JSON.stringify(validReviews, null, 2));
      
      if (validReviews.length > 0) {
        const totalRating = validReviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
        const averageRating = totalRating / validReviews.length;
        
        // Save reviews to product document AND set rating
        product.reviews = validReviews.map(review => ({
          id: review.id || `review_${Date.now()}_${Math.random()}`,
          customerName: review.customerName,
          customerEmail: review.customerEmail || '',
          rating: parseInt(review.rating),
          title: review.title || '',
          comment: review.comment || 'Great product!', // Default comment if empty
          date: review.date || new Date().toISOString().split('T')[0],
          verified: review.verified || true,
          helpful: review.helpful || 0
        }));
        
        // Update product rating from detailed reviews
        finalRating = {
          average: Math.round(averageRating * 10) / 10,
          count: validReviews.length
        };
        
        console.log(`📊 Updated product rating from admin reviews: ${finalRating.average} (${finalRating.count} reviews)`);
        console.log(`📝 Saved ${product.reviews.length} reviews to product document`);
        
        // Log the reviews that were processed
        validReviews.forEach((review, index) => {
          console.log(`✅ Processed review ${index + 1}: ${review.rating} stars - "${review.comment.substring(0, 50)}..."`);
        });
      }
    }
    
    // Process quick rating settings (only if no detailed reviews or as override)
    if (quickRating && quickRating > 0) {
      console.log(`Setting quick rating for product update: ${product.name}`);
      finalRating = {
        average: Math.round(quickRating * 10) / 10,
        count: quickReviewCount || finalRating.count || 1
      };
      console.log(`📊 Updated quick rating: ${finalRating.average} (${finalRating.count} reviews)`);
    }
    
    // Apply final rating to product
    product.rating = finalRating;
    await product.save();
    
    // Verify reviews and rating were saved by fetching from database
    const savedProduct = await Product.findById(product._id);
    console.log(`🔍 VERIFICATION (UPDATE): Product reviews in database:`, savedProduct.reviews?.length || 0);
    console.log(`🔍 VERIFICATION (UPDATE): Product rating in database:`, savedProduct.rating);
    console.log(`🔍 VERIFICATION (UPDATE): Product order count in database:`, savedProduct.popularitySettings?.orderCount);

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Product update error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Permanently delete the product from database
    await Product.findByIdAndDelete(req.params.id);
    
    console.log(`🗑️ Product permanently deleted: ${product.name} (ID: ${req.params.id})`);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// @route   POST /api/products/:id/wishlist
// @desc    Add/Remove product from wishlist
// @access  Private
router.post('/:id/wishlist', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const productIndex = user.wishlist.indexOf(req.params.id);

    if (productIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(productIndex, 1);
      await user.save();
      res.json({ message: 'Product removed from wishlist', inWishlist: false });
    } else {
      // Add to wishlist
      user.wishlist.push(req.params.id);
      await user.save();
      res.json({ message: 'Product added to wishlist', inWishlist: true });
    }
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({ message: 'Server error updating wishlist' });
  }
});

// Toggle product status (Active/Inactive)
router.patch('/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status || !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be "Active" or "Inactive"' 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`✅ Product ${product.name} status updated to ${status}`);

    res.json({
      message: `Product ${status === 'Active' ? 'activated' : 'deactivated'} successfully`,
      product: {
        _id: product._id,
        name: product.name,
        status: product.status
      }
    });

  } catch (error) {
    console.error('❌ Error updating product status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { managerAuth, categoryAccessAuth } = require('../middleware/auth');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

// @route   GET /api/manager/categories
// @desc    Get categories that the manager can access
// @access  Private (Manager/Admin)
router.get('/categories', managerAuth, async (req, res) => {
  try {
    let categories;
    
    if (req.user.role === 'admin') {
      // Admin can see all categories
      categories = await Category.find({ isActive: true }).sort({ name: 1 });
    } else {
      // Manager can only see their assigned categories
      categories = await Category.find({ 
        _id: { $in: req.user.managedCategories },
        isActive: true 
      }).sort({ name: 1 });
    }
    
    res.json({
      success: true,
      categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Error fetching manager categories:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// @route   GET /api/manager/products
// @desc    Get products that the manager can access
// @access  Private (Manager/Admin)
router.get('/products', managerAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    let filter = { isActive: true };
    
    if (req.user.role === 'manager') {
      // Manager can only see products from their assigned categories
      filter.category = { $in: req.user.managedCategories };
    }
    
    if (category) {
      filter.category = category;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);
    
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    
    res.json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: totalCount,
        limit: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching manager products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// @route   GET /api/manager/products/:id
// @desc    Get single product that manager can access
// @access  Private (Manager/Admin)
router.get('/products/:id', managerAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if manager has access to this product's category
    if (req.user.role === 'manager' && !req.user.managedCategories.includes(product.category._id)) {
      return res.status(403).json({ 
        message: 'Access denied. You do not have permission to view this product.' 
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// @route   POST /api/manager/products
// @desc    Create new product (within manager's categories)
// @access  Private (Manager/Admin)
router.post('/products', [
  managerAuth,
  categoryAccessAuth,
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('sizes').isArray({ min: 1 }).withMessage('At least one size is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, description, category, sizes, ...otherData } = req.body;
    
    // Find category by name
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Category not found' });
    }
    
    // Check if manager has access to this category
    if (req.user.role === 'manager' && !req.user.managedCategories.includes(categoryDoc._id)) {
      return res.status(403).json({ 
        message: 'Access denied. You do not have permission to create products in this category.' 
      });
    }
    
    // Generate unique slug
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');
    let finalSlug = slug;
    let counter = 1;
    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    
    const productData = {
      name,
      description,
      category: categoryDoc._id,
      categorySlug: categoryDoc.slug,
      slug: finalSlug,
      sizes,
      ...otherData
    };
    
    const product = new Product(productData);
    await product.save();
    await product.populate('category', 'name slug');
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// @route   PUT /api/manager/products/:id
// @desc    Update product (within manager's categories)
// @access  Private (Manager/Admin)
router.put('/products/:id', [
  managerAuth,
  categoryAccessAuth,
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Product description cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if manager has access to this product's category
    if (req.user.role === 'manager' && !req.user.managedCategories.includes(product.category)) {
      return res.status(403).json({ 
        message: 'Access denied. You do not have permission to edit this product.' 
      });
    }
    
    const updateData = { ...req.body };
    
    // Handle category change
    if (updateData.category) {
      const categoryDoc = await Category.findOne({ name: updateData.category });
      if (!categoryDoc) {
        return res.status(400).json({ message: 'Category not found' });
      }
      
      // Check if manager has access to the new category
      if (req.user.role === 'manager' && !req.user.managedCategories.includes(categoryDoc._id)) {
        return res.status(403).json({ 
          message: 'Access denied. You do not have permission to move products to this category.' 
        });
      }
      
      updateData.category = categoryDoc._id;
      updateData.categorySlug = categoryDoc.slug;
    }
    
    // Handle slug regeneration if name changed
    if (updateData.name && updateData.name !== product.name) {
      const slug = updateData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');
      let finalSlug = slug;
      let counter = 1;
      while (await Product.findOne({ slug: finalSlug, _id: { $ne: product._id } })) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      updateData.slug = finalSlug;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// @route   DELETE /api/manager/products/:id
// @desc    Delete product (within manager's categories)
// @access  Private (Manager/Admin)
router.delete('/products/:id', managerAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if manager has access to this product's category
    if (req.user.role === 'manager' && !req.user.managedCategories.includes(product.category)) {
      return res.status(403).json({ 
        message: 'Access denied. You do not have permission to delete this product.' 
      });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// @route   GET /api/manager/profile
// @desc    Get manager profile with managed categories
// @access  Private (Manager/Admin)
router.get('/profile', managerAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('managedCategories', 'name slug icon')
      .select('-password');
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching manager profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

module.exports = router;

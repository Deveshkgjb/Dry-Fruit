const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { parentCategory, isActive } = req.query;
    const filter = {};
    
    if (parentCategory) filter.parentCategory = parentCategory;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const categories = await Category.find(filter)
      .sort({ sortOrder: 1, name: 1 });
    
    res.json({
      success: true,
      categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Get products count for this category
    const productCount = await Product.countDocuments({ 
      categorySlug: req.params.slug, 
      isActive: true 
    });
    
    res.json({
      success: true,
      category: {
        ...category.toObject(),
        productCount
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
});

// Create new category (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      icon,
      parentCategory,
      healthBenefits,
      usageTips,
      nutritionalInfo,
      metaTitle,
      metaDescription
    } = req.body;
    
    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    const category = new Category({
      name,
      slug,
      description,
      icon: icon || '🍇',
      parentCategory,
      healthBenefits: healthBenefits || [],
      usageTips: usageTips || [],
      nutritionalInfo: nutritionalInfo || {},
      metaTitle: metaTitle || name,
      metaDescription: metaDescription || description
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
});

// Update category (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      icon,
      parentCategory,
      isActive,
      sortOrder,
      healthBenefits,
      usageTips,
      nutritionalInfo,
      metaTitle,
      metaDescription
    } = req.body;
    
    const updateData = {
      description,
      icon,
      parentCategory,
      isActive,
      sortOrder,
      healthBenefits,
      usageTips,
      nutritionalInfo,
      metaTitle,
      metaDescription
    };
    
    // Update name and slug if provided
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
});

// Delete category (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has products
    const productCount = await Product.countDocuments({ 
      categorySlug: category.slug 
    });
    
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products. Please move or delete products first.`
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
});

// Bulk operations (Admin only)
router.post('/bulk', auth, async (req, res) => {
  try {
    const { operation, categoryIds, data } = req.body;
    
    if (!['update', 'delete', 'activate', 'deactivate'].includes(operation)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation'
      });
    }
    
    let result;
    
    switch (operation) {
      case 'update':
        result = await Category.updateMany(
          { _id: { $in: categoryIds } },
          data
        );
        break;
      case 'delete':
        // Check for products before deleting
        const productsExist = await Product.countDocuments({
          categorySlug: { $in: categoryIds }
        });
        if (productsExist > 0) {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete categories that have products'
          });
        }
        result = await Category.deleteMany({ _id: { $in: categoryIds } });
        break;
      case 'activate':
        result = await Category.updateMany(
          { _id: { $in: categoryIds } },
          { isActive: true }
        );
        break;
      case 'deactivate':
        result = await Category.updateMany(
          { _id: { $in: categoryIds } },
          { isActive: false }
        );
        break;
    }
    
    res.json({
      success: true,
      message: `Bulk ${operation} completed successfully`,
      modifiedCount: result.modifiedCount || result.deletedCount
    });
  } catch (error) {
    console.error('Error in bulk operation:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk operation failed',
      error: error.message
    });
  }
});

module.exports = router;

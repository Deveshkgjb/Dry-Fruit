const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalReviews,
      pendingReviews,
      monthlyOrders,
      topProducts,
      recentOrders
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ status: 'Active' }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $nin: ['cancelled', 'returned'] } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            revenue: { $sum: '$pricing.total' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Product.find({ status: 'Active' })
        .sort({ salesCount: -1 })
        .limit(5)
        .select('name salesCount rating category'),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderNumber user pricing.total status createdAt')
    ]);

    // Calculate growth rates (simplified - comparing last 30 days vs previous 30 days)
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const previous30Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const [currentPeriodStats, previousPeriodStats] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenue: { $sum: '$pricing.total' }
          }
        }
      ]),
      Order.aggregate([
        { 
          $match: { 
            createdAt: { 
              $gte: previous30Days, 
              $lt: last30Days 
            } 
          } 
        },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenue: { $sum: '$pricing.total' }
          }
        }
      ])
    ]);

    const currentOrders = currentPeriodStats[0]?.orders || 0;
    const previousOrders = previousPeriodStats[0]?.orders || 0;
    const currentRevenue = currentPeriodStats[0]?.revenue || 0;
    const previousRevenue = previousPeriodStats[0]?.revenue || 0;

    const orderGrowth = previousOrders > 0 ? 
      ((currentOrders - previousOrders) / previousOrders * 100).toFixed(1) : 0;
    const revenueGrowth = previousRevenue > 0 ? 
      ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0;

    res.json({
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        totalReviews,
        pendingReviews
      },
      growth: {
        orderGrowth: parseFloat(orderGrowth),
        revenueGrowth: parseFloat(revenueGrowth)
      },
      charts: {
        monthlyOrders,
        topProducts
      },
      recentActivity: {
        recentOrders
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard statistics' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      role, 
      isActive 
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, totalCount] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalUsers: totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private/Admin
router.put('/users/:id/status', [
  adminAuth,
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private/Admin
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get total counts
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts,
      monthlyData,
      categoryData,
      recentActivity
    ] = await Promise.all([
      // Total Orders
      Order.countDocuments(),
      
      // Total Revenue
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      
      // Total Customers
      User.countDocuments({ role: 'customer' }),
      
      // Total Products
      Product.countDocuments({ isActive: true }),
      
      // Recent Orders (last 10)
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Top Products
      Product.aggregate([
        { $match: { isActive: true } },
        { $sort: { 'rating.average': -1 } },
        { $limit: 5 },
        { $project: { name: 1, 'rating.average': 1, 'rating.count': 1 } }
      ]),
      
      // Monthly Data (last 6 months)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$pricing.total' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 6 }
      ]),
      
      // Category Data
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Recent Activity
      Order.find()
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue[0]?.total || 0) / totalOrders) : 0;
    
    // Format monthly data
    const formattedMonthlyData = monthlyData.map(item => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
      revenue: item.revenue,
      orders: item.orders
    }));

    // Format category data
    const formattedCategoryData = categoryData.map(item => ({
      category: item._id?.name || 'Unknown',
      percentage: Math.round((item.count / totalProducts) * 100),
      color: 'bg-blue-500'
    }));

    // Format recent activity
    const formattedRecentActivity = recentActivity.map(order => ({
      title: `New order #${order.orderNumber}`,
      description: `₹${order.pricing.total} • ${order.user?.name || 'Customer'}`,
      color: 'bg-green-500'
    }));

    // Format top products
    const formattedTopProducts = topProducts.map(product => ({
      name: product.name,
      sales: product.rating?.count || 0,
      revenue: Math.round((product.rating?.count || 0) * 500) // Estimated revenue
    }));

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      avgOrderValue,
      totalCustomers,
      monthlyGrowth: 15.2, // This would be calculated based on previous month
      customerRetention: 68.5, // This would be calculated based on user data
      topProducts: formattedTopProducts,
      monthlyData: formattedMonthlyData,
      categoryData: formattedCategoryData,
      recentActivity: formattedRecentActivity
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// @route   GET /api/admin/inventory
// @desc    Get inventory status
// @access  Private/Admin
router.get('/inventory', adminAuth, async (req, res) => {
  try {
    const products = await Product.find({ status: 'Active' })
      .select('name category sizes salesCount')
      .sort({ 'sizes.stock': 1 });

    const lowStockProducts = products.filter(product => 
      product.sizes.some(size => size.stock < 10)
    );

    const outOfStockProducts = products.filter(product => 
      product.sizes.some(size => size.stock === 0)
    );

    const inventoryStats = await Product.aggregate([
      { $match: { status: 'Active' } },
      { $unwind: '$sizes' },
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$sizes.stock' },
          averageStock: { $avg: '$sizes.stock' }
        }
      }
    ]);

    res.json({
      inventoryStats,
      lowStockProducts,
      outOfStockProducts,
      alerts: {
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length
      }
    });
  } catch (error) {
    console.error('Inventory error:', error);
    res.status(500).json({ message: 'Server error fetching inventory data' });
  }
});

// @route   POST /api/admin/bulk-update-products
// @desc    Bulk update product prices or stock
// @access  Private/Admin
router.post('/bulk-update-products', [
  adminAuth,
  body('products').isArray({ min: 1 }).withMessage('Products array is required'),
  body('updateType').isIn(['price', 'stock', 'status']).withMessage('Invalid update type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { products, updateType } = req.body;
    const results = [];

    for (const productUpdate of products) {
      try {
        const product = await Product.findById(productUpdate.id);
        if (!product) {
          results.push({ id: productUpdate.id, status: 'error', message: 'Product not found' });
          continue;
        }

        if (updateType === 'price') {
          // Update prices for specific sizes
          if (productUpdate.sizes) {
            productUpdate.sizes.forEach(sizeUpdate => {
              const sizeIndex = product.sizes.findIndex(s => s.size === sizeUpdate.size);
              if (sizeIndex !== -1) {
                if (sizeUpdate.price !== undefined) {
                  product.sizes[sizeIndex].price = sizeUpdate.price;
                }
                if (sizeUpdate.originalPrice !== undefined) {
                  product.sizes[sizeIndex].originalPrice = sizeUpdate.originalPrice;
                }
              }
            });
          }
        } else if (updateType === 'stock') {
          // Update stock for specific sizes
          if (productUpdate.sizes) {
            productUpdate.sizes.forEach(sizeUpdate => {
              const sizeIndex = product.sizes.findIndex(s => s.size === sizeUpdate.size);
              if (sizeIndex !== -1 && sizeUpdate.stock !== undefined) {
                product.sizes[sizeIndex].stock = sizeUpdate.stock;
              }
            });
          }
        } else if (updateType === 'status') {
          // Update product status
          if (productUpdate.status) {
            product.status = productUpdate.status;
          }
        }

        await product.save();
        results.push({ id: productUpdate.id, status: 'success', message: 'Updated successfully' });
      } catch (error) {
        results.push({ id: productUpdate.id, status: 'error', message: error.message });
      }
    }

    res.json({
      message: 'Bulk update completed',
      results,
      summary: {
        total: products.length,
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'error').length
      }
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error during bulk update' });
  }
});

module.exports = router;

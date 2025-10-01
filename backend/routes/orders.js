const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders or all orders (Admin)
// @access  Private
router.get('/', [
  auth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      page = 1,
      limit = 10,
      status,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    // If not admin, only show user's orders
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }
    
    if (status) filter.status = status;

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .populate('items.product', 'name images category')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders: totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// @route   POST /api/orders/draft
// @desc    Save a draft order (incomplete order with basic info)
// @access  Public (for guest orders) / Private (for authenticated users)
router.post('/draft', [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.size').notEmpty().withMessage('Product size is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.phone').notEmpty().withMessage('Shipping phone is required')
], async (req, res) => {
  try {
    console.log('Draft order creation request received:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { items, shippingAddress, paymentMethod, paymentDetails, orderNote, subtotal, shipping, total } = req.body;
    
    // Get user ID if authenticated
    const userId = req.user ? req.user._id : null;

    // Calculate pricing
    const shippingCharges = shipping || 50;
    const tax = Math.round((subtotal || 0) * 0.18);
    const finalTotal = total || (subtotal || 0) + shippingCharges + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create draft order
    const order = new Order({
      orderNumber,
      user: userId,
      items: items.map(item => ({
        product: item.product,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image
      })),
      shippingAddress: {
        name: shippingAddress.name || '',
        phone: shippingAddress.phone,
        email: shippingAddress.email || '',
        street: shippingAddress.street || shippingAddress.address || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        pincode: shippingAddress.pincode || '',
        country: shippingAddress.country || 'India'
      },
      payment: {
        method: paymentMethod || 'pending',
        status: 'pending',
        details: paymentDetails || {}
      },
      pricing: {
        subtotal: subtotal || 0,
        shippingCharges,
        tax,
        total: finalTotal
      },
      status: 'draft', // Mark as draft
      notes: orderNote || {}
    });

    await order.save();

    // Populate order for response
    await order.populate('items.product', 'name images category');

    res.status(201).json({
      success: true,
      message: 'Draft order saved successfully',
      order
    });
  } catch (error) {
    console.error('Draft order creation error:', error);
    res.status(500).json({ message: 'Server error creating draft order' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images category')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Order fetch error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order (guest or authenticated user)
// @access  Public (for guest orders) / Private (for authenticated users)
router.post('/', [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.size').notEmpty().withMessage('Product size is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Shipping phone is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('Shipping city is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('Shipping state is required'),
  body('shippingAddress.pincode').notEmpty().withMessage('Shipping pincode is required'),
  body('paymentMethod').isIn(['upi', 'card', 'netbanking', 'cod']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    console.log('Order creation request received:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { items, shippingAddress, billingAddress, paymentMethod, paymentDetails, orderNote } = req.body;
    console.log('Processing order for items:', items.length);

    // Validate and calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }

      if (!product.isActive) {
        return res.status(400).json({ message: `Product is not available: ${product.name}` });
      }

      // Find the specific size
      const sizeOption = product.sizes.find(s => s.size === item.size);
      if (!sizeOption) {
        return res.status(400).json({ message: `Size not available for product: ${product.name}` });
      }

      if (sizeOption.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name} (${item.size}). Available: ${sizeOption.stock}` 
        });
      }

      const itemTotal = sizeOption.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        size: item.size,
        quantity: item.quantity,
        price: sizeOption.price,
        originalPrice: sizeOption.originalPrice,
        image: product.images.length > 0 ? product.images[0].url : ''
      });
    }

    // Calculate shipping and tax
    const shippingCharges = subtotal >= 500 ? 0 : 50; // Free shipping above ₹500
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + shippingCharges + tax;

    // Handle user (authenticated or guest)
    let userId = null;
    if (req.user && req.user._id) {
      userId = req.user._id;
    }

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `HP${Date.now().toString().slice(-6)}${(orderCount + 1).toString().padStart(4, '0')}`;

    // Create order
    const order = new Order({
      orderNumber: orderNumber,
      user: userId,
      items: orderItems,
      shippingAddress: {
        ...shippingAddress,
        street: shippingAddress.address, // Map address to street
        zipCode: shippingAddress.pincode // Map pincode to zipCode
      },
      billingAddress: billingAddress || { ...shippingAddress, sameAsShipping: true },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'completed'
      },
      pricing: {
        subtotal,
        shippingCharges,
        tax,
        total
      },
      notes: orderNote || {}
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.updateOne(
        { 
          _id: item.product,
          'sizes.size': item.size
        },
        {
          $inc: { 
            'sizes.$.stock': -item.quantity,
            salesCount: item.quantity
          }
        }
      );
    }

    // Clear user's cart (only for authenticated users)
    if (userId) {
      await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
    }

    // Populate order for response
    await order.populate('items.product', 'name images category');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', [
  adminAuth,
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status'),
  body('note').optional().trim().isLength({ max: 500 }).withMessage('Note cannot exceed 500 characters'),
  body('tracking').optional().isObject().withMessage('Tracking must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { status, note, tracking } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    await order.updateStatus(status, note, req.user._id);

    // Update tracking information if provided
    if (tracking) {
      order.tracking = { ...order.tracking, ...tracking };
      await order.save();
    }

    // Handle stock restoration for cancelled orders
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.updateOne(
          { 
            _id: item.product,
            'sizes.size': item.size
          },
          {
            $inc: { 
              'sizes.$.stock': item.quantity,
              salesCount: -item.quantity
            }
          }
        );
      }
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

// @route   POST /api/orders/:id/cancel
// @desc    Cancel an order (User can cancel pending/confirmed orders)
// @access  Private
router.post('/:id/cancel', [
  auth,
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
], async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    // Update order status
    await order.updateStatus('cancelled', reason || 'Cancelled by customer', req.user._id);

    // Restore stock
    for (const item of order.items) {
      await Product.updateOne(
        { 
          _id: item.product,
          'sizes.size': item.size
        },
        {
          $inc: { 
            'sizes.$.stock': item.quantity,
            salesCount: -item.quantity
          }
        }
      );
    }

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Order cancellation error:', error);
    res.status(500).json({ message: 'Server error cancelling order' });
  }
});

// @route   GET /api/orders/stats/summary
// @desc    Get order statistics (Admin)
// @access  Private/Admin
router.get('/stats/summary', adminAuth, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$pricing.total' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'returned'] } } },
      {
        $group: {
          _id: null,
          total: { $sum: '$pricing.total' }
        }
      }
    ]);

    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          status: { $nin: ['cancelled', 'returned'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$pricing.total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      statusStats: stats,
      totalOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      monthlyStats
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({ message: 'Server error fetching order statistics' });
  }
});

// @route   GET /api/orders/track/:mobileNumber
// @desc    Get orders by mobile number (for order tracking)
// @access  Public
router.get('/track/:mobileNumber', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { mobileNumber } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Clean mobile number (remove spaces, dashes, etc.)
    const cleanMobileNumber = mobileNumber.replace(/\D/g, '');
    
    // Validate mobile number format (should be 10 digits)
    if (cleanMobileNumber.length !== 10) {
      return res.status(400).json({ 
        message: 'Invalid mobile number format. Please provide a 10-digit mobile number.' 
      });
    }

    // Create regex patterns for different mobile number formats
    const mobilePatterns = [
      cleanMobileNumber,
      `+91${cleanMobileNumber}`,
      `91${cleanMobileNumber}`,
      `+91 ${cleanMobileNumber}`,
      `91 ${cleanMobileNumber}`,
      `${cleanMobileNumber.slice(0, 5)} ${cleanMobileNumber.slice(5)}`,
      `${cleanMobileNumber.slice(0, 3)}-${cleanMobileNumber.slice(3, 6)}-${cleanMobileNumber.slice(6)}`
    ];

    // Build query to find orders with matching mobile numbers
    // Escape special regex characters and use exact matches
    const query = {
      $or: mobilePatterns.map(pattern => {
        // Escape special regex characters
        const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return {
          'shippingAddress.phone': { $regex: `^${escapedPattern}$`, $options: 'i' }
        };
      })
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Find orders with pagination
    const orders = await Order.find(query)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Order tracking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while tracking orders' 
    });
  }
});

module.exports = router;

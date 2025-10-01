const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

// Middleware to check if user is manager or admin
const managerAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!['admin', 'manager'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Manager or admin privileges required.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

// Middleware to check category access for managers
const categoryAccessAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role === 'admin') {
        // Admin has access to all categories
        return next();
      }
      
      if (req.user.role === 'manager') {
        const categoryId = req.params.categoryId || req.body.category;
        if (!categoryId) {
          return next(); // No specific category restriction
        }
        
        // Check if manager has access to this category
        if (!req.user.managedCategories.includes(categoryId)) {
          return res.status(403).json({ 
            message: 'Access denied. You do not have permission to manage this category.' 
          });
        }
      }
      
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

// Middleware for optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  managerAuth,
  categoryAccessAuth,
  optionalAuth
};

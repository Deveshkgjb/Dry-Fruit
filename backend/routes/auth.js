const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { sendOTPEmail, sendPasswordResetSuccessEmail, sendPasswordResetLinkEmail } = require('../utils/emailService');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Please enter a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated. Please contact support.' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'name images sizes')
      .populate('wishlist', 'name images sizes rating');

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        cart: user.cart,
        wishlist: user.wishlist,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Please enter a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, phone, address } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', [
  auth,
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Private
router.post('/verify-token', auth, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// @route   POST /api/auth/admin-login
// @desc    Admin login with role verification
// @access  Public
router.post('/admin-login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated. Please contact support.' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// @route   GET /api/auth/admin-profile
// @desc    Get admin profile
// @access  Private (Admin only)
router.get('/admin-profile', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const user = await User.findById(req.user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Admin profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching admin profile' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP via email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    console.log('🔧 STEP 5: Backend - Forgot password route hit');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ STEP 5 ERROR: Backend - Validation failed:', errors.array());
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email } = req.body;
    console.log('📧 STEP 6: Backend - Email received:', email);

    // Check if user exists
    console.log('🔍 STEP 7: Backend - Checking if user exists in database');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ STEP 7 RESULT: Backend - User not found in database');
      // Don't reveal if email exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, a password reset OTP has been sent.' 
      });
    }

    console.log('✅ STEP 7 RESULT: Backend - User found:', { email: user.email, role: user.role });

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('❌ STEP 8 ERROR: Backend - User is not admin, role:', user.role);
      return res.status(403).json({ message: 'Password reset is only available for admin accounts.' });
    }

    console.log('✅ STEP 8: Backend - User is admin, proceeding with OTP generation');
    
    // Clear any existing OTP before generating new one
    if (user.resetPasswordOTP) {
      console.log('🧹 STEP 8.5: Backend - Clearing previous OTP:', user.resetPasswordOTP);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('🔢 STEP 9: Backend - Generating NEW OTP for user');
    console.log('🔢 STEP 9: Backend - OTP generated:', otp);
    console.log('⏰ STEP 9: Backend - OTP expires at:', otpExpiry);
    console.log('🎲 STEP 9: Backend - This is a FRESH OTP - previous OTP cleared');

    // Save OTP to user
    console.log('💾 STEP 10: Backend - Saving OTP to database');
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();
    console.log('✅ STEP 10 RESULT: Backend - OTP saved to database successfully');

    // Send OTP via email
    console.log('📧 STEP 11: Backend - Calling email service to send OTP');
    const emailResult = await sendOTPEmail(email, otp, user.name);
    
    console.log('📧 STEP 11 RESULT: Backend - Email service result:', emailResult);
    
    if (emailResult.success) {
      console.log('✅ STEP 12: Backend - Email sent successfully, sending success response');
      console.log('🎉 EMAIL DELIVERY CONFIRMED! OTP email has been sent to user');
      console.log('📧 Email delivery time:', emailResult.deliveryTime + 'ms');
      console.log('📬 User should receive OTP in their inbox shortly');
      
      // OTP sent successfully to user email
      res.json({
        message: 'Password reset OTP has been sent to your email address',
        expiresIn: '10 minutes'
      });
    } else {
      console.log('❌ STEP 12 ERROR: Backend - Email sending failed:', emailResult.error);
      // Failed to send OTP email
      // Clear the OTP if email sending failed
      console.log('🧹 STEP 12 CLEANUP: Backend - Clearing OTP from database due to email failure');
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpiry = undefined;
      await user.save();
      
      res.status(500).json({ 
        message: 'Failed to send OTP email. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? emailResult.error : undefined
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error processing password reset request' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and send reset link
// @access  Public
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('otp').custom((value) => {
    const trimmedValue = value.toString().trim();
    if (!/^\d{6}$/.test(trimmedValue)) {
      throw new Error('OTP must be exactly 6 digits');
    }
    return true;
  })
], async (req, res) => {
  try {
    console.log('🔍 STEP 16: Backend - OTP verification route hit');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ STEP 16 ERROR: Backend - OTP validation failed:', errors.array());
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, otp } = req.body;
    const trimmedOtp = otp.toString().trim();
    
    console.log('🔍 STEP 17: Backend - Verifying OTP');
    console.log('📧 STEP 17: Backend - Email:', email);
    console.log('🔢 STEP 17: Backend - OTP received:', otp);
    console.log('🔢 STEP 17: Backend - OTP trimmed:', trimmedOtp);

    // Find user with valid OTP
    console.log('🔍 STEP 18: Backend - Searching for user with valid OTP in database');
    const user = await User.findOne({
      email,
      resetPasswordOTP: trimmedOtp,
      resetPasswordOTPExpiry: { $gt: new Date() }
    });

    if (!user) {
      console.log('❌ STEP 18 RESULT: Backend - No user found with valid OTP');
      console.log('❌ STEP 18 RESULT: Backend - OTP might be invalid or expired');
      return res.status(400).json({ 
        message: 'Invalid or expired OTP. Please request a new password reset.' 
      });
    }
    
    console.log('✅ STEP 18 RESULT: Backend - User found with valid OTP:', { email: user.email, role: user.role });

    // Generate reset token
    console.log('🔑 STEP 19: Backend - Generating reset token');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    console.log('🔑 STEP 19: Backend - Reset token generated');
    console.log('⏰ STEP 19: Backend - Reset token expires at:', resetTokenExpiry);

    // Save reset token to user
    console.log('💾 STEP 20: Backend - Saving reset token and clearing OTP from database');
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetTokenExpiry;
    user.resetPasswordOTP = undefined; // Clear OTP after verification
    user.resetPasswordOTPExpiry = undefined;
    await user.save();
    
    console.log('✅ STEP 20 RESULT: Backend - Reset token saved and OTP cleared successfully');

    // Return reset token for frontend to redirect to reset password page
    console.log('✅ STEP 21: Backend - OTP verified successfully, sending reset token to frontend');
    res.json({ 
      message: 'OTP verified successfully. You can now reset your password.',
      resetToken,
      redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { token, newPassword } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token. Please request a new password reset.' 
      });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    // Send success email
    await sendPasswordResetSuccessEmail(user.email, user.name);

    res.json({ 
      message: 'Password reset successfully. You can now log in with your new password.' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

module.exports = router;

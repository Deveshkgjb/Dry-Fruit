const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const PaymentSettings = require('../models/PaymentSettings');

// @route   GET /api/payment-settings
// @desc    Get current payment settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await PaymentSettings.findOne({ isActive: true });
    
    if (!settings) {
      return res.json({
        success: true,
        settings: null,
        message: 'No payment settings configured'
      });
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching payment settings' 
    });
  }
});

// @route   POST /api/payment-settings
// @desc    Create or update payment settings
// @access  Public (Admin only in production)
router.post('/', [
  body('upiId').trim().notEmpty().withMessage('UPI ID is required'),
  body('accountHolderName').trim().notEmpty().withMessage('Account holder name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      upiId,
      accountHolderName
    } = req.body;

    // Deactivate any existing settings
    await PaymentSettings.updateMany({ isActive: true }, { isActive: false });

    // Create new settings
    const newSettings = new PaymentSettings({
      upiId,
      accountHolderName,
      isActive: true
    });

    await newSettings.save();

    console.log('💳 UPI Payment settings saved:', {
      upiId,
      accountHolderName
    });

    res.status(201).json({
      success: true,
      message: 'Payment settings saved successfully',
      settings: newSettings
    });
  } catch (error) {
    console.error('Error saving payment settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error saving payment settings' 
    });
  }
});

// @route   PUT /api/payment-settings/:id
// @desc    Update existing payment settings
// @access  Public (Admin only in production)
router.put('/:id', [
  body('upiId').optional().trim().notEmpty().withMessage('UPI ID cannot be empty'),
  body('accountHolderName').optional().trim().notEmpty().withMessage('Account holder name cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const settings = await PaymentSettings.findById(req.params.id);
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Payment settings not found'
      });
    }

    const updateData = req.body;
    const updatedSettings = await PaymentSettings.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('💳 Payment settings updated:', {
      id: req.params.id,
      upiId: updatedSettings.upiId
    });

    res.json({
      success: true,
      message: 'Payment settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating payment settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating payment settings' 
    });
  }
});

// @route   DELETE /api/payment-settings/:id
// @desc    Delete payment settings
// @access  Public (Admin only in production)
router.delete('/:id', async (req, res) => {
  try {
    const settings = await PaymentSettings.findById(req.params.id);
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Payment settings not found'
      });
    }

    await PaymentSettings.findByIdAndDelete(req.params.id);

    console.log('💳 Payment settings deleted:', req.params.id);

    res.json({
      success: true,
      message: 'Payment settings deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting payment settings' 
    });
  }
});

module.exports = router;

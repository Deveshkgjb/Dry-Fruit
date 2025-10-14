const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
  // UPI Settings
  upiId: {
    type: String,
    required: true,
    trim: true
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Settings metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Admin who configured these settings
  configuredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one active payment settings document
paymentSettingsSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);

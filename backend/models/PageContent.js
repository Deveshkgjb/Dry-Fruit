const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  pageType: {
    type: String,
    required: true,
    enum: ['homepage', 'navbar', 'footer', 'hero', 'offerBar', 'doYouKnow']
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
pageContentSchema.index({ pageType: 1 });

module.exports = mongoose.model('PageContent', pageContentSchema);

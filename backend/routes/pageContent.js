const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const PageContent = require('../models/PageContent');

// @route   GET /api/page-content/:pageType
// @desc    Get page content by type
// @access  Public
router.get('/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    
    const pageContent = await PageContent.findOne({ pageType });
    
    if (!pageContent) {
      // Return default content if not found
      const defaultContent = getDefaultContent(pageType);
      return res.json({
        pageType,
        content: defaultContent,
        lastUpdated: new Date(),
        updatedBy: 'system'
      });
    }
    
    res.json(pageContent);
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ message: 'Server error fetching page content' });
  }
});

// @route   PUT /api/page-content/:pageType
// @desc    Update page content by type
// @access  Public (for admin panel)
router.put('/:pageType', [
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { pageType } = req.params;
    const { content } = req.body;
    
    // Validate pageType
    const validPageTypes = ['homepage', 'navbar', 'footer', 'hero', 'offerBar', 'doYouKnow'];
    if (!validPageTypes.includes(pageType)) {
      return res.status(400).json({ message: 'Invalid page type' });
    }
    
    // Find existing content or create new
    let pageContent = await PageContent.findOne({ pageType });
    
    if (pageContent) {
      // Update existing
      pageContent.content = content;
      pageContent.lastUpdated = new Date();
      pageContent.updatedBy = 'admin';
      await pageContent.save();
    } else {
      // Create new
      pageContent = new PageContent({
        pageType,
        content,
        lastUpdated: new Date(),
        updatedBy: 'admin'
      });
      await pageContent.save();
    }
    
    console.log(`✅ Page content updated for ${pageType}:`, pageContent);
    
    res.json({
      success: true,
      message: `${pageType} content updated successfully`,
      data: pageContent
    });
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({ message: 'Server error updating page content' });
  }
});

// @route   GET /api/page-content
// @desc    Get all page content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const allPageContent = await PageContent.find({}).sort({ pageType: 1 });
    
    // Convert to object format for easier frontend consumption
    const contentObject = {};
    allPageContent.forEach(page => {
      contentObject[page.pageType] = page.content;
    });
    
    // Add default content for missing page types
    const validPageTypes = ['homepage', 'navbar', 'footer', 'hero', 'offerBar', 'doYouKnow'];
    validPageTypes.forEach(pageType => {
      if (!contentObject[pageType]) {
        contentObject[pageType] = getDefaultContent(pageType);
      }
    });
    
    res.json({
      success: true,
      data: contentObject
    });
  } catch (error) {
    console.error('Error fetching all page content:', error);
    res.status(500).json({ message: 'Server error fetching page content' });
  }
});

// Helper function to get default content
function getDefaultContent(pageType) {
  const defaults = {
    navbar: {
      logo: {
        image: "/logo.avif",
        alt: "Happilo Logo"
      },
      searchPlaceholder: "Search for dry fruits, nuts, and more...",
      menuItems: [
        { label: "Home", url: "/" },
        { label: "Products", url: "/products" },
        { label: "Categories", url: "/categories" },
        { label: "About", url: "/about" },
        { label: "Contact", url: "/contact" }
      ]
    },
    homepage: {
      hero: {
        title: "Premium Quality Dry Fruits & Nuts",
        subtitle: "Delicious, nutritious, and delivered fresh to your doorstep",
        backgroundImage: "/hero-bg.jpg",
        ctaText: "Shop Now",
        ctaUrl: "/products"
      },
      doYouKnow: {
        title: "Did You Know?",
        subtitle: "Amazing facts about our premium dry fruits",
        facts: [
          "Almonds contain more calcium than any other nut",
          "Walnuts are the only nut with significant amounts of omega-3 fatty acids",
          "Cashews are actually seeds, not nuts!",
          "Pistachios help reduce cholesterol levels"
        ]
      }
    },
    footer: {
      companyName: "Happilo",
      description: "Your trusted source for premium quality dry fruits and nuts",
      socialLinks: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        youtube: "#"
      },
      quickLinks: [
        { label: "About Us", url: "/about" },
        { label: "Contact", url: "/contact" },
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms of Service", url: "/terms" }
      ]
    }
  };
  
  return defaults[pageType] || {};
}

module.exports = router;

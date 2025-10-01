// Page Content API - for managing page content
import config from '../config/environment.js';

const API_BASE_URL = config.API_BASE_URL;

// Mock data for development
const mockPageContent = {
  homepage: {
    hero: {
      title: "Premium Dry Fruits & Nuts",
      subtitle: "Discover the finest selection of premium dry fruits and nuts",
      backgroundImage: "/dry.png",
      ctaText: "Shop Now",
      ctaLink: "/shop"
    },
    offerBar: {
      text: "Free shipping on orders above ₹499",
      backgroundColor: "#10B981",
      textColor: "#FFFFFF"
    },
    doYouKnow: {
      title: "Do You Know?",
      subtitle: "Amazing facts about dry fruits",
      facts: [
        {
          icon: "🥜",
          title: "Rich in Nutrients",
          description: "Dry fruits are packed with essential vitamins and minerals"
        },
        {
          icon: "💪",
          title: "Energy Boost",
          description: "Natural source of instant energy for your daily activities"
        },
        {
          icon: "❤️",
          title: "Heart Healthy",
          description: "Regular consumption supports cardiovascular health"
        },
        {
          icon: "🧠",
          title: "Brain Food",
          description: "Improves memory and cognitive function"
        },
        {
          icon: "🛡️",
          title: "Immune Support",
          description: "Strengthens your immune system naturally"
        },
        {
          icon: "⚡",
          title: "Quick Snack",
          description: "Perfect healthy snack for busy lifestyles"
        }
      ]
    },
    footer: {
      sections: {
        trackOrder: {
          title: "Track My Order",
          links: ["Order Status", "Shipping Info", "Delivery Updates"]
        },
        terms: {
          title: "Terms & Policies",
          links: ["Privacy Policy", "Terms of Service", "Return Policy", "Shipping Policy"]
        },
        updates: {
          title: "Updates",
          links: ["Newsletter", "Product Updates", "Special Offers"]
        },
        help: {
          title: "Help",
          links: ["FAQ", "Contact Us", "Live Chat", "Support Center"]
        },
        about: {
          title: "About",
          links: ["Our Story", "Quality Promise", "Sustainability", "Careers"]
        }
      },
      newsletter: {
        title: "Stay Updated",
        description: "Subscribe to our newsletter for latest offers and updates",
        placeholder: "Enter your email"
      },
      socialMedia: {
        facebook: "https://facebook.com/happilo",
        instagram: "https://instagram.com/happilo",
        twitter: "https://twitter.com/happilo",
        youtube: "https://youtube.com/happilo"
      },
      paymentMethods: ["Visa", "Mastercard", "PayPal", "UPI", "Net Banking"],
      copyright: "© 2024 Happilo. All rights reserved."
    }
  },
  navbar: {
    logo: {
      image: "/logo.avif",
      alt: "Happilo Logo"
    },
    searchPlaceholder: "Search For Hazelnut",
    categories: {
      nuts: {
        title: "🥜 Nuts",
        items: ["Almonds", "Cashews", "Pistachios", "Walnuts", "Brazil Nuts", "Peanuts"]
      },
      driedFruits: {
        title: "🍇 Dried Fruits",
        items: ["Raisins", "Anjeer (Figs)", "Apricots", "Prunes", "Kiwi", "Mango"]
      },
      berries: {
        title: "🍓 Berries",
        items: ["Blueberries", "Cranberries", "Strawberries"]
      },
      dates: {
        title: "🌴 Dates",
        items: ["Omani", "Queen Kalmi", "Arabian", "Ajwa"]
      },
      seeds: {
        title: "🌱 Seeds",
        items: ["Chia Seeds", "Flax Seeds", "Pumpkin Seeds", "Sunflower Seeds"]
      },
      mixes: {
        title: "🥗 Mixes",
        items: ["Fitness Mix", "Roasted Party Mix", "Nuts & Berries Mix", "Berries Mix", "Champion Mix", "Nutty Trail Mix", "Seeds Mix"]
      },
      newLaunches: {
        title: "🆕 New Launches",
        items: ["Peanut Butter", "Party Snacks", "GameFul Corn Nuts"]
      }
    },
    navigation: ["New Launches", "Combos", "Gifts"]
  },
  cart: {
    title: "Cart",
    freeShippingMessage: "You are eligible for free shipping.",
    emptyCart: {
      title: "Your cart is empty",
      description: "Looks like you haven't added any items to your cart yet.",
      ctaText: "Continue Shopping"
    },
    shipping: {
      title: "Estimate shipping",
      fields: {
        country: "Country",
        province: "Province",
        zipCode: "Zip code"
      },
      buttonText: "Estimate"
    },
    orderSummary: {
      title: "Order Summary",
      subtotal: "Subtotal",
      total: "Total",
      taxNote: "Tax included. Shipping calculated at checkout.",
      orderNote: "Order note",
      checkoutButton: "Checkout",
      deliveryCheck: {
        title: "Check if we ship/deliver to your address.",
        placeholder: "Your ZIP/Postal Code",
        buttonText: "Check"
      }
    }
  }
};

// Helper function to make API requests
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (config.IS_DEVELOPMENT) {
      console.error('API request failed:', error);
    }
    throw error;
  }
};

// Page Content API
export const pageAPI = {
  // Get all page content
  getAllPages: async () => {
    try {
      if (config.IS_DEVELOPMENT) {
        // Return mock data for development
        return mockPageContent;
      }
      return await makeRequest('/pages');
    } catch (error) {
      console.error('Error fetching page content:', error);
      return mockPageContent;
    }
  },

  // Get specific page content
  getPageContent: async (pageId) => {
    try {
      if (config.IS_DEVELOPMENT) {
        return mockPageContent[pageId] || {};
      }
      return await makeRequest(`/pages/${pageId}`);
    } catch (error) {
      console.error('Error fetching page content:', error);
      return mockPageContent[pageId] || {};
    }
  },

  // Update page content
  updatePageContent: async (pageId, sectionId, content) => {
    try {
      if (config.IS_DEVELOPMENT) {
        // Simulate API call
        console.log('Updating page content:', { pageId, sectionId, content });
        return { success: true, message: 'Content updated successfully' };
      }
      
      return await makeRequest(`/pages/${pageId}/${sectionId}`, {
        method: 'PUT',
        body: JSON.stringify(content),
      });
    } catch (error) {
      console.error('Error updating page content:', error);
      throw error;
    }
  },

  // Update entire page
  updatePage: async (pageId, content) => {
    try {
      if (config.IS_DEVELOPMENT) {
        console.log('Updating entire page:', { pageId, content });
        return { success: true, message: 'Page updated successfully' };
      }
      
      return await makeRequest(`/pages/${pageId}`, {
        method: 'PUT',
        body: JSON.stringify(content),
      });
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  },

  // Get page sections
  getPageSections: async (pageId) => {
    try {
      if (config.IS_DEVELOPMENT) {
        const pageContent = mockPageContent[pageId] || {};
        return Object.keys(pageContent);
      }
      return await makeRequest(`/pages/${pageId}/sections`);
    } catch (error) {
      console.error('Error fetching page sections:', error);
      return [];
    }
  },

  // Preview page content
  previewPage: async (pageId, content) => {
    try {
      if (config.IS_DEVELOPMENT) {
        console.log('Previewing page:', { pageId, content });
        return { success: true, previewUrl: `/preview/${pageId}` };
      }
      
      return await makeRequest(`/pages/${pageId}/preview`, {
        method: 'POST',
        body: JSON.stringify(content),
      });
    } catch (error) {
      console.error('Error previewing page:', error);
      throw error;
    }
  },

  // Product Page Management
  createProductPage: async (productData) => {
    try {
      if (config.IS_DEVELOPMENT) {
        console.log('Creating new product page:', productData);
        
        // Store in localStorage for persistence
        const existingPages = JSON.parse(localStorage.getItem('productPages') || '[]');
        const newPage = {
          id: Date.now().toString(),
          ...productData,
          route: productData.route || `/${productData.name.toLowerCase().replace(/\s+/g, '-')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        existingPages.push(newPage);
        localStorage.setItem('productPages', JSON.stringify(existingPages));
        
        return { 
          success: true, 
          message: 'Product page created successfully',
          product: newPage
        };
      }
      
      return await makeRequest('/pages/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Error creating product page:', error);
      throw error;
    }
  },

  getProductPages: async () => {
    try {
      if (config.IS_DEVELOPMENT) {
        // Get from localStorage
        const pages = JSON.parse(localStorage.getItem('productPages') || '[]');
        return { 
          success: true, 
          pages 
        };
      }
      
      return await makeRequest('/pages/products');
    } catch (error) {
      console.error('Error fetching product pages:', error);
      throw error;
    }
  },

  updateProductPage: async (productName, productData) => {
    try {
      if (config.IS_DEVELOPMENT) {
        console.log('Updating product page:', { productName, productData });
        
        // Update in localStorage
        const existingPages = JSON.parse(localStorage.getItem('productPages') || '[]');
        const updatedPages = existingPages.map(page => 
          page.name === productName 
            ? { ...page, ...productData, updatedAt: new Date().toISOString() }
            : page
        );
        localStorage.setItem('productPages', JSON.stringify(updatedPages));
        
        return { 
          success: true, 
          message: 'Product page updated successfully' 
        };
      }
      
      return await makeRequest(`/pages/products/${encodeURIComponent(productName)}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Error updating product page:', error);
      throw error;
    }
  },

  updateProductContent: async (productName, contentData) => {
    try {
      if (config.IS_DEVELOPMENT) {
        console.log('Updating product content:', { productName, contentData });
        return { 
          success: true, 
          message: 'Product content updated successfully',
          content: {
            ...contentData,
            updatedAt: new Date().toISOString()
          }
        };
      }
      
      return await makeRequest(`/pages/products/${encodeURIComponent(productName)}/content`, {
        method: 'PUT',
        body: JSON.stringify(contentData),
      });
    } catch (error) {
      console.error('Error updating product content:', error);
      throw error;
    }
  },

  getProductPage: async (productName) => {
    try {
      if (config.IS_DEVELOPMENT) {
        console.log('Getting product page:', productName);
        
        // Sample product data for different categories
        const sampleProducts = {
          'Almonds': [
            { id: '1', name: 'Premium California Almonds', description: 'Premium quality California almonds, rich in protein and healthy fats', price: 299, weight: '250g', image: '/almonds-250g.jpg', isBestSeller: true, isPopular: true, stock: 50, tags: ['premium', 'california', 'protein'] },
            { id: '2', name: 'Organic Raw Almonds', description: 'Certified organic raw almonds, perfect for snacking', price: 399, weight: '500g', image: '/almonds-500g.jpg', isBestSeller: false, isPopular: true, stock: 30, tags: ['organic', 'raw', 'healthy'] },
            { id: '3', name: 'Roasted Salted Almonds', description: 'Perfectly roasted and salted almonds for a delicious crunch', price: 349, weight: '250g', image: '/almonds-roasted.jpg', isBestSeller: true, isPopular: false, stock: 40, tags: ['roasted', 'salted', 'crunchy'] },
            { id: '4', name: 'Almond Flour', description: 'Fine ground almond flour for baking and cooking', price: 499, weight: '1kg', image: '/almond-flour.jpg', isBestSeller: false, isPopular: false, stock: 20, tags: ['flour', 'baking', 'gluten-free'] },
            { id: '5', name: 'Almond Butter', description: 'Creamy natural almond butter, no added sugar', price: 599, weight: '500g', image: '/almond-butter.jpg', isBestSeller: false, isPopular: true, stock: 25, tags: ['butter', 'natural', 'sugar-free'] }
          ],
          'Cashews': [
            { id: '6', name: 'Premium Cashew Nuts', description: 'Premium quality cashew nuts, creamy and delicious', price: 399, weight: '250g', image: '/cashews-250g.jpg', isBestSeller: true, isPopular: true, stock: 45, tags: ['premium', 'creamy', 'delicious'] },
            { id: '7', name: 'Raw Cashew Kernels', description: 'Raw cashew kernels, perfect for cooking and snacking', price: 449, weight: '500g', image: '/cashews-500g.jpg', isBestSeller: false, isPopular: true, stock: 35, tags: ['raw', 'kernels', 'cooking'] },
            { id: '8', name: 'Roasted Cashews', description: 'Lightly roasted cashews for enhanced flavor', price: 379, weight: '250g', image: '/cashews-roasted.jpg', isBestSeller: true, isPopular: false, stock: 30, tags: ['roasted', 'flavor', 'snack'] }
          ],
          'Pistachios': [
            { id: '9', name: 'Premium Pistachio Nuts', description: 'Premium quality pistachio nuts, naturally green and flavorful', price: 499, weight: '250g', image: '/pistachios-250g.jpg', isBestSeller: true, isPopular: true, stock: 40, tags: ['premium', 'green', 'flavorful'] },
            { id: '10', name: 'Shelled Pistachios', description: 'Convenient shelled pistachios, ready to eat', price: 599, weight: '250g', image: '/pistachios-shelled.jpg', isBestSeller: false, isPopular: true, stock: 25, tags: ['shelled', 'convenient', 'ready-to-eat'] }
          ]
        };
        
        // Return mock data for development
        return {
          name: productName,
          category: productName === 'Almonds' || productName === 'Cashews' || productName === 'Pistachios' || productName === 'Walnuts' || productName === 'Brazil Nuts' || productName === 'Peanuts' ? 'Nuts' : 'Dried Fruits',
          route: `/${productName.toLowerCase().replace(' ', '-')}`,
          description: `Premium ${productName}`,
          pageTitle: `${productName} - Premium Quality`,
          metaDescription: `Buy premium ${productName} online. High quality, fresh, and nutritious.`,
          heroImage: '/placeholder-hero.jpg',
          educationalContent: `Learn about the benefits of ${productName}.`,
          pageHeader: `${productName} Collection`,
          pageSubtitle: `Discover our finest selection of premium ${productName}`,
          benefits: `Rich in nutrients, natural energy source, heart healthy.`,
          usageInstructions: 'Enjoy as a healthy snack or add to your favorite recipes.',
          storageInstructions: 'Store in a cool, dry place in an airtight container.',
          nutritionalInfo: 'High in protein, fiber, and essential vitamins.',
          ctaText: `Shop Premium ${productName} Now`,
          products: sampleProducts[productName] || []
        };
      }
      
      return await makeRequest(`/pages/products/${encodeURIComponent(productName)}`);
    } catch (error) {
      console.error('Error getting product page:', error);
      throw error;
    }
  },

  deleteProductPage: async (productName) => {
    try {
      if (config.IS_DEVELOPMENT) {
        console.log('Deleting product page:', productName);
        return { 
          success: true, 
          message: 'Product page deleted successfully'
        };
      }
      
      return await makeRequest(`/pages/products/${encodeURIComponent(productName)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting product page:', error);
      throw error;
    }
  },

  getAllProductPages: async () => {
    try {
      if (config.IS_DEVELOPMENT) {
        console.log('Getting all product pages');
        // Return mock data for development
        return [
          { name: 'Almonds', category: 'Nuts', route: '/almonds', description: 'Premium California Almonds' },
          { name: 'Cashews', category: 'Nuts', route: '/cashews', description: 'Premium Cashew Nuts' },
          { name: 'Pistachios', category: 'Nuts', route: '/pistachios', description: 'Premium Pistachio Nuts' },
          { name: 'Walnuts', category: 'Nuts', route: '/walnuts', description: 'Premium Walnut Kernels' },
          { name: 'Brazil Nuts', category: 'Nuts', route: '/brazil-nuts', description: 'Premium Brazil Nuts' },
          { name: 'Peanuts', category: 'Nuts', route: '/peanuts', description: 'Premium Peanut Kernels' },
          { name: 'Raisins', category: 'Dried Fruits', route: '/raisins', description: 'Premium Black Raisins' },
          { name: 'Anjeer', category: 'Dried Fruits', route: '/anjeer', description: 'Premium Anjeer (Figs)' },
          { name: 'Apricots', category: 'Dried Fruits', route: '/apricots', description: 'Premium Dried Apricots' },
          { name: 'Prunes', category: 'Dried Fruits', route: '/prunes', description: 'Premium Dried Prunes' },
          { name: 'Kiwi', category: 'Dried Fruits', route: '/kiwi', description: 'Premium Dried Kiwi' },
          { name: 'Mango', category: 'Dried Fruits', route: '/mango', description: 'Premium Dried Mango' }
        ];
      }
      
      return await makeRequest('/pages/products');
    } catch (error) {
      console.error('Error getting all product pages:', error);
      throw error;
    }
  }
};

export default pageAPI;

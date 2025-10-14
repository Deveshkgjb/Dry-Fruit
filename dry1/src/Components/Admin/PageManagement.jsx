import React, { useState, useEffect } from 'react';
import { useNotification } from '../Common/NotificationProvider.jsx';
import { pageAPI } from '../../services/pageAPI.js';
import { uploadAPI } from '../../services/api.js';

const PageManagement = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});
  const { showSuccess, showError } = useNotification();

  const [pageContent, setPageContent] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('homepage');
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [logoRefreshKey, setLogoRefreshKey] = useState(0);

  // Load page content on component mount
  useEffect(() => {
    loadPageContent();
  }, []);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading page content...');
      
      const content = await pageAPI.getAllPages();
      
      console.log('📄 Page content loaded:', content);
      console.log('📄 Navbar content:', content.navbar);
      console.log('📄 Navbar search placeholder:', content.navbar?.searchPlaceholder);
      console.log('📄 Navbar categories:', content.navbar?.categories);
      
      // Ensure navbar data is available with fallbacks
      const enhancedContent = {
        ...content,
        navbar: {
          logo: { image: "/logo.avif", alt: "Mufindryfruit Logo" },
          searchPlaceholder: "Search For Hazelnut",
          categories: {
            nuts: {
              title: "🥜 Nuts",
              items: ["Almonds", "Cashews", "Pistachios", "Walnuts", "Brazil Nuts", "Peanuts", "devesh"]
            },
            driedFruits: {
              title: "🍇 Dried Fruits", 
              items: ["Raisins", "Anjeer (Figs)", "Apricots", "Prunes", "Kiwi", "Mango", "Raghu"]
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
              title: "🌿 Mixes",
              items: ["Fitness Mix", "Roasted Party Mix", "Tropical Mix"]
            }
          },
          ...content.navbar
        }
      };
      
      console.log('📄 Enhanced content with fallbacks:', enhancedContent.navbar);
      
      setPageContent(enhancedContent);
      
      
    } catch (error) {
      console.error('Error loading page content:', error);
      showError('Failed to load page content, using fallback data');
      // Use fallback data when API fails
      setPageContent(fallbackPageContent);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data if API fails
  const fallbackPageContent = {
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
          facebook: "https://facebook.com/mufindryfruit",
          instagram: "https://instagram.com/mufindryfruit",
          twitter: "https://twitter.com/mufindryfruit",
          youtube: "https://youtube.com/mufindryfruit"
        },
        paymentMethods: ["Visa", "Mastercard", "PayPal", "UPI", "Net Banking"],
        copyright: "© 2024 Mufindryfruit. All rights reserved."
      }
    },
    navbar: {
      logo: {
        image: "/logo.avif",
        alt: "Mufindryfruit Logo"
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
      },
      navigation: ["Combos"]
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

  const tabs = [
    { id: 'homepage', name: 'Homepage', icon: '🏠', description: 'Manage homepage content and sections' },
    { id: 'navbar', name: 'Navigation', icon: '🧭', description: 'Configure navigation menu and categories' },
    { id: 'cart', name: 'Cart Page', icon: '🛒', description: 'Customize cart page layout and content' },
    { id: 'admin-pages', name: 'Admin Pages', icon: '⚙️', description: 'Configure admin dashboard settings' }
  ];

  const categories = [
    {
      id: 'homepage',
      name: 'Homepage Management',
      icon: '🏠',
      description: 'Manage homepage content, hero section, offers, and featured content',
      color: 'blue',
      features: ['Hero Section', 'Offer Bars', 'Featured Products', 'Educational Content', 'Footer']
    },
    {
      id: 'navigation',
      name: 'Navigation & Menu',
      icon: '🧭',
      description: 'Configure navigation menu, categories, and site structure',
      color: 'green',
      features: ['Main Menu', 'Category Dropdowns', 'Search Bar', 'User Account', 'Cart Icon']
    },
    {
      id: 'products',
      name: 'Product Management',
      icon: '📦',
      description: 'Manage product categories, individual products, and inventory',
      color: 'purple',
      features: ['Product Categories', 'Individual Products', 'Pricing', 'Inventory', 'Product Images']
    },
    {
      id: 'cart',
      name: 'Cart & Checkout',
      icon: '🛒',
      description: 'Customize cart page, checkout process, and order management',
      color: 'orange',
      features: ['Cart Layout', 'Checkout Process', 'Shipping Options', 'Payment Methods', 'Order Summary']
    },
    {
      id: 'admin',
      name: 'Admin Dashboard',
      icon: '⚙️',
      description: 'Configure admin panel settings, user management, and system preferences',
      color: 'red',
      features: ['User Management', 'System Settings', 'Analytics', 'Reports', 'Backup']
    }
  ];

  const handleEdit = async (section, data) => {
    console.log('🔧 handleEdit called:', { section, data });

    // Set default data for sections that might not have data
    let defaultData = data;
    if (!data) {
      if (section === 'search') {
        defaultData = { placeholder: '' };
      } else if (section === 'categories') {
        defaultData = {};
      } else if (section === 'doYouKnow') {
        defaultData = {
          title: 'Do You Know?',
          subtitle: 'Amazing facts about our premium dry fruits',
          facts: [
            { icon: '🥜', title: 'Rich in Calcium', description: 'Almonds contain more calcium than any other nut' },
            { icon: '💪', title: 'Omega-3 Powerhouse', description: 'Walnuts are the only nut with significant amounts of omega-3 fatty acids' },
            { icon: '🌰', title: 'Not Actually Nuts', description: 'Cashews are actually seeds, not nuts!' },
            { icon: '❤️', title: 'Heart Healthy', description: 'Pistachios help reduce cholesterol levels' }
          ]
        };
      } else {
        showError('No data available for this section');
        return;
      }
    }
    
    // Convert string format facts to object format for doYouKnow section
    if (section === 'doYouKnow' && defaultData && defaultData.facts) {
      const icons = ["🥜", "💪", "❤️", "🧠", "🛡️", "⚡"];
      if (defaultData.facts.length > 0 && typeof defaultData.facts[0] === 'string') {
        defaultData.facts = defaultData.facts.map((factText, index) => ({
          icon: icons[index] || "📝",
          title: factText.split(':')[0] || `Fact ${index + 1}`,
          description: factText.includes(':') ? factText.split(':').slice(1).join(':').trim() : factText
        }));
      }
    }

    setEditingSection(section);
    
    setFormData(defaultData);
    
    setShowEditModal(true);
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Handle different types of saves
      if (['dashboard', 'productManagement', 'orderManagement', 'userManagement', 'analytics', 'settings'].includes(editingSection)) {
        // Handle admin page updates
        console.log('Updating admin page:', editingSection, formData);
        showSuccess(`Admin page "${formData.name || editingSection}" settings updated successfully!`);

        // Store admin page settings in localStorage for development
        const adminPageSettings = JSON.parse(localStorage.getItem('adminPageSettings') || '{}');
        adminPageSettings[editingSection] = formData;
        localStorage.setItem('adminPageSettings', JSON.stringify(adminPageSettings));
      } else {
        // Default page content update
        await pageAPI.updatePageContent(activeTab, editingSection, formData);
        
        // Update local state
        setPageContent(prev => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            [editingSection]: formData
          }
        }));
        
        showSuccess('Content updated successfully!');
        
        // Dispatch event to update frontend navbar if categories or logo were updated
        if (editingSection === 'categories') {
          window.dispatchEvent(new CustomEvent('categoriesUpdated'));
        }
        if (editingSection === 'logo') {
          window.dispatchEvent(new CustomEvent('pageContentUpdated'));
        }
        
        // Dispatch event to update frontend sections in real-time
        if (['doYouKnow', 'hero', 'offerBar', 'footer'].includes(editingSection)) {
          window.dispatchEvent(new CustomEvent('pageContentUpdated'));
          console.log(`🔄 Dispatched pageContentUpdated event for ${editingSection}`);
        }
      }
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving content:', error);
      showError('Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Show file info
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`🔄 Uploading file: ${file.name} (${fileSizeMB}MB, ${file.type})`);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      showError('Please select a valid image file (JPEG, PNG, GIF, WebP, or AVIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError(`File size (${fileSizeMB}MB) must be less than 5MB`);
      return;
    }

    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('image', file);

      console.log('📤 Sending logo upload request...');
      
      const response = await uploadAPI.uploadImage(formData, true); // true = isLogo
      
      console.log('📥 Upload response:', response);
      console.log('📥 Response type:', typeof response);
      console.log('📥 Response keys:', Object.keys(response || {}));
      console.log('📥 Response.success:', response?.success);
      console.log('📥 Response.imageUrl:', response?.imageUrl);
      console.log('📥 Response.url:', response?.url);
      
      // Check if upload was successful (handle different response formats)
      if (response && (response.success === true || response.imageUrl || response.url)) {
        // Update the form data with the new image URL
        setFormData(prev => ({
          ...prev,
          image: response.imageUrl || response.url
        }));
        
        // Update the page content immediately with the new logo
        const updatedLogo = {
          ...pageContent.navbar?.logo,
          image: response.imageUrl || response.url
        };
        
        setPageContent(prev => ({
          ...prev,
          navbar: {
            ...prev.navbar,
            logo: updatedLogo
          }
        }));
        
        // Force logo refresh in admin panel
        setLogoRefreshKey(prev => prev + 1);
        
        // Save the logo to localStorage via pageAPI
        console.log('💾 Saving logo to database:', updatedLogo);
        const saveResult = await pageAPI.updatePageContent('navbar', 'logo', updatedLogo);
        console.log('✅ Logo save result:', saveResult);
        
        // Refresh the page content to show updated logo in admin panel
        setTimeout(() => {
          loadPageContent();
        }, 500);
        
        // Dispatch event to update frontend navbar immediately
        window.dispatchEvent(new CustomEvent('pageContentUpdated'));
        
        showSuccess(`🎉 Logo uploaded successfully! (${fileSizeMB}MB)`);
        console.log('✅ Logo upload completed successfully');
      } else {
        console.error('❌ Upload failed:', response);
        console.error('❌ Response structure:', JSON.stringify(response, null, 2));
        showError(response?.message || 'Failed to upload logo - no image URL received');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      console.error('❌ Error details:', error.message, error.stack);
      showError(`Failed to upload logo: ${error.message}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [index]: value
      }
    }));
  };

  const addArrayItem = (field, newItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };




  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategorySelection(false);
    setActiveTab(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setShowCategorySelection(true);
    setActiveTab('homepage');
  };

  const renderCategorySelection = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            🎛️ Page Management Dashboard
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-600">
            Select a category to manage different aspects of your website. 
            Choose from homepage content, navigation, products, cart, or admin settings.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 group-hover:border-amber-500 transition-all duration-300">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl transition-colors duration-300 bg-amber-50">
                  <span className="text-amber-600">{category.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-center group-hover:opacity-80 transition-opacity duration-300 text-gray-800">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="mb-6 text-center leading-relaxed text-gray-600">
                  {category.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-semibold mb-3 text-gray-700">Key Features:</h4>
                  {category.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full mr-3 bg-amber-500"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="w-full py-3 px-6 rounded-xl text-white font-semibold text-center transition-colors duration-300 flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700">
                  <span>Manage {category.name.split(' ')[0]}</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">🚀 Production Ready</h3>
            <p className="mb-6 text-gray-600">
              This admin panel is designed for production use with your clients. 
              All changes are automatically saved and can be easily managed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Auto-Save Changes</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>Database Integration</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHomepageContent = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: '#A47551' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#A47551' }}>Hero Section</h3>
          <button
            onClick={() => handleEdit('hero', pageContent.homepage.hero)}
            className="text-white px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#A47551' }}
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm mb-2" style={{ color: '#A47551' }}>Title:</p>
            <p className="font-medium" style={{ color: '#A47551' }}>{pageContent.homepage?.hero?.title || 'No title set'}</p>
          </div>
          <div>
            <p className="text-sm mb-2" style={{ color: '#A47551' }}>Subtitle:</p>
            <p className="font-medium" style={{ color: '#A47551' }}>{pageContent.homepage?.hero?.subtitle || 'No subtitle set'}</p>
          </div>
        </div>
      </div>

      {/* Offer Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Offer Bar</h3>
          <button
            onClick={() => handleEdit('offerBar', pageContent.homepage.offerBar)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: pageContent.homepage?.offerBar?.backgroundColor || '#10B981' }}>
          <p style={{ color: pageContent.homepage?.offerBar?.textColor || '#FFFFFF' }} className="text-center font-medium">
            {pageContent.homepage?.offerBar?.text || 'No offer text set'}
          </p>
        </div>
      </div>

      {/* Do You Know Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Do You Know Section</h3>
          <button
            onClick={() => handleEdit('doYouKnow', pageContent.homepage.doYouKnow)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="mb-4">
          <h4 className="font-medium text-gray-800">{pageContent.homepage?.doYouKnow?.title || 'No title set'}</h4>
          <p className="text-gray-600">{pageContent.homepage?.doYouKnow?.subtitle || 'No subtitle set'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(pageContent.homepage?.doYouKnow?.facts || []).map((fact, index) => {
            // Handle both string format and object format
            if (typeof fact === 'string') {
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">📝</div>
                  <h5 className="font-medium text-gray-800">Fact {index + 1}</h5>
                  <p className="text-sm text-gray-600">{fact}</p>
                </div>
              );
            } else {
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">{fact.icon || '📝'}</div>
                  <h5 className="font-medium text-gray-800">{fact.title || 'No title'}</h5>
                  <p className="text-sm text-gray-600">{fact.description || 'No description'}</p>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Footer</h3>
          <button
            onClick={() => handleEdit('footer', pageContent.homepage.footer)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(pageContent.homepage?.footer?.sections || {}).map(([key, section]) => (
            <div key={key}>
              <h5 className="font-medium text-gray-800 mb-2">{section?.title || 'No title'}</h5>
              <ul className="space-y-1">
                {(section?.links || []).map((link, index) => (
                  <li key={index} className="text-sm text-gray-600">{link || 'No link'}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNavbarContent = () => (
    <div className="space-y-6">
      {/* Logo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Logo</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setLogoRefreshKey(prev => prev + 1);
                loadPageContent();
              }}
              className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              title="Refresh logo display"
            >
              🔄
            </button>
            <button
              onClick={() => handleEdit('logo', pageContent.navbar.logo)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              key={`admin-logo-${logoRefreshKey}`}
              src={pageContent.navbar?.logo?.image || '/placeholder.png'} 
              alt={pageContent.navbar?.logo?.alt || 'Logo'} 
              className="w-16 h-16 object-contain border border-gray-200 rounded-lg bg-gray-50" 
              onError={(e) => {
                e.target.src = '/placeholder.png';
              }}
            />
            {pageContent.navbar?.logo?.image && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {pageContent.navbar?.logo?.image ? 'Current Logo' : 'No logo set'}
            </p>
            <p className="text-sm text-gray-600">
              Image: {pageContent.navbar?.logo?.image || 'No image set'}
            </p>
            <p className="text-sm text-gray-600">
              Alt: {pageContent.navbar?.logo?.alt || 'No alt text'}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Search Bar</h3>
          <button
            onClick={() => handleEdit('search', { placeholder: pageContent.navbar?.searchPlaceholder || '' })}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
        <p className="font-medium">Placeholder: {pageContent.navbar?.searchPlaceholder || 'No placeholder set'}</p>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Categories</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <p className="text-yellow-800 font-medium">Categories are disabled</p>
                <p className="text-yellow-700 text-sm mt-1">
                  All category pages have been removed. The "Shop by Categories" dropdown will show "No categories available".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCartContent = () => (
    <div className="space-y-6">
      {/* Cart Title */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Cart Title</h3>
          <button
            onClick={() => handleEdit('title', { title: pageContent.cart.title })}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
        <p className="font-medium">{pageContent.cart?.title || 'No title set'}</p>
      </div>

      {/* Free Shipping Message */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Free Shipping Message</h3>
          <button
            onClick={() => handleEdit('freeShippingMessage', { message: pageContent.cart.freeShippingMessage })}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
        <p className="font-medium text-green-600">{pageContent.cart?.freeShippingMessage || 'No message set'}</p>
      </div>

      {/* Empty Cart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Empty Cart State</h3>
          <button
            onClick={() => handleEdit('emptyCart', pageContent.cart.emptyCart)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2">
          <p className="font-medium">{pageContent.cart?.emptyCart?.title || 'No title set'}</p>
          <p className="text-gray-600">{pageContent.cart?.emptyCart?.description || 'No description set'}</p>
          <p className="text-sm text-blue-600">{pageContent.cart?.emptyCart?.ctaText || 'No CTA text set'}</p>
        </div>
      </div>

      {/* Shipping Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Shipping Section</h3>
          <button
            onClick={() => handleEdit('shipping', pageContent.cart.shipping)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2">
          <p className="font-medium">{pageContent.cart?.shipping?.title || 'No title set'}</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <p><span className="font-medium">Country:</span> {pageContent.cart?.shipping?.fields?.country || 'No field set'}</p>
            <p><span className="font-medium">Province:</span> {pageContent.cart?.shipping?.fields?.province || 'No field set'}</p>
            <p><span className="font-medium">Zip Code:</span> {pageContent.cart?.shipping?.fields?.zipCode || 'No field set'}</p>
          </div>
          <p className="text-sm text-blue-600">{pageContent.cart?.shipping?.buttonText || 'No button text set'}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
          <button
            onClick={() => handleEdit('orderSummary', pageContent.cart.orderSummary)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2">
          <p className="font-medium">{pageContent.cart?.orderSummary?.title || 'No title set'}</p>
          <p className="text-sm"><span className="font-medium">Subtotal:</span> {pageContent.cart?.orderSummary?.subtotal || 'No text set'}</p>
          <p className="text-sm"><span className="font-medium">Total:</span> {pageContent.cart?.orderSummary?.total || 'No text set'}</p>
          <p className="text-sm text-gray-600">{pageContent.cart?.orderSummary?.taxNote || 'No tax note set'}</p>
          <p className="text-sm"><span className="font-medium">Order Note:</span> {pageContent.cart?.orderSummary?.orderNote || 'No text set'}</p>
          <p className="text-sm text-green-600">{pageContent.cart?.orderSummary?.checkoutButton || 'No button text set'}</p>
        </div>
      </div>
    </div>
  );


  const renderAdminPagesContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Pages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Dashboard', description: 'Admin dashboard overview', section: 'dashboard' },
            { name: 'Product Management', description: 'Manage products, categories, and inventory', section: 'productManagement' },
            { name: 'Order Management', description: 'View and manage customer orders', section: 'orderManagement' },
            { name: 'User Management', description: 'Manage customer accounts', section: 'userManagement' },
            { name: 'Analytics', description: 'Sales and performance analytics', section: 'analytics' },
            { name: 'Settings', description: 'System and store settings', section: 'settings' }
          ].map((page) => (
            <div key={page.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h5 className="font-medium text-gray-800 mb-2">{page.name}</h5>
              <p className="text-sm text-gray-600 mb-3">{page.description}</p>
              <button 
                onClick={() => handleEdit(page.section, { name: page.name, description: page.description })}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Edit Page
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditModal = () => {
    console.log('🎭 renderEditModal:', { showEditModal, editingSection, formData });
    if (!showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden">
          {/* Enhanced Modal Header */}
          <div className="text-white p-6 relative overflow-hidden" style={{ backgroundColor: '#A47551' }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {editingSection === 'newProduct' ? 'Add New Product Page' :
                     editingSection === 'productPage' ? `Edit Product Page: ${formData.name}` :
                     editingSection === 'productContent' ? `Edit Product Content: ${formData.name}` :
                     editingSection === 'editIndividualProduct' ? 'Edit Individual Product' :
                     editingSection === 'logo' ? 'Edit Logo' :
                     editingSection === 'search' ? 'Edit Search Bar' :
                     editingSection === 'categories' ? 'Edit Categories' :
                     `Edit ${editingSection}`}
                  </h3>
                  <p className="text-white text-sm opacity-90">
                    {editingSection === 'newProduct' ? 'Create a new product category page with custom content and settings' :
                     editingSection === 'productPage' ? 'Update the page settings and basic information' :
                     editingSection === 'productContent' ? 'Update the content that users see on this product page and manage individual products' :
                     editingSection === 'editIndividualProduct' ? 'Update the details of this specific product item' :
                     editingSection === 'logo' ? 'Update the website logo image and alt text' :
                     editingSection === 'search' ? 'Update the search bar placeholder text' :
                     editingSection === 'categories' ? 'Manage product categories and their items' :
                     'Make changes to this section'}
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:opacity-80 transition-opacity p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {editingSection === 'hero' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                  <input
                    type="text"
                    value={formData.backgroundImage || ''}
                    onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Text</label>
                  <input
                    type="text"
                    value={formData.ctaText || ''}
                    onChange={(e) => handleInputChange('ctaText', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link</label>
                  <input
                    type="text"
                    value={formData.ctaLink || ''}
                    onChange={(e) => handleInputChange('ctaLink', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {editingSection === 'offerBar' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                  <input
                    type="text"
                    value={formData.text || ''}
                    onChange={(e) => handleInputChange('text', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <input
                    type="color"
                    value={formData.backgroundColor || '#10B981'}
                    onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <input
                    type="color"
                    value={formData.textColor || '#FFFFFF'}
                    onChange={(e) => handleInputChange('textColor', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {editingSection === 'logo' && (
              <div className="space-y-4">
                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="logo-upload"
                      disabled={uploadingFile}
                    />
                    <div
                      className={`relative p-6 border-2 border-dashed rounded-lg text-center transition-all duration-200 ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      } ${uploadingFile ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => !uploadingFile && document.getElementById('logo-upload').click()}
                    >
                      {uploadingFile ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="text-sm text-gray-600 font-medium">Uploading logo...</span>
                          <span className="text-xs text-gray-500">Please wait while we process your image</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">
                              {dragActive ? 'Drop your logo here' : 'Click to upload or drag and drop'}
                            </div>
                            <div className="text-xs text-gray-500">
                              PNG, JPG, GIF, WebP, AVIF up to 5MB
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <div className="px-3 text-sm text-gray-500">OR</div>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Manual URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="/logo.avif"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the URL of your logo image</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                  <input
                    type="text"
                    value={formData.alt || ''}
                    onChange={(e) => handleInputChange('alt', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mufindryfruit Logo"
                  />
                  <p className="text-xs text-gray-500 mt-1">Alternative text for accessibility</p>
                </div>

                {formData.image && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <img 
                        src={formData.image} 
                        alt={formData.alt || 'Logo preview'} 
                        className="w-32 h-32 object-contain mx-auto"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="text-center text-gray-500 text-sm hidden">Failed to load image</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {editingSection === 'search' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Placeholder</label>
                  <input
                    type="text"
                    value={formData.placeholder || ''}
                    onChange={(e) => handleInputChange('placeholder', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search For Hazelnut"
                  />
                </div>
              </div>
            )}

            {editingSection === 'categories' && (
              <div className="space-y-6 max-h-full overflow-y-auto">
                <div className="text-sm text-gray-600 mb-4">
                  Edit the categories and their items. Each category has a title and a list of items.
                </div>
                <div className="space-y-4">
                  {Object.entries(formData || {}).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">
                          {categoryKey === 'nuts' ? '🥜' : 
                           categoryKey === 'driedFruits' ? '🍇' : 
                           categoryKey === 'berries' ? '🍓' : 
                           categoryKey === 'dates' ? '🌴' : 
                           categoryKey === 'seeds' ? '🌱' : 
                           categoryKey === 'mixes' ? '🥗' : '📦'}
                        </span>
                        {category?.title || categoryKey}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category Title</label>
                          <input
                            type="text"
                            value={category?.title || ''}
                            onChange={(e) => handleArrayChange(categoryKey, 'title', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Items (one per line)</label>
                          <textarea
                            value={(category?.items || []).join('\n')}
                            onChange={(e) => handleArrayChange(categoryKey, 'items', e.target.value.split('\n').filter(item => item.trim()))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none overflow-y-auto"
                            rows={6}
                            style={{ minHeight: '120px', maxHeight: '200px' }}
                            placeholder="Item 1&#10;Item 2&#10;Item 3&#10;Item 4&#10;Item 5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editingSection === 'doYouKnow' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facts</label>
                  {formData.facts?.map((fact, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                          <input
                            type="text"
                            value={fact.icon || ''}
                            onChange={(e) => handleArrayChange('facts', index, { ...fact, icon: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={fact.title || ''}
                            onChange={(e) => handleArrayChange('facts', index, { ...fact, title: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <input
                            type="text"
                            value={fact.description || ''}
                            onChange={(e) => handleArrayChange('facts', index, { ...fact, description: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeArrayItem('facts', index)}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove Fact
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('facts', { icon: '📝', title: 'New Fact', description: 'Description' })}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add Fact
                  </button>
                </div>
              </div>
            )}

            {/* New Product Form */}
            {editingSection === 'newProduct' && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-green-800 mb-2">Add New Product Page</h4>
                  <p className="text-sm text-green-700">Create a new product category page with custom content and settings.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Macadamia Nuts"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Nuts">🥜 Nuts</option>
                      <option value="Dried Fruits">🍇 Dried Fruits</option>
                      <option value="Berries">🍓 Berries</option>
                      <option value="Dates">🌴 Dates</option>
                      <option value="Seeds">🌱 Seeds</option>
                      <option value="Mixes">🥗 Mixes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Route *</label>
                  <input
                    type="text"
                    value={formData.route || ''}
                    onChange={(e) => handleInputChange('route', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., /macadamia-nuts"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Brief description of the product category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                  <input
                    type="text"
                    value={formData.pageTitle || ''}
                    onChange={(e) => handleInputChange('pageTitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Premium Macadamia Nuts - Buy Online"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    value={formData.metaDescription || ''}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    placeholder="SEO meta description for search engines"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                  <input
                    type="url"
                    value={formData.heroImage || ''}
                    onChange={(e) => handleInputChange('heroImage', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/hero-image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Educational Content</label>
                  <textarea
                    value={formData.educationalContent || ''}
                    onChange={(e) => handleInputChange('educationalContent', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Educational content about the product benefits, history, etc."
                  />
                </div>
              </div>
            )}

            {/* Product Page Edit Form */}
            {editingSection === 'productPage' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Edit Product Page: {formData.name}</h4>
                  <p className="text-sm text-blue-700">Update the page settings and basic information.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Nuts">🥜 Nuts</option>
                      <option value="Dried Fruits">🍇 Dried Fruits</option>
                      <option value="Berries">🍓 Berries</option>
                      <option value="Dates">🌴 Dates</option>
                      <option value="Seeds">🌱 Seeds</option>
                      <option value="Mixes">🥗 Mixes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Route *</label>
                  <input
                    type="text"
                    value={formData.route || ''}
                    onChange={(e) => handleInputChange('route', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                  <input
                    type="text"
                    value={formData.pageTitle || ''}
                    onChange={(e) => handleInputChange('pageTitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    value={formData.metaDescription || ''}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                  <input
                    type="url"
                    value={formData.heroImage || ''}
                    onChange={(e) => handleInputChange('heroImage', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Educational Content</label>
                  <textarea
                    value={formData.educationalContent || ''}
                    onChange={(e) => handleInputChange('educationalContent', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                  />
                </div>
              </div>
            )}

            {/* Product Content Edit Form */}
            {editingSection === 'productContent' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-green-800 mb-2">Edit Product Content: {formData.name}</h4>
                  <p className="text-sm text-green-700">Update the content that users see on this product page and manage individual products.</p>
                </div>

                {/* Page Content Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Page Content</h5>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Header</label>
                      <input
                        type="text"
                        value={formData.pageHeader || ''}
                        onChange={(e) => handleInputChange('pageHeader', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Premium Almonds Collection"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Subtitle</label>
                      <input
                        type="text"
                        value={formData.pageSubtitle || ''}
                        onChange={(e) => handleInputChange('pageSubtitle', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Discover our finest selection of premium almonds"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Benefits</label>
                      <textarea
                        value={formData.benefits || ''}
                        onChange={(e) => handleInputChange('benefits', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="List the health benefits and features of this product"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Usage Instructions</label>
                      <textarea
                        value={formData.usageInstructions || ''}
                        onChange={(e) => handleInputChange('usageInstructions', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="How to use or consume this product"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Storage Instructions</label>
                      <textarea
                        value={formData.storageInstructions || ''}
                        onChange={(e) => handleInputChange('storageInstructions', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                        placeholder="How to store this product properly"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nutritional Information</label>
                      <textarea
                        value={formData.nutritionalInfo || ''}
                        onChange={(e) => handleInputChange('nutritionalInfo', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Key nutritional facts and values"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action Text</label>
                      <input
                        type="text"
                        value={formData.ctaText || ''}
                        onChange={(e) => handleInputChange('ctaText', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Shop Premium Almonds Now"
                      />
                    </div>
                  </div>
                </div>

                {/* Individual Products Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-gray-800">Individual Products in {formData.name}</h5>
                    <button
                      onClick={() => handleAddNewProduct()}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add New Product</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(formData.products || []).map((product, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="mb-3">
                          <h6 className="font-medium text-gray-800 mb-1">{product.name}</h6>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600 font-semibold">₹{product.price}</span>
                            <span className="text-gray-500">{product.weight}</span>
                          </div>
                          {product.isBestSeller && (
                            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-2">Best Seller</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product, index)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors flex-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProductItem(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(!formData.products || formData.products.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No individual products found for this category.</p>
                      <p className="text-sm">Click "Add New Product" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Individual Product Edit Form */}
            {editingSection === 'editIndividualProduct' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Edit Individual Product</h4>
                  <p className="text-sm text-blue-700">Update the details of this specific product item.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.editingProduct?.name || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        editingProduct: { ...prev.editingProduct, name: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Premium California Almonds"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.editingProduct?.price || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        editingProduct: { ...prev.editingProduct, price: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 299"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight/Size *</label>
                    <input
                      type="text"
                      value={formData.editingProduct?.weight || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        editingProduct: { ...prev.editingProduct, weight: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 250g, 500g, 1kg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.editingProduct?.stock || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        editingProduct: { ...prev.editingProduct, stock: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.editingProduct?.description || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      editingProduct: { ...prev.editingProduct, description: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Detailed description of the product"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image URL</label>
                  <input
                    type="url"
                    value={formData.editingProduct?.image || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      editingProduct: { ...prev.editingProduct, image: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/product-image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Tags</label>
                  <input
                    type="text"
                    value={formData.editingProduct?.tags?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      editingProduct: { 
                        ...prev.editingProduct, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., premium, organic, bestseller, healthy"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isBestSeller"
                      checked={formData.editingProduct?.isBestSeller || false}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        editingProduct: { ...prev.editingProduct, isBestSeller: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isBestSeller" className="text-sm font-medium text-gray-700">
                      Best Seller
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={formData.editingProduct?.isPopular || false}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        editingProduct: { ...prev.editingProduct, isPopular: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">
                      Popular Product
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => setEditingSection('productContent')}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveIndividualProduct}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Product
                  </button>
                </div>
              </div>
            )}

            {/* Footer Edit Form */}
            {editingSection === 'footer' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Edit Footer Content</h4>
                  <p className="text-sm text-blue-700">Update footer sections, links, and other content.</p>
                </div>

                {/* Footer Sections */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-4">Footer Sections</h4>
                  <div className="space-y-4">
                    {Object.entries(formData.sections || {}).map(([sectionKey, section]) => (
                      <div key={sectionKey} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-3 capitalize">{sectionKey.replace(/([A-Z])/g, ' $1').trim()}</h5>
                        
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                          <input
                            type="text"
                            value={section.title || ''}
                            onChange={(e) => handleArrayChange('sections', sectionKey, { ...section, title: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Section title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Links</label>
                          <div className="space-y-2">
                            {(section.links || []).map((link, linkIndex) => (
                              <div key={linkIndex} className="flex space-x-2">
                                <input
                                  type="text"
                                  value={link}
                                  onChange={(e) => {
                                    const newLinks = [...(section.links || [])];
                                    newLinks[linkIndex] = e.target.value;
                                    handleArrayChange('sections', sectionKey, { ...section, links: newLinks });
                                  }}
                                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Link text"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newLinks = (section.links || []).filter((_, i) => i !== linkIndex);
                                    handleArrayChange('sections', sectionKey, { ...section, links: newLinks });
                                  }}
                                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newLinks = [...(section.links || []), ''];
                                handleArrayChange('sections', sectionKey, { ...section, links: newLinks });
                              }}
                              className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                              Add Link
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter Section */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-4">Newsletter Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.newsletter?.title || ''}
                        onChange={(e) => handleInputChange('newsletter', { ...formData.newsletter, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Newsletter title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={formData.newsletter?.description || ''}
                        onChange={(e) => handleInputChange('newsletter', { ...formData.newsletter, description: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Newsletter description"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-4">Social Media Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={formData.socialMedia?.facebook || ''}
                        onChange={(e) => handleInputChange('socialMedia', { ...formData.socialMedia, facebook: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://facebook.com/mufindryfruit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={formData.socialMedia?.instagram || ''}
                        onChange={(e) => handleInputChange('socialMedia', { ...formData.socialMedia, instagram: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://instagram.com/mufindryfruit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                      <input
                        type="url"
                        value={formData.socialMedia?.twitter || ''}
                        onChange={(e) => handleInputChange('socialMedia', { ...formData.socialMedia, twitter: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://twitter.com/mufindryfruit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                      <input
                        type="url"
                        value={formData.socialMedia?.youtube || ''}
                        onChange={(e) => handleInputChange('socialMedia', { ...formData.socialMedia, youtube: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://youtube.com/mufindryfruit"
                      />
                    </div>
                  </div>
                </div>

                {/* Copyright */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                  <input
                    type="text"
                    value={formData.copyright || ''}
                    onChange={(e) => handleInputChange('copyright', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="© 2024 Mufindryfruit. All rights reserved."
                  />
                </div>
              </div>
            )}

            {/* Admin Page Sections */}
            {(editingSection === 'dashboard' || editingSection === 'productManagement' ||
              editingSection === 'orderManagement' || editingSection === 'userManagement' ||
              editingSection === 'analytics' || editingSection === 'settings') && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="font-medium text-blue-800">Admin Page Configuration</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Configure the settings and content for the <strong>{formData.name}</strong> admin page.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                    <input
                      type="text"
                      value={formData.title || formData.name || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter page title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Enter page description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page URL/Route</label>
                    <input
                      type="text"
                      value={formData.route || `/admin/${editingSection}`}
                      onChange={(e) => handleInputChange('route', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="/admin/dashboard"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Icon</label>
                      <input
                        type="text"
                        value={formData.icon || ''}
                        onChange={(e) => handleInputChange('icon', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="📊 or dashboard"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                      <select
                        value={formData.accessLevel || 'admin'}
                        onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="admin">Admin Only</option>
                        <option value="manager">Manager & Admin</option>
                        <option value="staff">All Staff</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.enabled !== false}
                        onChange={(e) => handleInputChange('enabled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Page Enabled</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.showInNavigation !== false}
                        onChange={(e) => handleInputChange('showInNavigation', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Show in Navigation</span>
                    </label>
                  </div>

                  {editingSection === 'dashboard' && (
                    <div className="border-t pt-4">
                      <h5 className="font-medium text-gray-800 mb-3">Dashboard Widgets</h5>
                      <div className="space-y-2">
                        {['Sales Overview', 'Recent Orders', 'Top Products', 'Analytics Summary'].map((widget) => (
                          <label key={widget} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.widgets?.[widget.toLowerCase().replace(/\s+/g, '')] !== false}
                              onChange={(e) => handleInputChange('widgets', {
                                ...formData.widgets,
                                [widget.toLowerCase().replace(/\s+/g, '')]: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{widget}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Add more edit forms for other sections */}
          </div>

          <div className="px-6 py-4 border-t-2 flex justify-between items-center" style={{ backgroundColor: '#F5F2E7', borderColor: '#A47551' }}>
            <div className="text-sm" style={{ color: '#A47551' }}>
              💡 All changes are automatically saved to the database
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                style={{ backgroundColor: '#A47551', opacity: 0.8 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="text-white px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 shadow-lg"
                style={{ backgroundColor: '#A47551' }}
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    // Show loading state if no content is loaded yet
    if (Object.keys(pageContent).length === 0) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page content...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'homepage':
        return renderHomepageContent();
      case 'navbar':
        return renderNavbarContent();
      case 'cart':
        return renderCartContent();
      case 'admin-pages':
        return renderAdminPagesContent();
      default:
        return renderHomepageContent();
    }
  };

  if (loading && Object.keys(pageContent).length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page content...</p>
        </div>
      </div>
    );
  }

  // Show category selection first
  if (showCategorySelection) {
    return renderCategorySelection();
  }

    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          {/* Header with Navigation */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={handleBackToCategories}
                    className="flex items-center space-x-2 transition-colors duration-200 text-amber-600 hover:text-amber-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Categories</span>
                  </button>
                  <button
                    onClick={() => setShowCategorySelection(false)}
                    className="flex items-center space-x-2 transition-colors duration-200 text-blue-600 hover:text-blue-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>Page Management</span>
                  </button>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-gray-800">
                  {categories.find(cat => cat.id === selectedCategory)?.name || 'Page Management'}
                </h1>
                <p className="text-gray-600">
                  {categories.find(cat => cat.id === selectedCategory)?.description || 'Manage all pages and their content'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm mb-1 text-gray-600">Production Ready</div>
                <div className="text-xs mb-2 text-gray-500">✓ Auto-Save Enabled</div>
                <button
                  onClick={loadPageContent}
                  disabled={loading}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{loading ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors group ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{tab.icon}</span>
                      <div className="text-left">
                        <div className="font-semibold">{tab.name}</div>
                        <div className="text-xs opacity-70 group-hover:opacity-100">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
      </div>

      {renderEditModal()}
    </div>
  );
};

export default PageManagement;

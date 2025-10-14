import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Homepages/Header.jsx';
import Navbar from '../../Homepages/Navbar.jsx';
import Footer from '../../Homepages/Footer.jsx';
import { useNotification } from '../../Common/NotificationProvider.jsx';
import { cartAPI, paymentSettingsAPI } from '../../../services/api.js';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  // State declarations - MUST come before useEffect hooks
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiData, setUpiData] = useState({
    selectedApp: ''
  });
  const [errors, setErrors] = useState({});
  const [cartTotal, setCartTotal] = useState(0);
  const [failedLogos, setFailedLogos] = useState(new Set());
  const [showOtherApps, setShowOtherApps] = useState(false);
  const [showPaymentDoneButton, setShowPaymentDoneButton] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({
    upiId: '',
    accountHolderName: ''
  });
  const [loadingPaymentSettings, setLoadingPaymentSettings] = useState(true);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [showUTRInput, setShowUTRInput] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [verificationTimer, setVerificationTimer] = useState(20);
  const [timerInterval, setTimerInterval] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  // Timer effect for payment verification
  React.useEffect(() => {
    if (isVerifyingPayment && verificationTimer > 0) {
      const interval = setInterval(() => {
        setVerificationTimer(prev => {
          if (prev <= 1) {
            // Timer expired - show UTR input
            clearInterval(interval);
            setIsVerifyingPayment(false);
            setShowUTRInput(true);
            console.log('⏰ 20 seconds expired - showing UTR input');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [isVerifyingPayment]);
  
  // DETECT USER RETURN FROM UPI APP - Only trigger on visibility change, NOT on initial load
  React.useEffect(() => {
    let hasInitiallyLoaded = false;
    
    const handleUserReturn = () => {
      const orderId = sessionStorage.getItem('currentOrderId');
      const paymentInProgress = sessionStorage.getItem('paymentInProgress');
      
      // Only proceed if this is NOT the initial page load AND payment is in progress
      if (hasInitiallyLoaded && orderId && paymentInProgress === 'true') {
        console.log('🔄 USER RETURNED: Continuing payment verification...');
        console.log('🔄 Order ID:', orderId);
        
        // If user returns, keep showing verification screen (don't show UTR yet)
        // The timer will handle showing UTR after 20 seconds
        if (!isVerifyingPayment && !showUTRInput) {
          setIsVerifyingPayment(true);
          console.log('📝 Showing verification screen...');
        }
      }
    };

    // Method 1: Page visibility change (when user returns from UPI app)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📱 Page became visible - checking for user return');
        handleUserReturn();
      }
    };

    // Method 2: Window focus (when user returns from UPI app)
    const handleWindowFocus = () => {
      console.log('📱 Window focused - checking for user return');
      handleUserReturn();
    };

    // Mark as initially loaded after a short delay
    const timer = setTimeout(() => {
      hasInitiallyLoaded = true;
      console.log('✅ Page fully loaded - now monitoring for user return from UPI');
    }, 1000);

    // Add event listeners (NOT calling handleUserReturn on mount)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isVerifyingPayment, showUTRInput]);

  // Fallback UPI credentials (will be overridden by admin settings)
  const MERCHANT_UPI_ID = paymentSettings.upiId || '9958815201@ybl';
  const MERCHANT_NAME = paymentSettings.accountHolderName || 'Happilo';

  const handleUPIAppClick = (appName) => {
    // Just set the selected app - don't open payment yet
    setUpiData(prev => ({...prev, selectedApp: appName}));
    console.log('✅ Payment method selected:', appName);
    console.log('💡 Now click "Pay Now" button to proceed with payment');
    
    // Get the order amount
    const orderAmount = cartTotal;
    
    // UPI app deep links
    const upiLinks = {
      phonepe: `phonepe://pay?pa=${MERCHANT_UPI_ID}&pn=${MERCHANT_NAME}&am=${orderAmount}&cu=INR&tn=Dry%20Fruits%20Order`,
      paytm: `paytmmp://pay?pa=${MERCHANT_UPI_ID}&pn=${MERCHANT_NAME}&am=${orderAmount}&cu=INR&tn=Dry%20Fruits%20Order`,
      bhim: `bhim://upi/pay?pa=${MERCHANT_UPI_ID}&pn=${MERCHANT_NAME}&am=${orderAmount}&cu=INR&tn=Dry%20Fruits%20Order`,
      whatsapp: `whatsapp://send?phone=9958815201&text=Pay%20₹${orderAmount}%20for%20Dry%20Fruits%20Order`,
      gpay: `gpay://upi/pay?pa=${MERCHANT_UPI_ID}&pn=${MERCHANT_NAME}&am=${orderAmount}&cu=INR&tn=Dry%20Fruits%20Order`,
      qr: `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${MERCHANT_NAME}&am=${orderAmount}&cu=INR&tn=Dry%20Fruits%20Order`
    };

    const upiLink = upiLinks[appName];
    
    // Payment method selected - wait for "Pay Now" button click
  };

  useEffect(() => {
    // Only clear old payment flags if there's no active payment in progress
    const paymentInProgress = sessionStorage.getItem('paymentInProgress');
    const currentOrderId = sessionStorage.getItem('currentOrderId');
    
    if (!paymentInProgress && !currentOrderId) {
      console.log('🧹 Cleaning up old payment flags on fresh page load');
      sessionStorage.removeItem('currentOrderId');
      sessionStorage.removeItem('paymentInProgress');
      sessionStorage.removeItem('actualPaymentAmount');
    } else {
      console.log('🔄 Payment in progress, keeping session data:', { paymentInProgress, currentOrderId });
    }
    
    // Check if we were waiting for payment (restore state after refresh)
    const waitingForPayment = sessionStorage.getItem('waitingForPayment');
    if (waitingForPayment === 'true') {
      console.log('🔄 User was waiting for payment, redirecting to summary...');
      
      // Get the stored payment data to extract order ID
      const paymentData = JSON.parse(localStorage.getItem('paymentMethod') || '{}');
      const orderId = paymentData.orderId || `ORD${Date.now()}`;
      
      console.log('📤 Auto-redirecting to payment-success with orderId:', orderId);
      
      // Clear waiting flag
      sessionStorage.removeItem('waitingForPayment');
      
      // Don't auto-redirect - let user complete the payment flow manually
      console.log('🔄 User was waiting for payment, but letting them complete flow manually');
      
      return; // Skip the rest of the initialization
    }
    
    // Fetch payment settings from admin
    const fetchPaymentSettings = async () => {
      try {
        console.log('🔍 Fetching admin payment settings...');
        setLoadingPaymentSettings(true);
        
        const response = await paymentSettingsAPI.getPaymentSettings();
        console.log('✅ Payment settings response:', response);
        
        if (response && response.settings) {
          setPaymentSettings({
            upiId: response.settings.upiId || '',
            accountHolderName: response.settings.accountHolderName || ''
          });
          console.log('✅ Payment settings loaded:', {
            upiId: response.settings.upiId,
            accountHolderName: response.settings.accountHolderName
          });
        } else {
          console.log('⚠️ No payment settings found, using fallback values');
        }
      } catch (error) {
        console.error('❌ Error fetching payment settings:', error);
        console.log('⚠️ Using fallback UPI credentials');
      } finally {
        setLoadingPaymentSettings(false);
      }
    };

    // Fetch payment settings
    fetchPaymentSettings();

    // Get cart total when component mounts
    // Check for direct order first (from Buy Now), then regular cart
    const directOrder = sessionStorage.getItem('directOrder');
    
    console.log('🔍 PaymentPage Debug - Cart Total Calculation:');
    console.log('  - directOrder from sessionStorage:', directOrder);
    
    if (directOrder) {
      try {
        const orderItems = JSON.parse(directOrder);
        console.log('  - Parsed order items:', orderItems);
        const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log('  - Calculated total from direct order:', total);
        setCartTotal(total);
      } catch (error) {
        console.error('Error parsing direct order:', error);
        const total = cartAPI.getCartTotal();
        console.log('  - Fallback to cartAPI.getCartTotal():', total);
        setCartTotal(total);
      }
    } else {
      const cart = cartAPI.getCart();
      console.log('  - Regular cart from localStorage:', cart);
      const total = cartAPI.getCartTotal();
      console.log('  - Cart total calculated:', total);
      setCartTotal(total);
    }
    
    // Also check localStorage for cart data
    const localStorageCart = localStorage.getItem('cart');
    console.log('  - Cart from localStorage:', localStorageCart);
    
  }, []);

  // DISABLED - Using simple direct redirect instead

  const validateUpiForm = () => {
    const newErrors = {};
    
    // Check if UPI app is selected
    if (!upiData.selectedApp) {
      newErrors.selectedApp = 'Please select a UPI app';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Manual redirect function for "Payment Done" button - DISABLED to prevent duplicate orders
  const handlePaymentDone = () => {
    console.log('🚫 Payment Done button disabled to prevent duplicate orders');
    showSuccess('Please complete the UTR verification process to finish your order.');
  };

  // Create order directly without going through PaymentSuccess page
  const createOrderDirectly = async (orderId, utrNumber) => {
    console.log('📦 Creating order directly:', orderId);
    
    // Get cart items
    let cartItems = [];
    const directOrder = sessionStorage.getItem('directOrder');
    if (directOrder) {
      try {
        cartItems = JSON.parse(directOrder);
        console.log('✅ Cart items found in directOrder:', cartItems);
      } catch (error) {
        console.error('Error parsing directOrder:', error);
      }
    }
    
    // Try localStorage cart as fallback
    if (cartItems.length === 0) {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          cartItems = JSON.parse(localCart);
          console.log('✅ Cart items found in localStorage:', cartItems);
        } catch (error) {
          console.error('Error parsing localStorage cart:', error);
        }
      }
    }
    
    // Get shipping address
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
    
    // Create payment data with UTR
    const paymentData = {
      utrNumber: utrNumber,
      method: 'upi',
      status: 'completed'
    };
    
    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCharges = 0;
    const total = subtotal + shippingCharges;
    
    // Validate cart items and filter out items with no stock
    const validCartItems = cartItems.filter(item => {
      // Basic validation - ensure required fields exist
      if (!item.productId && !item.product) {
        console.warn('⚠️ Item missing product ID:', item);
        return false;
      }
      if (!item.size) {
        console.warn('⚠️ Item missing size:', item);
        return false;
      }
      if (!item.quantity || item.quantity <= 0) {
        console.warn('⚠️ Item has invalid quantity:', item);
        return false;
      }
      return true;
    });

    if (validCartItems.length === 0) {
      throw new Error('No valid items in cart. Please add items to your cart.');
    }

    // Create order data
    const orderData = {
      items: validCartItems.map(item => ({
        product: item.productId || item.product,
        name: item.name || 'Unknown Product',
        size: item.size || '1',
        quantity: item.quantity || 1,
        price: item.price || 0,
        originalPrice: item.originalPrice || item.price || 0,
        image: item.image || ''
      })),
      shippingAddress: {
        name: shippingAddress.name || 
              (shippingAddress.firstName && shippingAddress.lastName ? 
                `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim() : '') || '',
        phone: shippingAddress.phone || '',
        email: shippingAddress.email || '',
        address: shippingAddress.address || shippingAddress.street || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        pincode: shippingAddress.pincode || '',
        country: shippingAddress.country || 'India'
      },
      paymentMethod: 'upi',
      paymentDetails: paymentData,
      orderNote: '',
      subtotal: subtotal,
      shipping: shippingCharges,
      total: total,
      status: 'pending'
    };
    
    console.log('📤 Creating order with data:', orderData);
    
    // Import ordersAPI dynamically to avoid circular imports
    const { ordersAPI } = await import('../../../services/api.js');
    
    // Create order
    const response = await ordersAPI.create(orderData);
    console.log('✅ Order created successfully:', response);
    
    // Save order locally
    const localOrder = {
      id: response.order.orderNumber,
      ...orderData,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(localOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    // Clear cart and session data
    localStorage.removeItem('cart');
    sessionStorage.removeItem('directOrder');
    localStorage.removeItem('paymentMethod');
    sessionStorage.removeItem('waitingForPayment');
    
    return response;
  };

  const handleUTRSubmit = async () => {
    if (!utrNumber.trim()) {
      showError('Please enter UTR/Reference number');
      return;
    }
    
    // Validate UTR length (at least 10 digits)
    const utrDigits = utrNumber.replace(/\D/g, ''); // Remove non-digits
    if (utrDigits.length < 10) {
      showError('UTR/Reference number must be at least 10 digits long');
      return;
    }

    // Check if cart has valid items before proceeding
    const directOrder = sessionStorage.getItem('directOrder');
    if (!directOrder) {
      showError('No items found in cart. Please add items and try again.');
      return;
    }

    try {
      const cartItems = JSON.parse(directOrder);
      if (!cartItems || cartItems.length === 0) {
        showError('Your cart is empty. Please add items and try again.');
        return;
      }
    } catch (error) {
      showError('Invalid cart data. Please refresh and try again.');
      return;
    }
    
    const orderId = sessionStorage.getItem('currentOrderId');
    console.log('🔍 UTR Submit Debug:');
    console.log('  - UTR Number:', utrNumber);
    console.log('  - Order ID from sessionStorage:', orderId);
    console.log('  - All sessionStorage keys:', Object.keys(sessionStorage));
    
    if (!orderId) {
      console.error('❌ No orderId found in sessionStorage!');
      console.log('🔄 Attempting to generate new orderId...');
      const fallbackOrderId = `ORD${Date.now()}`;
      sessionStorage.setItem('currentOrderId', fallbackOrderId);
      console.log('✅ Generated fallback orderId:', fallbackOrderId);
      showError('Order ID was missing, but we\'ve generated a new one. Proceeding...');
    }
    
    // Save UTR to sessionStorage for order creation
    sessionStorage.setItem('paymentUTR', utrNumber);
    
    // Get the final orderId (either original or fallback)
    const finalOrderId = sessionStorage.getItem('currentOrderId');
    
    setShowUTRInput(false);
    setUtrNumber('');
    setIsCreatingOrder(true); // Show loading screen
    
    // showSuccess('UTR submitted! Creating order...');
    
    // Create order directly here instead of going to PaymentSuccess
    try {
      const orderResponse = await createOrderDirectly(finalOrderId, utrNumber);
      
      // Clear flags after successful order creation
      sessionStorage.removeItem('currentOrderId');
      sessionStorage.removeItem('paymentInProgress');
      sessionStorage.removeItem('paymentUTR');
      
      // showSuccess('Order created successfully! Opening confirmation...');
      
      // Use the actual order number from the response, not the temporary ID
      const actualOrderNumber = orderResponse.order.orderNumber;
      
      // Redirect directly to order confirmation page in new tab
      setTimeout(() => {
        console.log('🚀 Redirecting directly to order confirmation with orderNumber:', actualOrderNumber);
        window.open(`/order-confirmation/${actualOrderNumber}`, '_blank');
        setIsCreatingOrder(false); // Hide loading screen
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error creating order:', error);
      setIsCreatingOrder(false); // Hide loading screen on error
      
      // Show specific error messages based on the error type
      if (error.message.includes('Insufficient stock')) {
        showError('Some items are out of stock. Please remove them from your cart and try again.');
      } else if (error.message.includes('No valid items')) {
        showError('Your cart is empty or contains invalid items. Please add items to your cart.');
      } else if (error.message.includes('Product not found')) {
        showError('Some products are no longer available. Please refresh and try again.');
      } else {
        showError('Failed to create order. Please contact support.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if payment method is selected
    if (!upiData.selectedApp) {
      showError('Please select a payment method first');
      return;
    }
    
    console.log('🚀 Pay Now button clicked!');
    console.log('📱 Selected payment method:', upiData.selectedApp);
    console.log('💰 Amount to pay:', cartTotal);
    
    // Now proceed with payment using the existing payment logic
    const selectedApp = {
      id: upiData.selectedApp,
      name: upiData.selectedApp.charAt(0).toUpperCase() + upiData.selectedApp.slice(1)
    };
    
    // Call the existing payment function
    handleUPIPayment(selectedApp, cartTotal);
  };


  const upiApps = [
    {
      id: 'phonepe',
      name: 'PhonePe',
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-icon.png',
      color: 'bg-purple-100',
      deepLink: 'phonepe://pay'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.png',
      color: 'bg-blue-100',
      deepLink: 'gpay://pay'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      logo: 'https://www.citypng.com/public/uploads/preview/paytm-circle-logo-hd-png-701751694706614zmho56voff.png',
      color: 'bg-blue-100',
      deepLink: 'paytmmp://pay'
    },
    {
      id: 'other',
      name: 'Other',
      logo: '',
      color: 'bg-gray-100',
      fallbackIcon: '➕',
      deepLink: ''
    }
  ];

  const otherUpiApps = [
    // {
    //   id: 'bhim',
    //   name: 'BHIM Pay',
    //   logo: 'https://play-lh.googleusercontent.com/B5cNBA15IxjCT-8UTXEWgiPcGkJ1C07iHKwm2Hbs8xR3PnJvZ0swTag3abdC_Fj5OfnP=w240-h480-rw',
    //   color: 'bg-orange-100',
    //   fallbackIcon: '🏦',
    //   deepLink: 'bhim://pay'
    // },
    {
      id: 'amazonpay',
      name: 'Amazon Pay',
      logo: 'https://www.iconpacks.net/icons/free-icons-6/free-amazon-pay-circle-round-logo-icon-19775-thumb.png',
      color: 'bg-yellow-100',
      fallbackIcon: '🛒',
      deepLink: 'amazonpay://pay'
    },
    {
      id: 'navi',
      name: 'Navi Pay',
      logo: 'https://etimg.etb2bimg.com/thumb/msid-95274997,width-1200,height-900,resizemode-4/.jpg',
      color: 'bg-indigo-100',
      fallbackIcon: '',
      deepLink: 'navi://pay'
    },
    {
      id: 'bharatpe',
      name: 'Bharat Pay',
      logo: 'https://bharatpe.com/wp-content/uploads/2023/05/group-24@3x.png',
      color: 'bg-green-100',
      fallbackIcon: '🇮',
      deepLink: 'bharatpe://pay'
    },
    // {
    //   id: 'popupi',
    //   name: 'PopUPI Pay',
    //   logo: 'https://play-lh.googleusercontent.com/Br4JLbZotZRd3MawaMPBIf1QRHDJtJCMzUbJSZmJq0Xlhh_9lkjvKo92oo5nvm2bq1J_',
    //   color: 'bg-pink-100',
    //   fallbackIcon: '💳',
    //   deepLink: 'popupi://pay'
    // },
    {
      id: 'mobikwik',
      name: 'MobiKwik',
      logo: 'https://i.pinimg.com/736x/ce/c1/dd/cec1dd1d81590f5e6aac34f2a2fbb51f.jpg',
      color: 'bg-blue-100',
      fallbackIcon: '💙',
      deepLink: 'mobikwik://pay'
    },
    {
      id: 'freecharge',
      name: 'FreeCharge',
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/freecharge-logo-icon.png',
      color: 'bg-red-100',
      fallbackIcon: '🔴',
      deepLink: 'freecharge://pay'
    },
    {
      id: 'airtel',
      name: 'Airtel Payments Bank',
      logo: 'https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/airtel-payments-bank-logo-hd.png',
      color: 'bg-red-100',
      fallbackIcon: '📶',
      deepLink: 'airtel://pay'
    },
    {
      id: 'jio',
      name: 'JioMoney',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKCuLxFCQ5Jcy9W9wF34RbDnxfCyc1t64zgw&s',
      color: 'bg-teal-100',
      fallbackIcon: '📱',
      deepLink: 'jiomoney://pay'
    },
    // {
    //   id: 'yono',
    //   name: 'YONO SBI',
    //   logo: 'https://play-lh.googleusercontent.com/uAGuxZ872xYq99O9O1IgYEceMWAheQyEwZskZ9sE6Xrt1A-WinZkHj3MDAcTcJVLATFP',
    //   color: 'bg-blue-100',
    //   fallbackIcon: '🏛️',
    //   deepLink: 'yono://pay'
    // },
    {
      id: 'icici',
      name: 'ICICI iMobile',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWRt8z5_b-vz2Hq-n0bRqcqoDqscK27uqrHA&s',
      color: 'bg-orange-100',
      fallbackIcon: '🏦',
      deepLink: 'icici://pay'
    },
    {
      id: 'hdfc',
      name: 'HDFC PayZapp',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm6isVlMc6u-tS0NUWaHt1rjtRt-1m-z7V7A&s',
      color: 'bg-red-100',
      fallbackIcon: '💳',
      deepLink: 'hdfc://pay'
    }
  ];

  const handleUpiAppClick = (app) => {
    // Check if app is valid
    if (!app || !app.id) {
      console.error('❌ Invalid UPI app object:', app);
      showError('Invalid UPI app selection. Please try again.');
      return;
    }
    
    if (app.id === 'other') {
      setShowOtherApps(!showOtherApps);
      return;
    }
    
    setUpiData(prev => ({
      ...prev,
      selectedApp: app.id
    }));
    
    // Check if cart has items
    console.log('🔍 UPI Payment Debug:', { cartTotal, app: app.name });
    if (cartTotal <= 0) {
      showError('Cart is empty! Please add items to your cart first.');
      return;
    }
    
    // Check minimum amount
    if (cartTotal < 1) {
      showError('Minimum order amount is ₹1. Please add items to your cart.');
      return;
    }
    
    // Generate order ID (you can customize this)
    const orderId = `ORD${Date.now()}`;
    
    // Get the redirect URL - redirect to payment success page instead of payment page
    const redirectUrl = `${window.location.origin}/payment-success?orderId=${orderId}`;
    console.log('🔗 Redirect URL:', redirectUrl);
    
    // Debug payment settings
    console.log('🔍 UPI Payment Debug:');
    console.log('  - Admin UPI ID:', MERCHANT_UPI_ID);
    console.log('  - Admin Name:', MERCHANT_NAME);
    console.log('  - Cart Total:', cartTotal);
    console.log('  - Order ID:', orderId);
    console.log('  - Selected App:', app.name);
    console.log('  - Redirect URL:', redirectUrl);
    
    // Create payment URL with pre-filled data based on the selected app
    // Note: 'url' parameter is the callback URL after payment completion
    let paymentUrl = '';
    if (app.id === 'phonepe') {
      // PhonePe deep link format
      paymentUrl = `phonepe://pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'googlepay' || app.id === 'gpay') {
      // Google Pay deep link format
      paymentUrl = `gpay://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'paytm') {
      // Paytm deep link format - Try multiple formats
      const amount = cartTotal.toFixed(2);
      const merchantName = MERCHANT_NAME;
      const upiId = MERCHANT_UPI_ID;
      const transactionNote = `Dry Fruits Order ${orderId}`;
      
      // Format 1: Standard UPI format
      paymentUrl = `paytmmp://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${transactionNote}`;
      
      console.log('🔍 Paytm URL Debug:');
      console.log('  - UPI ID:', upiId);
      console.log('  - Name:', merchantName);
      console.log('  - Amount:', amount);
      console.log('  - Note:', transactionNote);
      console.log('  - Generated URL:', paymentUrl);
    } else if (app.id === 'bhim') {
      // BHIM UPI deep link format
      paymentUrl = `bhim://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'whatsapp') {
      // WhatsApp Pay deep link format (doesn't support URL parameter, will use fallback detection)
      paymentUrl = `whatsapp://send?phone=9958815201&text=Pay%20₹${cartTotal.toFixed(2)}%20for%20Dry%20Fruits%20Order%20(${orderId})`;
    } else if (app.id === 'amazon' || app.id === 'amazonpay') {
      // Amazon Pay deep link format
      paymentUrl = `amazonpay://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'mobikwik') {
      // MobiKwik deep link format
      paymentUrl = `mobikwik://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'freecharge') {
      // FreeCharge deep link format
      paymentUrl = `freecharge://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'airtel') {
      // Airtel Payments Bank deep link format
      paymentUrl = `airtel://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'jiomoney' || app.id === 'jio') {
      // JioMoney deep link format
      paymentUrl = `jiomoney://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'yono') {
      // YONO SBI deep link format
      paymentUrl = `yono://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'icici') {
      // ICICI iMobile deep link format
      paymentUrl = `icici://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'hdfc') {
      // HDFC PayZapp deep link format
      paymentUrl = `hdfc://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'navi') {
      // Navi Pay deep link format
      paymentUrl = `navi://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'bharat' || app.id === 'bharatpe') {
      // Bharat Pay deep link format
      paymentUrl = `bharatpe://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else if (app.id === 'popupi') {
      // PopUPI Pay deep link format
      paymentUrl = `popupi://upi/pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    } else {
      // Generic UPI deep link for other apps
      paymentUrl = `upi://pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${cartTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${orderId}`)}&url=${encodeURIComponent(redirectUrl)}`;
    }
      
      // Save payment details to localStorage
      const paymentData = {
        method: 'upi',
        app: app.name,
        appId: app.id,
        upiId: MERCHANT_UPI_ID,
        amount: cartTotal,
        orderId: orderId,
        paymentUrl: paymentUrl,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('paymentMethod', JSON.stringify(paymentData));
      
      // Store pending payment redirect for mobile detection
      sessionStorage.setItem('pendingPaymentRedirect', JSON.stringify({
        orderId: orderId,
        appName: app.name,
        timestamp: Date.now()
      }));
      
      // Set flag for manual redirect after payment
      sessionStorage.setItem('currentOrderId', orderId);
      sessionStorage.setItem('paymentInProgress', 'true');
      sessionStorage.setItem('actualPaymentAmount', cartTotal.toString());
      
    // showSuccess(`Opening ${app.name} for payment...`);
      
    // Open UPI app via deep link
      try {
        const link = document.createElement('a');
        link.href = paymentUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      console.log('✅ UPI app opened:', paymentUrl);
      
      // Start 20-second verification timer after opening app
      setTimeout(() => {
        console.log('⏰ Starting 20-second verification timer...');
        setVerificationTimer(20);
        setIsVerifyingPayment(true);
      }, 1000); // Wait 1 second before starting timer
      
      } catch (error) {
        console.error('Error opening UPI app:', error);
      showError(`Could not open ${app.name}. Please try another payment method.`);
      }
  };

  const showFallbackOptions = (app, amount, orderId) => {
    // Show simple try again message when UPI app can't be opened
    const fallbackMessage = `
      ${app.name} app couldn't be opened automatically.
      
      Please try again or use a different UPI app.
      
      💡 Tips:
      • Make sure ${app.name} is installed
      • Try PhonePe, Google Pay, or Paytm
      • Check your internet connection
      
      Click "Try Again" to retry or select another payment method.
    `;
    
    // Show the fallback message
    alert(fallbackMessage);
    
    // Show error message
    showError(`${app.name} app couldn't be opened. Please try again or select another UPI app.`);
    
    // Don't save payment data or navigate further
    // User needs to try again or select another option
  };


  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Payment Waiting Modal */}
      {isWaitingForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Instructions</h3>
            <p className="text-gray-600 mb-4">
              📱 <strong>UPI app should have opened!</strong>
              <br />
              <span className="font-semibold text-blue-600">Complete payment in the app</span>
              <br />
              <span className="font-semibold text-green-600">Then click "I've Paid" button below</span>
              <br />
              <span className="text-sm text-gray-500 mt-1">This will take you to order summary page ✨</span>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start text-sm text-blue-700">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold">How it works:</div>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Complete payment in your UPI app</li>
                    <li>App redirects you to order summary</li>
                    <li>We auto-verify and create your order</li>
                    <li>You'll see order confirmation page</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span>Waiting for payment confirmation...</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => {
                  setIsWaitingForPayment(false);
                  sessionStorage.removeItem('waitingForPayment');
                  showSuccess('Payment confirmation received! Please enter your UTR number when prompted.');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                ✅ I've Paid - Continue
              </button>
              <button
                onClick={() => {
                  setIsWaitingForPayment(false);
                  sessionStorage.removeItem('waitingForPayment');
                  showError('Payment cancelled. Please try again or select a different payment method.');
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel & Choose Different Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header - Only show on mobile */}
      <div className="block md:hidden">
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => navigate('/address')} className="text-gray-600">
                ←
              </button>
              <span className="text-2xl font-bold text-gray-700">Choose Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header - Only show on desktop */}
      <div className="hidden md:block">
      <Header />
      <Navbar />
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Desktop Progress Steps - Only show on desktop */}
        <div className="hidden md:block mb-8 px-6 lg:px-8 pt-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Address</span>
            </div>
            <div className="w-16 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Review</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block bg-white rounded-lg shadow-lg mx-6 lg:mx-8 p-8">
          <div className="flex items-center space-x-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payment Method</h1>
            <div className="ml-[400px]">
              <img 
                src="/payment.gif" 
                alt="Quick Payment Instructions" 
                className="w-70 h-auto rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout - Single Screen */}
        <div className="md:hidden min-h-screen flex flex-col bg-gray-50">
          {/* Mobile Navigation Tabs */}
          <div className="bg-white border-b">
            <div className="flex items-center justify-around py-3 px-4">
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-500">Cart</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-500">Address</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <span className="text-sm font-semibold text-blue-600">Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-500">Summary</span>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
         
          {/* Promotional Banner */}
          <div className="bg-purple-100 mx-4 mt-4 rounded-lg p-4">
            <div className="flex items-center">
              <img 
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-icon.png"
                alt="PhonePe"
                className="w-8 h-8 mr-3"
              />
              <span className="text-sm font-medium text-gray-800">Pay online & get EXTRA ₹33 off</span>
            </div>
          </div>

          {/* PAY ONLINE Section */}
          <div className="mx-1 mt-4">
            <div className="border-t border-gray-200 mb-4">
              <div className="flex items-center justify-between py-3">
                
                <img 
                  className="h-24 w-full object-contain"
                  src="/gif.gif" 
                  alt="Payment" 
                />
              </div>
            </div>

          {/* UPI Section */}
          <div className="mx-4 mt-4">
            <div className="bg-white rounded-lg shadow-sm">
              {/* UPI Section Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">UPI (GPay/PhonePe/Paytm)</span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">UPI</span>
                  </div>
                  <span className="text-gray-400">▼</span>
                </div>
              </div>

              {/* UPI Payment Options */}
              <div className="p-4 space-y-3">
                {/* PhonePe */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="upi" 
                      className="mr-3"
                      checked={upiData.selectedApp === 'phonepe'}
                      onChange={() => handleUPIAppClick('phonepe')}
                    />
                    <span className="text-sm font-medium text-gray-900">PhonePe</span>
                  </div>
                  <img 
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-icon.png"
                    alt="PhonePe"
                    className="w-8 h-8"
                  />
                </label>

                {/* Paytm */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="upi" 
                      className="mr-3"
                      checked={upiData.selectedApp === 'paytm'}
                      onChange={() => handleUPIAppClick('paytm')}
                    />
                    <span className="text-sm font-medium text-gray-900">Paytm</span>
                    <span className="ml-2 text-xs text-green-600 font-medium">20% Cashback in 24 hour</span>
                  </div>
                  <img 
                    src="https://www.citypng.com/public/uploads/preview/paytm-circle-logo-hd-png-701751694706614zmho56voff.png"
                    alt="Paytm"
                    className="w-8 h-8"
                  />
                </label>

                {/* BHIM UPI */}
                {/* <label className="flex items-center justify-between cursor-pointer" onClick={() => handleUPIAppClick('bhim')}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="upi" 
                      className="mr-3"
                      checked={upiData.selectedApp === 'bhim'}
                      onChange={() => setUpiData(prev => ({...prev, selectedApp: 'bhim'}))}
                    />
                    <span className="text-sm font-medium text-gray-900">BHIM UPI</span>
                  </div>
                  <img 
                    src="https://play-lh.googleusercontent.com/B5cNBA15IxjCT-8UTXEWgiPcGkJ1C07iHKwm2Hbs8xR3PnJvZ0swTag3abdC_Fj5OfnP=w240-h480-rw"
                    alt="BHIM UPI"
                    className="w-8 h-8"
                  />
                </label> */}

                {/* Google Pay */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="upi" 
                      className="mr-3"
                      checked={upiData.selectedApp === 'googlepay'}
                      onChange={() => handleUPIAppClick('googlepay')}
                    />
                    <span className="text-sm font-medium text-gray-900">Google Pay</span>
                  </div>
                  <img 
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.png"
                    alt="Google Pay"
                    className="w-8 h-8"
                  />
                </label>

                {/* QR Code */}
                {/* <label className="flex items-center justify-between cursor-pointer" onClick={() => handleUPIAppClick('qr')}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="upi" 
                      className="mr-3"
                      checked={upiData.selectedApp === 'qr'}
                      onChange={() => setUpiData(prev => ({...prev, selectedApp: 'qr'}))}
                    />
                    <span className="text-sm font-medium text-gray-900">Pay Using QR Code</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-white text-sm">📱</span>
                  </div>
                </label> */}

                {/* Other Button for Mobile */}
                <label className="flex items-center justify-between cursor-pointer" onClick={() => setShowOtherApps(!showOtherApps)}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="upi" 
                      className="mr-3"
                      checked={showOtherApps}
                      onChange={() => setShowOtherApps(!showOtherApps)}
                    />
                    <span className="text-sm font-medium text-gray-900">Other UPI Apps</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
                    <span className="text-white text-sm">+</span>
                  </div>
                </label>


                {/* COD - Always Disabled */}
                <label className="flex items-center justify-between cursor-not-allowed opacity-50">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="upi" 
                      className="mr-3"
                      disabled
                    />
                    <span className="text-sm font-medium text-gray-900">Cash on Delivery (COD)</span>
                    <span className="ml-2 text-xs text-red-600 font-medium">Currently Unavailable</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center">
                    <span className="text-white text-sm">💵</span>
                  </div>
                </label>
              </div>

              {/* More UPI Options for Mobile */}
              {showOtherApps && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">More UPI Payment Options</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {otherUpiApps.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => handleUpiAppClick(app)}
                        className={`p-3 border-2 rounded-lg text-center hover:shadow-md transition-all duration-200 ${
                          upiData.selectedApp === app.id 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 ${app.color} rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200`}>
                          {app.logo && (
                            <img 
                              src={app.logo} 
                              alt={app.name}
                              className="w-6 h-6 object-contain rounded-full"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          )}
                          <span className="text-xs hidden">{app.emoji}</span>
                        </div>
                        <div className="font-medium text-gray-900 text-xs">{app.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mx-4 mt-6 bg-white rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Product Price</span>
                <span className="text-sm font-medium text-gray-900">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">Order Total</span>
                  <span className="text-sm font-bold text-gray-900">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="mt-auto bg-white border-t p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900">₹{cartTotal.toFixed(2)}</div>
                <div className="text-xs text-blue-600 underline">VIEW PRICE DETAILS</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  console.log('🔍 Pay Now clicked - Debug info:');
                  console.log('  - upiData.selectedApp:', upiData.selectedApp);
                  console.log('  - upiApps array:', upiApps);
                  
                  if (upiData.selectedApp) {
                    const selectedApp = upiApps.find(app => app.id === upiData.selectedApp);
                    console.log('  - Found selectedApp:', selectedApp);
                    
                    if (selectedApp) {
                    handleUpiAppClick(selectedApp);
                    } else {
                      console.error('❌ Selected UPI app not found in upiApps array');
                      showError('Selected UPI app not found. Please try again.');
                    }
                  } else {
                    showError('Please select a UPI app');
                  }
                }}
                className="px-8 py-3 rounded-lg font-semibold text-sm text-white"
                style={{ 
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                PayNow
              </button>
            </div>
            
          </div>
        </div>
      </div>

        {/* Desktop Layout Content */}
        <div className="hidden md:block">
          {/* Desktop Payment Amount Display */}
          <div className="mx-6 lg:mx-8 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Total Amount to Pay</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-gray-900">₹{cartTotal.toFixed(2)}</div>
                  {cartTotal === 0 && (
                    <button
                      onClick={() => {
                        console.log('🔄 Manual cart total refresh triggered');
                        const directOrder = sessionStorage.getItem('directOrder');
                        if (directOrder) {
                          try {
                            const orderItems = JSON.parse(directOrder);
                            const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                            setCartTotal(total);
                            console.log('🔄 Direct order total refreshed:', total);
                          } catch (error) {
                            console.error('Error refreshing direct order:', error);
                          }
                        } else {
                          const total = cartAPI.getCartTotal();
                          setCartTotal(total);
                          console.log('🔄 Cart total refreshed:', total);
                        }
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                      title="Refresh cart total"
                    >
                      🔄
                    </button>
                  )}
                </div>
                {cartTotal < 1 && cartTotal > 0 && (
                  <div className="text-xs text-red-600 mt-1">
                    ⚠️ Minimum order amount is ₹1
                  </div>
                )}
                {cartTotal === 0 && (
                  <div className="text-xs text-red-600 mt-1">
                    ⚠️ No items in cart - please add items to proceed
                  </div>
                )}
              </div>
              <div className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">🔒</span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Secure Payment</div>
                      <div className="text-sm font-semibold text-green-600">Safe & Protected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mx-6 lg:mx-8 space-y-6">
            {/* Desktop Payment Method Selection */}
            <div>
              <div className="flex items-center p-4 border-2 border-green-500 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">📱</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">UPI Payment</div>
                    <div className="text-sm text-gray-500">Google Pay, PhonePe, Paytm, BHIM Pay, Amazon Pay & more</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop UPI Payment Form */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">Choose UPI App</h3>
                
                {/* Payment Settings Status */}
                {loadingPaymentSettings ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-sm text-blue-700">Loading payment settings...</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="text-sm text-green-700">
                      <div className="font-medium">✅ Payment configured by admin</div>
                      <div className="text-xs text-green-600 mt-1">
                        UPI ID: {MERCHANT_UPI_ID} | Name: {MERCHANT_NAME}
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mb-4">Select your preferred UPI app to complete the payment</p>
                
                <div className="grid grid-cols-4 gap-4">
                  {upiApps.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleUpiAppClick(app)}
                      className={`p-4 border-2 rounded-lg text-center hover:shadow-md transition-all duration-200 ${
                        upiData.selectedApp === app.id || (app.id === 'other' && showOtherApps)
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 ${app.color} rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200`}>
                        {app.logo && (
                          <img 
                            src={app.logo} 
                            alt={app.name}
                            className="w-10 h-10 object-contain rounded-full"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              console.error(`Failed to load image for ${app.name}:`, app.logo);
                              e.target.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log(`Successfully loaded image for ${app.name}:`, app.logo);
                            }}
                          />
                        )}
                        {!app.logo && app.fallbackIcon && (
                          <span className="text-gray-600 text-xl flex items-center justify-center w-full h-full">{app.fallbackIcon}</span>
                        )}
                      </div>
                      <div className="font-medium text-gray-900 text-sm">{app.name}</div>
                    </button>
                  ))}
                </div>

                {/* Other UPI Apps - Show when "Other" is clicked */}
                {showOtherApps && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-4">More UPI Payment Options</h4>
                    <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
                      {otherUpiApps.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => handleUpiAppClick(app)}
                          className={`p-3 border-2 rounded-lg text-center hover:shadow-md transition-all duration-200 ${
                            upiData.selectedApp === app.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-10 h-10 ${app.color} rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200`}>
                            {app.logo && (
                              <img 
                                src={app.logo} 
                                alt={app.name}
                                className="w-8 h-8 object-contain rounded-full"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  console.error(`Failed to load image for ${app.name}:`, app.logo);
                                  e.target.style.display = 'none';
                                }}
                                onLoad={() => {
                                  console.log(`Successfully loaded image for ${app.name}:`, app.logo);
                                }}
                              />
                            )}
                            {!app.logo && app.fallbackIcon && (
                              <span className="text-gray-600 text-lg flex items-center justify-center w-full h-full">{app.fallbackIcon}</span>
                            )}
                          </div>
                          <div className="font-medium text-gray-900 text-xs">{app.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Desktop Action Buttons */}
            <div className="flex justify-between gap-4 pt-6 p-4">
              <button
                type="button"
                onClick={() => navigate('/address')}
                className="px-6 py-3 rounded-md font-bold"
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Back to Address
              </button>
              <button
                type="submit"
                disabled={!upiData.selectedApp || cartTotal <= 0}
                className={`px-8 py-3 rounded-md font-bold transition-all duration-200 ${
                  !upiData.selectedApp || cartTotal <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                style={{
                  color: 'white',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
                onClick={(e) => {
                  if (!upiData.selectedApp) {
                    e.preventDefault();
                    showError('Please select a UPI app to proceed');
                    return;
                  }
                  if (cartTotal <= 0) {
                    e.preventDefault();
                    showError('Please add items to your cart first');
                    return;
                  }
                }}
              >
                {!upiData.selectedApp ? 'Select Payment Method' : `Pay ₹${cartTotal} Now`}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Desktop Footer */}
      {/* Payment Verification Modal with Timer */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            {/* Loading Animation */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Verifying Payment...</h3>
            <p className="text-gray-600 mb-6">
              🔍 <strong>Please wait while we verify your payment</strong>
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Complete your payment in the UPI app. We'll verify it automatically.
              </span>
            </p>
            
            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {verificationTimer}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  seconds remaining
                </span>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(verificationTimer / 20) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              💡 After {verificationTimer} seconds, you'll be asked to enter your UTR/Reference number
            </div>
            
            {/* Skip Button */}
            <button
              onClick={() => {
                if (timerInterval) clearInterval(timerInterval);
                setIsVerifyingPayment(false);
                setShowUTRInput(true);
                console.log('⏭️ User skipped verification - showing UTR input');
              }}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Skip and enter UTR now →
            </button>
          </div>
        </div>
      )}

      {/* UTR Input Modal */}
      {showUTRInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Payment Completed! 🎉</h3>
            <p className="text-gray-600 mb-6 text-center">
              Please enter your UTR/Reference number to complete the order
            </p>
            
            {/* Instructions on how to find UTR */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                How to find your UTR/Reference Number:
              </h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">1️⃣</span>
                  <span>Open your UPI app (PhonePe, Google Pay, Paytm, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2️⃣</span>
                  <span>Go to <strong>Transaction History</strong> or <strong>Recent Transactions</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3️⃣</span>
                  <span>Find the latest payment you just made</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4️⃣</span>
                  <span>Look for <strong>UTR Number</strong>, <strong>Transaction ID</strong>, or <strong>Reference Number</strong></span>
                </li>
                
              </ul>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UTR/Reference Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="Enter UTR number "
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono"
                autoFocus
                maxLength={20}
              />
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500 mb-1">
                  💡 This helps us verify your payment quickly
              </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleUTRSubmit}
                className="w-full px-6 py-3 rounded-lg font-semibold text-lg shadow-lg transition-colors"
                style={{
                  backgroundColor: utrNumber.trim() && utrNumber.replace(/\D/g, '').length >= 10 ? '#16a34a' : '#ef4444',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = utrNumber.trim() && utrNumber.replace(/\D/g, '').length >= 10 ? '#15803d' : '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = utrNumber.trim() && utrNumber.replace(/\D/g, '').length >= 10 ? '#16a34a' : '#ef4444';
                }}
              >
                Submit & Complete Order
              </button>
              <button
                onClick={() => {
                    // Clear all payment-related session data
                    sessionStorage.removeItem('currentOrderId');
                    sessionStorage.removeItem('paymentInProgress');
                    sessionStorage.removeItem('paymentUTR');
                    sessionStorage.removeItem('actualPaymentAmount');
                    sessionStorage.removeItem('pendingPaymentRedirect');
                    
                    // Reset all payment states
                  setShowUTRInput(false);
                  setUtrNumber('');
                    setIsVerifyingPayment(false);
                    setUpiData({ selectedApp: '' });
                    
                    // Clear cart
                    localStorage.removeItem('cart');
                    localStorage.removeItem('directOrder');
                    
                    // Redirect to home page
                    navigate('/');
                    showSuccess('Redirecting to home page. You can start a new order.');
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Try Again
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-4 text-center">
              🔒 Your UTR number is securely saved for order verification
            </p>
          </div>
        </div>
      )}

      {/* Loading Screen for Order Creation */}
      {isCreatingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Order...</h3>
            <p className="text-gray-600 mb-4">
              Please wait while we process your payment and create your order
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
            
            <p className="text-sm text-gray-500">
              This may take a few seconds...
            </p>
          </div>
        </div>
      )}

      {/* Payment Done Button */}
      {showPaymentDoneButton && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Completed?</h3>
            <p className="text-gray-600 mb-4">
              If you have completed the payment in UPI app, click the button below to go to order summary page.
              <br /><br />
              <span className="font-semibold text-green-600">✅ This will:</span>
              <br />• Take you to order confirmation
              <br />• Create your order automatically
              <br />• Show payment success
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handlePaymentDone}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
              >
                ✅ Payment Done - Go to Summary
              </button>
              <button
                onClick={() => {
                  setShowPaymentDoneButton(false);
                  showError('Payment not completed. Please complete payment in UPI app first.');
                }}
                className="px-4 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block">
      <Footer />
      </div>
    </div>
  );
};

export default PaymentPage;

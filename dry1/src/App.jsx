import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { initializeConfig } from './config/environment.js'
import Home from './Components/Home.jsx'
import ContactUs from './Components/ContactUs.jsx'
import AllProducts from './Components/Pages/AllProducts.jsx'
import ProductDetail from './Components/Pages/ProductDetail.jsx'
import Cart from './Components/Pages/Cart.jsx'
import DynamicProductPage from './Components/Pages/DynamicProductPage.jsx'
import AdminDashboard from './Components/Admin/AdminDashboard.jsx'

// Import Mix components
import FitnessMix from './Components/Pages/Mixes/FitnessMix.jsx'
import RoastedPartyMix from './Components/Pages/Mixes/RoastedPartyMix.jsx'
import ChampionMix from './Components/Pages/Mixes/ChampionMix.jsx'
import NuttyTrailMix from './Components/Pages/Mixes/NuttyTrailMix.jsx'

// Import New Launches components
import PeanutButter from './Components/Pages/NewLaunches/PeanutButter.jsx'
import PartySnacks from './Components/Pages/NewLaunches/PartySnacks.jsx'
import GameFulCornNuts from './Components/Pages/NewLaunches/GameFulCornNuts.jsx'

// Import checkout components
import AddressPage from './Components/Pages/Checkout/AddressPage.jsx'
import PaymentPage from './Components/Pages/Checkout/PaymentPage.jsx'
import PaymentSuccess from './Components/Pages/Checkout/PaymentSuccess.jsx'
import OrderReview from './Components/Pages/Checkout/OrderReview.jsx'
import OrderConfirmation from './Components/Pages/Checkout/OrderConfirmation.jsx'

// Import order components
import OrderDetails from './Components/Pages/Orders/OrderDetails.jsx'
import OrderTracking from './Components/Pages/OrderTracking.jsx'

// Import value combos components
import ValueCombosPage from './Components/Pages/ValueCombosPage.jsx'

// Import about us component
import AboutUs from './Components/Pages/AboutUs.jsx'

// Import policy pages
import ReturnRefundPolicy from './Components/Pages/ReturnRefundPolicy.jsx'
import TermsOfService from './Components/Pages/TermsOfService.jsx'
import PrivacyPage from './Components/Pages/PrivacyPage.jsx'
import ShippingPolicy from './Components/Pages/ShippingPolicy.jsx'

// Import admin components
import AdminLogin from './Components/Admin/AdminLogin.jsx'
import ResetPassword from './Components/Admin/ResetPassword.jsx'
import AdminAuthGuard from './Components/Admin/AdminAuthGuard.jsx'

import { NotificationProvider } from './Components/Common/NotificationProvider.jsx'

// Admin Redirect Component - Opens Admin Login (Production Ready)
const AdminRedirect = () => {
  useEffect(() => {
    // Check if we're on production or local
    const isProduction = window.location.hostname === 'mufindryfruit.com';
    
    if (isProduction) {
      // On production, redirect to admin-login on the same domain
      window.location.href = 'https://mufindryfruit.com/admin-login';
    } else {
      // On local, redirect to local admin-login
      window.location.href = '/admin-login';
    }
  }, []);
  
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading Admin Panel...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  );
};

function App() {
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        await initializeConfig();
        setConfigLoaded(true);
      } catch (error) {
        console.error('Failed to load configuration:', error);
        setConfigLoaded(true); // Still render the app with fallback config
      }
    };

    loadConfig();
  }, []);

  if (!configLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <Router>
        <div className="w-full min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            {/* Mix Routes */}
            <Route path="/fitness-mix" element={<FitnessMix />} />
            <Route path="/roasted-party-mix" element={<RoastedPartyMix />} />
            <Route path="/champion-mix" element={<ChampionMix />} />
            <Route path="/nutty-trail-mix" element={<NuttyTrailMix />} />            
            {/* New Launches Routes */}
            <Route path="/peanut-butter" element={<PeanutButter />} />
            <Route path="/party-snacks" element={<PartySnacks />} />
            <Route path="/gameful-corn-nuts" element={<GameFulCornNuts />} />
            
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/combos" element={<ValueCombosPage />} />
            <Route path="/about" element={<AboutUs />} />
            
            {/* Checkout Routes */}
            <Route path="/address" element={<AddressPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/order-review" element={<OrderReview />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            
            {/* Order Management Routes */}
            <Route path="/order-details/:orderId" element={<OrderDetails />} />
            <Route path="/track-order" element={<OrderTracking />} />
            
            {/* Admin Routes - Only /kingadminlogin works */}
            <Route path="/kingadminlogin" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminAuthGuard>
                <AdminDashboard />
              </AdminAuthGuard>
            } />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            
            {/* Dynamic Product Pages - Must be last to catch all unmatched routes */}
            {/* <Route path="/:slug" element={<DynamicProductPage />} /> */}
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  )
}

export default App

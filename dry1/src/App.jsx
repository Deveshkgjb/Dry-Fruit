import { Component, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { initializeConfig } from './config/environment.js'
import Home from './Components/Home.jsx'
import ContactUs from './Components/ContactUs.jsx'
import Almonds from './Components/Pages/Nuts/Almonds.jsx'
import Cashews from './Components/Pages/Nuts/Cashews.jsx'
import Pistachios from './Components/Pages/Nuts/Pistachios.jsx'
import Walnuts from './Components/Pages/Nuts/Walnuts.jsx'
import BrazilNuts from './Components/Pages/Nuts/BrazilNuts.jsx'
import Peanuts from './Components/Pages/Nuts/Peanuts.jsx'
import Raisins from './Components/Pages/DriedFruits/Raisins.jsx'
import Anjeer from './Components/Pages/DriedFruits/Anjeer.jsx'
import Apricots from './Components/Pages/DriedFruits/Apricots.jsx'
import Prunes from './Components/Pages/DriedFruits/Prunes.jsx'
import Kiwi from './Components/Pages/DriedFruits/Kiwi.jsx'
import Mango from './Components/Pages/DriedFruits/Mango.jsx'
import Blueberries from './Components/Pages/Berries/Blueberries.jsx'
import Cranberries from './Components/Pages/Berries/Cranberries.jsx'
import Strawberries from './Components/Pages/Berries/Strawberries.jsx'
import Omani from './Components/Pages/Dates/Omani.jsx'
import QueenKalmi from './Components/Pages/Dates/QueenKalmi.jsx'
import Arabian from './Components/Pages/Dates/Arabian.jsx'
import Ajwa from './Components/Pages/Dates/Ajwa.jsx'
import ChiaSeeds from './Components/Pages/Seeds/ChiaSeeds.jsx'
import FlaxSeeds from './Components/Pages/Seeds/FlaxSeeds.jsx'
import PumpkinSeeds from './Components/Pages/Seeds/PumpkinSeeds.jsx'
import SunflowerSeeds from './Components/Pages/Seeds/SunflowerSeeds.jsx'
import ProductDetail from './Components/Pages/ProductDetail.jsx'
import Cart from './Components/Pages/Cart.jsx'
import DynamicProductPage from './Components/Pages/DynamicProductPage.jsx'
import AdminDashboard from './Components/Admin/AdminDashboard.jsx'
import ProfessionalAdminDashboard from './Components/Admin/ProfessionalAdminDashboard.jsx'

// Import Mix components
import FitnessMix from './Components/Pages/Mixes/FitnessMix.jsx'
import RoastedPartyMix from './Components/Pages/Mixes/RoastedPartyMix.jsx'
import NutsBerriesMix from './Components/Pages/Mixes/NutsBerriesMix.jsx'
import BerriesMix from './Components/Pages/Mixes/BerriesMix.jsx'
import ChampionMix from './Components/Pages/Mixes/ChampionMix.jsx'
import NuttyTrailMix from './Components/Pages/Mixes/NuttyTrailMix.jsx'
import SeedsMix from './Components/Pages/Mixes/SeedsMix.jsx'

// Import New Launches components
import PeanutButter from './Components/Pages/NewLaunches/PeanutButter.jsx'
import PartySnacks from './Components/Pages/NewLaunches/PartySnacks.jsx'
import GameFulCornNuts from './Components/Pages/NewLaunches/GameFulCornNuts.jsx'

// Import checkout components
import AddressPage from './Components/Pages/Checkout/AddressPage.jsx'
import PaymentPage from './Components/Pages/Checkout/PaymentPage.jsx'
import OrderReview from './Components/Pages/Checkout/OrderReview.jsx'
import OrderConfirmation from './Components/Pages/Checkout/OrderConfirmation.jsx'

// Import order components
import OrderHistory from './Components/Pages/Orders/OrderHistory.jsx'
import OrderDetails from './Components/Pages/Orders/OrderDetails.jsx'
import OrderTracking from './Components/Pages/OrderTracking.jsx'

// Import value combos components
import ValueCombosPage from './Components/Pages/ValueCombosPage.jsx'

// Import admin components
import AdminLogin from './Components/Admin/AdminLogin.jsx'
import ResetPassword from './Components/Admin/ResetPassword.jsx'
import AdminAuthGuard from './Components/Admin/AdminAuthGuard.jsx'

import { NotificationProvider } from './Components/Common/NotificationProvider.jsx'



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
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/almonds" element={<Almonds />} />
            <Route path="/cashews" element={<Cashews />} />
            <Route path="/pistachios" element={<Pistachios />} />
            <Route path="/walnuts" element={<Walnuts />} />
            <Route path="/brazil-nuts" element={<BrazilNuts />} />
            <Route path="/peanuts" element={<Peanuts />} />
            <Route path="/raisins" element={<Raisins />} />
            <Route path="/anjeer" element={<Anjeer />} />
            <Route path="/apricots" element={<Apricots />} />
            <Route path="/prunes" element={<Prunes />} />
            <Route path="/kiwi" element={<Kiwi />} />
            <Route path="/mango" element={<Mango />} />
            <Route path="/blueberries" element={<Blueberries />} />
            <Route path="/cranberries" element={<Cranberries />} />
            <Route path="/strawberries" element={<Strawberries />} />
            <Route path="/omani" element={<Omani />} />
            <Route path="/queen-kalmi" element={<QueenKalmi />} />
            <Route path="/arabian" element={<Arabian />} />
            <Route path="/ajwa" element={<Ajwa />} />
            <Route path="/chia-seeds" element={<ChiaSeeds />} />
            <Route path="/flax-seeds" element={<FlaxSeeds />} />
            <Route path="/pumpkin-seeds" element={<PumpkinSeeds />} />
            <Route path="/sunflower-seeds" element={<SunflowerSeeds />} />
            
            {/* Mix Routes */}
            <Route path="/fitness-mix" element={<FitnessMix />} />
            <Route path="/roasted-party-mix" element={<RoastedPartyMix />} />
            <Route path="/nuts-and-berries-mix" element={<NutsBerriesMix />} />
            <Route path="/berries-mix" element={<BerriesMix />} />
            <Route path="/champion-mix" element={<ChampionMix />} />
            <Route path="/nutty-trail-mix" element={<NuttyTrailMix />} />
            <Route path="/seeds-mix" element={<SeedsMix />} />
            
            {/* New Launches Routes */}
            <Route path="/peanut-butter" element={<PeanutButter />} />
            <Route path="/party-snacks" element={<PartySnacks />} />
            <Route path="/gameful-corn-nuts" element={<GameFulCornNuts />} />
            
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/combos" element={<ValueCombosPage />} />
            
            {/* Checkout Routes */}
            <Route path="/address" element={<AddressPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order-review" element={<OrderReview />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            
            {/* Order Management Routes */}
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/order-details/:orderId" element={<OrderDetails />} />
            <Route path="/track-order" element={<OrderTracking />} />
            
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={
              <AdminAuthGuard>
                <AdminDashboard />
              </AdminAuthGuard>
            } />
            <Route path="/admin-pro" element={
              <AdminAuthGuard>
                <ProfessionalAdminDashboard />
              </AdminAuthGuard>
            } />
            
            {/* Dynamic Product Pages - Must be last to catch all unmatched routes */}
            <Route path="/:slug" element={<DynamicProductPage />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  )
}

export default App

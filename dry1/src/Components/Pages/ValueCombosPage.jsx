import React from 'react';
import Header from '../Homepages/Header.jsx';
import Navbar from '../Homepages/Navbar.jsx';
import Footer from '../Homepages/Footer.jsx';
import ValueCombos from '../Homepages/ValueCombos.jsx';

const ValueCombosPage = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Value Combos Content */}
      <ValueCombos />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ValueCombosPage;

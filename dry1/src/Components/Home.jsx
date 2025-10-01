import React from 'react';
import Header from './Homepages/Header.jsx';
import Navbar from './Homepages/Navbar.jsx';
import OfferBar from './Homepages/OfferBar.jsx';
import ExploreCategories from './Homepages/ExploreCategories.jsx';
import OurBestSellers from './Homepages/OurBestSellers.jsx';
import OfferBar2 from './Homepages/OfferBar2.jsx';
import ValueCombos from './Homepages/ValueCombos.jsx';
import PartyMixesVideo from './Homepages/PartyMixesVideo.jsx';
import HappilosJourney from './Homepages/HappilosJourney.jsx';
import Offer3 from './Homepages/Offer3.jsx';
import BlogPosts from './Homepages/BlogPosts.jsx';
import FAQ from './Homepages/FAQ.jsx';
import YouMayAlsoLike from './Homepages/YouMayAlsoLike.jsx';
import DoYouKnow from './Homepages/DoYouKnow.jsx';
import Footer from './Homepages/Footer.jsx';

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Top Header with Contact Info */}
      <Header />
      
      {/* Main Navigation */}
      <Navbar />
      
      {/* First Offer Banner */}
      <OfferBar />
      
      {/* Categories Section */}
      <ExploreCategories />
      
      {/* Best Sellers Products */}
      <OurBestSellers />
      
      {/* Second Offer Banner */}
      <OfferBar2 />
      
      {/* Value Combos Section */}
      <ValueCombos />
      
      {/* Party Mixes Video Section */}
      <PartyMixesVideo />
      
      {/* Company Journey Section */}
      <HappilosJourney />
      
      {/* Third Offer Banner */}
      <Offer3 />
      
      {/* Blog Posts Section */}
      <BlogPosts />
      
      {/* FAQ Section */}
      <FAQ />
      
      {/* You May Also Like Products */}
      <YouMayAlsoLike />
      
      {/* Do You Know Educational Section */}
      <DoYouKnow />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

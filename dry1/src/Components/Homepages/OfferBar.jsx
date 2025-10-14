import React, { useState, useEffect } from 'react';
import { pageAPI } from '../../services/pageAPI.js';

const OfferBar = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default fallback data
  const defaultOffer = {
    text: "Find the amazing deal with us",
    backgroundColor: "#22c55e",
    textColor: "#ffffff",
    isVisible: true
  };

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      console.log('🔄 OfferBar - Fetching page content...');
      
      // Get homepage content
      const homepageContent = await pageAPI.getPageContent('homepage');
      console.log('📄 OfferBar - Raw homepage content:', homepageContent);
      
      // Set the content with proper structure
      setPageContent({ homepage: homepageContent });
      
      console.log('📄 OfferBar - Offer content loaded:', homepageContent?.offerBar);
    } catch (error) {
      console.error('❌ OfferBar - Error loading page content:', error);
      setPageContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent();

    // Listen for real-time updates
    const handlePageUpdate = () => {
      console.log('🔄 OfferBar - Page content update detected, refreshing...');
      // Force a complete refresh by clearing localStorage cache
      setTimeout(() => {
        fetchPageContent();
      }, 100);
    };

    window.addEventListener('pageContentUpdated', handlePageUpdate);

    return () => {
      window.removeEventListener('pageContentUpdated', handlePageUpdate);
    };
  }, []);

  // Use dynamic content if available, otherwise fallback to default
  const offerData = pageContent?.homepage?.offerBar || defaultOffer;

  // Don't render if not visible
  if (!offerData.isVisible) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full py-2 bg-gray-200 animate-pulse">
        <div className="text-center">
          <div className="h-6 bg-gray-300 rounded w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full py-1 sm:py-2 relative overflow-hidden"
      style={{
        backgroundColor: offerData.backgroundColor || '#22c55e',
        color: offerData.textColor || '#ffffff'
      }}
    >
      <div className="text-center px-2">
        <p className="text-xs sm:text-sm md:text-base font-medium">
          {offerData.text || 'Find the amazing deal with us'}
        </p>
      </div>
    </div>
  );
};

export default OfferBar;

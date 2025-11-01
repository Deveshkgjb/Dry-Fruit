import React, { useState, useEffect } from 'react';
import { pageAPI } from '../../services/pageAPI.js';
import { getImageUrl } from '../../utils/urls.js';

// Preload all hero images for instant loading
const preloadImages = (imageUrls) => {
  imageUrls.forEach((url, index) => {
    const img = new Image();
    img.src = getImageUrl(url);
    img.onload = () => {
      console.log(`✅ Hero image ${index + 1} preloaded successfully`);
    };
    img.onerror = () => {
      console.error(`❌ Hero image ${index + 1} preload failed:`, url);
    };
  });
};

const Hero = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider images array
  const sliderImages = [
    "/muff.png",
    "/muff2.png",
    "/slide1.png"
  ];

  // Default fallback data
  const defaultHero = {
    title: "Premium Quality Dry Fruits & Nuts",
    subtitle: "Delicious, nutritious, and delivered fresh to your doorstep",
    backgroundImage: "/dry.png",
    ctaText: "Shop Now",
    ctaUrl: "/all-products"
  };

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      console.log('🔄 Hero - Fetching page content...');
      
      // Get homepage content
      const homepageContent = await pageAPI.getPageContent('homepage');
      console.log('📄 Hero - Raw homepage content:', homepageContent);
      
      // Set the content with proper structure
      setPageContent({ homepage: homepageContent });
      
      console.log('📄 Hero - Hero content loaded:', homepageContent?.hero);
    } catch (error) {
      console.error('❌ Hero - Error loading page content:', error);
      setPageContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent();
    
    // Preload all hero images for instant switching
    preloadImages(sliderImages);

    // Listen for real-time updates
    const handlePageUpdate = () => {
      console.log('🔄 Hero - Page content update detected, refreshing...');
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

  // Auto-slide functionality - change image every 4 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
    }, 4000); // 4 seconds

    return () => clearInterval(slideInterval);
  }, [sliderImages.length]);

  // Use dynamic content if available, otherwise fallback to default
  const heroData = pageContent?.homepage?.hero || defaultHero;

  if (loading) {
    return (
      <div className="h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh] relative overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="h-full w-full bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[35vh] xs:h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh] 2xl:h-[65vh] relative overflow-hidden bg-gray-100">
      {/* Responsive image container that adjusts to device size */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={getImageUrl(sliderImages[currentSlide])} 
          alt={`Dry Fruits Banner ${currentSlide + 1}`}
          className="w-full h-full object-contain sm:object-cover object-center block transition-all duration-300 ease-in-out"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          style={{ 
            display: 'block', 
            margin: 0, 
            padding: 0, 
            border: 'none', 
            outline: 'none',
            minHeight: '100%',
            minWidth: '100%',
            // Mobile-specific optimizations
            maxHeight: '100%',
            objectPosition: 'center center',
            // Optimize for instant loading
            imageRendering: 'auto',
            willChange: 'auto'
          }}
          onLoad={(e) => {
            console.log(`✅ Hero image ${currentSlide + 1} loaded successfully`);
            // Hide loading state
            e.target.style.opacity = '1';
          }}
          onError={(e) => {
            console.error(`❌ Hero image ${currentSlide + 1} failed to load:`, e.target.src);
            // Fallback to first image if any image fails
            if (currentSlide !== 0) {
              e.target.src = getImageUrl(sliderImages[0]);
            } else {
              // Ultimate fallback to a placeholder
              e.target.src = '/dry.png';
            }
          }}
        />
      </div>
      
    </div>
  );
};

export default Hero;

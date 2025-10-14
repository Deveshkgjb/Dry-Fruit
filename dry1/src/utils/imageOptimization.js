// Image optimization utilities
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return '';
  
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // For external URLs, we can't optimize them directly
  // But we can add loading hints
  if (url.startsWith('http')) {
    return url;
  }
  
  // For local images, we could add optimization parameters
  // This would work with image optimization services like Cloudinary, etc.
  return url;
};

export const preloadCriticalImages = (imageUrls) => {
  imageUrls.forEach(url => {
    if (url) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    }
  });
};

export const createImagePlaceholder = (width = 200, height = 200) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">Loading...</text>
    </svg>
  `)}`;
};

// Image loading states
export const ImageLoadingStates = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
};

export const useImageLoader = (src) => {
  const [state, setState] = React.useState(ImageLoadingStates.LOADING);
  
  React.useEffect(() => {
    if (!src) {
      setState(ImageLoadingStates.ERROR);
      return;
    }
    
    const img = new Image();
    img.onload = () => setState(ImageLoadingStates.LOADED);
    img.onerror = () => setState(ImageLoadingStates.ERROR);
    img.src = src;
  }, [src]);
  
  return state;
};

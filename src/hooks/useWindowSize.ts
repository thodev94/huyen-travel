import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  // Use a stable default so server and the client's initial render match.
  // Update to actual window dimensions after mount to avoid hydration mismatches.
  const [windowSize, setWindowSize] = useState({
    width: 1920,
    height: 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

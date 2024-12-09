import React, { useEffect, useRef, useState } from 'react';

const Header = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(7);

  useEffect(() => {
    const updateFontSize = () => {
      if (!containerRef.current || !textRef.current) return;
      
      const container = containerRef.current;
      const text = textRef.current;
      
      // Start with initial size
      let size = 7;
      text.style.fontSize = `${size}rem`;
      
      // Add a small buffer to ensure text doesn't touch container edges
      const targetWidth = container.offsetWidth - 32; // 16px padding on each side
      
      // Reduce font size until text fits container width with buffer
      while (text.offsetWidth > targetWidth && size > 1) {
        size -= 0.1;
        text.style.fontSize = `${size}rem`;
      }
      
      setFontSize(size);
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  return (
    <div className="w-full mb-4">
      <div 
        ref={containerRef}
        className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 rounded-2xl p-6"
      >
        <div className="relative flex justify-center items-center min-h-[2rem]">
          <h1 
            ref={textRef}
            style={{ fontSize: `${fontSize}rem` }}
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-200 to-pink-300 animate-shimmer tracking-wider whitespace-nowrap"
          >
            CONGRATULATIONS!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
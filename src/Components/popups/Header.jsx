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
      
      let size = 7;
      text.style.fontSize = `${size}rem`;
      
      const targetWidth = container.offsetWidth - 32;
      
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
        className="bg-gradient-to-r from-purple-900/90 via-purple-800/90 to-purple-900/90 backdrop-blur-md rounded-2xl p-6"
      >
        <div className="relative flex justify-center items-center min-h-[2rem]">
          <h1 
            ref={textRef}
            style={{ fontSize: `${fontSize}rem` }}
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 animate-shimmer tracking-wider whitespace-nowrap"
          >
            CONGRATULATIONS!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;